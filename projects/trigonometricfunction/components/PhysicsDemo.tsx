import React, { useState, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PhysicsDemoProps {
  angle: number; // current phase/time
  onAngleChange: (newAngle: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
}

const PhysicsDemo: React.FC<PhysicsDemoProps> = ({ 
  angle,
  onAngleChange,
  isPlaying, 
  onTogglePlay, 
  onReset,
}) => {
  // Visualization States
  const [showDisplacement, setShowDisplacement] = useState(true);
  const [showForce, setShowForce] = useState(true); // Force & Acceleration
  const [showVelocity, setShowVelocity] = useState(false);

  // Dragging State for the Graphs
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);

  // --- Shared Physics Constants ---
  const amplitude = 80; // Pixels max displacement
  // We use the same 'angle' for all demos to show synchronization.
  
  // Sine/Cos values for the current frame
  const sinVal = Math.sin(angle);
  const cosVal = Math.cos(angle);


  // ==========================================
  // Shared Graph Logic
  // ==========================================
  const demoWidth = 750;
  const demoHeight = 300;
  const centerY = demoHeight / 2;
  
  // Graph area definitions
  const graphXStart = 300;
  const graphWidth = 400;
  const range = 2.5 * Math.PI; 
  const pixelsPerRad = graphWidth / range;

  // Helper to generate SVG paths for graphs
  // func: returns the normalized value (-1 to 1) or scaled value
  // scale: the pixel amplitude
  const generateGraphPath = (func: (phase: number) => number, scale: number, invertY: boolean = true) => {
    let d = "";
    const resolution = 0.1;
    for (let t = 0; t <= range; t += resolution) {
       const phase = angle - t; 
       const val = func(phase); 
       // SVG Y increases downwards. 
       // invertY: true means positive val goes UP (subtract from centerY)
       const y = centerY - (val * scale * (invertY ? 1 : -1)); 
       const x = graphXStart + graphWidth - (t * pixelsPerRad);
       
       if (x < graphXStart) break;
       if (t === 0) d = `M ${x} ${y}`;
       else d += ` L ${x} ${y}`;
    }
    return d;
  };

  // --- Interaction Handlers ---
  const handleGraphMouseDown = (e: React.MouseEvent) => {
    if(isPlaying) onTogglePlay();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = angle;
    document.body.style.cursor = 'ew-resize';
  };
  const handleGraphMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    onAngleChange(dragStartAngleRef.current + deltaX / pixelsPerRad);
  };
  const handleGraphMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
  };
  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
    }
  };

  // ==========================================
  // 1. Spring Mass System (SHM)
  // ==========================================
  // Physics: y = A sin(t)
  const shmDisplacement = sinVal * amplitude; 
  const shmY = centerY - shmDisplacement;
  const springTop = 40;
  const springBottom = shmY - 15;
  
  const springPath = useMemo(() => {
    const segments = 12;
    const totalLen = springBottom - springTop;
    const segmentLen = totalLen / segments;
    let d = `M 100 ${springTop}`;
    for (let i = 1; i <= segments; i++) {
      const x = i % 2 === 0 ? 100 - 10 : 100 + 10; 
      const y = springTop + i * segmentLen;
      d += ` L ${x} ${y}`;
    }
    d += ` L 100 ${springBottom}`; 
    return d;
  }, [springBottom, springTop]);

  const shmDispPath = useMemo(() => generateGraphPath(Math.sin, amplitude), [angle]);
  const shmVelPath = useMemo(() => generateGraphPath(Math.cos, amplitude * 0.6), [angle]); // velocity scaled down visually
  const shmAccPath = useMemo(() => generateGraphPath(p => -Math.sin(p), amplitude * 0.6), [angle]);

  // ==========================================
  // 2. Uniform Circular Motion (UCM)
  // ==========================================
  const ucmRadius = 70;
  const ucmCx = 130;
  const ucmCy = centerY;
  // Particle pos
  const ucmPx = ucmCx + ucmRadius * Math.cos(angle);
  const ucmPy = ucmCy - ucmRadius * Math.sin(angle); // SVG Y flip
  
  // Wave Graph for UCM: We plot the Y-projection (Height) vs Time
  // Height = R sin(t).
  const ucmGraphPath = useMemo(() => generateGraphPath(Math.sin, ucmRadius), [angle, ucmRadius]);


  // ==========================================
  // 3. Simple Pendulum
  // ==========================================
  const penLength = 160;
  const penOriginX = 130;
  const penOriginY = 50;
  const maxTheta = 25 * (Math.PI / 180);
  const penTheta = maxTheta * Math.sin(angle);
  const penBobX = penOriginX + penLength * Math.sin(penTheta);
  const penBobY = penOriginY + penLength * Math.cos(penTheta);

  // Wave Graph for Pendulum: We plot Horizontal Displacement (or Theta) vs Time
  // Displacement x approx L * theta = L * A * sin(t)
  // We map "Right" swing (+x) to "Up" graph (+y) for visual clarity of the sine wave.
  const penGraphPath = useMemo(() => generateGraphPath(Math.sin, amplitude), [angle]);


  // --- Reusable Axis Component ---
  const GraphAxes = ({ labelY = "y" }: { labelY?: string }) => (
    <g pointerEvents="none">
      {/* X Axis (Time) */}
      <line x1={graphXStart} y1={centerY} x2={graphXStart + graphWidth} y2={centerY} stroke="#cbd5e1" strokeWidth="1" />
      <text x={graphXStart + graphWidth + 10} y={centerY + 4} fontSize="12" fill="#94a3b8" fontStyle="italic">t</text>
      
      {/* Y Axis */}
      <line x1={graphXStart} y1={40} x2={graphXStart} y2={260} stroke="#cbd5e1" strokeWidth="1" />
      <text x={graphXStart} y={30} fontSize="12" textAnchor="middle" fill="#94a3b8" fontStyle="italic">{labelY}</text>
    </g>
  );


  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* --- Main Controls Header --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-20 z-20">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">物理实验室</h2>
              <p className="text-slate-500 text-sm mt-1">
                所有系统共享同一时间变量 <span className="font-mono bg-slate-100 px-1 rounded text-indigo-600">t (θ)</span>，拖拽任意图表即可调整时间。
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               {/* Toggles */}
               <div className="flex gap-2 mr-4 border-r border-slate-200 pr-4">
                  <button 
                    onClick={() => setShowDisplacement(!showDisplacement)}
                    className={`text-xs px-2 py-1 rounded border ${showDisplacement ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-transparent text-slate-400'}`}
                  >
                    位移 x
                  </button>
                  <button 
                    onClick={() => setShowVelocity(!showVelocity)}
                    className={`text-xs px-2 py-1 rounded border ${showVelocity ? 'bg-sky-50 border-sky-200 text-sky-700' : 'border-transparent text-slate-400'}`}
                  >
                    速度 v
                  </button>
                  <button 
                    onClick={() => setShowForce(!showForce)}
                    className={`text-xs px-2 py-1 rounded border ${showForce ? 'bg-rose-50 border-rose-200 text-rose-700' : 'border-transparent text-slate-400'}`}
                  >
                    加速度 a
                  </button>
               </div>

                <button
                  onClick={onTogglePlay}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-colors ${isPlaying ? 'bg-amber-100 text-amber-700' : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'}`}
                >
                  {isPlaying ? <><Pause size={16}/> 暂停</> : <><Play size={16}/> 开始演示</>}
                </button>
                <button onClick={onReset} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                   <RotateCcw size={18} />
                </button>
            </div>
         </div>
      </div>

      {/* Definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <marker id="arrow-force" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#f43f5e"/></marker>
          <marker id="arrow-vel" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0ea5e9"/></marker>
          <marker id="arrow-disp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#10b981"/></marker>
          <marker id="arrow-gravity" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#94a3b8"/></marker>
        </defs>
      </svg>

      {/* ======================================================== */}
      {/* DEMO 1: SHM */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
           <h3 className="font-bold text-slate-700 flex items-center gap-2">
             <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-xs">1</span>
             简谐运动 (弹簧振子)
           </h3>
           <span className="text-xs text-slate-400 font-mono">y(t) = A sin(ωt)</span>
        </div>
        
        <div className="relative flex justify-center overflow-hidden bg-slate-50/30">
          <svg 
            width="100%" height={demoHeight} viewBox={`0 0 ${demoWidth} ${demoHeight}`} 
            className="max-w-[800px] select-none cursor-ew-resize"
            onMouseMove={handleGraphMouseMove}
            onMouseDown={handleGraphMouseDown}
            onMouseUp={handleGraphMouseUp}
            onMouseLeave={handleMouseLeave}
          >
             <rect width="100%" height="100%" fill="transparent" /> {/* Hit area */}

             {/* --- Left: Spring System --- */}
             <line x1="60" y1={springTop} x2="140" y2={springTop} stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
             <path d={springPath} stroke="#64748b" strokeWidth="2" fill="none" pointerEvents="none"/>
             <line x1="40" y1={centerY} x2="160" y2={centerY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
             
             {/* Mass */}
             <circle cx="100" cy={shmY} r="20" fill="white" stroke="#334155" strokeWidth="2.5" pointerEvents="none"/>
             <text x="100" y={shmY} dy="4" textAnchor="middle" className="text-[10px] font-bold fill-slate-600 pointer-events-none">m</text>

             {/* Vectors */}
             {showDisplacement && Math.abs(shmDisplacement) > 2 && <line x1="80" y1={centerY} x2="80" y2={shmY} stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-disp)"/>}
             {showForce && Math.abs(shmDisplacement) > 2 && <line x1="120" y1={shmY} x2="120" y2={shmY - (-shmDisplacement * 0.8)} stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-force)"/>}
             {showVelocity && Math.abs(cosVal) > 0.1 && <line x1="100" y1={shmY} x2="100" y2={shmY - (cosVal * 50)} stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#arrow-vel)"/>}

             {/* --- Right: Graph --- */}
             <GraphAxes labelY="y" />
             <line x1={130} y1={shmY} x2={graphXStart+graphWidth} y2={shmY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" pointerEvents="none"/>

             {showDisplacement && <path d={shmDispPath} stroke="#10b981" strokeWidth="2" fill="none" pointerEvents="none"/>}
             {showVelocity && <path d={shmVelPath} stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" fill="none" pointerEvents="none"/>}
             {showForce && <path d={shmAccPath} stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" fill="none" pointerEvents="none"/>}

             <g transform={`translate(${graphXStart+graphWidth}, 0)`} pointerEvents="none">
                {showDisplacement && <circle cy={shmY} r="4" fill="#10b981"/>}
             </g>
          </svg>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DEMO 2: UCM */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
           <h3 className="font-bold text-slate-700 flex items-center gap-2">
             <span className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded flex items-center justify-center text-xs">2</span>
             匀速圆周运动
           </h3>
           <span className="text-xs text-slate-400 font-mono">y投影 = R sin(θ)</span>
        </div>
        <div className="relative flex justify-center overflow-hidden bg-slate-50/30">
            <svg 
              width="100%" height={demoHeight} viewBox={`0 0 ${demoWidth} ${demoHeight}`} 
              className="max-w-[800px] select-none cursor-ew-resize"
              onMouseMove={handleGraphMouseMove}
              onMouseDown={handleGraphMouseDown}
              onMouseUp={handleGraphMouseUp}
              onMouseLeave={handleMouseLeave}
            >
                <rect width="100%" height="100%" fill="transparent" />

                {/* Axes for Circle */}
                <line x1={ucmCx - 90} y1={ucmCy} x2={ucmCx + 90} y2={ucmCy} stroke="#e2e8f0" strokeWidth="1"/>
                <line x1={ucmCx} y1={ucmCy - 90} x2={ucmCx} y2={ucmCy + 90} stroke="#e2e8f0" strokeWidth="1"/>
                
                {/* Circle */}
                <circle cx={ucmCx} cy={ucmCy} r={ucmRadius} stroke="#cbd5e1" strokeWidth="1" fill="none" strokeDasharray="4"/>
                <line x1={ucmCx} y1={ucmCy} x2={ucmPx} y2={ucmPy} stroke="#94a3b8" strokeWidth="1.5"/>

                {/* Projection */}
                {showDisplacement && (
                  <line x1={ucmPx} y1={ucmPy} x2={ucmCx} y2={ucmPy} stroke="#10b981" strokeWidth="1" strokeDasharray="2"/>
                )}
                {showDisplacement && (
                  <line x1={ucmCx} y1={ucmCy} x2={ucmCx} y2={ucmPy} stroke="#10b981" strokeWidth="3" opacity="0.5"/>
                )}

                {/* Particle */}
                <circle cx={ucmPx} cy={ucmPy} r="8" fill="#334155"/>

                {/* Vectors */}
                {showVelocity && (
                  <line 
                    x1={ucmPx} y1={ucmPy} 
                    x2={ucmPx + (-Math.sin(angle) * 50)} 
                    y2={ucmPy + (-Math.cos(angle) * 50)} 
                    stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#arrow-vel)"
                  />
                )}
                {showForce && (
                  <line 
                    x1={ucmPx} y1={ucmPy} 
                    x2={ucmPx + (Math.cos(angle + Math.PI) * 50)} 
                    y2={ucmPy + (-Math.sin(angle + Math.PI) * 50)} 
                    stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-force)"
                  />
                )}

                {/* --- Right: Graph --- */}
                <GraphAxes labelY="y" />
                
                {/* Connection Line from Circle to Graph */}
                <line x1={ucmPx} y1={ucmPy} x2={graphXStart+graphWidth} y2={ucmPy} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" pointerEvents="none"/>

                {showDisplacement && <path d={ucmGraphPath} stroke="#10b981" strokeWidth="2" fill="none" pointerEvents="none"/>}

                <g transform={`translate(${graphXStart+graphWidth}, 0)`} pointerEvents="none">
                    {showDisplacement && <circle cy={ucmPy} r="4" fill="#10b981"/>}
                </g>
            </svg>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DEMO 3: Pendulum */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
               <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded flex items-center justify-center text-xs">3</span>
               单摆运动
             </h3>
             <span className="text-xs text-slate-400 font-mono">x(t) ≈ A sin(θ)</span>
        </div>
        <div className="relative flex justify-center overflow-hidden bg-slate-50/30">
             <svg 
               width="100%" height={demoHeight} viewBox={`0 0 ${demoWidth} ${demoHeight}`} 
               className="max-w-[800px] select-none cursor-ew-resize"
               onMouseMove={handleGraphMouseMove}
               onMouseDown={handleGraphMouseDown}
               onMouseUp={handleGraphMouseUp}
               onMouseLeave={handleMouseLeave}
             >
                <rect width="100%" height="100%" fill="transparent" />

                {/* Pendulum System */}
                <line x1={80} y1={penOriginY} x2={180} y2={penOriginY} stroke="#334155" strokeWidth="3" strokeLinecap="round"/>
                <line x1={penOriginX} y1={penOriginY} x2={penOriginX} y2={penOriginY + 220} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4"/>
                <line x1={penOriginX} y1={penOriginY} x2={penBobX} y2={penBobY} stroke="#64748b" strokeWidth="2"/>
                <circle cx={penBobX} cy={penBobY} r="12" fill="#f59e0b" stroke="#b45309" strokeWidth="2"/>

                {/* Vectors */}
                <line x1={penBobX} y1={penBobY} x2={penBobX} y2={penBobY + 40} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gravity)"/>
                {showForce && (
                  <line 
                    x1={penBobX} y1={penBobY} 
                    x2={penBobX - (Math.cos(penTheta) * 40 * Math.sign(penTheta))}
                    y2={penBobY + (Math.sin(Math.abs(penTheta)) * 40)}
                    stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-force)"
                  />
                )}
                
                {/* --- Right: Graph --- */}
                {/* Here we map Horizontal displacement to Graph Y-axis for comparison */}
                <GraphAxes labelY="x (位移)" />

                {showDisplacement && <path d={penGraphPath} stroke="#10b981" strokeWidth="2" fill="none" pointerEvents="none"/>}
                
                {/* Sync Point on Graph */}
                {/* Note: penGraphPath is generated based on sin(angle). 
                    Current val = sin(angle) * amplitude. 
                    Y pos = centerY - val. 
                */}
                <g transform={`translate(${graphXStart+graphWidth}, 0)`} pointerEvents="none">
                    {showDisplacement && <circle cy={centerY - sinVal * amplitude} r="4" fill="#10b981"/>}
                </g>
                
                {/* Visual connection hint (abstract) */}
                {showDisplacement && (
                  <path 
                    d={`M ${penBobX} ${penBobY} C ${penBobX + 50} ${penBobY}, ${graphXStart+graphWidth - 50} ${centerY - sinVal * amplitude}, ${graphXStart+graphWidth} ${centerY - sinVal * amplitude}`} 
                    stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2" fill="none" opacity="0.5" pointerEvents="none"
                  />
                )}

             </svg>
        </div>
      </section>

    </div>
  );
};

export default PhysicsDemo;