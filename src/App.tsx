import { useState, useEffect } from "react";
import "./App.css";

const getTimeScale = (cellIndex: number) => {
  const seconds = BigInt(1) << BigInt(cellIndex);

  if (seconds < BigInt(60 * 2)) {
    return `${seconds}s`;
  }
  const minutes = seconds / BigInt(60);

  if (minutes < BigInt(60 * 2)) {
    return `${minutes}m`;
  }
  const hours = minutes / BigInt(60);

  if (hours < BigInt(24 * 2)) {
    return `${hours}h`;
  }
  const days = hours / BigInt(24);

  if (days < BigInt(365 * 2)) {
    return `${days}d`;
  }
  const years = seconds / BigInt(365.25 * 24 * 60 * 60);

  if (years < BigInt(100 * 2)) {
    return `${years}y`;
  }
  const centuries = years / BigInt(100);

  if (centuries < BigInt(10 * 2)) {
    return `${centuries}c`;
  }
  const millennia = centuries / BigInt(10);

  if (millennia < BigInt(1000 * 2)) {
    return `${millennia}k`;
  }
  const myr = millennia / BigInt(1000);

  if (myr < BigInt(1000 * 2)) {
    return `${myr}myr`;
  }

  const gyr = myr / BigInt(1000);
  return `${gyr}gyr`;
};

function App() {
  const [time, setTime] = useState(BigInt(0));
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const secondsSinceBigBang = BigInt(4.354e17);
      setTime(BigInt(Math.floor(Date.now() / 1000)) + secondsSinceBigBang);
    };

    tick();

    return () => cancelAnimationFrame(rafId);
  }, []);

  const gridSize = 8;
  const margin = 250;

  const cellSize =
    Math.min(window.innerWidth - margin, window.innerHeight - margin) /
    gridSize;
  const cellBorder = 1;

  const cells = Array.from({ length: gridSize ** 2 }, (_, i) => i);

  return (
    <div className="app">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: `${gridSize * cellSize}px`,
        }}
      >
        {cells.map((cell) => {
          const isOn = !!((time >> BigInt(cell)) & BigInt(1));
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
              key={cell}
            >
              <div
                style={{
                  width: `${cellSize - cellBorder * 2}px`,
                  height: `${cellSize - cellBorder * 2}px`,
                  borderRadius: `${cellSize * 0.2}px`,
                  backgroundColor: isOn ? "black" : "rgba(0,0,0,0.05)",
                  ["cornerShape" as string]: "squircle",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {(isOn || hoveredCell === cell) && (
                  <div
                    style={{
                      color: "white",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      mixBlendMode: "difference",
                    }}
                  >
                    {getTimeScale(cell)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontSize: "11px",
          fontFamily: "monospace",
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "10px",
          opacity: 0.5,
        }}
      >
        Last updated:{" "}
        {new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        })}{" "}
        UTC
        <br />
        Binary clock of seconds since the Big Bang, Larix Kortbeek, 2025
      </div>
    </div>
  );
}

export default App;
