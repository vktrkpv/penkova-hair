import { Link } from "react-router-dom";

export default function GalleryPreview({ items }) {
  return (
    <section className="relative py-16 bg-gradient-to-b from-brand-surface/50 to-brand-bg">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8 text-center">
          <div className="text-brand-ink/60 tracking-widest uppercase text-xs">Gallery</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-brand-ink">Recent work</h2>
          <p className="mt-3 text-brand-ink/70">A few favorites from the chair.</p>
        </div>

        {/* Сітка фото */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((img, i) => (
            <figure
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-brand-accent/50 bg-brand-surface"
              aria-label={img.alt || "Hair work"}
            >
              <img
                src={img.src}
                alt={img.alt || "Hair work"}
                loading="lazy"
                className="h-full w-full object-cover aspect-[4/5] transition duration-500 group-hover:scale-105"
              />

              {/* легкий затемнюючий градієнт для контрасту підпису */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />

              {/* ПІДПИС: завжди видно, але на hover оживає */}
              <figcaption
                className="
                  absolute bottom-3 left-3 z-10
                  max-w-[85%] truncate
                  rounded-xl bg-brand-bg/90 backdrop-blur-sm
                  border border-brand-accent/50
                  px-3 py-1 text-xs text-brand-ink shadow-soft
                  opacity-90
                  transition
                  group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:shadow-xl
                  group-hover:ring-1 group-hover:ring-brand-accent/60
                "
                title={img.alt} /* показує повний текст при наведенні курсору */
              >
                {img.alt}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Кнопка CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center rounded-full px-8 py-3 font-medium shadow-soft
                       bg-brand-primary text-white hover:bg-brand-ink transition"
          >
            View gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
