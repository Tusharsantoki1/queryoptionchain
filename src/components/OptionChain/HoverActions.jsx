/**
 * HoverActions.jsx
 * Shows three action buttons (Buy CE, Sell CE, Buy PE, Sell PE, Chart)
 * when the user hovers over a strike row.
 *
 * Props:
 *   strike  (number) — the strike price for this row
 *   visible (boolean) — whether to show (controlled by OptionRow hover state)
 */

import "./HoverActions.css";

export default function HoverActions({ strike, side, visible }) {
  if (!visible) return null;

  const isCE = side === "CE";
  const isPE = side === "PE";

  const handleAction = (action) => {
    // In production: open order ticket or chart modal
    console.log(`[HoverActions] ${action} @ strike ${strike}`);
  };

  return (
    <div className="hover-actions" role="group" aria-label={`Actions for ${side} strike ${strike}`}>
      {isCE && (
        <>
          <button
            className="ha-btn ha-buy"
            onClick={() => handleAction("BUY CE")}
            title={`Buy CE ${strike}`}
          >
            B
          </button>

          <button
            className="ha-btn ha-sell"
            onClick={() => handleAction("SELL CE")}
            title={`Sell CE ${strike}`}
          >
            S
          </button>
        </>
      )}

      {isPE && (
        <>
          <button
            className="ha-btn ha-buy"
            onClick={() => handleAction("BUY PE")}
            title={`Buy PE ${strike}`}
          >
            B
          </button>

          <button
            className="ha-btn ha-sell"
            onClick={() => handleAction("SELL PE")}
            title={`Sell PE ${strike}`}
          >
            S
          </button>
        </>
      )}

      <button
        className="ha-btn ha-chart"
        onClick={() => handleAction("CHART")}
        title={`View Chart for ${strike}`}
      >
        {/* Simple inline SVG candlestick icon */}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <rect x="2" y="4" width="2" height="6" rx="0.5" fill="currentColor" />
          <line x1="3" y1="2" x2="3" y2="4" stroke="currentColor" strokeWidth="1.2" />
          <line x1="3" y1="10" x2="3" y2="12" stroke="currentColor" strokeWidth="1.2" />
          <rect x="5.5" y="2" width="2" height="5" rx="0.5" fill="currentColor" />
          <line x1="6.5" y1="1" x2="6.5" y2="2" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6.5" y1="7" x2="6.5" y2="9" stroke="currentColor" strokeWidth="1.2" />
          <rect x="9" y="5" width="2" height="4" rx="0.5" fill="currentColor" />
          <line x1="10" y1="3" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="10" y1="9" x2="10" y2="11" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </div>
  );
}