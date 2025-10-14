// src/components/dashboards/add-appointment/AddAppointmentModal/index.tsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import SummaryPanel from "./SummaryPanel";
import { AppointmentDraft, ServiceItem } from "../../../types/appointments";
import { services as catalog } from "../../../data/services";
import ServicesStep from "./ServicesStep";
import ClientStep from "./ClientStep";
import { useAuth } from "../../../auth/AuthProvider";
import type { ClientMini } from "../../../types/appointments";
import TimeStep from "./TimeStep";

import { createAppointment, timeUtils, updateAppointment } from "../../../services/appointments";
import { getOwnerUid } from "../../../lib/ownerUid";






type Step = "services" | "client" | "time" | "summary";


type Mode = "create" | "edit";

type Props = {
  onClose: () => void;
  mode?: Mode;
  ownerUid?: string | null;
  initialDraft?: AppointmentDraft;
  apptId?: string;
};


type AuthCtx = {
  user: { uid: string } | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
};

export default function AddAppointmentModal({ 
  onClose,
  mode = "create",
  ownerUid: ownerUidProp = null,
  initialDraft,
  apptId,

 }: Props) {
  const [step, setStep] = useState<Step>("services");

  

  const appointmentServices = useMemo<ServiceItem[]>(() => {
    return catalog.flatMap((svc: any) =>
      (svc.variants ?? []).map((v: any) => ({
        id: `${svc.id}:${v.id}`,
        name: `${svc.title} — ${v.label}`,
        duration: v.durationMin,
        price:
          typeof v.price === "number"
            ? v.price
            : Array.isArray(v.priceRange)
            ? v.priceRange[0]
            : undefined,
        category: svc.category,
      }))
    );
  }, []);

  const { user } = useAuth() as AuthCtx;
// const ownerUid = user?.uid ?? null;
const ownerUid = getOwnerUid();


  // const [draft, setDraft] = useState<AppointmentDraft>({
  //   services: [],
  //   client: null,
  //   date: null,
  //   start: null,
  // });

  const [draft, setDraft] = useState<AppointmentDraft>(() =>
    initialDraft ?? { services: [], client: null, date: null, start: null }
  );

  const totalDuration = useMemo(
    () => draft.services.reduce((acc, s) => acc + (s.duration || 0), 0),
    [draft.services]
  );
  const totalPrice = useMemo(
    () => draft.services.reduce((acc, s) => acc + (s.price || 0), 0),
    [draft.services]
  );

  const toggleService = (item: ServiceItem) => {
    setDraft((prev) => {
      const exists = prev.services.some((s) => s.id === item.id);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s.id !== item.id)
          : [...prev.services, item],
      };
    });
  };

  const clearServices = () => setDraft((p) => ({ ...p, services: [] }));

  // Заблокувати прокрутку сторінки під модалкою
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Закривати по Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const steps: Step[] = ["services", "client", "time", "summary"];
  const stepIndex = steps.indexOf(step) + 1;

  const title = useMemo(() => {
    switch (step) {
      case "services":
        return "Select Services";
      case "client":
        return "Choose / Add Client";
      case "time":
        return "Pick Date & Time";
      case "summary":
        return "Review & Confirm";
    }
  }, [step]);

  const canGoBack = step !== "services";
  const canGoNext = step !== "summary";

  const goBack = () => {
    setStep((s) => (s === "client" ? "services" : s === "time" ? "client" : "time"));
  };

  const goNext = () => {
    setStep((s) => (s === "services" ? "client" : s === "client" ? "time" : "summary"));
  };

  return createPortal(
    <div aria-modal role="dialog" className="fixed inset-0 z-[1100] flex items-center justify-center">
      {/* Фон */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Контейнер модалки */}
      <div
        className="
          relative z-10
          w-screen h-[100dvh]
          md:w-[88%] md:max-w-3xl
          bg-white md:rounded-2xl shadow-2xl overflow-hidden
          flex flex-col
        "
      >
        {/* Header — sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-white">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
            <p className="text-xs text-gray-500">
              Step {stepIndex} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100"
            aria-label="Close"
            title="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.71L12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--brand-surface)]/60 overflow-x-auto">
          {steps.map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-3 py-1.5 text-xs rounded-full border transition ${
                step === s
                  ? "bg-white border-[var(--brand-border)] shadow"
                  : "bg-transparent hover:bg-white/70 border-transparent"
              }`}
            >
              {s === "services" ? "Services" : s === "client" ? "Client" : s === "time" ? "Time" : "Summary"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
          {/* Ліва частина: кроки */}
          <div className="min-h-[240px]">
            <ServicesStep
              visible={step === "services"}
              all={appointmentServices}
              selected={draft.services}
              onToggle={toggleService}
              onClear={clearServices}
            />

            <ClientStep
  visible={step === "client"}
  ownerUid={ownerUid}
  value={draft.client ?? null} 
  onChange={(c: ClientMini | null) => setDraft((p) => ({ ...p, client: c }))}
/>


<TimeStep
  visible={step === "time"}
  ownerUid={ownerUid}
  totalDuration={totalDuration}
  draft={draft}
  setDraft={setDraft}
/>


           {step === "summary" && (
  <div>
    <SummaryPanel
      mode="full"
      services={draft.services}
      totalDuration={totalDuration}
      totalPrice={totalPrice}
      client={draft.client}
      dateISO={draft.date ? draft.date.toISOString().slice(0,10) : null}
      start={draft.start}
    />
  </div>
)}

          </div>

          {/* Права частина: підсумок */}
         {step !== "summary" && (
  <aside className="hidden md:block">
    <div className="sticky top-4">
      <SummaryPanel
        mode="compact"
        services={draft.services}
        totalDuration={totalDuration}
        totalPrice={totalPrice}
        client={draft.client}
        dateISO={draft.date ? draft.date.toISOString().slice(0,10) : null}
        start={draft.start}
      />
    </div>
  </aside>
)}

        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t bg-white"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="text-xs text-gray-500">
            Changes won’t be saved to the database until you press <b>Confirm</b>.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {canGoBack && (
              <button
                onClick={goBack}
                className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {canGoNext ? (
              <button
                onClick={goNext}
                className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl bg-[var(--brand-primary,#3A5D56)] text-white hover:opacity-90"
              >
                Next
              </button>
            ) : (
              <button
  onClick={async () => {
    if (!ownerUid || !draft.client || !draft.start || !draft.date || draft.services.length === 0) return;

    const dateISO = draft.date.toISOString().slice(0, 10);
    const startMs = timeUtils.makeMs(dateISO, draft.start);
    const durationMin = draft.services.reduce((a, s) => a + (s.duration || 0), 0);
    const endMs = startMs + durationMin * 60 * 1000;
    const priceTotal = draft.services.reduce((a, s) => a + (s.price || 0), 0);

    if (mode === "edit" && apptId) {
      await updateAppointment(apptId, {
        client: draft.client,
        services: draft.services,
        durationMin,
        priceTotal,
        date: dateISO,
        start: startMs,
        end: endMs,
        updatedAt: new Date(),
      });
    } else {
      await createAppointment({
        stylistUid: ownerUid,
        client: draft.client,
        services: draft.services,
        durationMin,
        priceTotal,
        date: dateISO,
        start: startMs,
        end: endMs,
        status: "booked",
      });
    }

    onClose();
  }}
  className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl bg-[var(--brand-primary,#3A5D56)] text-white hover:opacity-90"
>
  {mode === "edit" ? "Save changes" : "Confirm"}
</button>


            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// function TimeStep({ visible }: { visible: boolean }) {
//   if (!visible) return null;
//   return (
//     <div className="space-y-2">
//       <h4 className="font-medium">Date & Time</h4>
//       <p className="text-sm text-gray-600">
//         Pick a date and available time slot. Conflicts will be checked later.
//       </p>
//     </div>
//   );
// }
