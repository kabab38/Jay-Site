/* ===== EDIT YOUR CONTENT HERE ===== */

// Gallery: upload each photo next to your other files and list it here by file name.
const GALLERY = [
  { src: "gallery-1.jpg", alt: "Goddess Jay in a black lace halter top and long black skirt" },
  { src: "gallery-2.jpg", alt: "Goddess Jay in a black latex nurse-style dress with pink trim, glasses and stockings" },
  { src: "gallery-3.jpg", alt: "Goddess Jay in a pink and grey striped zip-up outfit with long black and silver hair" },
  { src: "gallery-4.jpg", alt: "Goddess Jay in black athleisure and heels, seated on a facesitting chair over a masked submissive" },
  { src: "gallery-5.jpg", alt: "Goddess Jay raising one finger while seated on a facesitting chair over a masked submissive" },
  { src: "gallery-6.jpg", alt: "Goddess Jay taking a mirror selfie in a pink and grey striped zip-up set" }
  // Add more like this (one line each, with a comma after the previous one):
  // { src: "gallery-2.jpg", alt: "Goddess Jay" },
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
// Gallery
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
document.getElementById("galleryGrid").classList.toggle("few", GALLERY.length < 3);
document.getElementById("galleryGrid").innerHTML = GALLERY.map((p, i) =>
  p.src
    ? `<button class="tile" type="button" data-i="${i}" aria-label="Open photo ${i + 1}"><img src="${p.src}" alt="${p.alt}" loading="lazy"></button>`
    : `<div class="tile ph" role="img" aria-label="Photo placeholder ${i + 1}">${icon("heartlock")}</div>`
).join("");

document.getElementById("galleryGrid").addEventListener("click", (e) => {
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
