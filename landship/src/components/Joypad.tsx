import React, { useEffect } from 'react';


export type Position = {
    x: number,
    y: number
}

export interface JoypadProps {
    onPositionChange?: (position: Position) => void
}

const Joypad: React.FC<JoypadProps> = ({onPositionChange}) => {
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

    const setPositionConstrained = ({x, y}: Position) => {
        // Max length = 1
        const length = Math.sqrt(x * x + y * y);
        if (length > 1) {
            x /= length;
            y /= length;
        }
        setPosition({ x, y });
    }

    const handleMouseDown = () => {
        setDragging(true);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseMove: React.MouseEventHandler<SVGSVGElement> = (event) => {
        if (dragging && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width * 2 - 1;
            const y = (event.clientY - rect.top) / rect.height * 2 - 1;
            setPositionConstrained({ x, y });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setPosition({ x: 0, y: 0 });
    }

    const handleTouchStart: React.TouchEventHandler<SVGSVGElement> = (event) => {
        setDragging(true);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
            const x = (event.touches[0].clientX - rect.left) / rect.width * 2 - 1;
            const y = (event.touches[0].clientY - rect.top) / rect.height * 2 - 1;
            setPositionConstrained({ x, y });
        }
    };

    const handleTouchMove: React.TouchEventHandler<SVGSVGElement> = (event) => {
        if (dragging && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = (event.touches[0].clientX - rect.left) / rect.width * 2 - 1;
            const y = (event.touches[0].clientY - rect.top) / rect.height * 2 - 1;
            setPositionConstrained({ x, y });
        }
    };

    const handleTouchEnd: React.TouchEventHandler<SVGSVGElement> = () => {
        setDragging(false);
        setPosition({ x: 0, y: 0 });
    };

    React.useEffect(() => {
        if (dotRef.current) {
            dotRef.current.setAttribute('cx', (position.x * 50 + 50).toString());
            dotRef.current.setAttribute('cy', (position.y * 50 + 50).toString());
        }
    }, [position]);

    return (
        <svg ref={svgRef} viewBox="0 0 100 100" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseLeave={handleMouseUp} onMouseUp={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{touchAction: 'none'}}>
            <circle cx="50" cy="50" r="50" fill="none" stroke="white" strokeWidth="2" />
            <circle ref={dotRef} r="10" fill="white" />
        </svg>
    );
};


export default Joypad;