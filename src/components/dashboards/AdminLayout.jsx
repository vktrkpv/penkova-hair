import { useEffect, useState } from "react";
import AdminTopbar from "./AdminTopbar";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Закривати по Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink">
      <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex">
        {/* Десктопний сайдбар */}
        <AdminSidebar variant="desktop" />

        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

     {/* Мобільна шухляда — завжди в DOM, керуємо класами */}
<div
  className={`fixed inset-0 z-50 flex transition-opacity duration-300
              ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
  aria-modal="true"
  role="dialog"
  onClick={() => setMobileOpen(false)} // клік по фону закриває
>
  {/* напівпрозорий фон (fade-in/out) */}
  <div
    className={`absolute inset-0 bg-black/50 transition-opacity duration-300
                ${mobileOpen ? "opacity-100" : "opacity-0"}`}
  />

  {/* сама панель (slide-in/out) */}
  <div
    className={`relative z-10 h-full w-72 bg-brand-bg border-r border-brand-accent/40 shadow-xl
                transform transition-transform duration-300 ease-out
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    onClick={(e) => e.stopPropagation()} // клік всередині — не закриває
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-brand-accent/40">
      <div className="text-sm font-medium">Menu</div>
      <button
        onClick={() => setMobileOpen(false)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-brand-accent/60 hover:bg-brand-accent/30"
        aria-label="Close menu"
      >
        ✕
      </button>
    </div>

    {/* Sidebar у мобільному варіанті */}
    <AdminSidebar
      variant="mobile"
      onNavigate={() => setMobileOpen(false)}
    />
  </div>
</div>

    </div>
  );
}
