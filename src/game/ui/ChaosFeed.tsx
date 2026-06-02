import { useEffect, useState } from "react";
import { ChaosEvent } from "../types";

interface Props {
  events: ChaosEvent[];
}

const COLOR_BY_TYPE: Record<ChaosEvent["type"], string> = {
  tableFlip:    "from-fuchsia-500/80 to-orange-400/80",
  reshuffle:    "from-cyan-400/80 to-violet-500/80",
  animalFlees:  "from-rose-400/80 to-amber-500/80",
  emptyCard:    "from-slate-300/80 to-slate-500/80",
  swapSymbols: "from-yellow-300/80 to-amber-500/80",
  swapClick:    "from-emerald-300/80 to-sky-500/80",
};

export function ChaosFeed({ events }: Props) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 120);
    return () => clearInterval(t);
  }, []);

  const visible = events.filter((e) => now - e.timestamp < 2200);

  return (
    <div className="pointer-events-none absolute top-20 right-4 z-20 flex flex-col items-end gap-2">
      {visible.map((e, i) => {
        const age = (now - e.timestamp) / 2200;
        return (
          <div
            key={e.timestamp}
            className={`glass-panel rounded-full px-4 py-1.5 font-display text-sm bg-gradient-to-r ${COLOR_BY_TYPE[e.type]} text-white shadow-lg`}
            style={{
              opacity: i === 0 ? 1 - age * 0.3 : 1 - age,
              transform: `translateX(${age * 12}px) scale(${1 - age * 0.05})`,
            }}
          >
            {e.message}
          </div>
        );
      })}
    </div>
  );
}
