import { useEffect, useState } from "react";
import { auth, firebaseProjectId } from "../lib/firebase";

export default function DevCheck() {
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // якщо SDK ініціалізовано — цей підписник працюватиме
    const unsub = auth.onAuthStateChanged(u => {
      setUserEmail(u?.email ?? null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-2xl border border-brand-accent/50 bg-brand-surface p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Firebase Dev Check</h1>
        <ul className="mt-4 space-y-2 text-brand-ink/80">
          <li><strong>Project ID:</strong> {firebaseProjectId || "—"}</li>
          <li><strong>SDK initialized:</strong> {ready ? "Yes ✅" : "Loading…"}</li>
          <li><strong>Auth user:</strong> {userEmail || "No (not signed in)"}</li>
        </ul>
        <p className="mt-4 text-sm text-brand-ink/60">
          Бачиш Project ID і “Yes ✅”? — Значить конфіг ок. Далі зробимо логін.
        </p>
      </div>
    </div>
  );
}
