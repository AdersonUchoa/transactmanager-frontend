type Variant = "primary" | "danger" | "ghost";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: Variant;
  disabled?: boolean;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-zinc-100 hover:bg-white text-zinc-900 font-semibold",
  danger:
    "text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60",
  ghost:
    "text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/60",
};

export function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-sm px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {label}
    </button>
  );
}