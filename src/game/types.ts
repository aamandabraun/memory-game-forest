// Tipos e configurações do jogo da memória caótico
export type CardSymbol =
  | "fox" | "owl" | "frog" | "bunny" | "deer" | "bear" | "fish" | "snail";

export interface MemoryCard {
  id: number;
  pairId: number;
  symbol: CardSymbol;
  /** símbolo "verdadeiro" — pode mentir mostrando outro temporariamente */
  displayedSymbol: CardSymbol;
  /** segundo bicho mostrado junto (caos doubleSymbol) */
  ghostSymbol: CardSymbol | null;
  /** se true, frente fica em branco (caos emptyCard) */
  empty: boolean;
  /** o bicho está espiando por baixo da carta abaixada (caos peek) */
  peeking: boolean;
  flipped: boolean;
  matched: boolean;
  /** posição na grade (índice) — pode mudar quando embaralha */
  slot: number;
}

/** Paleta dos animais — cores low-poly amigáveis */
export const SYMBOL_COLORS: Record<CardSymbol, { body: string; accent: string }> = {
  fox:   { body: "#e07a3a", accent: "#f5e6d0" },
  owl:   { body: "#7a5a3a", accent: "#e8c98a" },
  frog:  { body: "#6fbf6f", accent: "#3a7a3a" },
  bunny: { body: "#f0e3d0", accent: "#d8a8b0" },
  deer:  { body: "#b07848", accent: "#f0e0c0" },
  bear:  { body: "#8a5a3a", accent: "#3a2418" },
  fish:  { body: "#5aa8d8", accent: "#f5c84b" },
  snail: { body: "#d8a868", accent: "#a07848" },
};

export const ALL_SYMBOLS: CardSymbol[] = [
  "fox","owl","frog","bunny","deer","bear","fish","snail",
];

export type ChaosType =
  | "tableFlip"    // mesa vira (gira tudo de cabeça pra baixo)
  | "reshuffle"    // cartas trocam de lugar
  | "animalFlees"  // o bicho foge — carta fica vazia
  | "emptyCard"    // carta sem nada (mais frequente)
  | "swapSymbols"  // dois bichos trocam de carta (trapaça)
  | "swapClick";   // clica numa, vira outra

export interface ChaosEvent {
  type: ChaosType;
  message: string;
  timestamp: number;
}

export interface GameState {
  cards: MemoryCard[];
  flippedIds: number[];
  moves: number;
  matches: number;
  timeLeft: number;
  status: "menu" | "preview" | "playing" | "won" | "lost";
  chaosLevel: number;
  /** mesa virada de cabeça pra baixo */
  tableFlipped: boolean;
  /** próximo clique vira uma carta aleatória ao invés da clicada */
  swapClick: boolean;
  shaking: boolean;
  events: ChaosEvent[];
}
