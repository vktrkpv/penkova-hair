import React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export default function AddAppointmentButton({ onClick, disabled, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-xl " +
        "bg-[var(--brand-primary,#3A5D56)] text-white shadow hover:opacity-90 " +
        "disabled:opacity-50 disabled:cursor-not-allowed " + (className ?? "")
      }
      title="Add new appointment"
    >
      <span className="hidden sm:inline">Add Appointment</span>
      <span className="sm:hidden">Add</span>
      {/* простий плюсик */}
      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
        <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
      </svg>
    </button>
  );
}
