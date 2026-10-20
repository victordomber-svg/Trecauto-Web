# PRD · Trecauto Landing

## Original problem statement
https://www.soyjerez.com/item/trecauto-recambios-para-el-automovil/ he visto esta pagina un poco anticuada, quiero que actues como un profesional y experto en hacer paginas web con mas de 20 años de experiencia, ademas quiero que me analices todo su contenido que tiene dentro y lo explotes al maximo, quedando lo mejor posible para una posible venta, quiero que se vea tanto visual como funcional, que el cliente antes de ir al lugar presencial gracias a la web sepa de que va la empresa, a que se dedican, su lugar, y todo esto de una manera la que pueda llamar la atencion al cliente y quiera o tenga ganas de ir alli, lo dejo en tus manos

User choices: one-page landing; part-request form stored in DB; style left to us; original photos + stock.

## Real data from source
Trecauto – Recambios para el automóvil · Automóvil · Accesorios y recambios · Paseo de las Delicias, 50 · Jerez de la Frontera · GPS 36.68282, -6.11095 · Tel 856 100 292 · Ref 180320. Source has no real photos (only a generic 100px placeholder), no hours, no brands.

## Architecture
React (CRA) + framer-motion + lenis; FastAPI `POST /api/part-requests` → MongoDB `part_requests`.

## Implemented (2026-10-20)
- Dark industrial design, Barlow Condensed/Plus Jakarta/JetBrains Mono, amber accent, SVG logo + favicon
- Hero with masked line reveal, clip reveal image, 3D tilt + scroll parallax, rotating badge
- Marquee, About, bento categories, 4 steps, request form (DB), Location with Google Maps embed + directions, footer, mobile sticky call button

## Backlog
- P0: confirm hours, real shop photos, product categories/brands
- P1: admin panel to view requests; email notification on new request
- P2: WhatsApp (if business has one), Google reviews, SEO schema LocalBusiness