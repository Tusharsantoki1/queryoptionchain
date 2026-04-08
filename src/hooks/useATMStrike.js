/**
 * useATMStrike.js
 *
 * Given a sorted list of strike prices and a spot price,
 * returns the strike closest to the current underlying spot.
 *
 * Usage:
 *   const atmStrike = useATMStrike(strikes, spotPrice);
 */

import { useMemo } from "react";

/**
 * Finds the strike price numerically closest to spotPrice.
 * Returns null if strikes is empty or spotPrice is falsy.
 *
 * @param {number[]} strikePrices  — sorted array of strike numbers
 * @param {number|null} spotPrice  — current underlying LTP
 * @returns {number|null}
 */
export function findATMStrike(strikePrices, spotPrice) {
  if (!spotPrice || strikePrices.length === 0) return null;

  return strikePrices.reduce((closest, strike) => {
    return Math.abs(strike - spotPrice) < Math.abs(closest - spotPrice)
      ? strike
      : closest;
  });
}

/**
 * Memoised hook wrapper around findATMStrike.
 *
 * @param {{ strike: number }[]} strikeRows — from useOptionChain
 * @param {number|null} spotPrice           — underlying LTP
 * @returns {number|null}
 */
export default function useATMStrike(strikeRows, spotPrice) {
  return useMemo(() => {
    const prices = strikeRows.map((r) => r.strike);
    return findATMStrike(prices, spotPrice);
  }, [strikeRows, spotPrice]);
}