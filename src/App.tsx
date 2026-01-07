import React, { useState, useRef, useEffect } from 'react';
import { CanvasContainer } from './components/CanvasContainer';
import { Toolbar } from './components/Toolbar';
import { Cursor } from './components/Cursor';
import { useCanvas } from './hooks/useCanvas';
import type { ToolType, Stroke, Point } from './types/types';

function App() {
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState('#000000');
  
  // Independent width states
  const [penWidth, setPenWidth] = useState(3);
  const [eraserWidth, setEraserWidth] = useState(20);

  // Core State: Vector History & Camera
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [cameraOffset, setCameraOffset] = useState<Point>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const currentWidth = tool === 'eraser' ? eraserWidth : penWidth;

  const setLineWidth = (width: number) => {
    if (tool === 'eraser') setEraserWidth(width);
    else setPenWidth(width);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'h': setTool('hand'); break;
        case 'f': setTool('pen'); break;
        case 'e': setTool('eraser'); break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) handleRedo();
            else handleUndo();
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [strokes, redoStack]); 

  // Persistence
  useEffect(() => {
    const savedStrokes = localStorage.getItem('drawingStrokes');
    const savedCamera = localStorage.getItem('drawingCamera');
    if (savedStrokes) {
        try {
            setStrokes(JSON.parse(savedStrokes));
        } catch (e) {
            console.error("Failed to load strokes", e);
        }
    }
    if (savedCamera) {
        try {
            setCameraOffset(JSON.parse(savedCamera));
        } catch (e) {
            console.error("Failed to load camera", e);
        }
    }
  }, []);

  const saveToStorage = (newStrokes: Stroke[], newCamera: Point) => {
      try {
          localStorage.setItem('drawingStrokes', JSON.stringify(newStrokes));
          localStorage.setItem('drawingCamera', JSON.stringify(newCamera));
      } catch (e) {
          console.error("Storage failed", e);
      }
  };

  const handleStrokeComplete = (stroke: Stroke) => {
    const newStrokes = [...strokes, stroke];
    setStrokes(newStrokes);
    setRedoStack([]); // Clear redo stack on new action
    saveToStorage(newStrokes, cameraOffset);
  };

  const handlePan = (delta: Point) => {
    setCameraOffset(prev => {
        const newOffset = { x: prev.x + delta.x, y: prev.y + delta.y };
        return newOffset;
    });
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    setRedoStack(prev => [...prev, last]);
    saveToStorage(newStrokes, cameraOffset);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newStrokes = [...strokes, next];
    setStrokes(newStrokes);
    setRedoStack(newRedoStack);
    saveToStorage(newStrokes, cameraOffset);
  };

  useCanvas({
    canvasRef,
    tool,
    color,
    width: currentWidth,
    strokes,
    cameraOffset,
    onStrokeComplete: handleStrokeComplete,
    onPan: handlePan
  });

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      <CanvasContainer canvasRef={canvasRef} />
      
      {/* Custom Cursor */}
      <Cursor tool={tool} width={currentWidth} color={color} />

      <Toolbar 
        currentTool={tool}
        setTool={setTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        color={color}
        setColor={setColor}
        lineWidth={currentWidth}
        setLineWidth={setLineWidth}
      />
    </div>
  );
}

export default App;