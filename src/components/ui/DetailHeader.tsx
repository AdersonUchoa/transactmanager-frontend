interface DetailHeaderProps {
  id: number;
  title: string;
  fields: { label: string; value: string | number }[];
  onBack: () => void;
}

export function DetailHeader({ id, title, onBack, fields }: DetailHeaderProps) {
  const initials = title
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex justify-start items-start mb-5">
        <button
          onClick={onBack}
          className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-1.5"
        >
          ← Voltar
        </button>
      </div>

      <div className="border-t border-zinc-800 pt-5 flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 font-medium text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {fields.map((field, index) => (
                <span key={field.label} className="text-zinc-400 text-sm flex items-center gap-2">
                  {index > 0 && <span>·</span>}
                  {field.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <span className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-2 py-1 self-center">
          ID #{id}
        </span>
      </div>
    </div>
  );
}