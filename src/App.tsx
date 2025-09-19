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

const imprecision = (max: number) => {
  return BigInt(Math.floor(Math.random() * max));
};

const secondsPerYear = BigInt(365.25 * 24 * 60 * 60);
const millionYears = BigInt(1e6) * secondsPerYear;

const calendarYear = (year: number) => {
  return secondsTil2020 - BigInt(2020 - year) * secondsPerYear;
};

// https://www.aanda.org/articles/aa/full_html/2020/09/aa33910-18/aa33910-18.html
const secondsTil2020 = BigInt(13780) * millionYears;
const unixEpoch = calendarYear(1970);
const events = [
  {
    name: "Universe",
    timestamp: BigInt(0),
    source: "https://science.nasa.gov/universe/overview/",
  },
  {
    name: "Hydrogen, Helium, and Lithium nuclei",
    timestamp: BigInt(180),
    source: "https://wmap.gsfc.nasa.gov/universe/bb_tests_ele.html",
  },
  {
    name: "Recombination (CMB decoupling)",
    timestamp: (BigInt(38) * millionYears) / BigInt(100) + imprecision(1000),
    source:
      "https://www.cfa.harvard.edu/research/topic/cosmic-microwave-background",
  },
  {
    name: "First stars",
    timestamp: BigInt(180) * millionYears + imprecision(1000),
    source: "https://pubmed.ncbi.nlm.nih.gov/29493587/",
  },
  {
    name: "Earliest confirmed galaxy",
    timestamp: BigInt(290) * millionYears + imprecision(1000),
    source:
      "https://www.reuters.com/science/earliest-known-galaxy-spotted-by-webb-telescope-is-beacon-cosmic-dawn-2024-05-31/",
  },
  {
    name: "Sun",
    timestamp: BigInt(9233) * millionYears + imprecision(1000),
    source: "https://pubmed.ncbi.nlm.nih.gov/23118187/",
  },
  {
    name: "Earth",
    timestamp: BigInt(9260) * millionYears + imprecision(1000),
    source: "https://pubs.usgs.gov/gip/geotime/age.html",
  },
  {
    name: "Moon",
    timestamp: BigInt(9290) * millionYears + imprecision(1000),
    source: "https://www.science.org/doi/10.1126/sciadv.1602365",
  },
  {
    name: "Life on Earth",
    timestamp: BigInt(10300) * millionYears + imprecision(1000),
    source: "https://pubmed.ncbi.nlm.nih.gov/11539686/",
  },
  {
    name: "Homo sapiens",
    timestamp: (BigInt(137997) * millionYears) / BigInt(10) + imprecision(1000),
    source: "https://www.nature.com/articles/nature22336",
  },
  {
    name: "Great Pyramid of Giza",
    timestamp: calendarYear(-2600) + imprecision(1000),
    source: "https://www.britannica.com/place/Great-Pyramid-of-Giza",
  },

  {
    name: "Renaissance begins",
    timestamp: calendarYear(1400) + imprecision(1000),
    source: "https://www.britannica.com/event/Renaissance-European-history",
  },
  {
    name: "Industrial Revolution",
    timestamp: calendarYear(1760) + imprecision(1000),
    source: "https://www.britannica.com/event/Industrial-Revolution",
  },
  {
    name: "Moon landing",
    timestamp: calendarYear(1969) + imprecision(1000),
    source: "https://www.nasa.gov/history/50-years-ago-apollo-11/",
  },
  {
    name: "World Wide Web",
    timestamp: calendarYear(1989) + imprecision(1000),
    source: "https://www.w3.org/History/1989/proposal.html",
  },
  {
    name: "Human Genome Project completed",
    timestamp: calendarYear(2003) + imprecision(1000),
    source: "https://www.genome.gov/human-genome-project",
  },
];
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

    console.log(duration);
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
  const [eventShown] = useState<(typeof events)[number]["name"] | null>(null);
  const [currentTime, setCurrentTime] = useState(BigInt(0));
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const selectedEvent = events.find((event) => event.name === eventShown);
  const time = selectedEvent ? selectedEvent.timestamp : currentTime;

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

  const smoothedTime = useSmoothed(time);

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
          const isOn = !!((smoothedTime >> BigInt(cell)) & BigInt(1));
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
              key={cell}
            >
              <div
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  borderRadius: `${cellSize * 0.15}px`,
                  backgroundColor: "rgba(0,0,0,0.05)",
                  ["cornerShape" as string]: "bevel",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <div
                  style={{
                    color: "white",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    mixBlendMode: "difference",
                    opacity: isOn || hoveredCell === cell ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  {getTimeScale(cell)}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    backgroundColor: "black",
                    zIndex: -1,
                    transformOrigin: isOn ? "0 0" : "100% 100%",
                    scale: `${isOn ? 1 : 0} 1`,
                    transition: "scale 0.2s ease-out",
                    transitionDuration: `${isOn ? 0.5 : 0.1}s`,
                  }}
                />
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
        Universal Binary Clock, Larix Kortbeek, 2025
        <br />
        A binary clock of seconds since the Big Bang
        <br />
        Last updated:{" "}
        {new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        })}{" "}
        UTC
      </div>
    </div>
  );
}

export default App;
