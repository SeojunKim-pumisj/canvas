export type Point = {
  x: number;
  y: number;
};

export type ToolType = 'pen' | 'eraser' | 'hand';

export type Stroke = {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
};