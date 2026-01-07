import { useEffect, useRef, useState } from 'react';
import type { Point, Stroke, ToolType } from '../types/types';

interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: ToolType;
  color: string;
  width: number;
  strokes: Stroke[];
  cameraOffset: Point;
  onStrokeComplete: (stroke: Stroke) => void;
  onPan: (delta: Point) => void;
}

export const useCanvas = ({
  canvasRef,
  tool,
  color,
  width,
  strokes,
  cameraOffset,
  onStrokeComplete,
  onPan,
}: UseCanvasProps) => {
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef<Point | null>(null);

  // Coordinate conversion: Screen (Mouse) -> World (Canvas logical)
  const toWorld = (screenPoint: Point): Point => {
    return {
      x: screenPoint.x - cameraOffset.x,
      y: screenPoint.y - cameraOffset.y,
    };
  };

  // Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // 1. Clear Screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // 2. Apply Camera Transform
      ctx.translate(cameraOffset.x, cameraOffset.y);

      // 3. Define Draw Line Helper
      const drawLine = (stroke: Stroke) => {
        if (stroke.points.length < 1) return;
        
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = stroke.width;
        
        if (stroke.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = '#000000'; 
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = stroke.color;
        }

        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      };

      // 4. Draw Existing Strokes
      strokes.forEach(drawLine);

      // 5. Draw Current Stroke (Preview)
      if (currentStroke) {
        drawLine(currentStroke);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [strokes, currentStroke, cameraOffset, canvasRef]); 

  // Resize Handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  // Input Handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPoint = (e: MouseEvent | TouchEvent): Point => {
      if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 0) {
        const touch = (e as TouchEvent).touches[0];
        return { x: touch.clientX, y: touch.clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      isDragging.current = true;
      const point = getPoint(e);
      lastPos.current = point;

      if (tool === 'hand') {
        canvas.style.cursor = 'grabbing';
      } else {
        const worldPoint = toWorld(point);
        setCurrentStroke({
          points: [worldPoint],
          color: color,
          width: width,
          tool: tool === 'eraser' ? 'eraser' : 'pen',
        });
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !lastPos.current) return;
      if (e.cancelable) e.preventDefault();
      
      const point = getPoint(e);

      if (tool === 'hand') {
        const dx = point.x - lastPos.current.x;
        const dy = point.y - lastPos.current.y;
        onPan({ x: dx, y: dy });
        lastPos.current = point;
      } else {
        const worldPoint = toWorld(point);
        setCurrentStroke((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...prev.points, worldPoint],
          };
        });
        lastPos.current = point;
      }
    };

    const handleEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      
      if (tool === 'hand') {
        canvas.style.cursor = 'default';
      } else {
        if (currentStroke) {
          onStrokeComplete(currentStroke);
          setCurrentStroke(null);
        }
      }
      lastPos.current = null;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseout', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseout', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [tool, color, width, cameraOffset, onStrokeComplete, onPan, currentStroke, canvasRef]);
};
