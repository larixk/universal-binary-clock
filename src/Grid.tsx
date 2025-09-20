const circleScale = (index: number, total: number) => ((index + 1) / total) ** 0.9 + 0.1;
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
            style={{
              scale: `${circleScale(bitIndex, gridSize ** 2) * 1} ${circleScale(bitIndex, gridSize ** 2) * 0.125}`,
              translate: `0 ${(bitIndex / gridSize ** 2 - 0.5) * 100}%`,
              zIndex: gridSize ** 2 - bitIndex,
            }}
            key={bitIndex}
          >
            <div className="cell-fill" />
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
