/* ===== EDIT YOUR CONTENT HERE ===== */

// Gallery: upload each photo next to your other files and list it here by file name.
const GALLERY = [
  { src: "gallery-1.jpg", w: 962, h: 1600, alt: "Goddess Jay in a pale blue fishnet bodysuit, seated on a bench in front of a brick wall" },
  { src: "gallery-2.jpg", w: 1200, h: 1600, alt: "Goddess Jay in a black latex nurse-style dress and stockings, kneeling on the floor" },
  { src: "gallery-3.jpg", w: 1156, h: 1600, alt: "Goddess Jay in a black latex nurse-style dress with pink trim, glasses and stockings" },
  { src: "gallery-4.jpg", w: 1312, h: 1600, alt: "Goddess Jay in glasses and a sheer black top, resting on a grey couch" },
  { src: "gallery-5.jpg", w: 1186, h: 1600, alt: "Goddess Jay in a sheer black top and blue plaid skirt, lying on a grey couch" },
  { src: "gallery-6.jpg", w: 1219, h: 1600, alt: "Goddess Jay in glasses, a blue plaid outfit and black stockings, seated on a bench" },
  { src: "gallery-7.jpg", w: 1200, h: 1600, alt: "Goddess Jay in glasses and a blue plaid outfit, leaning on a bench against a brick wall" },
  { src: "gallery-8.jpg", w: 1200, h: 1600, alt: "Close-up of Goddess Jay in a pale blue fishnet top with long black and blonde hair" },
  { src: "gallery-9.jpg", w: 1200, h: 1600, alt: "Goddess Jay looking up with her tongue out, in front of a brick wall" }
  // Add more like this (one line each, with a comma after the previous one).
  // w and h are the photo's width and height in pixels (right-click the file > Properties/Get Info):
  // { src: "gallery-10.jpg", w: 1200, h: 1600, alt: "Goddess Jay" },
];

/* ===== SITE LOGIC ===== */

const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// Age gate (remembered for this browser session)
const gate = document.getElementById("gate");
let confirmed = false;
try { confirmed = sessionStorage.getItem("ageOk") === "1"; } catch (e) {}
if (gate && !confirmed) gate.hidden = false;
const enterBtn = document.getElementById("enter");
if (enterBtn) enterBtn.addEventListener("click", () => {
  gate.hidden = true;
  try { sessionStorage.setItem("ageOk", "1"); } catch (e) {}
});

if (document.getElementById("galleryGrid")) {
// Gallery: every photo shows in full (no cropping). Space is reserved from each photo's w/h,
// and photos are split into columns by JS so it looks the same on Safari, Chrome and Firefox.
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const grid = document.getElementById("galleryGrid");

const tileHTML = (p, i) => p.src
  ? `<button class="tile" type="button" data-i="${i}" aria-label="Open photo ${i + 1}"><span class="ratio" style="padding-top:${((p.h && p.w ? p.h / p.w : 4 / 3) * 100).toFixed(3)}%"><img src="${p.src}" alt="${p.alt}"${p.w && p.h ? ` width="${p.w}" height="${p.h}"` : ""} loading="lazy" decoding="async"></span></button>`
  : `<div class="tile ph" role="img" aria-label="Photo placeholder ${i + 1}">${icon("heartlock")}</div>`;

let galleryCols = 0;
const renderGallery = () => {
  const cols = Math.max(1, Math.min(GALLERY.length, window.matchMedia("(max-width: 900px)").matches ? 2 : 3));
  if (cols === galleryCols) return;
  galleryCols = cols;
  const parts = Array.from({ length: cols }, () => ({ html: "", h: 0 }));
  GALLERY.forEach((p, i) => {
    let t = parts[0];
    parts.forEach((c) => { if (c.h < t.h) t = c; });
    t.html += tileHTML(p, i);
    t.h += p.h && p.w ? p.h / p.w : 4 / 3;
  });
  grid.innerHTML = parts.map((c) => `<div class="gcol">${c.html}</div>`).join("");
};
renderGallery();
window.addEventListener("resize", renderGallery);

grid.addEventListener("click", (e) => {
  const tile = e.target.closest("button.tile");
  if (!tile) return;
  const p = GALLERY[tile.dataset.i];
  lbImg.src = p.src;
  lbImg.alt = p.alt;
  lightbox.showModal();
});
document.getElementById("closeLb").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
}

// FAQ: open or close every question
const toggleAll = document.getElementById("toggleAll");
if (toggleAll) toggleAll.addEventListener("click", () => {
  const all = [...document.querySelectorAll(".qa")];
  const open = all.some((d) => !d.open);
  all.forEach((d) => { d.open = open; });
  toggleAll.textContent = open ? "Close all" : "Open all";
});

// Alive: spotlight on dark sections, rising keyholes, scroll reveals
document.querySelectorAll(".dark").forEach((sec) => {
  sec.addEventListener("pointermove", (e) => {
    const r = sec.getBoundingClientRect();
    sec.style.setProperty("--mx", e.clientX - r.left + "px");
    sec.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const layer = document.createElement("div");
  layer.className = "drift";
  layer.setAttribute("aria-hidden", "true");
  const n = innerWidth < 700 ? 7 : 13;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    const w = 10 + Math.random() * 16;
    s.style.cssText = `left:${Math.random() * 100}%;width:${w}px;height:${w * 1.52}px;animation-duration:${14 + Math.random() * 16}s;animation-delay:-${Math.random() * 20}s;--sw:${Math.round(Math.random() * 60 - 30)}px`;
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
}

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
    setTimeout(() => { e.target.classList.remove("rv", "in"); e.target.style.removeProperty("--d"); }, 1500);
  }), { threshold: 0.12 });
  document.querySelectorAll(".card,.item,.tile,.rules li,.house li,.plat,.qa,.steps li,.links .btn,.quote blockquote,.about-copy > *").forEach((el, i) => {
    el.classList.add("rv");
    el.style.setProperty("--d", (i % 4) * 90 + "ms");
    io.observe(el);
  });
}

// Content cards: tilt toward the mouse, glow follows it, logo drifts with it
if (matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".plat").forEach((card) => {
    const reset = () => ["--rx", "--ry", "--lx", "--ly"].forEach((v) => card.style.setProperty(v, v[1] === "r" ? "0deg" : "0px"));
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--px", x * 100 + "%");
      card.style.setProperty("--py", y * 100 + "%");
      card.style.setProperty("--ry", (x - 0.5) * 12 + "deg");
      card.style.setProperty("--rx", (0.5 - y) * 12 + "deg");
      card.style.setProperty("--lx", (x - 0.5) * 44 + "px");
      card.style.setProperty("--ly", (y - 0.5) * 44 + "px");
    });
    card.addEventListener("pointerleave", reset);
  });
}
