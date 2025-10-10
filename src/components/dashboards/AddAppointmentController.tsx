import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AddAppointmentButton from "./AddAppointmentButton";
import AddAppointmentModal from "./AddAppointmentModal";

export default function AddAppointmentController() {
  const [open, setOpen] = useState(false);

  // Закриття по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  return (
    <>
      <AddAppointmentButton onClick={() => setOpen(true)} />
      {open && <AddAppointmentModal onClose={() => setOpen(false)} />}
    </>
  );
}

/** Тимчасова легка модалка-плейсхолдер (без логіки, без БД) */
function LightModal({ onClose }: { onClose: () => void }) {
  // Портал у body — щоб модалка не ламала layout календаря
  return createPortal(
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      {/* напівпрозорий фон */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* вміст модалки */}
      <div className="relative z-10 max-w-xl w-[92%] sm:w-[520px] rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Appointment</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.71L12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"
              />
            </svg>
          </button>
        </div>

        {/* Плейсхолдер-контент: далі тут будуть вкладки Services / Client / Time / Summary */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Це тимчасова модалка. На наступному кроці ми замінимо її на
            справжню оболонку з кроками: <b>Services</b> → <b>Client</b> →
            <b> Time</b> → <b>Summary</b>. Поки що тут нічого не записується у Firebase.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-xl border border-[var(--brand-border,#e5e7eb)] hover:bg-gray-50"
          >
            Close
          </button>
          {/* Кнопка підтвердження зʼявиться пізніше, коли додамо логіку */}
        </div>
      </div>
    </div>,
    document.body
  );
}
