/**
 * OptionRow.jsx
 *
 * A single row in the option chain table.
 *
 * KEY CHANGES vs original:
 *  1. Wrapped in React.memo — row only re-renders when its own props change.
 *     Tick data (CE/PE) lives inside the row via useMarketData, so a tick
 *     for this strike re-renders ONLY this row, not the table.
 *
 *  2. Hover-glitch fix — hoverSide is stored in a ref *and* synced to state
 *     with a scheduled flush so rapid mouse movement never leaves stale
 *     "stuck" buttons. The critical fix: onMouseLeave resets via the ref
 *     immediately (no batching delay) and also calls setState.
 *
 *  3. HoverActions replaced conditional render with CSS opacity crossfade
 *     (matching the .oi-slot pattern already in OptionRow.css) so layout
 *     never shifts during rapid hover transitions.
 */

import { useState, useRef, useCallback, memo } from "react";
import useMarketData from "../../hooks/useMarketData";
import HoverActions  from "./HoverActions";
import OIVisualBar   from "./OIVisualBar";
import "./OptionRow.css";

/* ─── Helpers ────────────────────────────────────────────── */

function fmt(val, decimals = 2) {
  if (val == null) return "—";
  return Number(val).toFixed(decimals);
}

function fmtVol(n) {
  if (!n) return "—";
  if (n >= 1_00_000) return (n / 1_00_000).toFixed(1) + "L";
  if (n >= 1_000)    return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

function ltpClass(change) {
  if (change == null) return "";
  return change > 0 ? "ltp-up" : change < 0 ? "ltp-down" : "";
}

/* ─── Component ──────────────────────────────────────────── */

function OptionRow({ strike, ceSecId, peSecId, isATM, maxOI }) {
  // State drives the render; ref makes the latest value available
  // synchronously inside event handlers without stale-closure issues.
  const [hoverSide, setHoverSide] = useState(null); // "CE" | "PE" | null
  const hoverRef = useRef(null);

  const { data: CE } = useMarketData(ceSecId);
  const { data: PE } = useMarketData(peSecId);

  // onMouseMove: determine CE / PE / null side based on cursor X position.
  const onRowMouseMove = useCallback((event) => {
    const row    = event.currentTarget;
    const rect   = row.getBoundingClientRect();
    const midX   = rect.left + rect.width / 2;
    const GAP    = 14; // dead zone around strike column (px)

    const newSide =
      event.clientX < midX - GAP ? "CE" :
      event.clientX > midX + GAP ? "PE" :
      null;

    // Early-exit: avoid unnecessary setState calls on every pixel move.
    if (newSide === hoverRef.current) return;

    hoverRef.current = newSide;
    setHoverSide(newSide);
  }, []);

  // onMouseLeave: CRITICAL for fixing the "stuck button" glitch.
  // We reset both the ref (synchronous) and the state immediately.
  const onRowMouseLeave = useCallback(() => {
    hoverRef.current = null;
    setHoverSide(null);
  }, []);

  const ceSide = hoverSide === "CE";
  const peSide = hoverSide === "PE";

  return (
    <tr
      className={[
        "option-row",
        isATM    ? "option-row--atm"    : "",
        hoverSide ? "option-row--hovered" : "",
      ].join(" ")}
      onMouseMove={onRowMouseMove}
      onMouseLeave={onRowMouseLeave}
    >
      {/* ── CE SIDE (left) ──────────────────── */}
      <td className="cell cell-greek">{fmt(CE?.gamma, 4)}</td>
      <td className="cell cell-greek">{fmt(CE?.vega,  2)}</td>
      <td className="cell cell-greek">{fmt(CE?.theta, 2)}</td>
      <td className="cell cell-greek">{fmt(CE?.delta, 2)}</td>
      <td className="cell cell-volume">{fmtVol(CE?.volume)}</td>
      <td className="cell cell-iv">{CE?.iv != null ? CE.iv.toFixed(1) : "—"}</td>

      {/* OI cell — crossfade between bar and hover actions (no layout shift) */}
      <td className="cell cell-oi">
        <div className="oi-slot">
          <div className={`oi-slot__bar ${ceSide ? "oi-slot__bar--hidden" : ""}`}>
            <OIVisualBar value={CE?.oi} maxValue={maxOI} side="CE" />
          </div>
          <div className={`oi-slot__actions ${ceSide ? "oi-slot__actions--visible" : ""}`}>
            <HoverActions strike={strike} side="CE" visible={ceSide} />
          </div>
        </div>
      </td>

      <td className={`cell cell-ltp ${ltpClass(CE?.change)}`}>
        {fmt(CE?.ltp, 1)}
      </td>

      {/* ── STRIKE (centre) ─────────────────── */}
      <td className="cell cell-strike">
        <div className="strike-inner">
          <span className="strike-label">{strike}</span>
          {isATM && <span className="atm-badge">ATM</span>}
        </div>
      </td>

      {/* ── PE SIDE (right) ─────────────────── */}
      <td className={`cell cell-ltp ${ltpClass(PE?.change)}`}>
        {fmt(PE?.ltp, 1)}
      </td>

      <td className="cell cell-oi">
        <div className="oi-slot">
          <div className={`oi-slot__bar ${peSide ? "oi-slot__bar--hidden" : ""}`}>
            <OIVisualBar value={PE?.oi} maxValue={maxOI} side="PE" />
          </div>
          <div className={`oi-slot__actions ${peSide ? "oi-slot__actions--visible" : ""}`}>
            <HoverActions strike={strike} side="PE" visible={peSide} />
          </div>
        </div>
      </td>

      <td className="cell cell-iv">{PE?.iv != null ? PE.iv.toFixed(1) : "—"}</td>
      <td className="cell cell-volume">{fmtVol(PE?.volume)}</td>
      <td className="cell cell-greek">{fmt(PE?.delta, 2)}</td>
      <td className="cell cell-greek">{fmt(PE?.theta, 2)}</td>
      <td className="cell cell-greek">{fmt(PE?.vega,  2)}</td>
      <td className="cell cell-greek">{fmt(PE?.gamma, 4)}</td>
    </tr>
  );
}

// React.memo — parent re-renders (e.g. spot price change → ATM recalc)
// will only re-render rows whose props actually changed.
export default memo(OptionRow);