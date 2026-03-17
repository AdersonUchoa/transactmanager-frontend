import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color?: "green" | "red" | "blue";
}

export function StatCard({ title, value, icon, color = "blue" }: StatCardProps) {

  const colorStyles = {
    green: {
      icon: "text-emerald-400 bg-emerald-400/10",
      value: "text-emerald-400"
    },
    red: {
      icon: "text-red-400 bg-red-400/10",
      value: "text-red-400"
    },
    blue: {
      icon: "text-blue-400 bg-blue-400/10",
      value: "text-blue-400"
    }
  };

  return (
    <div
      className="
        rounded-xl
        border border-zinc-800
        bg-zinc-900
        p-6
        flex
        items-center
        justify-between
        transition
        hover:border-zinc-700
        hover:shadow-lg
      "
    >
      <div className="flex flex-col">
        <span className="text-sm text-zinc-400">{title}</span>
        <span className={`text-2xl font-bold mt-2 ${colorStyles[color].value}`}>
          {value}
        </span>
      </div>

      <div
        className={`
          h-10
          w-10
          rounded-lg
          flex
          items-center
          justify-center
          ${colorStyles[color].icon}
        `}
      >
        {icon}
      </div>
    </div>
  );
}