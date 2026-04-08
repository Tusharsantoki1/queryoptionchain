/**
 * OptionChain.jsx
 *
 * Renders the live option chain for a symbol.
 *
 * 1. useNearestExpiry  → finds nearest expiry from instruments JSON
 * 2. useOptionSocket   → subscribes WebSocket, writes ticks to React Query cache
 * 3. useOptionChain    → reads cache, assembles strike rows, provides maxOI
 */

import useNearestExpiry from "../../hooks/useNearestExpiry";
import useOptionSocket  from "../../hooks/useOptionSocket";
import useOptionChain   from "../../hooks/useOptionChain";
import OptionRow        from "./OptionRow";
import "./OptionChain.css";

// maxOI is used by OIVisualBar to normalise bar widths.
// Since each row now manages its own data independently,
// pass a fixed reasonable max or compute it separately if needed.
// For live data, brokers typically send OI per tick so you can
// track the running max in useOptionSocket and expose it via a ref/context.
const MAX_OI_PLACEHOLDER = 1_00_00_000; // 1 Cr — adjust to your instrument

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

export default function OptionChain({ symbol = "NIFTY" }) {
  // Step 1 — nearest expiry for this symbol
  const expiry = useNearestExpiry(symbol);

  // Step 2 — open WebSocket + subscribe all security IDs for this expiry
  useOptionSocket(symbol, expiry);

  // Step 3 — static list of strikes with their security IDs (no cache subscription)
  const strikes = useOptionChain(symbol, expiry);

  return (
    <div className="oc-wrapper">

      {/* Top bar */}
      <div className="oc-topbar">
        <div className="oc-title-block">
          <span className="oc-underlying">{symbol}</span>
          {expiry && <span className="oc-expiry">{expiry}</span>}
        </div>
        <div className="oc-live-badge">
          <span className="oc-live-dot" />
          LIVE
        </div>
      </div>

      {/* Loading state */}
      {strikes.length === 0 && (
        <div className="oc-status">
          <span className="oc-spinner" /> Loading option chain…
        </div>
      )}

      {/* Table */}
      {strikes.length > 0 && (
        <div className="oc-table-scroll">
          <table className="oc-table">
            <thead>
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
                {[...SIDE_COLUMNS].reverse().map((col) => (
                  <th key={`pe-${col.key}`} className="th-col th-col-pe">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {strikes.map(({ strike, ceSecId, peSecId, isATM }) => (
                <OptionRow
                  key={strike}
                  strike={strike}
                  ceSecId={ceSecId}
                  peSecId={peSecId}
                  maxOI={MAX_OI_PLACEHOLDER}
                  isATM={isATM}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}