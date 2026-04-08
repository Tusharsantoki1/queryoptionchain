
import { useMemo } from "react";
import instruments from "../constants/multi_trade_response_data.json";

function parseExpiry(expiryStr) {
  const day   = expiryStr.slice(0, 2);
  const month = expiryStr.slice(2, 5);
  const year  = expiryStr.slice(5);
  return new Date(`${day} ${month} ${year}`);
}

export default function useNearestExpiry(symbol) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Collect unique expiry dates for this symbol
    const expiries = [
      ...new Set(
        instruments
          .filter((inst) => inst.symbol === symbol)
          .map((inst) => inst.expiry_date)
      ),
    ];

    if (expiries.length === 0) return null;

    // Sort ascending and pick the first one that is >= today
    const sorted = expiries
      .map((e) => ({ raw: e, date: parseExpiry(e) }))
      .sort((a, b) => a.date - b.date);

    const nearest = sorted.find((e) => e.date >= today) ?? sorted[0];
    return nearest.raw; // e.g. "07APR2026"
  }, [symbol]);
}