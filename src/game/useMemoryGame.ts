import { useCallback, useEffect, useReducer, useRef } from "react";
import { GameState, ChaosEvent, ChaosType } from "./types";
import {
  createDeck,
  chaoticShuffle,
  makeEmpty,
  hideGhosts,
  clearChaos,
  revealAll,
  hideAll,
  pickFleePair,
  revealPair,
  emptyPair,
  swapSymbols,
} from "./deck";

const TOTAL_TIME = 60;
const MAX_PAIRS = 8;
const PREVIEW_MS = 2600;

type Action =
  | { type: "start" }
  | { type: "startPlay" }
  | { type: "flip"; id: number }
  | { type: "tick" }
  | { type: "resolveFlip" }
  | { type: "chaos"; event: ChaosEvent; mutate: (s: GameState) => GameState }
  | { type: "stopShake" }
  | { type: "stopTableFlip" }
  | { type: "stopSwapClick" }
  | { type: "hideGhosts" }
  | { type: "clearChaosFx" }
  | { type: "fleeStep2"; pairId: number }
  
  | { type: "reset" };

const initial = (): GameState => ({
  cards: createDeck(),
  flippedIds: [],
  moves: 0,
  matches: 0,
  timeLeft: TOTAL_TIME,
  status: "menu",
  chaosLevel: 0,
  tableFlipped: false,
  swapClick: false,
  shaking: false,
  events: [],
});

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start": {
      const fresh = initial();
      return { ...fresh, status: "preview", cards: revealAll(fresh.cards) };
    }
    case "startPlay":
      return { ...state, status: "playing", cards: hideAll(state.cards) };

    case "reset":
      return initial();

    case "flip": {
      if (state.status !== "playing") return state;
      if (state.flippedIds.length >= 2) return state;
      const card = state.cards.find((c) => c.id === action.id);
      if (!card || card.flipped || card.matched) return state;
      const cards = state.cards.map((c) =>
        c.id === action.id ? { ...c, flipped: true, displayedSymbol: c.symbol } : c,
      );
      return { ...state, cards, flippedIds: [...state.flippedIds, action.id] };
    }

    case "resolveFlip": {
      if (state.flippedIds.length !== 2) return state;
      const [a, b] = state.flippedIds.map(
        (id) => state.cards.find((c) => c.id === id)!,
      );
      const isMatch = (a.empty && b.empty) || (a.pairId === b.pairId && !a.empty && !b.empty);
      const cards = state.cards.map((c) => {
        if (c.id === a.id || c.id === b.id) {
          return isMatch
            ? { ...c, matched: true, flipped: true }
            : { ...c, flipped: false };
        }
        return c;
      });
      const matches = isMatch ? state.matches + 1 : state.matches;
      const chaosLevel = Math.min(100, state.chaosLevel + (isMatch ? 8 : 4));
      const status = matches === MAX_PAIRS ? "won" : state.status;
      return {
        ...state,
        cards,
        flippedIds: [],
        moves: state.moves + 1,
        matches,
        chaosLevel,
        status,
      };
    }

    case "tick": {
      if (state.status !== "playing") return state;
      const timeLeft = state.timeLeft - 1;
      if (timeLeft <= 0) return { ...state, timeLeft: 0, status: "lost" };
      return { ...state, timeLeft };
    }

    case "chaos": {
      const events = [action.event, ...state.events].slice(0, 4);
      return { ...action.mutate(state), events };
    }

    case "stopShake":
      return { ...state, shaking: false };
    case "stopTableFlip":
      return { ...state, tableFlipped: false };
    case "stopSwapClick":
      return { ...state, swapClick: false };
    case "hideGhosts":
      return { ...state, cards: hideGhosts(state.cards, state.flippedIds) };
    case "clearChaosFx":
      return { ...state, cards: clearChaos(state.cards) };
    case "fleeStep2":
      return { ...state, cards: emptyPair(state.cards, action.pairId) };
  }
}

export function useMemoryGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const stateRef = useRef(state);
  stateRef.current = state;
  const lastChaosMoveRef = useRef(0);
  const nextChaosInRef = useRef(2 + Math.floor(Math.random() * 3));
  const fleesUsedRef = useRef(0);
  const peekUsedRef = useRef(0);

  // Resolve flip after delay when 2 cards flipped
  useEffect(() => {
    if (state.flippedIds.length === 2) {
      const t = setTimeout(() => dispatch({ type: "resolveFlip" }), 850);
      return () => clearTimeout(t);
    }
  }, [state.flippedIds]);

  // Preview inicial
  useEffect(() => {
    if (state.status !== "preview") return;
    const t = setTimeout(() => dispatch({ type: "startPlay" }), PREVIEW_MS);
    return () => clearTimeout(t);
  }, [state.status]);

  // Cronômetro
  useEffect(() => {
    if (state.status !== "playing") return;
    const t = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(t);
  }, [state.status]);

  // Reset contadores ao começar nova partida
  useEffect(() => {
    if (state.status === "preview" || state.status === "menu") {
      fleesUsedRef.current = 0;
      peekUsedRef.current = 0;
      lastChaosMoveRef.current = 0;
      nextChaosInRef.current = 1 + Math.floor(Math.random() * 2);
    }
  }, [state.status]);

  // Caos por jogadas
  useEffect(() => {
    if (state.status !== "playing") return;
    const movesSince = state.moves - lastChaosMoveRef.current;
    if (state.moves === 0 || movesSince < nextChaosInRef.current) return;
    if (state.flippedIds.length > 0) return;

    lastChaosMoveRef.current = state.moves;
    nextChaosInRef.current = 1 + Math.floor(Math.random() * 2);

    const pool: ChaosType[] = [
      "tableFlip", "tableFlip",
      "reshuffle", "reshuffle", "reshuffle",
      "emptyCard", "emptyCard", "emptyCard",
      "swapClick", "swapClick",
      "swapSymbols", "swapSymbols", "swapSymbols",
    ];
    if (fleesUsedRef.current < 2) pool.push("animalFlees");

    // Combo: dispara 1-2 caos por vez
    const comboCount = Math.random() < 0.45 ? 2 : 1;
    const picks = Array.from({ length: comboCount }, () => pool[Math.floor(Math.random() * pool.length)]);

    picks.forEach((type, idx) => {
      setTimeout(() => fireChaos(type), idx * 350);
    });
  }, [state.moves, state.status, state.flippedIds.length]);

  const fireChaos = useCallback((type: ChaosType) => {
    const cards = stateRef.current.cards;
    switch (type) {
      case "tableFlip":
        dispatch({
          type: "chaos",
          event: { type, message: "🙃 mesa virou", timestamp: Date.now() },
          mutate: (g) => ({ ...g, tableFlipped: true, shaking: true }),
        });
        setTimeout(() => dispatch({ type: "stopShake" }), 700);
        setTimeout(() => dispatch({ type: "stopTableFlip" }), 5000);
        break;

      case "reshuffle":
        dispatch({
          type: "chaos",
          event: { type, message: "🌀 reembaralhou", timestamp: Date.now() },
          mutate: (g) => ({ ...g, cards: chaoticShuffle(g.cards), shaking: true }),
        });
        setTimeout(() => dispatch({ type: "stopShake" }), 800);
        break;

      case "animalFlees": {
        const pairId = pickFleePair(cards);
        if (pairId == null) break;
        fleesUsedRef.current += 1;
        dispatch({
          type: "chaos",
          event: { type, message: "🏃 os bichos fugiram!", timestamp: Date.now() },
          mutate: (g) => ({ ...g, cards: revealPair(g.cards, pairId) }),
        });
        setTimeout(() => dispatch({ type: "fleeStep2", pairId }), 1400);
        break;
      }

      case "emptyCard":
        dispatch({
          type: "chaos",
          event: { type, message: "👻 carta vazia", timestamp: Date.now() },
          mutate: (g) => ({ ...g, cards: makeEmpty(g.cards, 2) }),
        });
        setTimeout(() => dispatch({ type: "clearChaosFx" }), 4000);
        break;

      case "swapSymbols":
        dispatch({
          type: "chaos",
          event: { type, message: "🔁 bichos trocaram de carta", timestamp: Date.now() },
          mutate: (g) => ({ ...g, cards: swapSymbols(g.cards), shaking: true }),
        });
        setTimeout(() => dispatch({ type: "stopShake" }), 600);
        break;

      case "swapClick":
        dispatch({
          type: "chaos",
          event: { type, message: "🔀 dedo errado", timestamp: Date.now() },
          mutate: (g) => ({ ...g, swapClick: true }),
        });
        break;
    }
  }, [state.moves, state.status, state.flippedIds.length]);

  const flip = useCallback((id: number) => {
    const s = stateRef.current;
    if (s.swapClick) {
      // troca para uma carta aleatória disponível e consome o efeito
      const candidates = s.cards.filter(
        (c) => !c.matched && !c.flipped && c.id !== id,
      );
      if (candidates.length > 0) {
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        dispatch({ type: "flip", id: target.id });
      } else {
        dispatch({ type: "flip", id });
      }
      dispatch({ type: "stopSwapClick" });
    } else {
      dispatch({ type: "flip", id });
    }
  }, []);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return { state, flip, start, reset };
}
