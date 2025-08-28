import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin"; // куди вертати після логіну

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-brand-surface border border-brand-accent/60 p-6 shadow-soft"
      >
        <h1 className="text-2xl font-semibold text-brand-ink">Admin login</h1>

        <label className="block mt-4 text-sm text-brand-ink">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block mt-3 text-sm text-brand-ink">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-brand-accent/60 bg-brand-bg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-accent/60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full btn justify-center disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <div className="mt-3 text-xs text-brand-ink/60">
          <Link to="/">← Back to site</Link>
        </div>
      </form>
    </div>
  );
}
