import "./App.css";
import { getTimeScale } from "./utils";
import { useSmoothed, useCurrentTime } from "./hooks";

function App() {
  const currentTime = useCurrentTime();
  const smoothedValue = useSmoothed(currentTime);

  const gridSize = 8;
  const pageMargin = 120;

  const cellSize =
    (Math.min(window.innerWidth, window.innerHeight) - pageMargin) / gridSize;

  return (
    <div className="app">
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {Array.from({ length: gridSize ** 2 }, (_, cellIndex) => {
          const isOn = !!((smoothedValue >> BigInt(cellIndex)) & BigInt(1));
          return (
            <div
              className={`cell ${isOn ? "cell-on" : "cell-off"}`}
              key={cellIndex}
            >
              <div className="cell-text">{getTimeScale(cellIndex)}</div>
              <div className="cell-fill" />
            </div>
          );
        })}
      </div>
      <div className="footer">
        A binary clock of seconds since the Big Bang
        <br />
        <a href="https://larixk.nl" target="_blank">
          Larix Kortbeek
        </a>
        ,{" "}
        <a href="https://plusoneamsterdam.com" target="_blank">
          PlusOne®
        </a>
        , Amsterdam, 2025
        <br />
        {new Date().toLocaleString("en-US", { timeZone: "UTC" })} UTC
      </div>
    </div>
  );
}

export default App;
