import { useState, useRef, useCallback } from 'react';

export const useHistory = () => {
  const historyRef = useRef<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [historyLength, setHistoryLength] = useState(0);

  const saveHistory = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Remove future history if any (redo branch)
    if (currentIndex < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndex + 1);
    }
    
    // Add new state
    historyRef.current.push(imageData);
    
    // Limit to 50
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    }

    setHistoryLength(historyRef.current.length);
    setCurrentIndex(historyRef.current.length - 1);
  }, [currentIndex]);

  const undo = useCallback((canvas: HTMLCanvasElement) => {
    if (currentIndex < 0) return; 
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    if (newIndex >= 0) {
        ctx.putImageData(historyRef.current[newIndex], 0, 0);
    } else {
        // Clear canvas if we go back before the first history item
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentIndex]);

  const redo = useCallback((canvas: HTMLCanvasElement) => {
    if (currentIndex >= historyLength - 1) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    ctx.putImageData(historyRef.current[newIndex], 0, 0);
  }, [currentIndex, historyLength]);

  return {
    saveHistory,
    undo,
    redo,
    canUndo: currentIndex >= 0,
    canRedo: currentIndex < historyLength - 1
  };
};