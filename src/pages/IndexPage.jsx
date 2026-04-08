import useMarketSocket from "../api/marketSocket";
import { INDEXES } from "../constants/instruments";
import IndexCard from "../components/IndexCard";

const IndexPage = () => {
  useMarketSocket(); // start websocket

  return (
    <div>
      <h1>Live Index</h1>

      <div style={styles.grid}>
        {INDEXES.map((index) => (
          <IndexCard key={index} name={index} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
  },
};

export default IndexPage;