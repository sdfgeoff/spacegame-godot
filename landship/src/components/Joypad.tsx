import React, { useEffect } from "react";

export type Position = {
  x: number;
  y: number;
};

export interface JoypadProps {
  onPositionChange?: (position: Position) => void;
}

const NOMINAL_SIZE = 100;
const LINEWIDTH = 2;
const HANDLE_RADIUS = 10;
const PADDING = HANDLE_RADIUS;

const HALF_SIZE = NOMINAL_SIZE / 2;
const CANVAS_HALF_SIZE = HALF_SIZE + PADDING;

const PADDING_SCALE_FACTOR = CANVAS_HALF_SIZE / HALF_SIZE;

const eventCoordsToPercent = (x: number, y: number, rect: DOMRect) => {
  return {
    x: (((x - rect.left) / rect.width) * 2.0 - 1) * PADDING_SCALE_FACTOR,
    y: (((y - rect.top) / rect.height) * 2.0 - 1) * PADDING_SCALE_FACTOR,
  };
};

const Joypad: React.FC<JoypadProps> = ({ onPositionChange }) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 }); // Ranges from -1 to 1
  const [dragging, setDragging] = React.useState(false);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const dotRef = React.useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(position);
    }
  }, [onPositionChange, position]);

  useEffect(() => {
    onPositionChange?.({ x: 0, y: 0 });
  }, [onPositionChange, dragging]);

  const setPositionConstrained = ({ x, y }: Position) => {
    // Max length = 1
    const length = Math.sqrt(x * x + y * y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    setPosition({ x, y });
  };

  const handleMouseDown = () => {
    setDragging(true);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseMove: React.MouseEventHandler<SVGSVGElement> = (event) => {
    if (dragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setPositionConstrained(
        eventCoordsToPercent(event.clientX, event.clientY, rect),
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleTouchStart: React.TouchEventHandler<SVGSVGElement> = (event) => {
    setDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setPositionConstrained(
        eventCoordsToPercent(
          event.touches[0].clientX,
          event.touches[0].clientY,
          rect,
        ),
      );
    }
  };

  const handleTouchMove: React.TouchEventHandler<SVGSVGElement> = (event) => {
    if (dragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setPositionConstrained(
        eventCoordsToPercent(
          event.touches[0].clientX,
          event.touches[0].clientY,
          rect,
        ),
      );
    }
  };

  const handleTouchEnd: React.TouchEventHandler<SVGSVGElement> = () => {
    setDragging(false);
    setPosition({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    if (dotRef.current) {
      dotRef.current.setAttribute("cx", (position.x * HALF_SIZE).toString());
      dotRef.current.setAttribute("cy", (position.y * HALF_SIZE).toString());
    }
  }, [position]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${-CANVAS_HALF_SIZE} ${-CANVAS_HALF_SIZE} ${CANVAS_HALF_SIZE * 2} ${CANVAS_HALF_SIZE * 2}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      <circle
        cx="0"
        cy="0"
        r={HALF_SIZE - LINEWIDTH / 2}
        fill="none"
        stroke="blue"
        strokeWidth={LINEWIDTH}
      />
      <circle ref={dotRef} r={HANDLE_RADIUS} fill="blue" />
    </svg>
  );
};

export default Joypad;
