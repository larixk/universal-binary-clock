import "./App.css";
import { useCurrentTime } from "./useCurrentTime";
import Footer from "./Footer";
import Grid from "./Grid";

function App() {
  const value = useCurrentTime();

  return (
    <div className="app">
      <Grid value={value} />
      <Footer />
    </div>
  );
}

export default App;
