import { NavLink } from "react-router-dom";

const items = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/calendar", label: "Calendar" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar({ variant = "desktop", onNavigate }) {
  const base = "block rounded-xl px-3 py-2 text-sm transition hover:bg-brand-accent/30";

  // різні класи контейнера для desktop / mobile
  const containerClass =
    variant === "desktop"
      ? "hidden md:block w-56 shrink-0 border-r border-brand-accent/40 bg-brand-bg p-4"
      : "block md:hidden w-72 bg-brand-bg p-4"; // у шухляді

  return (
    <aside className={containerClass}>
      <div className="mb-4 text-xs uppercase tracking-widest text-brand-ink/60">Admin Olexandra P.</div>
      <nav className="space-y-1">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            className={({ isActive }) =>
              isActive ? `${base} bg-brand-accent/40 text-brand-ink` : `${base} text-brand-ink/80`
            }
            onClick={onNavigate} // щоб на мобільних закривати шухляду
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
