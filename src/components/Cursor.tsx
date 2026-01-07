import React, { useEffect, useRef, useState } from 'react';
import type { ToolType } from '../types/types';

interface CursorProps {
  tool: ToolType;
  width: number;
  color: string;
}

export const Cursor: React.FC<CursorProps> = ({ tool, width, color }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      // Show cursor when moving
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (tool === 'hand') return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none rounded-full z-50 mix-blend-difference"
      style={{
        width: `${width}px`,
        height: `${width}px`,
        marginTop: `-${width / 2}px`,
        marginLeft: `-${width / 2}px`,
        border: '1px solid white', 
        backgroundColor: tool === 'pen' ? color : 'rgba(255, 255, 255, 0.2)',
        opacity: isVisible ? 1 : 0,
        // Using mix-blend-mode: difference ensures visibility on both light/dark backgrounds
        // But if we use colored pen, difference might distort color perception.
        // Let's remove mix-blend for the fill, but maybe use a shadow for border visibility.
        mixBlendMode: 'normal',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5)', // Outer ring for contrast
      }}
    />
  );
};
