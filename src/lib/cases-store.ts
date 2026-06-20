import { useEffect, useState } from "react";
import type { IncidentCase } from "./incident-summary.functions";

const KEY = "lify.cases.v1";

export type StoredCase = IncidentCase & {
  id: string;
  number: string;
  createdAt: string;
};

function read(): StoredCase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredCase[]) : [];
  } catch {
    return [];
  }
}

function write(cases: StoredCase[]) {
  window.localStorage.setItem(KEY, JSON.stringify(cases));
  window.dispatchEvent(new CustomEvent("lify:cases-changed"));
}

export function addCase(c: IncidentCase): StoredCase {
  const existing = read();
  const stored: StoredCase = {
    ...c,
    id: crypto.randomUUID(),
    number: `№${200 + existing.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  write([stored, ...existing]);
  return stored;
}

export function useCases(): StoredCase[] {
  const [cases, setCases] = useState<StoredCase[]>([]);
  useEffect(() => {
    setCases(read());
    const onChange = () => setCases(read());
    window.addEventListener("lify:cases-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("lify:cases-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return cases;
}
