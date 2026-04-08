/**
 * useSlicedStrikes.js
 *
 * Given the full sorted list of strikes and the ATM strike, returns
 * a window of exactly 50 strikes below ATM (CE-dominant) and 50 above
 * (PE-dominant), centred on the ATM row.
 *
 * The result is a flat, sorted array of ≤ 101 rows (50 below ATM +
 * ATM itself + 50 above), each annotated with `isATM`.
 *
 * If the ATM is near an edge (fewer than 50 strikes on one side) the
 * window simply extends as far as it can — we never fabricate rows.
 *
 * Usage:
 *   const visible = useSlicedStrikes(strikes, atmStrike);
 */

import { useMemo } from "react";

const WINDOW = 50; // strikes to show on each side of ATM

export default function useSlicedStrikes(strikeRows, atmStrike) {
  return useMemo(() => {
    if (!strikeRows.length) return [];

    // If we don't know the ATM yet, show the middle 101 strikes
    if (atmStrike == null) {
      const mid = Math.floor(strikeRows.length / 2);
      const start = Math.max(0, mid - WINDOW);
      const end   = Math.min(strikeRows.length, mid + WINDOW + 1);
      return strikeRows.slice(start, end).map((r) => ({ ...r, isATM: false }));
    }

    // Find ATM index in the sorted array
    const atmIdx = strikeRows.findIndex((r) => r.strike === atmStrike);
    if (atmIdx === -1) {
      // Fallback: annotate none as ATM and return middle window
      const mid = Math.floor(strikeRows.length / 2);
      const start = Math.max(0, mid - WINDOW);
      const end   = Math.min(strikeRows.length, mid + WINDOW + 1);
      return strikeRows.slice(start, end).map((r) => ({ ...r, isATM: false }));
    }

    const start = Math.max(0, atmIdx - WINDOW);
    const end   = Math.min(strikeRows.length, atmIdx + WINDOW + 1);

    return strikeRows.slice(start, end).map((r) => ({
      ...r,
      isATM: r.strike === atmStrike,
    }));
  }, [strikeRows, atmStrike]);
}