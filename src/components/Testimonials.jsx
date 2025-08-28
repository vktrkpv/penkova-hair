import { Link } from "react-router-dom";

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-1 text-brand-primary" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials({ items, googleProfileUrl }) {
  return (
    <section className="py-16 bg-gradient-to-b from-brand-bg to-brand-surface/40">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="text-brand-ink/60 tracking-widest uppercase text-xs">Reviews</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-brand-ink">
            What clients say
          </h2>
          <p className="mt-3 text-brand-ink/70">
            A few words from happy clients.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((r, i) => (
            <figure
              key={i}
              className="group h-full rounded-2xl bg-brand-surface border border-brand-accent/50 p-6 shadow-soft
                         hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <figcaption className="flex items-center justify-between">
                <div className="font-medium text-brand-ink">{r.name}</div>
                <Stars n={r.rating} />
              </figcaption>
              <blockquote className="mt-3 text-brand-ink/80 leading-relaxed">
                “{r.text}”
              </blockquote>
              <div className="mt-4 text-xs text-brand-ink/60">{r.source}</div>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/reviews"
            className="inline-flex items-center rounded-full px-6 py-2.5 font-medium shadow-soft
                       bg-brand-primary text-white hover:bg-brand-ink transition"
          >
            Read more reviews
          </Link>

          {/* якщо є посилання на твій Google профіль */}
          {googleProfileUrl && (
            <div className="mt-3 text-xs text-brand-ink/60">
              or{" "}
              <a
                href={googleProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-primary"
              >
                see them on Google
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
