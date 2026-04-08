
import instruments from "./multi_trade_response_data.json";

export function getOptionInstruments(symbol, expiry) {
  return instruments.filter(
    (inst) => inst.symbol === symbol && inst.expiry_date === expiry
  );
}


export function buildSecIdMap(symbol, expiry) {
  const rows = getOptionInstruments(symbol, expiry);
  return new Map(rows.map((inst) => [inst.security_id, inst]));
}