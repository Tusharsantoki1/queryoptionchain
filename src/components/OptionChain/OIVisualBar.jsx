/**
 * OIVisualBar.jsx
 * Renders a number with a subtle horizontal bar behind it
 * to give a visual sense of relative OI / volume magnitude.
 *
 * Props:
 *   value   (number) — the raw OI / volume value to display
 *   maxValue (number) — the max across all strikes (used to normalise width)
 *   side    ("CE" | "PE") — controls bar colour direction
 */

import "./OIVisualBar.css";

export default function OIVisualBar({ value, maxValue=5000000, side }) {
  if (!value) return <span className="oibar-empty">—</span>;

  // width as a percentage of the max OI, clamped 2%–100%
  const pct = Math.min(100, Math.max(2, (value / maxValue) * 100));

  // Format large numbers compactly: 9540000 → 95.4L
  const formatted = formatOI(value);

  return (
    <div className={`oibar-wrapper oibar-${side.toLowerCase()}`}>
      {/* The bar sits behind the text via absolute positioning */}
      <div className="oibar-track">
        <div className="oibar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="oibar-label">{formatted}</span>
    </div>
  );
}

/** Converts raw number to compact Indian-style notation */
function formatOI(n) {
  if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(1) + "Cr";
  if (n >= 1_00_000)    return (n / 1_00_000).toFixed(1) + "L";
  if (n >= 1_000)       return (n / 1_000).toFixed(1) + "K";
  return String(n);
}