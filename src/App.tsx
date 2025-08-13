import { useEffect, useRef, useState } from "react";
import { Button, Heading, Point, Textfield, Timer } from "./components";
import type { PointData } from "./components/Point";
import "./App.css";

const App = () => {
  const [valueInput, setValueInput] = useState<string>("");
  const [points, setPoints] = useState<PointData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<number>(0);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      resetTimeout();
    };
  }, []);

  /**
   * Handle auto play functionality
   * Automatically clicks points in sequence with 1000ms delay
   */
  useEffect(() => {
    if (!isAutoPlay || points.length === 0 || isStopped) {
      resetTimeout();
      return;
    }

    const clickNextPoint = (index: number) => {
      if (index >= points.length || !points[index].visible || isStopped) return;

      const timeoutId = setTimeout(() => {
        if (points[index].id === currentPoints && !isStopped) {
          handlePointClick(points[index].id);
          clickNextPoint(index + 1);
        }
      }, 1000);

      timeoutsRef.current.push(timeoutId);
    };

    const nextPointIndex = points.findIndex((point) => point.id === currentPoints && point.visible);

    if (nextPointIndex !== -1) {
      clickNextPoint(nextPointIndex);
    }
  }, [isAutoPlay, isStopped, currentPoints]);

  const resetTimeout = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
  };

  /**
   * Generate random points within game area
   * @param count - Number of points to generate
   * @returns Array of PointData with random positions
   */
  const generateRandomPoints = (count: number): PointData[] => {
    const gameArea = { width: 500, height: 300, margin: 15 };

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * (gameArea.width - 2 * gameArea.margin) + gameArea.margin,
      y: Math.random() * (gameArea.height - 2 * gameArea.margin) + gameArea.margin,
      title: `${i + 1}`,
      visible: true,
      className: "",
    }));
  };

  /** Initialize a new game */
  const initializeGame = () => {
    const pointCount = parseInt(valueInput) || 0;

    if (pointCount <= 0) {
      alert("Vui lòng nhập số từ 1");
      return;
    }

    const newPoints = generateRandomPoints(pointCount);
    setPoints(newPoints);
    setScore(0);
    setTimerKey((prev) => prev + 1);
    setIsAutoPlay(false);
    setIsStopped(false);
    setCurrentPoints(0);
    resetTimeout();
    setIsStarted(true);
  };

  const handlePlay = () => {
    initializeGame();
  };

  const handleRestart = () => {
    initializeGame();
  };

  const handleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  /**
   * Handle point click events
   * @param pointId - ID of clicked point
   * @returns true if correct click, false if wrong click
   */
  const handlePointClick = (pointId: number) => {
    if (pointId !== currentPoints) {
      setPoints((prevPoints) =>
        prevPoints.map((point) =>
          point.id === pointId ? { ...point, className: "wrong-click" } : point
        )
      );
      setIsStopped(true);
      resetTimeout();
      return false;
    }

    setCurrentPoints((prev) => prev + 1);
    setScore((prevScore) => prevScore + 1);

    setPoints((prevPoints) =>
      prevPoints.map((point) =>
        point.id === pointId ? { ...point, className: "fade-out" } : point
      )
    );

    return true;
  };

  /**
   * Remove a point from the view after its fade-out animation ends.
   * @param pointId - ID of the point whose animation has ended.
   */
  const handleAnimationEnd = (pointId: number) => {
    if (!isStopped) {
      setPoints((prevPoints) =>
        prevPoints.map((point) => (point.id === pointId ? { ...point, visible: false } : point))
      );
    }
  };

  const isGameCompleted = score === points.length && points.length > 0;

  return (
    <div className="app">
      <Heading
        title={isGameCompleted ? "ALL CLEARED" : isStopped ? "GAME OVER" : "LET'S PLAY"}
        variant={isGameCompleted ? "success" : isStopped ? "error" : "info"}
      />

      <div className="app__controls">
        <Textfield label="Points" value={valueInput} onChange={handleChange} />
        <Timer
          key={timerKey}
          label="Time"
          isStarted={isStarted}
          isStopped={isGameCompleted || isStopped}
        />
        <div className="app__score">
          <strong>
            Score: {score} / {points.length}
          </strong>
        </div>
      </div>

      <div className="app__buttons">
        {!isStarted && <Button title="Play" onClick={handlePlay} />}
        {isStarted && (
          <>
            <Button title="Restart" onClick={handleRestart} />
            <Button
              title={`Auto Play ${!isAutoPlay ? "ON" : "OFF"}`}
              onClick={handleAutoPlay}
              disabled={isStopped || isGameCompleted}
            />
          </>
        )}
      </div>

      <div className="app__game-area">
        {points.map((point) => (
          <Point
            key={`${point.id}-${timerKey}`}
            {...point}
            className={`${point.className || ""} ${isStopped ? "frozen" : ""}`}
            onClick={() => handlePointClick(point.id)}
            isDisabled={isStopped || isAutoPlay}
            style={{ zIndex: points.length - point.id }}
            onAnimationEnd={() => handleAnimationEnd(point.id)}
          />
        ))}

        {points.length === 0 && !isStarted && (
          <div className="app__empty-message">Please enter the number of points</div>
        )}
      </div>
    </div>
  );
};

export default App;
