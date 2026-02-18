import { TrigFunction, TrigConfig } from './types';

export const TRIG_CONFIGS: Record<TrigFunction, TrigConfig> = {
  [TrigFunction.SIN]: {
    color: '#06b6d4', // cyan-500
    label: '正弦函数 (Sin)',
    description: 'y = sin(θ) \n对应单位圆上点的 y 坐标（高度）。',
  },
  [TrigFunction.COS]: {
    color: '#d946ef', // fuchsia-500
    label: '余弦函数 (Cos)',
    description: 'y = cos(θ) \n对应单位圆上点的 x 坐标（水平距离）。',
  },
  [TrigFunction.TAN]: {
    color: '#f59e0b', // amber-500
    label: '正切函数 (Tan)',
    description: 'y = tan(θ) \n对应半径延长线与切线 x=1 的交点高度 (即斜率)。',
  },
};

export const CIRCLE_RADIUS = 120; // Logical radius in SVG pixels
export const CENTER = { x: 0, y: 0 };
export const SVG_SIZE = 400;
export const VIEWBOX = `-200 -200 400 400`; // Centered at 0,0