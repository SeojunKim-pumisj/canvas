import React, { useState, useRef } from 'react';
import { Pencil, Eraser, Hand, Undo, Redo, Palette } from 'lucide-react';
import type { ToolType } from '../types/types';

interface ToolbarProps {
  currentTool: ToolType;
  setTool: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
}

const PRESET_COLORS = [
  '#000000', '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
  '#0000FF', '#4B0082', '#9400D3', '#FFFFFF'
];

export const Toolbar: React.FC<ToolbarProps> = ({ 
  currentTool, 
  setTool, 
  onUndo, 
  onRedo, 
  color, 
  setColor,
  lineWidth,
  setLineWidth
}) => {
  const [activePopup, setActivePopup] = useState<'pen' | 'eraser' | 'color' | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleToolClick = (tool: ToolType) => {
    if (currentTool === tool) {
      if (tool === 'pen') {
          setActivePopup(activePopup === 'pen' ? null : 'pen');
      } else if (tool === 'eraser') {
          setActivePopup(activePopup === 'eraser' ? null : 'eraser');
      } else {
          setActivePopup(null);
      }
    } else {
      setTool(tool);
      if (tool === 'pen') setActivePopup('pen');
      else if (tool === 'eraser') setActivePopup('eraser');
      else setActivePopup(null);
    }
  };

  const handleColorClick = () => {
    setActivePopup(activePopup === 'color' ? null : 'color');
  };
  
  // Helper to generate gradient background for slider track
  const getSliderBackground = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%)`;
  };

  return (
    <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-slate-700 z-50">
      
      {/* Hand Tool */}
      <button 
        onClick={() => setTool('hand')}
        className={`p-2 rounded-lg transition-colors ${currentTool === 'hand' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'}`}
        title="Hand (H)"
      >
        <Hand className="w-5 h-5" />
      </button>

      {/* Pen Tool */}
      <div className="relative">
        {activePopup === 'pen' && (
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 z-50">
             <input 
               type="range" 
               min="1" 
               max="50" 
               value={lineWidth} 
               onChange={(e) => setLineWidth(Number(e.target.value))}
               className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer"
               style={{ background: getSliderBackground(lineWidth, 50) }}
             />
           </div>
        )}
        <button 
          onClick={() => handleToolClick('pen')}
          className={`p-2 rounded-lg transition-colors ${currentTool === 'pen' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'}`}
          title="Pen (F)"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      {/* Eraser Tool */}
      <div className="relative">
        {activePopup === 'eraser' && (
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 z-50">
             <input 
               type="range" 
               min="1" 
               max="100" 
               value={lineWidth} 
               onChange={(e) => setLineWidth(Number(e.target.value))}
               className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer"
               style={{ background: getSliderBackground(lineWidth, 100) }}
             />
           </div>
        )}
        <button 
          onClick={() => handleToolClick('eraser')}
          className={`p-2 rounded-lg transition-colors ${currentTool === 'eraser' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'}`}
          title="Eraser (E)"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>
      
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
      
      {/* Color Picker */}
      <div className="relative">
        {activePopup === 'color' && (
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 w-64">
             <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Color</span>
                <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600" style={{ backgroundColor: color }}></div>
             </div>
             
             <div className="grid grid-cols-5 gap-2">
                {/* 9 Presets + 1 Custom trigger */}
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setActivePopup(null); }}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
                
                {/* Custom Color Input Wrapper */}
                <div className="relative w-8 h-8">
                     <input 
                        ref={colorInputRef}
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 border border-slate-200 dark:border-slate-600" />
                </div>
             </div>
           </div>
        )}
        <button 
            onClick={handleColorClick}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-700 dark:text-slate-200 relative" 
            title="Color"
        >
            <Palette className="w-5 h-5" style={{ color: color }} />
        </button>
      </div>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

      <button onClick={onUndo} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-700 dark:text-slate-200" title="Undo (Ctrl+Z)">
        <Undo className="w-5 h-5" />
      </button>
      <button onClick={onRedo} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-700 dark:text-slate-200" title="Redo">
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};
