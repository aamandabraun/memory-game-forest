import { PawPrint, Clock, Sparkles, Repeat } from "lucide-react";
import { GameState } from "../types";
import { cn } from "@/lib/utils";

interface Props {
  state: GameState;
}

export function HUD({ state }: Props) {
  const timeColor =
    state.timeLeft < 15 ? "text-destructive" : state.timeLeft < 30 ? "text-firefly" : "text-foreground";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-2 sm:p-4 md:p-6">
      {/* Mobile: compact single row */}
      <div className="flex sm:hidden items-center justify-between gap-2">
        <div className="glass-panel rounded-full px-3 py-1.5 flex items-center gap-2 pointer-events-auto">
          <PawPrint className="h-3.5 w-3.5 text-primary" />
          <span className="font-display text-sm leading-none tabular-nums">
            {state.matches}<span className="text-muted-foreground">/8</span>
          </span>
          <span className="w-px h-4 bg-border mx-1" />
          <Repeat className="h-3.5 w-3.5 text-accent" />
          <span className="font-display text-sm leading-none tabular-nums">{state.moves}</span>
        </div>

        <div className="glass-panel rounded-full px-3 py-1.5 flex items-center gap-1.5 pointer-events-auto">
          <Clock className={cn("h-3.5 w-3.5", timeColor)} />
          <span className={cn("font-display text-base leading-none tabular-nums", timeColor, state.timeLeft < 15 && "animate-pulse")}>
            {String(Math.floor(state.timeLeft / 60))}:{String(state.timeLeft % 60).padStart(2, "0")}
          </span>
        </div>

        <div className="glass-panel rounded-full px-2.5 py-1.5 flex items-center gap-1.5 pointer-events-auto">
          <Sparkles className="h-3.5 w-3.5 text-firefly" />
          <div className="h-1.5 w-10 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-warm transition-all duration-500" style={{ width: `${state.chaosLevel}%` }} />
          </div>
        </div>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden sm:flex items-start justify-between">
        <div className="glass-panel rounded-2xl px-4 py-3 md:px-5 md:py-4 flex items-center gap-4 md:gap-6 pointer-events-auto">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Pares</div>
              <div className="font-display text-2xl leading-none">{state.matches}<span className="text-muted-foreground text-base">/8</span></div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-accent" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Jogadas</div>
              <div className="font-display text-2xl leading-none">{state.moves}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl px-5 py-3 md:py-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Clock className={cn("h-5 w-5", timeColor)} />
            <div className={cn("font-display text-3xl md:text-4xl tabular-nums", timeColor, state.timeLeft < 15 && "animate-pulse")}>
              {String(Math.floor(state.timeLeft / 60)).padStart(1, "0")}:
              {String(state.timeLeft % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl px-4 py-3 md:px-5 md:py-4 w-44 md:w-56 pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-firefly" />
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Caos</div>
            <div className="ml-auto font-display text-sm tabular-nums">{Math.round(state.chaosLevel)}%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-warm transition-all duration-500 shadow-glow"
              style={{ width: `${state.chaosLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
