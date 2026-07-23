"use client";

import { useEffect, useRef, useState } from "react";

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [duration, setDuration] = useState(5);

  const isRunning = elapsedTime < duration;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!isRunning) return;
    console.log("monting");

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const progress = Math.min((elapsedTime / duration) * 100, 100);

  function resetTimer() {
    setElapsedTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div className="flex w-80 flex-col gap-4">
      <div>
        <p>Elapsed Time:</p>

        <div className="h-4 w-full border">
          <div
            className="h-full bg-blue-500 transition-[width] duration-100 ease-linear"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <p>{elapsedTime.toFixed(1)}s</p>

      <div>
        <p>Duration: {duration}s</p>

        <input
          type="range"
          min="1"
          max="30"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
