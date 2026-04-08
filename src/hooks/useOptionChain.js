/**
 * useOptionChain.js
 *
 * Returns a STATIC list of strike rows derived from the instruments JSON.
 * Each row has strike + security IDs — NO live data, NO cache subscription.
 *
 * Live tick data is handled per-row in useOptionRow.js,
 * so only the row that received a tick re-renders.
 *
 * Usage:
 *   const strikes = useOptionChain("NIFTY", "07APR2026");
 *   // → [{ strike, ceSecId, peSecId }, ...]
 */

import { useMemo } from "react";
import { getOptionInstruments } from "../constants/optionInstruments";

export default function useOptionChain(symbol, expiry) {
  return useMemo(() => {
    if (!symbol || !expiry) return [];

    const instruments = getOptionInstruments(symbol, expiry);

    // Group CE + PE by strike price
    const strikeMap = new Map();
    instruments.forEach((inst) => {
      const strike = parseFloat(inst.strike_price);
      if (!strikeMap.has(strike)) strikeMap.set(strike, {});
      strikeMap.get(strike)[inst.option_type] = inst.security_id;
    });

    // Build sorted array of static strike metadata
    return Array.from(strikeMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([strike, sides]) => ({
        strike,
        ceSecId: sides["CE"] ?? null,
        peSecId: sides["PE"] ?? null,
      }));
  }, [symbol, expiry]);
}