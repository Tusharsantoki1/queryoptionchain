import useMarketData from "../hooks/useMarketData";
import { MultiTradeInstrumentIDs } from "../constants/instruments";

export default function IndexCard({ name }) {
  const secId = MultiTradeInstrumentIDs[name];
  const { data } = useMarketData(secId);
 
  return (
    <div style={styles.card}>
      <h3>{name}</h3>

      <p>
        Price:{" "}
        {data?.ltp ? (
          <span style={{ color: data.change > 0 ? "green" : "red" }}>
            {data.ltp}
          </span>
        ) : (
          "Loading..."
        )}
      </p>
    </div>
  );
};

const styles = {
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    margin: "10px",
    width: "150px",
  },
};

