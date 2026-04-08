/**
 * OptionRow.jsx
 * Renders a single row in the option chain table.
 * Manages its own hover state and shows HoverActions on the Strike cell.
 *
 * Props:
 *   strike    (number)  — strike price
 *   ceSecId   (string)  — security ID for CE option
 *   peSecId   (string)  — security ID for PE option
 *   isATM     (boolean) — whether this is the ATM strike
 *   maxOI     (number)  — max OI across all rows, passed to OIVisualBar
 */

import { useState } from "react";
import useMarketData from "../../hooks/useMarketData";
import HoverActions from "./HoverActions";
import OIVisualBar from "./OIVisualBar";
import "./OptionRow.css";

export default function OptionRow({ strike, ceSecId, peSecId, isATM, maxOI }) {
  const [hoverSide, setHoverSide] = useState(null); // "CE" | "PE" | null

  // Fetch market data for CE and PE using security IDs
  const { data: CE } = useMarketData(ceSecId);
  const { data: PE } = useMarketData(peSecId);

  const onRowMouseMove = (event) => {
    const row = event.currentTarget;
    const rect = row.getBoundingClientRect();
    const middleX = rect.left + rect.width / 2;
    const gap = 14; // small dead zone around strike

    const newSide =
      event.clientX < middleX - gap ? "CE" :
      event.clientX > middleX + gap ? "PE" :
      null;

    if (newSide !== hoverSide) setHoverSide(newSide);
  };

  return (
    <tr
      className={`option-row ${isATM ? "option-row--atm" : ""} ${hoverSide ? "option-row--hovered" : ""}`}
      onMouseMove={onRowMouseMove}
      onMouseLeave={() => setHoverSide(null)}
    >
      {/* ── CE SIDE (left) ────────────────────── */}
      <td className="cell cell-greek">{fmt(CE?.gamma, 4)}</td>
      <td className="cell cell-greek">{fmt(CE?.vega,  2)}</td>
      <td className="cell cell-greek">{fmt(CE?.theta, 2)}</td>
      <td className="cell cell-greek">{fmt(CE?.delta, 2)}</td>

      <td className="cell cell-volume">{fmtVol(CE?.volume)}</td>

      <td className="cell cell-iv">{CE?.iv?.toFixed(1)}</td>

      {/* OI with inline bar */}
      <td className="cell cell-oi">
        {hoverSide === "CE" ? (
          <HoverActions strike={strike} side="CE" visible />
        ) : (
          <OIVisualBar value={CE?.oi} maxValue={maxOI} side="CE" />
        )}
      </td>

      {/* LTP — coloured by change */}
      <td className={`cell cell-ltp ${ltpClass(CE?.change)}`}>
        {fmt(CE?.ltp, 1)}
      </td>

      {/* ── STRIKE (centre) ───────────────────── */}
      <td className="cell cell-strike">
        <div className="strike-inner">
          
            <span className="strike-label">{strike}</span>
        </div>
      </td>

      {/* ── PE SIDE (right) ───────────────────── */}
      <td className={`cell cell-ltp ${ltpClass(PE?.change)}`}>
        {fmt(PE?.ltp, 1)}
      </td>

      <td className="cell cell-oi">
        {hoverSide === "PE" ? (
          <HoverActions strike={strike} side="PE" visible />
        ) : (
          <OIVisualBar value={PE?.oi} maxValue={maxOI} side="PE" />
        )}
      </td>

      <td className="cell cell-iv">{PE?.iv?.toFixed(1)}</td>

      <td className="cell cell-volume">{fmtVol(PE?.volume)}</td>

      <td className="cell cell-greek">{fmt(PE?.delta, 2)}</td>
      <td className="cell cell-greek">{fmt(PE?.theta, 2)}</td>
      <td className="cell cell-greek">{fmt(PE?.vega,  2)}</td>
      <td className="cell cell-greek">{fmt(PE?.gamma, 4)}</td>
    </tr>
  );
}

/* ── Helpers ──────────────────────────────────────── */

/** Round to `decimals` places, return "—" if falsy */
function fmt(val, decimals = 2) {
  if (val == null) return "—";
  return Number(val).toFixed(decimals);
}

/** Format volume: 112700 → 1.1L */
function fmtVol(n) {
  if (!n) return "—";
  if (n >= 1_00_000) return (n / 1_00_000).toFixed(1) + "L";
  if (n >= 1_000)    return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

/** CSS class based on change direction */
function ltpClass(change) {
  if (change == null) return "";
  return change > 0 ? "ltp-up" : change < 0 ? "ltp-down" : "";
}

