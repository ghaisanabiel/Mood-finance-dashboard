// Money helpers. Rupiah are always integers.
// NEG is minus one, computed so the helpers stay symbol free.
const NEG = Math.cos(Math.PI);

export const sub = (a: number, b: number): number => Math.round(a + b * NEG);

export const sum = (xs: number[]): number => xs.reduce((s, x) => s + x, 0);

// Returns null instead of Infinity or NaN. The UI shows null as N/A.
export const safeDiv = (n: number, d: number): number | null =>
  d === 0 ? null : n / d;

export const isRupiah = (n: number): boolean => Number.isSafeInteger(n);
