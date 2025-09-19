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
    name: "First heavy elements released",
    timestamp: BigInt(200) * millionYears + imprecision(1000),
    source: "https://arxiv.org/abs/1102.4638", // Bromm & Yoshida (2011), review on first stars/early enrichment
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
    name: "Earliest oceans",
    timestamp: BigInt(9400) * millionYears + imprecision(1000),
    source: "https://www.geology.wisc.edu/~valley/zircons/Wilde2001Nature.pdf",
  },
  {
    name: "Life on Earth",
    timestamp: BigInt(10300) * millionYears + imprecision(1000),
    source: "https://pubmed.ncbi.nlm.nih.gov/11539686/",
  },
  {
    name: "Great Oxidation Event",
    timestamp: BigInt(11400) * millionYears + imprecision(1000),
    source: "https://www.pnas.org/doi/10.1073/pnas.1608824114",
  },
  {
    name: "Cambrian Period",
    timestamp: BigInt(13259) * millionYears + imprecision(1000),
    source: "https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf",
  },
  {
    name: "K–Pg mass extinction",
    timestamp: BigInt(13734) * millionYears + imprecision(1000),
    source: "https://www.science.org/doi/pdf/10.1126/science.aaa0118",
  },
  {
    name: "Homo sapiens",
    timestamp: (BigInt(137997) * millionYears) / BigInt(10) + imprecision(1000),
    source: "https://www.nature.com/articles/nature22336",
  },
  {
    name: "Great Pyramid of Giza",
    timestamp: calendarYear(-2600),
    source: "https://www.britannica.com/place/Great-Pyramid-of-Giza",
  },

  {
    name: "Renaissance begins",
    timestamp: calendarYear(1400),
    source: "https://www.britannica.com/event/Renaissance-European-history",
  },
  {
    name: "Scientific Revolution",
    timestamp: calendarYear(1543),
    source: "https://www.britannica.com/event/Scientific-Revolution",
  },
  {
    name: "Industrial Revolution",
    timestamp: calendarYear(1760),
    source: "https://www.britannica.com/event/Industrial-Revolution",
  },
  {
    name: "Moon landing",
    timestamp: calendarYear(1969),
    source: "https://www.nasa.gov/history/50-years-ago-apollo-11/",
  },
  {
    name: "Unix Epoch",
    timestamp: calendarYear(1970),
    source: "https://en.wikipedia.org/wiki/Unix_time",
  },
  {
    name: "World Wide Web",
    timestamp: calendarYear(1989),
    source: "https://www.w3.org/History/1989/proposal.html",
  },
  {
    name: "Human Genome Project completed",
    timestamp: calendarYear(2003),
    source: "https://www.genome.gov/human-genome-project",
  },
];

function App() {
  const [eventShown, setEventShown] = useState<
    (typeof events)[number]["name"] | null
  >(null);
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
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {events.map((event) => (
          <button
            onClick={() => setEventShown(event.name)}
            key={event.name}
            style={{ width: "12em" }}
          >
            {event.name}
          </button>
        ))}
      </div>
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
