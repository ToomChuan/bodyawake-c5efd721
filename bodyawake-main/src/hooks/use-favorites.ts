import * as React from "react";

const KEY = "warmcare:favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("warmcare:favorites-changed"));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIds(read());
    const sync = () => setIds(read());
    window.addEventListener("warmcare:favorites-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("warmcare:favorites-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = React.useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    write(next);
    setIds(next);
  }, []);

  const has = React.useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}
