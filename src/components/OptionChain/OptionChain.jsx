/**
 * OptionChain.jsx
 *
 * Renders the live option chain for a symbol.
 *
 * Flow:
 *  1. useNearestExpiry  → nearest expiry date from instruments JSON
 *  2. useOptionSocket   → subscribes WebSocket, writes ticks to RQ cache
 *  3. useOptionChain    → static list of all strikes (no cache subscription)
 *  4. useMarketData     → underlying spot LTP (from marketSocket)
 *  5. useATMStrike      → finds strike closest to spot price
 *  6. useSlicedStrikes  → 50 strikes below ATM + ATM + 50 above
 *
 * Performance:
 *  - OptionRow is wrapped in React.memo → only re-renders on prop change.
 *  - Each row subscribes to its own RQ keys internally → tick for strike X
 *    re-renders ONLY row X, never the table.
 *  - SIDE_COLUMNS and MAX_OI are module-level constants → stable references.
 */

import useNearestExpiry  from "../../hooks/useNearestExpiry";
import useOptionSocket   from "../../hooks/useOptionSocket";
import useOptionChain    from "../../hooks/useOptionChain";
import useMarketData     from "../../hooks/useMarketData";
import useATMStrike      from "../../hooks/useATMStrike";
import useSlicedStrikes  from "../../hooks/useSlicedStrikes";
import { MultiTradeInstrumentIDs } from "../../constants/instruments";
import OptionRow         from "./OptionRow";
import "./OptionChain.css";

/* ─── Constants ─────────────────────────────────────────── */

const MAX_OI = 1_00_00_000; // 1 Cr — normalises OIVisualBar widths

const SIDE_COLUMNS = [
  { key: "gamma",  label: "Gamma"  },
  { key: "vega",   label: "Vega"   },
  { key: "theta",  label: "Theta"  },
  { key: "delta",  label: "Delta"  },
  { key: "volume", label: "Volume" },
  { key: "iv",     label: "IV"     },
  { key: "oi",     label: "OI"     },
  { key: "ltp",    label: "LTP"    },
];

const PE_COLUMNS = [...SIDE_COLUMNS].reverse();

/* ─── Component ─────────────────────────────────────────── */

export default function OptionChain({ symbol = "NIFTY" }) {
  // 1 — nearest expiry
  const expiry = useNearestExpiry(symbol);

  // 2 — open WebSocket for all option security IDs
  useOptionSocket(symbol, expiry);

  // 3 — full static list of strikes (memoised, never causes re-render on tick)
  const allStrikes = useOptionChain(symbol, expiry);

  // 4 — underlying spot price (written by marketSocket into RQ cache)
  const underlyingSecId = MultiTradeInstrumentIDs?.[symbol];
  const { data: spotData } = useMarketData(underlyingSecId);
  const rawSpotPrice = spotData?.ltp;
  const spotPrice =
    rawSpotPrice == null
      ? null
      : Number(String(rawSpotPrice).replace(/,/g, ""));
  const hasValidSpotPrice = Number.isFinite(spotPrice);

  // 5 — ATM strike (memoised, only changes when spot crosses a strike boundary)
  const atmStrike = useATMStrike(allStrikes, hasValidSpotPrice ? spotPrice : null);

  // 6 — 50 strikes on each side of ATM (with isATM flag injected)
  const strikes = useSlicedStrikes(allStrikes, atmStrike);

  return (
    <div className="oc-wrapper">

      {/* ── Top bar ──────────────────────────────────────── */}
      <div className="oc-topbar">
        <div className="oc-title-block">
          <span className="oc-underlying">{symbol}</span>
          {expiry && <span className="oc-expiry">{expiry}</span>}
        </div>

        {hasValidSpotPrice && (
          <div className="oc-spot-block">
            <span className="oc-spot-label">Spot</span>
            <span className="oc-spot-value">{spotPrice.toFixed(2)}</span>
          </div>
        )}

        <div className="oc-live-badge">
          <span className="oc-live-dot" />
          LIVE
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────── */}
      {strikes.length === 0 && (
        <div className="oc-status">
          <span className="oc-spinner" /> Loading option chain…
        </div>
      )}

      {/* ── Table ────────────────────────────────────────── */}
      {strikes.length > 0 && (
        <div className="oc-table-scroll">
          <table className="oc-table">

            {/*
              sticky thead — both header rows are position:sticky so they
              stay visible while the user scrolls through 100 strike rows.
              The top offsets are set in OptionChain.css via:
                .oc-thead-group th { top: 0; }
                .oc-thead-cols  th { top: <group-row-height>; }
            */}
            <thead className="oc-thead-sticky">
              <tr className="oc-thead-group">
                <th colSpan={SIDE_COLUMNS.length} className="th-group th-group-ce">CALLS</th>
                <th colSpan={1}                   className="th-group th-group-strike" />
                <th colSpan={SIDE_COLUMNS.length} className="th-group th-group-pe">PUTS</th>
              </tr>
              <tr className="oc-thead-cols">
                {SIDE_COLUMNS.map((col) => (
                  <th key={`ce-${col.key}`} className="th-col th-col-ce">{col.label}</th>
                ))}
                <th className="th-col th-col-strike">Strike</th>
                {PE_COLUMNS.map((col) => (
                  <th key={`pe-${col.key}`} className="th-col th-col-pe">{col.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {strikes.map(({ strike, ceSecId, peSecId, isATM }) => (
                // OptionRow is memoised — only re-renders when its own props
                // or its internal RQ subscriptions (CE/PE tick) change.
                <OptionRow
                  key={strike}
                  strike={strike}
                  ceSecId={ceSecId}
                  peSecId={peSecId}
                  maxOI={MAX_OI}
                  isATM={isATM}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="oc-footer">
        Showing {strikes.length} strikes · ATM {atmStrike ?? "—"} · {expiry ?? ""}
      </div>

    </div>
  );
}
