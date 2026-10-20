export const BIZ = {
  name: "Trecauto",
  phone: "856 100 292",
  tel: "tel:+34856100292",
  street: "Paseo de las Delicias, 50",
  city: "Jerez de la Frontera",
  lat: 36.68282,
  lng: -6.11095,
  hours: "[Horario por confirmar]",
};

export const MAP_EMBED = `https://maps.google.com/maps?q=${BIZ.lat},${BIZ.lng}&z=17&output=embed`;
export const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${BIZ.lat},${BIZ.lng}`;

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const EASE = [0.16, 1, 0.3, 1];
