import React, { useState, useEffect } from "react";

function Timer({ name, duration, onClose }) {
  const [time, setTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

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
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100/70">
      <div className="bg-white rounded-lg text-center border border-gray-300 p-6">
        <div className="pt-9 px-20">
          <h1 className="text-2xl font-medium mb-6 text-fit-gray uppercase">{name}</h1>
          <div className="text-8xl mb-8 font-semibold text-fit-black">{formatTime(time)}</div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-2xl px-10 py-2 rounded-full bg-fit-orange text-white font-semibold hover:bg-fit-orange-hover hover:text-fit-white-hover transition"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTime(duration);
              }}
              className="text-2xl px-10 py-2 rounded-full border border-gray-300 bg-white text-fit-black font-semibold hover:bg-fit-white-hover transition"
            >
              Reset
            </button>
          </div>
        </div>
        <button 
          onClick={onClose} // Close the timer when clicked
          className='text-fit-black bg-[#FDFDFD] hover:bg-[#F6F5F5] font-medium uppercase mt-9 text-lg border p-2 rounded-md border-gray-300 w-full'>
          End Exercise
        </button>
      </div>
    </div>
  );
};

export default Timer;
