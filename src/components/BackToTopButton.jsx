import { useState, useEffect } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  // показуємо кнопку після скролу вниз
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // функція плавного скролу
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-50
        inline-flex items-center justify-center
        h-10 w-10 rounded-full
        bg-brand-primary text-white shadow-lg
        hover:bg-brand-ink transition
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
