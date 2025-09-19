import { useState, useEffect } from "react";
import { unixEpoch } from "../constants/time";

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(BigInt(0));

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      setCurrentTime(BigInt(Math.floor(Date.now() / 1000)) + unixEpoch);
    };

    tick();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return currentTime;
};
