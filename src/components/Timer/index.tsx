import { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";

import "./Timer.css";

export interface ITimerProps {
  label?: string;
  isStarted?: boolean;
  isStopped?: boolean;
}

const Timer = ({ label, isStarted, isStopped }: ITimerProps) => {
  const { seconds, minutes, start, pause } = useStopwatch({ autoStart: false });

  useEffect(() => {
    if (isStarted) start();
    if (isStopped) pause();
  }, [isStarted, isStopped]);

  return (
    <div className="timer">
      {label && <span className="timer__label">{label}</span>}
      {minutes}:{seconds.toFixed(0).padStart(2, "0")}
    </div>
  );
};

export default Timer;
