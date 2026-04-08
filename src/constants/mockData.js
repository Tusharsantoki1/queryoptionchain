/**
 * mockData.js
 * Hardcoded mock option chain data for NIFTY.
 * In production, this comes via WebSocket → useQuery cache (as in marketSocket.js).
 *
 * Structure per row:
 *   strike  — strike price
 *   CE      — Call side data
 *   PE      — Put  side data
 *
 * maxOI is used by OIVisualBar to compute bar width as a percentage.
 */

export const UNDERLYING = "NIFTY";
export const EXPIRY = "26 Jun 2025";
export const SPOT_PRICE = 24310.5;

// The highest OI across all strikes — used to normalize bar widths
export const MAX_OI = 95_40_0000;

const mockChain = [
  {
    strike: 23800,
    CE: { ltp: 621.3,  change: 12.4,  oi: 18_20_000, volume: 42_300, iv: 18.2, delta: 0.74, theta: -12.3, vega: 28.1, gamma: 0.0021 },
    PE: { ltp: 88.5,   change: -6.1,  oi: 32_10_000, volume: 71_200, iv: 19.4, delta: -0.26, theta: -8.4,  vega: 19.6, gamma: 0.0018 },
  },
  {
    strike: 23900,
    CE: { ltp: 534.0,  change: 9.8,   oi: 24_50_000, volume: 38_100, iv: 17.9, delta: 0.69, theta: -13.1, vega: 29.4, gamma: 0.0024 },
    PE: { ltp: 101.2,  change: -4.5,  oi: 41_80_000, volume: 83_400, iv: 18.8, delta: -0.31, theta: -9.1,  vega: 21.2, gamma: 0.0021 },
  },
  {
    strike: 24000,
    CE: { ltp: 448.7,  change: 7.2,   oi: 31_70_000, volume: 54_800, iv: 17.5, delta: 0.63, theta: -14.2, vega: 31.0, gamma: 0.0028 },
    PE: { ltp: 117.4,  change: -3.2,  oi: 58_60_000, volume: 96_100, iv: 18.2, delta: -0.37, theta: -10.2, vega: 23.8, gamma: 0.0025 },
  },
  {
    strike: 24100,
    CE: { ltp: 366.2,  change: 5.1,   oi: 42_30_000, volume: 67_200, iv: 17.1, delta: 0.57, theta: -15.4, vega: 32.7, gamma: 0.0031 },
    PE: { ltp: 136.8,  change: -1.9,  oi: 71_40_000, volume: 108_300, iv: 17.8, delta: -0.43, theta: -11.6, vega: 26.1, gamma: 0.0029 },
  },
  {
    strike: 24200,
    CE: { ltp: 288.5,  change: 3.4,   oi: 56_90_000, volume: 81_500, iv: 16.8, delta: 0.51, theta: -16.3, vega: 33.9, gamma: 0.0034 },
    PE: { ltp: 159.3,  change: -0.7,  oi: 82_70_000, volume: 119_400, iv: 17.4, delta: -0.49, theta: -12.8, vega: 28.4, gamma: 0.0033 },
  },
  {
    // ATM strike — closest to spot 24310.5
    strike: 24300,
    CE: { ltp: 215.0,  change: 1.2,   oi: 78_50_000, volume: 1_12_700, iv: 16.5, delta: 0.46, theta: -17.1, vega: 34.8, gamma: 0.0037 },
    PE: { ltp: 187.5,  change: 0.9,   oi: 95_40_000, volume: 1_28_600, iv: 17.1, delta: -0.54, theta: -13.9, vega: 30.2, gamma: 0.0036 },
    isATM: true,
  },
  {
    strike: 24400,
    CE: { ltp: 148.6,  change: -1.4,  oi: 91_20_000, volume: 1_04_100, iv: 16.3, delta: 0.40, theta: -17.6, vega: 35.1, gamma: 0.0038 },
    PE: { ltp: 221.4,  change: 2.1,   oi: 74_30_000, volume: 98_800,  iv: 16.9, delta: -0.60, theta: -14.7, vega: 31.6, gamma: 0.0035 },
  },
  {
    strike: 24500,
    CE: { ltp: 96.2,   change: -3.8,  oi: 83_40_000, volume: 89_300,  iv: 16.1, delta: 0.34, theta: -17.9, vega: 34.6, gamma: 0.0036 },
    PE: { ltp: 268.9,  change: 3.6,   oi: 61_80_000, volume: 84_200,  iv: 16.7, delta: -0.66, theta: -15.2, vega: 32.4, gamma: 0.0033 },
  },
  {
    strike: 24600,
    CE: { ltp: 58.4,   change: -5.9,  oi: 67_10_000, volume: 72_600,  iv: 15.9, delta: 0.27, theta: -17.4, vega: 33.1, gamma: 0.0031 },
    PE: { ltp: 329.7,  change: 5.2,   oi: 49_50_000, volume: 68_900,  iv: 16.5, delta: -0.73, theta: -15.6, vega: 31.8, gamma: 0.0029 },
  },
  {
    strike: 24700,
    CE: { ltp: 32.1,   change: -8.2,  oi: 48_60_000, volume: 54_100,  iv: 15.7, delta: 0.21, theta: -16.6, vega: 30.8, gamma: 0.0026 },
    PE: { ltp: 401.8,  change: 7.3,   oi: 38_20_000, volume: 51_400,  iv: 16.3, delta: -0.79, theta: -15.9, vega: 29.7, gamma: 0.0024 },
  },
];

export default mockChain;