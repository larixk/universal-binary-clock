import { useState, useEffect, useRef } from "react";
import { easeInOutExpo } from "../utils/easing";

export const useSmoothed = (value: bigint) => {
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
