import React, { useMemo } from 'react';
import { TrigFunction } from '../types';
import { TRIG_CONFIGS } from '../constants';
import { formatTrigValue } from './UnitCircle';

interface WaveGraphProps {
  angle: number;
  selectedFunc: TrigFunction;
}

const WaveGraph: React.FC<WaveGraphProps> = ({ angle, selectedFunc }) => {
  const config = TRIG_CONFIGS[selectedFunc];
  
  // Graph Dimensions
  const width = 400;
  const height = 300; // logical SVG height
  
  // How many cycles to show? 0 to 4PI usually good.
  const xScale = 40; // pixels per radian roughly? Let's say 2PI takes up about 300px
  // 2PI approx 6.28. 300 / 6.28 ~= 48
  
  // Amplitude scaling (must match UnitCircle y-projection for visual continuity)
  // In UnitCircle, Radius = 120.
  const yScale = 120; 

  // Let's map theta [0, 4PI] to the width.
  const maxTheta = 4 * Math.PI;
  const pixelsPerRadian = (width - 40) / maxTheta; // preserve some padding
  
  // Calculate the path 'd' string
  // We construct a path from theta = 0 to current angle
  const pathData = useMemo(() => {
    let d = `M 0 ${-Math.sin(0) * yScale}`; // Start
    
    // Resolution
    const step = 0.1;
    // Only draw up to current angle (clamped to max view)
    const drawLimit = Math.min(angle, maxTheta);

    for (let t = 0; t <= drawLimit; t += step) {
      const px = t * pixelsPerRadian;
      let py = 0;
      
      switch (selectedFunc) {
        case TrigFunction.SIN:
          py = -Math.sin(t) * yScale;
          break;
        case TrigFunction.COS:
          // Standard Cosine wave: starts at 1 (top)
          py = -Math.cos(t) * yScale;
          break;
        case TrigFunction.TAN:
          const val = Math.tan(t);
          // Clamp tan for visual sanity
          if (Math.abs(val) > 3) {
             // Create a gap in the line if asymptote
             d += ` M ${px} ${val > 0 ? -3 * yScale : 3 * yScale}`; 
             continue;
          }
          py = -val * yScale;
          break;
      }
      
      if (t === 0) d = `M ${px} ${py}`;
      else d += ` L ${px} ${py}`;
    }
    return d;
  }, [angle, selectedFunc, pixelsPerRadian, yScale, maxTheta]);

  // Calculate current value and Y position
  let currentValue = 0;
  let currentY = 0;
  if (selectedFunc === TrigFunction.SIN) {
    currentValue = Math.sin(angle);
    currentY = -currentValue * yScale;
  }
  else if (selectedFunc === TrigFunction.COS) {
    currentValue = Math.cos(angle);
    currentY = -currentValue * yScale;
  }
  else {
    currentValue = Math.tan(angle);
    currentY = -currentValue * yScale;
  }

  // Clamp currentY for Tan
  if (selectedFunc === TrigFunction.TAN && Math.abs(currentY) > 200) {
     // Visual clamp
     currentY = currentY > 0 ? 200 : -200;
  }

  const tipX = Math.min(angle, maxTheta) * pixelsPerRadian;

  // Helper to format Radian labels
  const getRadianLabel = (multiplier: number) => {
      if (multiplier === 0.5) return 'π/2';
      if (multiplier === 1) return 'π';
      if (multiplier === 1.5) return '3π/2';
      if (multiplier === 2) return '2π';
      if (multiplier === 2.5) return '5π/2';
      if (multiplier === 3) return '3π';
      if (multiplier === 3.5) return '7π/2';
      if (multiplier === 4) return '4π';
      return '';
  };

  return (
    <div className="relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
      <h3 className="absolute top-4 left-4 text-slate-500 font-medium text-sm">函数图像生成 y = f(θ)</h3>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 -200 ${width} 400`}
        className="max-w-[500px] max-h-[350px] overflow-visible"
        style={{ borderLeft: '1px dashed #cbd5e1' }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
          </marker>
        </defs>

        {/* X Axis */}
        <line x1="0" y1="0" x2={width} y2="0" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x={width - 10} y="-10" className="text-xs text-slate-400 fill-slate-400 font-serif italic">θ</text>

        {/* Y Axis */}
        <line x1="0" y1="200" x2="0" y2="-200" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="10" y="-190" className="text-xs text-slate-400 fill-slate-400 font-serif italic">y</text>
        
        {/* Y Axis Ticks (1, 0.5, -0.5, -1) */}
        {[1, 0.5, -0.5, -1].map(val => {
           const yPos = -val * yScale;
           return (
             <g key={val}>
               <line x1="-5" y1={yPos} x2="0" y2={yPos} stroke="#cbd5e1" strokeWidth="1.5" />
               <text 
                  x="-8" 
                  y={yPos} 
                  dy="3"
                  textAnchor="end" 
                  className="text-[10px] text-slate-400 font-mono"
               >
                 {val}
               </text>
             </g>
           );
        })}

        {/* Grid markers for Degrees and Radians */}
        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((multiplier) => {
          const tickVal = multiplier * Math.PI;
          const px = tickVal * pixelsPerRadian;
          const isMajor = Number.isInteger(multiplier);
          
          return (
            <g key={multiplier}>
              <line 
                x1={px} y1="-5" 
                x2={px} y2="5" 
                stroke={isMajor ? "#cbd5e1" : "#e2e8f0"} 
                strokeWidth={isMajor ? 1.5 : 1}
              />
              {/* Degrees Label (Primary) */}
              <text 
                x={px} y="20" 
                textAnchor="middle" 
                fill={isMajor ? "#475569" : "#94a3b8"}
                fontWeight={isMajor ? "600" : "400"}
                fontSize="10"
              >
                {multiplier * 180}°
              </text>
              {/* Radian Label (Secondary) */}
              <text 
                x={px} y="32" 
                textAnchor="middle" 
                fill="#94a3b8" 
                fontSize="9"
              >
                {getRadianLabel(multiplier)}
              </text>
            </g>
          );
        })}

        {/* Ghost Curve (Full guide) */}
        <path 
           d={useMemo(() => {
             let d = "";
             for(let t=0; t<=maxTheta; t+=0.1) {
               const px = t * pixelsPerRadian;
               let py = 0;
               if(selectedFunc === TrigFunction.SIN) py = -Math.sin(t) * yScale;
               else if(selectedFunc === TrigFunction.COS) py = -Math.cos(t) * yScale;
               else {
                 const val = Math.tan(t);
                 if(Math.abs(val) > 4) continue;
                 py = -val * yScale;
               }
               if(Math.abs(py) > 200) continue; // clip
               d += (t===0 ? `M ${px} ${py}` : ` L ${px} ${py}`);
             }
             return d;
           }, [selectedFunc, maxTheta, pixelsPerRadian, yScale])}
           stroke="#f1f5f9"
           strokeWidth="2"
           fill="none"
        />

        {/* The Active Drawing Path */}
        <path
          d={pathData}
          stroke={config.color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Connection Line from Left Edge */}
        <line 
           x1="-50" y1={currentY} x2={tipX} y2={currentY}
           stroke={config.color} strokeWidth="1.5" strokeDasharray="4" opacity="0.5"
        />

        {/* Dynamic Value Label on Y-axis */}
        <g transform={`translate(-50, ${currentY})`}>
           <rect x="-30" y="-10" width="34" height="20" rx="4" fill={config.color} />
           <text 
             x="-13" y="0" dy="4" 
             textAnchor="middle" 
             fill="white" 
             fontSize="10" 
             fontWeight="bold"
             className="font-mono"
           >
             {formatTrigValue(currentValue)}
           </text>
           {/* Pointer triangle */}
           <path d="M 4 0 L -2 -4 L -2 4 Z" fill={config.color} transform="translate(0, 0)" />
        </g>

        {/* Current Tip Point */}
        <circle cx={tipX} cy={currentY} r="5" fill={config.color} stroke="white" strokeWidth="2" />
        
      </svg>
      
      <div className="mt-2 text-sm font-mono text-slate-600 font-medium">
        θ = {(angle * 180 / Math.PI).toFixed(1)}° ({angle.toFixed(2)} rad)
      </div>
    </div>
  );
};

export default WaveGraph;