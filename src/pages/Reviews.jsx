export default function Reviews() {
  return (
    <section className="relative py-20 bg-brand-surface">
      <div className="container mx-auto px-4 text-center">
        {/* Іконка */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center 
                        rounded-full bg-brand-accent/20 text-brand-primary">
          <svg xmlns="http://www.w3.org/2000/svg" 
               fill="none" viewBox="0 0 24 24" 
               strokeWidth={1.5} stroke="currentColor" 
               className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M12 6v6h4.5m4.5 6.75a9.75 9.75 0 11-19.5 0 
                 9.75 9.75 0 0119.5 0z" />
          </svg>
        </div>

        {/* Заголовок */}
        <h2 className="text-3xl md:text-4xl font-semibold text-brand-ink">
          Reviews page under maintenance
        </h2>

        {/* Пояснення */}
        <p className="mt-4 text-brand-ink/70 max-w-lg mx-auto">
          We’re working on this section right now. Soon you’ll be able to
          read client feedback and experiences directly here.
        </p>

        {/* Кнопка назад */}
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center rounded-full px-6 py-3 font-medium shadow-soft
                       bg-brand-primary text-white hover:bg-brand-ink transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </section>
  );
}
