import { useState } from "react";

function formatBRL(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const number = Number(digits) / 100;
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function parseBRL(formatted: string): number | null {
  const digits = formatted.replace(/\D/g, "");
  if (!digits) return null;
  return Number(digits) / 100;
}

export function useCurrencyInput(initialValue?: number | null) {
  const [display, setDisplay] = useState<string>(
    initialValue != null
      ? formatBRL(String(Math.round(initialValue * 100)))
      : ""
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplay(formatBRL(e.target.value));
  }

  function reset(value?: number | null) {
    setDisplay(
      value != null ? formatBRL(String(Math.round(value * 100))) : ""
    );
  }

  return {
    display,
    numericValue: parseBRL(display),
    handleChange,
    reset,
  };
}