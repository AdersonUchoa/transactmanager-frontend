import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            {content}
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </div>
  );
}