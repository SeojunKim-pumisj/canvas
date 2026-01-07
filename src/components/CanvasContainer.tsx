import React from 'react';

interface CanvasContainerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none cursor-crosshair block"
    />
  );
};
