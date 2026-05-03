import { MemoryCard, ALL_SYMBOLS, CardSymbol } from "./types";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Cria 8 pares (16 cartas) embaralhados nos slots */
export function createDeck(): MemoryCard[] {
  const symbols: CardSymbol[] = ALL_SYMBOLS.slice(0, 8);
  const pairs = symbols.flatMap((sym, i) => [
    { sym, pairId: i },
    { sym, pairId: i },
  ]);
  const shuffled = shuffle(pairs);
  return shuffled.map((p, idx) => ({
    id: idx,
    pairId: p.pairId,
    symbol: p.sym,
    displayedSymbol: p.sym,
    ghostSymbol: null,
    empty: false,
    peeking: false,
    flipped: false,
    matched: false,
    slot: idx,
  }));
}

/** Reembaralha apenas as cartas ainda não combinadas. */
export function chaoticShuffle(cards: MemoryCard[]): MemoryCard[] {
  const unmatched = cards.filter((c) => !c.matched && !c.flipped);
  const slots = unmatched.map((c) => c.slot);
  const newSlots = shuffle(slots);
  const slotMap = new Map<number, number>();
  unmatched.forEach((c, i) => slotMap.set(c.id, newSlots[i]));
  return cards.map((c) =>
    slotMap.has(c.id) ? { ...c, slot: slotMap.get(c.id)! } : c,
  );
}

/** Dá um segundo bicho falso pra N cartas. */
export function addDoubleSymbols(cards: MemoryCard[], count = 2): MemoryCard[] {
  const candidates = cards.filter((c) => !c.matched && !c.ghostSymbol && !c.empty);
  const chosen = shuffle(candidates).slice(0, count);
  const ids = new Set(chosen.map((c) => c.id));
  return cards.map((c) => {
    if (!ids.has(c.id)) return c;
    const others = ALL_SYMBOLS.filter((s) => s !== c.symbol);
    return { ...c, ghostSymbol: others[Math.floor(Math.random() * others.length)] };
  });
}

/** Esvazia N cartas (mostra frente em branco). */
export function makeEmpty(cards: MemoryCard[], count = 2): MemoryCard[] {
  const candidates = cards.filter((c) => !c.matched && !c.empty);
  const chosen = shuffle(candidates).slice(0, count);
  const ids = new Set(chosen.map((c) => c.id));
  return cards.map((c) => (ids.has(c.id) ? { ...c, empty: true } : c));
}

/** Vira N cartas aleatórias (não casadas) por alguns instantes. */
export function ghostReveal(cards: MemoryCard[], count = 3): MemoryCard[] {
  const candidates = cards.filter((c) => !c.matched && !c.flipped);
  const chosen = shuffle(candidates).slice(0, count);
  const ids = new Set(chosen.map((c) => c.id));
  return cards.map((c) => (ids.has(c.id) ? { ...c, flipped: true } : c));
}

/** Desfaz revelações fantasmas (cartas que estão flipped mas não matched e não estão em flippedIds). */
export function hideGhosts(cards: MemoryCard[], keepIds: number[]): MemoryCard[] {
  const keep = new Set(keepIds);
  return cards.map((c) =>
    c.matched || keep.has(c.id) ? c : { ...c, flipped: false },
  );
}

/** Limpa efeitos visuais temporários (ghost symbol + empty). */
export function clearChaos(cards: MemoryCard[]): MemoryCard[] {
  return cards.map((c) => ({
    ...c,
    displayedSymbol: c.symbol,
    ghostSymbol: null,
    empty: false,
  }));
}

/** Revela todas as cartas (preview inicial). */
export function revealAll(cards: MemoryCard[]): MemoryCard[] {
  return cards.map((c) => ({ ...c, flipped: true }));
}

/** Esconde todas as cartas (fim do preview). */
export function hideAll(cards: MemoryCard[]): MemoryCard[] {
  return cards.map((c) => ({ ...c, flipped: false }));
}

/** Escolhe um pair (mesmo pairId) ainda completo (não casado, não vazio) para o "bicho fugir". */
export function pickFleePair(cards: MemoryCard[]): number | null {
  const groups = new Map<number, MemoryCard[]>();
  for (const c of cards) {
    if (c.matched || c.empty) continue;
    const arr = groups.get(c.pairId) ?? [];
    arr.push(c);
    groups.set(c.pairId, arr);
  }
  const valid = [...groups.entries()].filter(([_, arr]) => arr.length === 2);
  if (valid.length === 0) return null;
  return valid[Math.floor(Math.random() * valid.length)][0];
}

/** Revela (flipped=true) ambas as cartas de um pair. */
export function revealPair(cards: MemoryCard[], pairId: number): MemoryCard[] {
  return cards.map((c) => (c.pairId === pairId && !c.matched ? { ...c, flipped: true } : c));
}

/** Esvazia ambas as cartas de um pair e abaixa elas. */
export function emptyPair(cards: MemoryCard[], pairId: number): MemoryCard[] {
  return cards.map((c) =>
    c.pairId === pairId && !c.matched ? { ...c, empty: true, flipped: false } : c,
  );
}

/** Troca o "bicho" (symbol + pairId) entre 2 cartas não casadas. Pequena trapaça. */
export function swapSymbols(cards: MemoryCard[]): MemoryCard[] {
  const candidates = cards.filter((c) => !c.matched && !c.empty && !c.flipped);
  if (candidates.length < 2) return cards;
  const [a, b] = shuffle(candidates).slice(0, 2);
  return cards.map((c) => {
    if (c.id === a.id) return { ...c, symbol: b.symbol, displayedSymbol: b.symbol, pairId: b.pairId };
    if (c.id === b.id) return { ...c, symbol: a.symbol, displayedSymbol: a.symbol, pairId: a.pairId };
    return c;
  });
}
