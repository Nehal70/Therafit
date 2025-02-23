import React, { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    } 
    if (time == 0 && isRunning) {
        setIsRunning(!isRunning);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6">Cool Timer</h1>
        <div className="text-6xl font-mono mb-8">{formatTime(time)}</div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTime(5);
            }}
            className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
