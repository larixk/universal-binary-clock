import { getTimeScale } from "./timeScale";

const checkIsBitSet = (value: bigint, position: number) => {
  return !!((value >> BigInt(position)) & BigInt(1));
};

function Grid({ value }: { value: bigint }) {
  const gridSize = 8;

  return (
    <div
      className="grid-container"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {Array.from({ length: gridSize ** 2 }, (_, bitIndex) => {
        return (
          <div
            className={`cell ${
              checkIsBitSet(value, bitIndex) ? "cell-on" : "cell-off"
            }`}
            key={bitIndex}
          >
            <div className="cell-text">{getTimeScale(bitIndex)}</div>
            <div className="cell-fill" />
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
