import { useAuth } from "../../auth/AuthProvider";

export default function AdminTopbar({ onMenuClick }) {
  const { logout } = useAuth();
  return (
    <div className="px-4 py-3 border-b border-brand-accent/40 bg-brand-surface flex items-center justify-between">
      {/* Гамбургер тільки на мобільних */}
      <button
        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl border border-brand-accent/60 hover:bg-brand-accent/30"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        ☰
      </button>

      <div className="md:block text-sm text-brand-ink/70">
        Admin Olexandra P.
      </div>

      <button
        onClick={logout}
        className="text-sm underline hover:text-brand-primary"
      >
        Logout
      </button>
    </div>
  );
}
