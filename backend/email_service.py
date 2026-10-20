import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# Emergent managed email proxy. Constant on purpose (survives deployment).
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OFFICE_EMAIL = os.environ["OFFICE_EMAIL"]

# ---------------------------------------------------------------- guardrail gate
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


# ---------------------------------------------------------------- sending
async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    if resp.status_code >= 400:
        try:
            code = resp.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({resp.status_code}): {resp.text}")
        else:
            logger.error(f"Email send failed: {resp.status_code} {resp.text}")
        return None
    return resp.json().get("id")


# ---------------------------------------------------------------- templates
_WRAP = (
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
    'style="background:#0A0D12;padding:32px 16px;font-family:Arial,Helvetica,sans-serif">'
    '<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
    'style="max-width:600px;background:#F4EFE6;border-radius:16px;overflow:hidden">'
    '<tr><td style="background:#0A0D12;padding:22px 32px;color:#F4EFE6;font-size:22px;font-weight:900;'
    'letter-spacing:2px;text-transform:uppercase">{brand}'
    '<span style="color:#E8890C"> .</span></td></tr>'
    '<tr><td style="padding:32px;color:#0A0D12;font-size:15px;line-height:1.55">{body}</td></tr>'
    '<tr><td style="padding:18px 32px;background:#E9E2D5;color:#6B6660;font-size:12px">'
    'Enviado por {brand} &middot; Recambios para el autom&oacute;vil &middot; Jerez de la Frontera.'
    '</td></tr></table></td></tr></table>'
)


def _wrap(body: str) -> str:
    return _WRAP.format(brand=escape(EMAIL_FROM_NAME), body=body)


def _row(label: str, value: str) -> str:
    if not value:
        return ""
    return (
        f'<tr><td style="padding:8px 12px;border-bottom:1px solid #DDD5C6;color:#6B6660;font-size:12px;'
        f'text-transform:uppercase;letter-spacing:1px;white-space:nowrap">{escape(label)}</td>'
        f'<td style="padding:8px 12px;border-bottom:1px solid #DDD5C6;font-weight:600">{escape(value)}</td></tr>'
    )


def _vehicle(req: dict) -> str:
    return " ".join(x for x in (req.get("make", ""), req.get("model", ""), req.get("year", "")) if x)


def office_notification(req: dict) -> tuple[str, str]:
    phone = req["phone"]
    subject = f"Nueva consulta de pieza: {req['part']} ({_vehicle(req)})"
    table = (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#fff;border-radius:10px;border:1px solid #DDD5C6">'
        + _row("Nombre", req["name"])
        + _row("Teléfono", phone)
        + _row("Email", req.get("email", ""))
        + _row("Vehículo", _vehicle(req))
        + _row("Pieza", req["part"])
        + _row("Comentarios", req.get("message", ""))
        + _row("Recibida", req.get("created_at", ""))
        + "</table>"
    )
    tel_href = "tel:" + re.sub(r"[^\d+]", "", phone)
    body = (
        '<p style="margin:0 0 6px;color:#B4520A;font-size:12px;letter-spacing:2px;text-transform:uppercase">'
        'Nueva solicitud desde la web</p>'
        f'<h1 style="margin:0 0 20px;font-size:24px;line-height:1.2">{escape(req["part"])}</h1>'
        + table
        + f'<p style="margin:24px 0 0"><a href="{escape(tel_href)}" style="display:inline-block;background:#0A0D12;'
        f'color:#F4EFE6;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">'
        f'Llamar al cliente: {escape(phone)}</a></p>'
    )
    return subject, _wrap(body)


def customer_confirmation(req: dict) -> tuple[str, str]:
    subject = f"Hemos recibido tu consulta - {EMAIL_FROM_NAME}"
    body = (
        f'<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2">Hola {escape(req["name"])}, recibido.</h1>'
        f'<p style="margin:0 0 14px">Hemos recibido tu consulta sobre <strong>{escape(req["part"])}</strong>'
        f'{(" para tu " + escape(_vehicle(req))) if _vehicle(req) else ""}. '
        f'Te llamaremos al <strong>{escape(req["phone"])}</strong> lo antes posible para confirmarte '
        'disponibilidad y precio.</p>'
        '<p style="margin:0 0 14px">Si tienes prisa, puedes llamarnos directamente al '
        '<a href="tel:+34856100292" style="color:#B4520A;font-weight:700">856 100 292</a>.</p>'
        '<p style="margin:0;color:#6B6660;font-size:13px">Este correo es solo informativo. Nunca te pediremos '
        'contrase&ntilde;as ni datos bancarios por email.</p>'
    )
    return subject, _wrap(body)


async def notify_part_request(req: dict) -> None:
    """Background task: notify the office and (optionally) confirm to the customer."""
    try:
        subject, html = office_notification(req)
        await send_email(to=OFFICE_EMAIL, subject=subject, html=html,
                         reply_to=req.get("email") or None)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Office notification failed: {e}")
    if req.get("email"):
        try:
            subject, html = customer_confirmation(req)
            await send_email(to=req["email"], subject=subject, html=html)
        except Exception as e:  # noqa: BLE001
            logger.error(f"Customer confirmation failed: {e}")