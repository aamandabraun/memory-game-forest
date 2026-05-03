import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

interface Props {
  onStart: () => void;
}

export function MainMenu({ onStart }: Props) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
      <div className="vignette absolute inset-0 pointer-events-none" />
      <div className="relative w-full max-w-sm text-center">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 text-accent">
          <Leaf className="h-5 w-5 -rotate-12" />
          <Leaf className="h-7 w-7 rotate-3" />
          <Leaf className="h-5 w-5 rotate-12" />
        </div>

        <div className="rounded-[2rem] border border-accent/20 bg-background/40 backdrop-blur-md px-6 pt-10 pb-7 shadow-warm">
          <h1 className="font-display text-5xl sm:text-6xl leading-none mb-3 text-shadow-warm">
            bicho <span className="text-primary italic">solto</span>
          </h1>
          <p className="text-muted-foreground text-base italic mb-6">
            Animais que mentem, fogem e embaralham. <br></br>Você consegue pegá-los?
          </p>

          <Button
            size="lg"
            onClick={onStart}
            className="w-full bg-gradient-warm text-primary-foreground font-display text-xl py-6 rounded-full shadow-warm hover:shadow-glow transition-all"
          >
            entrar na mata
          </Button>

          <p className="mt-5 text-xs tracking-widest uppercase text-muted-foreground/70">
            60s · 8 pares
          </p>
        </div>
      </div>
    </div>
  );
}