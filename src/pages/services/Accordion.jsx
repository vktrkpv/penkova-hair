import { useState, useId, useEffect } from "react";
import logo from '../../../public/gallery/logoPenkova.png'

/** Акордеон, що дозволяє відкритою бути тільки одній секції */
export default function Accordion({ items = [], defaultOpenId = null, renderContent }) {
    
  const [openId, setOpenId] = useState(defaultOpenId);

  useEffect(() => {
    setOpenId(defaultOpenId ?? null);
  }, [defaultOpenId]);

  return (
    <div className="space-y-4">
      {items.map((it) => (
        <AccordionItem
          key={it.id}
          item={it}
          isOpen={openId === it.id}
          onToggle={() => setOpenId(openId === it.id ? null : it.id)}
          renderContent={renderContent}
        />
      ))}
    </div>
  );
}

function AccordionItem({ item, isOpen, onToggle, renderContent }) {
  const panelId = useId();
  return (
    <div className="rounded-2xl border border-brand-accent/50 bg-brand-surface shadow-soft overflow-hidden">
      {/* Шапка-плитка категорії */}
      <button
        className={`w-full flex items-center justify-between px-5 py-4 text-left
                    transition hover:bg-brand-accent/20`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* Іконка/бейдж категорії за бажанням */}

          <img 
  src={logo} 
  alt="Logo" 
  className="h-8 w-8 object-contain rounded-full" 
/>




          <div>
            <div className="text-lg font-semibold text-brand-ink">{item.name}</div>
            {item.subtitle && <div className="text-xs text-brand-ink/60">{item.subtitle}</div>}
          </div>
        </div>
        <svg
          className={`h-5 w-5 text-brand-ink/70 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Контент з плавним reveal */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out
                    ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-2">
            {renderContent?.(item)}
          </div>
        </div>
      </div>
    </div>
  );
}
