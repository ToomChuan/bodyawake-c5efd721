import * as React from "react";

const KEY_PREFIX = "warmcare:checklist:";

export function useChecklist(id: string, total: number) {
  const [checked, setChecked] = React.useState<boolean[]>(() => Array(total).fill(false));

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY_PREFIX + id);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === total) {
          setChecked(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [id, total]);

  const toggle = React.useCallback(
    (index: number) => {
      setChecked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        try {
          window.localStorage.setItem(KEY_PREFIX + id, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [id],
  );

  return { checked, toggle };
}
