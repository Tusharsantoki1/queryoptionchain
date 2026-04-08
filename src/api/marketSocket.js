import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { INDEXES, MultiTradeInstrumentIDs } from "../constants/instruments";

export default function useMarketSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(" wss://ctrade.jainam.in:31102");

    ws.onopen = () => {
      console.log(" WebSocket Connected");

      INDEXES.forEach((instrument) => {
        const exchange =
          instrument === "SENSEX" || instrument === "BANKEX" 
            ? "BSECM"
            : "NSECM";

        const payload = {
          Message: "Broadcast",
          EXC: exchange,
          SECID: MultiTradeInstrumentIDs[instrument],
        };

        ws.send(JSON.stringify(payload));
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.Message === "Broadcast") {
        
        const secId = parseInt(data.SECID)|| data.SECID; // ensure it's a number if possible
        
        // Extract price data from response - adjust based on actual field names
        const marketData = {
          ...data,
          ltp: data.LTP || data.ltp || null,
          change: data.CHN || data.change || 0,
        };
        
        queryClient.setQueryData(["marketData", secId], marketData);
      }
    };

    ws.onerror = (err) => {
      console.error(" WebSocket Error", err);
    };

    ws.onclose = () => {
      console.log(" WebSocket Closed");
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);
};


//i want to make a option chain . i have alrady fatch instrument data form the websocket and update using usequery. now i want to build a optionchain 