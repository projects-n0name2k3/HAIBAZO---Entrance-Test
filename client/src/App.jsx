import React, { useEffect, useState } from "react";

function App() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [points, setPoints] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const [circles, setCircles] = useState([]);
  const [nextTarget, setNextTarget] = useState(0);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    var intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 0.1);
      }, 100);
    }

    if (!isOver && isPlaying) {
      const createCircles = () => {
        const newCircles = [];
        for (let i = 0; i < parseInt(points, 10); i++) {
          const randomX = Math.random() * 800;
          const randomY = Math.random() * 300;
          newCircles.push({ x: randomX, y: randomY });
        }
        setCircles(newCircles);
      };

      createCircles();
    }
    if (isOver) {
      clearInterval(intervalId);
      return;
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, isOver]);

  const handleRetartGame = () => {
    const createCircles = () => {
      const newCircles = [];
      for (let i = 0; i < parseInt(points, 10); i++) {
        const randomX = Math.random() * 800;
        const randomY = Math.random() * 300;
        newCircles.push({ x: randomX, y: randomY });
      }
      setCircles(newCircles);
    };
    createCircles();
  };

  return (
    <div className="font-montserrat w-screen h-screen flex justify-center items-center">
      <div className="w-1/2 h-2/3 border border-gray-200 shadow-lg rounded-lg p-5 flex flex-col gap-4">
        <h3
          className={`uppercase text-xl font-bold ${
            isOver
              ? "text-red-500"
              : isCompleted
              ? "text-green-500"
              : "text-black"
          }`}
        >
          {isOver ? "GAME OVER" : isCompleted ? "ALL CLEARED" : `LET'S PLAY`}
        </h3>
        <div className="flex gap-10 items-center">
          <span className="w-20">Points:</span>
          <input
            type="number"
            min={1}
            value={points}
            onChange={(e) => {
              if (e.target.value <= 0) {
                alert("Points should be greater than 0");
                return;
              }
              setPoints(e.target.value);
            }}
            className="border border-gray-200 rounded-md p-2"
          />
        </div>
        <div className="flex gap-10 items-center">
          <span className="w-20">Time:</span>
          <span>{elapsedTime.toFixed(1)}s</span>
        </div>
        <button
          className="px-4 py-2 w-32 border text-center rounded-md border-black hover:opacity-60"
          onClick={() => {
            setIsOver(false);
            setIsCompleted(false);
            setNextTarget(0);
            if (!isPlaying) {
              setIsPlaying(true);
            }
            if (isPlaying || isCompleted) {
              setIsPlaying(true);
              handleRetartGame();
              setElapsedTime(0.0);
            }
          }}
        >
          {isPlaying ? "Restart" : isCompleted ? "Play Again" : "Play"}
        </button>
        <div className="w-full h-full border border-black rounded-md relative">
          {circles.map((circle, index) => (
            <div
              key={index}
              onClick={() => {
                if (index !== nextTarget && !circle.selected) {
                  setIsOver(true);
                  return;
                }
                if (circle.selected) {
                  console.log("already selected");
                  return;
                }
                if (nextTarget === points - 1) {
                  setCircles((prevCircles) =>
                    prevCircles.map((c, i) =>
                      i === index ? { ...c, selected: !c.selected } : c
                    )
                  );
                  setTimeout(() => {
                    setIsCompleted(true);
                    setIsPlaying(false);
                  }, 1000);
                  return;
                }
                if (!isCompleted) {
                  setCircles((prevCircles) =>
                    prevCircles.map((c, i) =>
                      i === index ? { ...c, selected: !c.selected } : c
                    )
                  );
                  setNextTarget((prevTarget) => prevTarget + 1);
                }
              }}
              className={`absolute bg-white rounded-full border flex items-center justify-center cursor-pointer border-black ${
                circle.selected && "selected"
              }`}
              style={{
                left: circle.x,
                top: circle.y,
                width: 50,
                height: 50,
                zIndex: points - index,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
