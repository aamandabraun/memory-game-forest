import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

interface Props {
  status: "won" | "lost";
  moves: number;
  timeLeft: number;
  onRetry: () => void;
}

export function EndScreen({ status, moves, timeLeft, onRetry }: Props) {
  const won = status === "won";
  return (
    <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="vignette absolute inset-0 pointer-events-none" />
      <div className="relative w-full max-w-sm text-center">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 text-accent">
          <Leaf className="h-5 w-5 -rotate-12" />
          <Leaf className="h-7 w-7 rotate-3" />
          <Leaf className="h-5 w-5 rotate-12" />
        </div>

        <div className="rounded-[2rem] border border-accent/20 bg-background/40 backdrop-blur-md px-6 pt-10 pb-7 shadow-warm">
          <h2 className="font-display text-3xl sm:text-4xl mb-2">
            {won ? "a mata te deixou passar" : "a mata te enganou"}
          </h2>
          <p className="text-muted-foreground text-sm italic mb-6">
            {won
              ? "achou cada bicho no meio da bagunça."
              : "o vento levou sua memória pra longe."}
          </p>

          <div className="flex justify-center gap-6 mb-6 text-left">
            <Stat label="jogadas" value={moves} />
            <div className="w-px bg-border/40" />
            <Stat label={won ? "tempo" : "perdido"} value={`${timeLeft}s`} />
          </div>

          <Button
            size="lg"
            onClick={onRetry}
            className="w-full bg-gradient-warm text-primary-foreground font-display text-lg py-6 rounded-full shadow-warm"
          >
            voltar pra mata
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{label}</div>
      <div className="font-display text-2xl">{value}</div>
    </div>
  );
}
