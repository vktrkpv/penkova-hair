export default function Button({ children, as = "button", className = "", ...props }) {
  const Comp = as;
  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3
                  bg-brand-primary text-white hover:bg-brand-ink transition shadow-soft ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
