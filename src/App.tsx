import { useState, useEffect, useRef } from "react";
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

  if (years < BigInt(1000 * 2)) {
    return `${years}a`;
  }
  const millennia = years / BigInt(1000);

  if (millennia < BigInt(1000 * 2)) {
    return `${millennia}ka`;
  }
  const myr = millennia / BigInt(1000);

  if (myr < BigInt(1000 * 2)) {
    return `${myr}Ma`;
  }

  const gyr = myr / BigInt(1000);
  return `${gyr}Ga`;
};

const secondsPerYear = BigInt(365.25 * 24 * 60 * 60);
const millionYears = BigInt(1e6) * secondsPerYear;

// https://www.aanda.org/articles/aa/full_html/2020/09/aa33910-18/aa33910-18.html
const secondsTil2020 = BigInt(13780) * millionYears;

const calendarYear = (year: number) => {
  return secondsTil2020 - BigInt(2020 - year) * secondsPerYear;
};

const unixEpoch = calendarYear(1970);
function easeInOutExpo(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
const useSmoothed = (value: bigint) => {
  const [smoothedValue, setSmoothedValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const difference = value - previousValueRef.current;
    const duration = 50;

    const startTime = Date.now();

    let rafId: number;

    const tick = () => {
      const now = Date.now();
      const progress = (now - startTime) / duration;
      const smoothedProgress = easeInOutExpo(progress);
      const precision = 10000;
      setSmoothedValue(
        previousValueRef.current +
          (difference * BigInt(Math.round(smoothedProgress * precision))) /
            BigInt(precision)
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      setSmoothedValue(value);
    };

    tick();

    return () => {
      previousValueRef.current = value;
      cancelAnimationFrame(rafId);
    };
  }, [value]);
  return smoothedValue;
};

function App() {
  const [currentTime, setCurrentTime] = useState(BigInt(0));
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      setCurrentTime(BigInt(Math.floor(Date.now() / 1000)) + unixEpoch);
    };

    tick();

    return () => cancelAnimationFrame(rafId);
  }, []);

  const gridSize = 8;
  const margin = 120;

  const cellSize =
    Math.min(window.innerWidth - margin, window.innerHeight - margin) /
    gridSize;

  const cells = Array.from({ length: gridSize ** 2 }, (_, i) => i);

  const smoothedTime = useSmoothed(currentTime);

  return (
    <div className="app">
      <div
        className="grid-container"
        style={{ width: `${gridSize * cellSize}px` }}
      >
        {cells.map((cell) => {
          const isOn = !!((smoothedTime >> BigInt(cell)) & BigInt(1));
          return (
            <div className="cell-container" key={cell}>
              <div
                className="cell-background"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  borderRadius: `${cellSize * 0.15}px`,
                  ["cornerShape" as string]: "bevel",
                }}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <div
                  className={`cell-text ${
                    isOn || hoveredCell === cell ? "cell-text-visible" : "cell-text-hidden"
                  }`}
                >
                  {getTimeScale(cell)}
                </div>
                <div
                  className={`cell-fill ${
                    isOn ? "cell-fill-on" : "cell-fill-off"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer">
        A binary clock of seconds since the Big Bang
        <br />
        <a href="https://larixk.nl" target="_blank">Larix Kortbeek</a>, <a href="https://plusoneamsterdam.com" target="_blank">PlusOne®</a>, Amsterdam, 2025
        <br />
        
        {new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        })}{" "}
        UTC
      </div>
    </div>
  );
}

export default App;
