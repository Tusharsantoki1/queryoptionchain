/**
 * HoverActions.jsx
 *
 * Action buttons (Buy / Sell / Chart) that appear when the user
 * hovers over the CE or PE half of an option chain row.
 *
 * CHANGE vs original:
 *  The `visible` prop no longer causes a conditional early-return.
 *  Visibility is now controlled exclusively by the parent's CSS
 *  (.oi-slot__actions--visible) via opacity + pointer-events.
 *
 *  This removes the mount/unmount cycle that caused the "stuck button"
 *  glitch on fast hover: the DOM node always exists, so React never has
 *  to tear down and recreate it mid-hover.
 *
 * Props:
 *   strike  (number)  — strike price for this row
 *   side    ("CE"|"PE") — which option side
 *   visible (boolean) — controls aria-hidden; actual fade is CSS-driven
 */

import "./HoverActions.css";

export default function HoverActions({ strike, side, visible }) {
  const isCE = side === "CE";
  const isPE = side === "PE";

  const handleAction = (action) => {
    // TODO: open order ticket or chart modal
    console.log(`[HoverActions] ${action} @ strike ${strike}`);
  };

  return (
    <div
      className="hover-actions"
      role="group"
      aria-label={`Actions for ${side} strike ${strike}`}
      aria-hidden={!visible}
    >
      {(isCE || isPE) && (
        <>
          <button
            className="ha-btn ha-buy"
            onClick={() => handleAction(`BUY ${side}`)}
            title={`Buy ${side} ${strike}`}
            tabIndex={visible ? 0 : -1}
          >
            B
          </button>
          <button
            className="ha-btn ha-sell"
            onClick={() => handleAction(`SELL ${side}`)}
            title={`Sell ${side} ${strike}`}
            tabIndex={visible ? 0 : -1}
          >
            S
          </button>
        </>
      )}

      <button
        className="ha-btn ha-chart"
        onClick={() => handleAction("CHART")}
        title={`View Chart for ${strike}`}
        tabIndex={visible ? 0 : -1}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <rect x="2"   y="4" width="2" height="6" rx="0.5" fill="currentColor" />
          <line x1="3"  y1="2"  x2="3"  y2="4"  stroke="currentColor" strokeWidth="1.2" />
          <line x1="3"  y1="10" x2="3"  y2="12" stroke="currentColor" strokeWidth="1.2" />
          <rect x="5.5" y="2" width="2" height="5" rx="0.5" fill="currentColor" />
          <line x1="6.5" y1="1" x2="6.5" y2="2"  stroke="currentColor" strokeWidth="1.2" />
          <line x1="6.5" y1="7" x2="6.5" y2="9"  stroke="currentColor" strokeWidth="1.2" />
          <rect x="9"   y="5" width="2" height="4" rx="0.5" fill="currentColor" />
          <line x1="10" y1="3" x2="10" y2="5"  stroke="currentColor" strokeWidth="1.2" />
          <line x1="10" y1="9" x2="10" y2="11" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </div>
  );
}