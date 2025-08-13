import { memo, useCallback } from "react";
import Button from "../Button";

export interface PointData {
  id: number;
  x: number;
  y: number;
  title: string;
  visible: boolean;
  className?: string;
}

interface PointProps extends PointData {
  isDisabled?: boolean;
  style?: React.CSSProperties;
  onClick: (id: number) => void;
  onAnimationEnd?: () => void;
}

const Point = memo(
  ({
    id,
    x,
    y,
    title,
    visible,
    className,
    isDisabled,
    style,
    onClick,
    onAnimationEnd,
  }: PointProps) => {
    const handleClick = useCallback(() => {
      onClick(id);
    }, [onClick, id]);

    if (!visible) return null;

    return (
      <Button
        id={String(id)}
        onClick={handleClick}
        title={title}
        disabled={isDisabled}
        className={className}
        onAnimationEnd={onAnimationEnd}
        style={{
          position: "absolute" as const,
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1px solid #f85757",
          cursor: isDisabled ? "not-allowed" : "pointer",
          backgroundColor: "white",
          color: "black",
          ...style,
        }}
      />
    );
  }
);

export default memo(Point);
