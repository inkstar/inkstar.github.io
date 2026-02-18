import React from 'react';
import { TrigFunction } from '../types';
import { CIRCLE_RADIUS, TRIG_CONFIGS } from '../constants';

interface UnitCircleProps {
  angle: number; // in radians
  selectedFunc: TrigFunction;
}

// Helper to format values like 0.707... to √2/2
export const formatTrigValue = (val: number): string => {
  const EPSILON = 0.005; // Tolerance for floating point comparisons
  const abs = Math.abs(val);
  const sign = val < -EPSILON ? '-' : ''; 

  // Handle large values (e.g. Tan near 90 degrees)
  if (abs > 100) return "∞ (未定义)";
  
  // 0
  if (Math.abs(abs - 0) < EPSILON) return "0";
  
  // 1/2 (Sin 30, Cos 60)
  if (Math.abs(abs - 0.5) < EPSILON) return `${sign}1/2`;
  
  // √2/2 (Sin 45, Cos 45) ~0.707
  if (Math.abs(abs - Math.sqrt(2)/2) < EPSILON) return `${sign}√2/2`;
  
  // √3/2 (Sin 60, Cos 30) ~0.866
  if (Math.abs(abs - Math.sqrt(3)/2) < EPSILON) return `${sign}√3/2`;
  
  // 1
  if (Math.abs(abs - 1) < EPSILON) return `${sign}1`;
  
  // √3 (Tan 60) ~1.732
  if (Math.abs(abs - Math.sqrt(3)) < EPSILON) return `${sign}√3`;
  
  // √3/3 (Tan 30) ~0.577
  if (Math.abs(abs - (Math.sqrt(3)/3)) < EPSILON) return `${sign}√3/3`;
  
  // Default to decimal
  return val.toFixed(2);
};

const UnitCircle: React.FC<UnitCircleProps> = ({ angle, selectedFunc }) => {
  // Calculate coordinates on the unit circle
  const x = Math.cos(angle) * CIRCLE_RADIUS;
  const y = -Math.sin(angle) * CIRCLE_RADIUS; // SVG y is down, so flip sin
  
  const config = TRIG_CONFIGS[selectedFunc];

  // Tan specific calculations
  let tanX = 0;
  let tanY = 0;
  const cosVal = Math.cos(angle);
  const isTanDefined = Math.abs(cosVal) > 0.001;
  
  if (selectedFunc === TrigFunction.TAN && isTanDefined) {
    // Tangent line is at x = 1 (right side) or x = -1 (left side) depending on definition
    // Usually visualized at x=1 for geometric definition
    tanX = CIRCLE_RADIUS; 
    tanY = -Math.tan(angle) * CIRCLE_RADIUS;
  }

  // Calculate Label Positions
  // For Point P, we push it slightly outside the radius
  const labelOffsetMultiplier = 1.15;
  const pLabelX = x * labelOffsetMultiplier;
  const pLabelY = y * labelOffsetMultiplier;

  return (
    <div className="relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
      <h3 className="absolute top-4 left-4 text-slate-500 font-medium text-sm">单位圆定义</h3>
      <svg
        width="100%"
        height="100%"
        viewBox="-200 -200 400 400"
        className="max-w-[350px] max-h-[350px] overflow-visible"
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

        {/* Grid/Axes */}
        {/* X Axis */}
        <line 
            x1="-190" y1="0" 
            x2="190" y2="0" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            markerEnd="url(#arrow)" 
        />
        <text x="195" y="4" className="text-xs text-slate-400 fill-slate-400 font-serif italic">x</text>

        {/* X Axis Ticks & Labels (1, -1) */}
        <line x1={CIRCLE_RADIUS} y1="-4" x2={CIRCLE_RADIUS} y2="4" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x={CIRCLE_RADIUS} y="18" textAnchor="middle" className="text-[10px] text-slate-400 fill-slate-400">1</text>
        
        <line x1={-CIRCLE_RADIUS} y1="-4" x2={-CIRCLE_RADIUS} y2="4" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x={-CIRCLE_RADIUS} y="18" textAnchor="middle" className="text-[10px] text-slate-400 fill-slate-400">-1</text>

        {/* Y Axis */}
        <line 
            x1="0" y1="190" 
            x2="0" y2="-190" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            markerEnd="url(#arrow)" 
        />
        <text x="4" y="-195" className="text-xs text-slate-400 fill-slate-400 font-serif italic">y</text>

        {/* Y Axis Ticks & Labels (1, -1) */}
        {/* Note: SVG Y is down. -CIRCLE_RADIUS is UP (1), CIRCLE_RADIUS is DOWN (-1) */}
        <line x1="-4" y1={-CIRCLE_RADIUS} x2="4" y2={-CIRCLE_RADIUS} stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="10" y={-CIRCLE_RADIUS + 3} className="text-[10px] text-slate-400 fill-slate-400">1</text>

        <line x1="-4" y1={CIRCLE_RADIUS} x2="4" y2={CIRCLE_RADIUS} stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="10" y={CIRCLE_RADIUS + 3} className="text-[10px] text-slate-400 fill-slate-400">-1</text>
        
        {/* The Unit Circle */}
        <circle cx="0" cy="0" r={CIRCLE_RADIUS} stroke="#94a3b8" strokeWidth="2" fill="none" />

        {/* Angle Arc */}
        <path
          d={`M ${CIRCLE_RADIUS * 0.2} 0 A ${CIRCLE_RADIUS * 0.2} ${CIRCLE_RADIUS * 0.2} 0 ${angle > Math.PI ? 1 : 0} 0 ${Math.cos(angle) * CIRCLE_RADIUS * 0.2} ${-Math.sin(angle) * CIRCLE_RADIUS * 0.2}`}
          fill="rgba(79, 70, 229, 0.1)"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        <text x="15" y="-15" fill="#4f46e5" fontSize="12" fontWeight="600">θ</text>

        {/* Radius Line */}
        <line x1="0" y1="0" x2={x} y2={y} stroke="#334155" strokeWidth="2" />

        {/* SIN Visualization */}
        {selectedFunc === TrigFunction.SIN && (
          <>
            {/* Vertical leg (Sin value) */}
            <line 
              x1={x} y1={0} x2={x} y2={y} 
              stroke={config.color} strokeWidth="3" 
            />
            {/* Connecting line to graph (to the right) */}
            <line 
              x1={x} y1={y} x2="200" y2={y} 
              stroke={config.color} strokeWidth="1.5" strokeDasharray="4" opacity="0.5" 
            />
            <circle cx={x} cy={y} r="4" fill={config.color} />
          </>
        )}

        {/* COS Visualization */}
        {selectedFunc === TrigFunction.COS && (
          <>
            {/* Horizontal leg (Cos value) */}
            <line 
              x1={0} y1={0} x2={x} y2={0} 
              stroke={config.color} strokeWidth="3" 
            />
             {/* Visual aid to show projection */}
            <line 
              x1={x} y1={0} x2={x} y2={y} 
              stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3" 
            />
            <circle cx={x} cy={0} r="4" fill={config.color} />
          </>
        )}

        {/* TAN Visualization */}
        {selectedFunc === TrigFunction.TAN && isTanDefined && (
          <>
             {/* Tangent Line at x=1 */}
             <line x1={CIRCLE_RADIUS} y1="-200" x2={CIRCLE_RADIUS} y2="200" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4" />
             
             {/* Radius Extension */}
             {/* We need to draw the full line from origin to the tangent intersection */}
             <line 
              x1="0" y1="0" x2={tanX} y2={tanY} 
              stroke="#94a3b8" strokeWidth="1" opacity="0.5"
             />

             {/* The Tangent Segment (Height on the tangent line) */}
             <line 
              x1={CIRCLE_RADIUS} y1={0} x2={tanX} y2={tanY} 
              stroke={config.color} strokeWidth="3" 
             />
             {/* Project to right */}
             <line 
              x1={tanX} y1={tanY} x2="200" y2={tanY} 
              stroke={config.color} strokeWidth="1.5" strokeDasharray="4" opacity="0.5"
             />
             <circle cx={tanX} cy={tanY} r="4" fill={config.color} />
          </>
        )}
        
        {/* Point on Circle */}
        <circle cx={x} cy={y} r="4" fill="#1e293b" stroke="white" strokeWidth="1.5" />

        {/* --- VERTEX LABELS (Added) --- */}
        
        {/* Origin O */}
        <text 
          x="-12" y="12" 
          className="text-sm font-bold fill-slate-500 font-serif italic pointer-events-none"
        >
          O
        </text>

        {(selectedFunc === TrigFunction.SIN || selectedFunc === TrigFunction.COS) && (
          <>
            {/* P: Point on Circle */}
            <text 
              x={pLabelX} 
              y={pLabelY} 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="text-sm font-bold fill-indigo-700 font-serif italic pointer-events-none"
            >
              P
            </text>
            
            {/* M: Projection on X-Axis */}
            <text 
              x={x} 
              y="18" 
              textAnchor="middle" 
              className="text-sm font-bold fill-indigo-700 font-serif italic pointer-events-none"
            >
              M
            </text>
          </>
        )}

        {selectedFunc === TrigFunction.TAN && isTanDefined && (
           <>
             {/* A: Point on X-Axis (1,0) */}
             <text 
               x={tanX + 8} 
               y="18" 
               textAnchor="start" 
               className="text-sm font-bold fill-indigo-700 font-serif italic pointer-events-none"
             >
               A
             </text>
             
             {/* T: Tangent Point */}
             <text 
               x={tanX + 8} 
               y={tanY} 
               textAnchor="start" 
               dominantBaseline="middle"
               className="text-sm font-bold fill-indigo-700 font-serif italic pointer-events-none"
             >
               T
             </text>
           </>
        )}
        
      </svg>
      
      {/* Value Display */}
      <div className="mt-4 w-full text-center">
         <div className="inline-block px-6 py-2 bg-slate-50 border border-slate-200 rounded-lg text-lg font-mono text-slate-700 font-bold shadow-sm">
          {selectedFunc === TrigFunction.SIN && `sin(θ) = ${formatTrigValue(Math.sin(angle))}`}
          {selectedFunc === TrigFunction.COS && `cos(θ) = ${formatTrigValue(Math.cos(angle))}`}
          {selectedFunc === TrigFunction.TAN && `tan(θ) = ${formatTrigValue(Math.tan(angle))}`}
         </div>
      </div>
    </div>
  );
};

export default UnitCircle;