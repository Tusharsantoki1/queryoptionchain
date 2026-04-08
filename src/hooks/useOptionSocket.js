/**
 * useOptionSocket.js
 *
 * Subscribes to the WebSocket for every CE + PE security ID
 * belonging to the given symbol & expiry date.
 *
 * On each tick it writes to the React Query cache:
 *   key: ["marketData", security_id] (used by OptionRow/useMarketData)
 *   key: ["optionTick", security_id] (legacy compatibility)
 *   value: { ltp, change, oi, volume, iv, ...raw }
 *
 * useOptionChain.js reads these cache entries and assembles
 * them into strike rows.
 *
 * Usage:
 *   useOptionSocket("NIFTY", "07APR2026");
 */

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getOptionInstruments, buildSecIdMap } from "../constants/optionInstruments";

const WS_URL = "wss://ctrade.jainam.in:31102";

export default function useOptionSocket(symbol, expiry) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!symbol || !expiry) return;

    const instruments = getOptionInstruments(symbol, expiry);
    if (instruments.length === 0) return;

    // Map for O(1) lookup when a tick arrives: security_id → instrument row
    const secIdMap = buildSecIdMap(symbol, expiry);

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("[OptionSocket] Connected");

      // Subscribe to every CE + PE security ID
      instruments.forEach((inst) => {
        const payload = {
          Message: "Broadcast",
          EXC: inst.exchange,       // e.g. "NSEFO"
          SECID: inst.security_id,  // e.g. "49833"
        };
        ws.send(JSON.stringify(payload));
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.Message !== "Broadcast") return;

      const secId = String(data.SECID);
      if (!secIdMap.has(secId)) return; // not one of our strikes

      // Normalize the tick — adjust field names to match your broker's response
      const tick = {
        ltp:    data.LTP    ?? data.ltp    ?? null,
        change: data.CHN    ?? data.change ?? 0,
        oi:     data.OI     ?? data.oi     ?? 0,
        volume: data.VOL    ?? data.volume ?? 0,
        iv:     data.IV     ?? data.iv     ?? 0,
        // Greeks (if broker sends them)
        delta:  data.DELTA  ?? data.delta  ?? null,
        theta:  data.THETA  ?? data.theta  ?? null,
        vega:   data.VEGA   ?? data.vega   ?? null,
        gamma:  data.GAMMA  ?? data.gamma  ?? null,
      };

      // Keep both keys in sync:
      // - marketData is consumed by useMarketData (OptionRow / IndexCard)
      // - optionTick is preserved for any legacy readers
      queryClient.setQueryData(["marketData", secId], tick);
      queryClient.setQueryData(["optionTick", secId], tick);
    };

    ws.onerror = (err) => console.error("[OptionSocket] Error", err);
    ws.onclose = ()  => console.log("[OptionSocket] Closed");

    return () => ws.close();
  }, [symbol, expiry, queryClient]);
}
