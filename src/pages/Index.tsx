import { useEffect } from "react";
import { useMemoryGame } from "@/game/useMemoryGame";
import { GameScene } from "@/game/scene/GameScene";
import { HUD } from "@/game/ui/HUD";
import { ChaosFeed } from "@/game/ui/ChaosFeed";
import { MainMenu } from "@/game/ui/MainMenu";
import { EndScreen } from "@/game/ui/EndScreen";
import { cn } from "@/lib/utils";

const Index = () => {
  const { state, flip, start, reset } = useMemoryGame();

  useEffect(() => {
    document.title = "Clareira Caótica — Jogo da Memória 3D";
  }, []);

  return (
    <main
      className={cn(
        "relative h-screen w-screen overflow-hidden bg-background",
        state.shaking && "animate-chaos-shake",
      )}
    >
      <div className="absolute inset-0">
        <GameScene
          cards={state.cards}
          shaking={state.shaking}
          tableFlipped={state.tableFlipped}
          onCardClick={flip}
        />
      </div>

      <div className="vignette absolute inset-0 pointer-events-none" />

      {state.status === "preview" && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 glass-panel rounded-full px-6 py-2 font-display text-lg md:text-xl text-white shadow-xl animate-pulse">
          🧠 memorize os bichos…
        </div>
      )}

      {state.status === "playing" && (
        <>
          <HUD state={state} />
          <ChaosFeed events={state.events} />
          {state.swapClick && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 glass-panel rounded-full px-4 py-2 text-sm text-firefly font-display animate-pulse">
              🔀 próximo clique vai pro lugar errado
            </div>
          )}
          {state.tableFlipped && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 glass-panel rounded-full px-4 py-2 text-sm text-firefly font-display animate-pulse">
              🙃 mesa virada
            </div>
          )}
        </>
      )}

      {state.status === "menu" && <MainMenu onStart={start} />}

      {(state.status === "won" || state.status === "lost") && (
        <EndScreen
          status={state.status}
          moves={state.moves}
          timeLeft={state.timeLeft}
          onRetry={reset}
        />
      )}
    </main>
  );
};

export default Index;
