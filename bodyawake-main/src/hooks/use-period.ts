import { useState, useEffect } from "react";

const KEY = "warmcare:period";
const EVENT = "warmcare:period-changed";

export interface PeriodData {
  startDate: string; // "YYYY-MM-DD"
  duration: number;
}

function read(): PeriodData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PeriodData) : null;
  } catch {
    return null;
  }
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function usePeriod() {
  const [data, setData] = useState<PeriodData | null>(read);

  useEffect(() => {
    const sync = () => setData(read());
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  const save = (startDate: string, duration: number) => {
    const next: PeriodData = { startDate, duration };
    localStorage.setItem(KEY, JSON.stringify(next));
    setData(next);
    window.dispatchEvent(new CustomEvent(EVENT));
  };

  const clear = () => {
    localStorage.removeItem(KEY);
    setData(null);
    window.dispatchEvent(new CustomEvent(EVENT));
  };

  const isInPeriod: boolean = (() => {
    if (!data) return false;
    const today = toDateStr(new Date());
    const start = data.startDate;
    const end = toDateStr(
      new Date(new Date(start).getTime() + data.duration * 86400000)
    );
    return today >= start && today < end;
  })();

  return { data, isInPeriod, save, clear };
}
