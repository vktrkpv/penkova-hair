// src/components/dashboards/add-appointment/AddAppointmentModal/ServicesStep.tsx
import React, { useMemo, useState } from "react";
import { ServiceItem } from "../../../types/appointments"; 
import { serviceCategories } from "../../../data/services";

type Props = {
  visible: boolean;
  all: ServiceItem[];
  selected: ServiceItem[];
  onToggle: (item: ServiceItem) => void;
  onClear: () => void;
};

export default function ServicesStep({ visible, all, selected, onToggle, onClear }: Props) {
  const [active, setActive] = useState<string>("all"); // "all" або id категорії

  const categories = useMemo(
    () => [{ id: "all", name: "All" }, ...serviceCategories],
    []
  );

  // Групуємо по категоріях у порядку з serviceCategories
  const grouped = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const c of serviceCategories) map.set(c.id, []);
    for (const s of all) {
      const key = s.category ?? "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [all]);

  const listForActive = useMemo(() => {
    if (active === "all") return null; // рендеримо всі розділи нижче
    return (grouped.get(active) ?? []).slice();
  }, [active, grouped]);

  if (!visible) return null;

  return (
    <div className="space-y-4">
      {/* Таби категорій */}
      <div className="flex flex-wrap items-center gap-2 pb-1 justify-start">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-3 py-1.5 text-xs rounded-full border transition whitespace-nowrap ${
              active === c.id
                ? "bg-[var(--brand-surface)] border-[var(--brand-border)]"
                : "bg-white hover:bg-[var(--brand-surface)]/70 border-[var(--brand-border)]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Обрані як чіпси */}
      <div className="flex flex-wrap gap-2">
        {selected.map((s) => (
          <button
            key={s.id}
            onClick={() => onToggle(s)}
            className="inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-full bg-[var(--brand-surface)] border border-[var(--brand-border)]"
            title="Remove"
          >
            {s.name}
            <span className="opacity-60">×</span>
          </button>
        ))}
        {selected.length > 0 && (
          <button onClick={onClear} className="text-xs underline opacity-70 hover:opacity-100">
            Clear all
          </button>
        )}
      </div>

      {/* Вміст: або всі категорії секціями, або лише активну */}
      {active === "all" ? (
        <div className="space-y-5">
          {serviceCategories.map((c) => {
            const items = grouped.get(c.id) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={c.id} className="space-y-2">
                <h5 className="text-sm font-semibold opacity-80">{c.name}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((s) => (
                    <ServiceCard
                      key={s.id}
                      item={s}
                      selected={!!selected.find((x) => x.id === s.id)}
                      onToggle={() => onToggle(s)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {listForActive && listForActive.length > 0 ? (
            listForActive.map((s) => (
              <ServiceCard
                key={s.id}
                item={s}
                selected={!!selected.find((x) => x.id === s.id)}
                onToggle={() => onToggle(s)}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 col-span-full">No services in this category.</div>
          )}
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  item,
  selected,
  onToggle,
}: {
  item: ServiceItem;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`text-left rounded-xl border p-3 transition hover:shadow-sm ${
        selected
          ? "border-[var(--brand-primary,#3A5D56)] ring-1 ring-[var(--brand-primary,#3A5D56)]"
          : "border-[var(--brand-border)] bg-white"
      }`}
    >
      <div className="font-medium text-sm">{item.name}</div>
      <div className="text-xs opacity-70">
        {item.duration} min{typeof item.price === "number" ? ` · $${item.price}` : ""}
      </div>
    </button>
  );
}
