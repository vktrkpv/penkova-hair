// src/data/services.js

/** ============ Categories (для табів/фільтрів) ============ */
export const serviceCategories = [
  { id: "treatments", name: "Treatments" },
  { id: "coloring",   name: "Coloring" },
  { id: "extensions", name: "Extensions" },
  { id: "haircuts",   name: "Haircuts" },          
  { id: "styling",    name: "Styling / Updos" },   
  { id: "texture",    name: "Texture & Perms" },   
];


/** ============ Helpers ============ */
export const formatPrice = (n) => `$${n}`;
export const byConsult = "by consult";

// Мінімальна ціна серед варіантів (для лейблу "from $60")
export function minVariantPrice(variants = []) {
  const prices = variants
    .map(v => typeof v.price === "number" ? v.price : (Array.isArray(v.priceRange) ? v.priceRange[0] : undefined))
    .filter(p => typeof p === "number");
  return prices.length ? Math.min(...prices) : undefined;
}

// Текст ціни для карток (Home → Popular services)
export function priceLabel(svc) {
  if (svc.byConsult) return byConsult;
  const min = minVariantPrice(svc.variants);
  return typeof min === "number" ? `from ${formatPrice(min)}` : "";
}

/** ============ Services (твій контент) ============ */
/*
  Поля:
  - id, slug, category: string
  - title: string
  - desc: короткий опис (1–2 речення)
  - notes?: додаткові примітки (показувати на сторінці сервісу)
  - addOns?: надбавки типу thick hair
  - variants: [{ id, label, durationMin, price? | priceRange?[min,max] }]
  - byConsult?: true (ціна після консультації)
  - popular?: true (щоб потрапити в блок Popular services на Home)
*/

export const services = [
  /* -------------------- TREATMENTS -------------------- */

  {
    id: "treat-collagen",
    slug: "collagen-hair-treatment",
    category: "treatments",
    title: "Collagen Hair Treatment",
    desc:
      "Deeply nourishes and strengthens hair with natural collagen for smoother, shinier, more manageable results (not a straightening).",
    notes: [
      "Results last ~1–3 months depending on hair and home care.",
      "Use sulfate-/paraben-/silicone-free, color-safe shampoos.",
      "Coloring: 1–2 weeks before or 2 weeks after the treatment.",
      "If hair is severely over-bleached, start with cold restoration first.",
      "Safe for pregnant women and children (at stylist’s discretion).",
    ],
    variants: [
      { id: "short",      label: "Short hair",      durationMin: 120, price: 150 },
      { id: "medium",     label: "Medium hair",     durationMin: 150, price: 250 },
      { id: "long",       label: "Long hair",       durationMin: 180, price: 300 },
      { id: "extra-long", label: "Extra long hair", durationMin: 210, price: 350 },
    ],
    popular: true,
  },

  {
    id: "treat-botox",
    slug: "hair-botox-treatment",
    category: "treatments",
    title: "Hair Botox Treatment",
    desc:
      "Intensive repair that hydrates, restores elasticity and smoothness with a light de-frizz effect (stronger than Collagen; not full straightening).",
    notes: [
      "Results last ~2–4 months depending on care.",
      "Suitable for natural and colored hair; bleached hair — at stylist’s discretion.",
      "If hair is severely damaged, start with cold restoration first.",
      "Coloring and Hair Botox should be 2 weeks apart (not same day).",
      "May slightly fade dye — plan toning if needed.",
    ],
    addOns: [{ id: "thick-extra", label: "Very thick hair (any length)", price: 50 }],
    variants: [
      { id: "short",      label: "Short hair",      durationMin: 120, price: 150 },
      { id: "medium",     label: "Medium hair",     durationMin: 150, price: 250 },
      { id: "long",       label: "Long hair",       durationMin: 180, price: 300 },
      { id: "extra-long", label: "Extra long hair", durationMin: 240, price: 350 },
    ],
    popular: true,
  },

  {
    id: "treat-keratin",
    slug: "keratin-hair-straightening",
    category: "treatments",
    title: "Keratin Hair Straightening",
    desc:
      "Professional smoothing/straightening for sleek, frizz-free hair using gentle, formaldehyde-free formulas. Adds shine and manageability.",
    notes: [
      "Not recommended for very tight curls or platinum-bleached hair.",
      "Procedure has temporary fumes/smell — this is normal.",
      "Wash 5–12 hours after the treatment.",
      "Results last ~6–9 months depending on care and washing frequency.",
    ],
    addOns: [{ id: "thick-extra", label: "Very thick hair (any length)", price: 50 }],
    variants: [
      { id: "short",      label: "Short hair",      durationMin: 120, price: 150 },
      { id: "medium",     label: "Medium hair",     durationMin: 150, price: 250 },
      // Діапазон: ставимо мінімальну в price, а верхню межу — в priceRange для відображення на сторінці
      { id: "long",       label: "Long hair",       durationMin: 180, price: 300, priceRange: [300, 350], note: "depending on thickness" },
      { id: "extra-long", label: "Extra long hair", durationMin: 210, price: 400, priceRange: [400, 450], note: "depending on thickness" },
    ],
    popular: true,
  },

  /* -------------------- EXTENSIONS -------------------- */

  {
    id: "ext-hot-fusion",
    slug: "hot-fusion-hair-extensions",
    category: "extensions",
    title: "Hot Fusion Hair Extensions (Keratin Bond)",
    desc:
      "Premium keratin-bond capsules applied strand-by-strand for natural look, length or volume. Lightweight, discreet, and comfortable.",
    notes: [
      "Consultation required to match shade and order hair (premium European hair available).",
      "Brush daily with an extensions brush; never sleep with wet hair.",
      "Avoid oils/masks on bonds; schedule maintenance on time (2–3 months).",
      "Coloring can be done a few days before/after the procedure.",
    ],
    variants: [
      { id: "side-volume", label: "Side-zone volume only", durationMin: 180, price: 250 },
      { id: "full-volume", label: "Full-head volume",      durationMin: 240, price: 400 },
      { id: "lengthening", label: "Lengthening",           durationMin: 300, price: 550, priceRange: [550, 600] },
    ],
  },

  /* -------------------- COLORING -------------------- */

  {
    id: "color-airtouch",
    slug: "airtouch-coloring",
    category: "coloring",
    title: "AirTouch Coloring",
    desc:
      "Advanced technique with seamless, sun-kissed transitions and natural blend. Low-maintenance grow-out with soft dimension.",
    notes: [
      "Process: sectioning, blow-out of baby hairs, lightening, toning, styling.",
      "Refresh on average every 4–6 months; use color-safe care; protect from heat/sun/chlorine.",
    ],
    variants: [
      { id: "medium",     label: "Medium hair",     durationMin: 180, price: 250 },
      { id: "long",       label: "Long hair",       durationMin: 240, price: 300, priceRange: [300, 350] },
      { id: "extra-long", label: "Extra long hair", durationMin: 300, price: 350, priceRange: [350, 450] },
    ],
  },

  {
    id: "color-balayage",
    slug: "balayage",
    category: "coloring",
    title: "Balayage",
    desc:
      "Freehand painting for soft, natural highlights with gradual transitions and minimal maintenance. Toning recommended for perfect shade.",
    notes: [
      "Best on medium to long hair; timing depends on desired lightness.",
      "Refresh every 4–6 months; do gloss/toner between visits to keep brightness.",
    ],
    variants: [
      { id: "medium",     label: "Medium hair",     durationMin: 180, price: 220 },
      { id: "long",       label: "Long hair",       durationMin: 210, price: 280 },
      { id: "extra-long", label: "Extra long & thick hair", durationMin: 240, price: 350 },
    ],
  },

  {
    id: "color-shatush",
    slug: "shatush",
    category: "coloring",
    title: "Shatush",
    desc:
      "Soft, sun-kissed highlighting with diffused blend and natural depth. Elegant, low-maintenance color with seamless grow-out.",
    notes: [
      "Typically 3–6 hours incl. prep, coloring, toning, styling.",
      "Use color-safe care; hydrate weekly; heat protectant recommended.",
    ],
    variants: [
      { id: "medium",     label: "Medium hair",     durationMin: 180, price: 250 },
      { id: "long",       label: "Long hair",       durationMin: 210, price: 300 },
      { id: "extra-long", label: "Extra long & thick hair", durationMin: 240, price: 350 },
    ],
  },

  {
    id: "color-contouring",
    slug: "hair-contouring",
    category: "coloring",
    title: "Hair Contouring",
    desc:
      "Face-framing highlights/lowlights to enhance features with light & shadow. Customized placement; luminous, balanced look.",
    notes: [
      "Works on most lengths; adapted for short cuts. Refresh ~2–4 months.",
      "Toning/glossing keeps the color fresh and shiny.",
    ],
    variants: [
      { id: "medium",     label: "Medium hair",     durationMin: 120, price: 150 },
      { id: "long",       label: "Long hair",       durationMin: 150, price: 180 },
      { id: "extra-long", label: "Extra long hair", durationMin: 180, price: 200 },
    ],
  },

  
];

/* -------------------- HAIRCUTS -------------------- */

services.push({
  id: "cut-hair",
  slug: "haircuts",
  category: "haircuts",
  title: "Haircuts (includes wash & light styling)",
  desc: "Precision haircut with wash and light styling for a polished, everyday look.",
  variants: [
    { id: "short",      label: "Short Haircut",       durationMin: 30, price: 40 },
    { id: "medium",     label: "Medium Haircut",      durationMin: 45, price: 55 },
    { id: "long",       label: "Long Haircut",        durationMin: 60, price: 65 },
    { id: "extra-long", label: "Extra Long Haircut",  durationMin: 75, price: 75 },
  ],
  popular: true, // якщо хочеш бачити в "Popular services"
});


/* -------------------- TEXTURE / PERM -------------------- */

services.push({
  id: "texture-perm",
  slug: "permanent-wave-perm",
  category: "texture",
  title: "Permanent Wave (Perm)",
  desc: "Long-lasting curls or waves using a professional perm solution and rods; curl size is customized to your hair and preference.",
  notes: [
    "Includes wash & styling.",
    "Consultation determines curl size/technique and suitability for hair type.",
  ],
  variants: [
    { id: "short",      label: "Short Hair",      durationMin: 120, price: 150 },
    { id: "medium",     label: "Medium Hair",     durationMin: 150, price: 200 },
    { id: "long",       label: "Long Hair",       durationMin: 180, price: 300 },
    { id: "extra-long", label: "Extra Long Hair", durationMin: 210, price: 350 },
  ],
});


/* -------------------- STYLING / UPDOS -------------------- */

services.push({
  id: "styling-event",
  slug: "graduation-evening-bridal-hairstyles",
  category: "styling",
  title: "Graduation, Evening & Bridal Hairstyles",
  desc: "Event styling tailored to your dress and occasion — from soft waves to intricate updos.",
  notes: ["Final day styling is fully secured; time and price depend on length/thickness and complexity."],
  variants: [
    // Ціни з діапазоном: нижню межу ставимо в price, повний діапазон — у priceRange
    { id: "event", label: "Event / Bridal Styling", durationMin: 60, price: 100, priceRange: [100, 150] },
  ],
});

services.push({
  id: "styling-trial",
  slug: "trial-hairstyle",
  category: "styling",
  title: "Trial Hairstyle (highly recommended)",
  desc: "Trial session to refine placement, volume, and balance; lightly secured to allow adjustments.",
  notes: [
    "Lets us try multiple variations before the event day.",
    "On the event day, changes after full set require redoing the style.",
  ],
  variants: [
    { id: "trial", label: "Trial Session", durationMin: 60, price: 80, priceRange: [80, 100] },
  ],
});


/** ============ Pre-computed selections (для Home) ============ */
export const popularServices = services
  .filter(s => s.popular)
  .map(s => ({
    id: s.id,
    title: s.title,
    desc: s.desc,
    price: priceLabel(s),
    ctaTo: "/book",
    category: s.category,
  }));

/** ============ Convenience getters ============ */
export const getServiceById = (id) => services.find(s => s.id === id);
export const getServicesByCategory = (cat) => services.filter(s => s.category === cat);
