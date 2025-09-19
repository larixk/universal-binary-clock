export const getTimeScale = (cellIndex: number) => {
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
