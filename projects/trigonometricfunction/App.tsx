import React, { useState, useEffect, useRef, useCallback } from 'react';
import UnitCircle from './components/UnitCircle';
import WaveGraph from './components/WaveGraph';
import PhysicsDemo from './components/PhysicsDemo';
import { TrigFunction } from './types';
import { TRIG_CONFIGS } from './constants';
import { Play, Pause, RotateCcw, Info, Keyboard, Activity, Calculator } from 'lucide-react';

type Tab = 'visualization' | 'physics';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('visualization');
  const [angle, setAngle] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedFunc, setSelectedFunc] = useState<TrigFunction>(TrigFunction.SIN);
  
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      // Speed 1 = 1 radian per second approx
      setAngle(prevAngle => {
        let newAngle = prevAngle + (deltaTime * 0.001 * speed);
        // Keep angle bounded nicely for float precision if running long, 
        // but allow it to grow for wave history continuity if needed. 
        // 100PI is enough buffer.
        if (newAngle > 100 * Math.PI) {
           newAngle = newAngle % (2 * Math.PI); 
        }
        return newAngle;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  const handleReset = () => {
    setAngle(0);
    setIsPlaying(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAngle(parseFloat(e.target.value));
    setIsPlaying(false);
  };

  // Handle direct degree input
  const handleDegreeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const degrees = parseFloat(e.target.value);
    if (!isNaN(degrees)) {
      // Convert to radians
      setAngle((degrees * Math.PI) / 180);
      setIsPlaying(false);
    }
  };

  const activeConfig = TRIG_CONFIGS[selectedFunc];
  
  // Convert current angle to degrees for display/input
  const currentDegrees = Math.round(((angle % (2*Math.PI)) * 180) / Math.PI);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      
      {/* Header & Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-3 md:py-0 gap-4">
            
            {/* Logo / Title */}
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Activity size={20} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-600">
                TrigMaster
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('visualization')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'visualization'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Calculator size={16} />
                三角函数可视化
              </button>
              <button
                onClick={() => setActiveTab('physics')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'physics'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Activity size={16} />
                物理应用
              </button>
            </nav>

            {/* Function Select (Only visible in Visualization tab, or global?) 
                Let's keep it global or hidden depending on context. 
                For simplicity, only show function selector in Math mode.
            */}
            <div className={`${activeTab === 'visualization' ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200 flex gap-1`}>
               {(Object.keys(TRIG_CONFIGS) as TrigFunction[]).map((func) => (
                <button
                  key={func}
                  onClick={() => setSelectedFunc(func)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all duration-200 border ${
                    selectedFunc === func
                      ? 'bg-slate-50 text-slate-900 border-slate-200'
                      : 'text-slate-400 border-transparent hover:bg-slate-50'
                  }`}
                  style={{
                    borderColor: selectedFunc === func ? TRIG_CONFIGS[func].color : undefined,
                    color: selectedFunc === func ? TRIG_CONFIGS[func].color : undefined
                  }}
                >
                  {func}
                </button>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {activeTab === 'visualization' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left: Unit Circle */}
            <div className="flex flex-col gap-4">
              <UnitCircle angle={angle} selectedFunc={selectedFunc} />
              
              {/* Explanation Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">
                      {activeConfig.label}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {activeConfig.description}
                    </p>
                    <div className="mt-3 text-xs text-slate-400">
                      提示：观察左侧单位圆上的彩色线条是如何随角度 θ 变化，并投影到右侧生成函数图像的。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Wave Graph */}
            <div className="flex flex-col gap-4">
              <WaveGraph angle={angle} selectedFunc={selectedFunc} />
              
              {/* Controls */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col gap-6">
                    
                    {/* Angle Inputs Group */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">角度控制</span>
                        
                        {/* Degree Input Field */}
                        <div className="flex items-center gap-2">
                          <Keyboard size={14} className="text-slate-400"/>
                          <label className="text-sm text-slate-600 font-medium">输入角度:</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={currentDegrees}
                              onChange={handleDegreeInput}
                              className="w-20 px-2 py-1 text-right text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                            <span className="absolute right-6 top-1 text-slate-400 pointer-events-none">°</span>
                          </div>
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="relative pt-1">
                        <input
                          type="range"
                          min="0"
                          max={4 * Math.PI}
                          step="0.01"
                          value={angle % (4 * Math.PI)} // Keep slider bound locally visual
                          onChange={handleSliderChange}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                          <span>0°</span>
                          <span>360° (2π)</span>
                          <span>720° (4π)</span>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Playback Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                            isPlaying 
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                          }`}
                        >
                          {isPlaying ? <><Pause size={18} /> 暂停</> : <><Play size={18} /> 演示</>}
                        </button>

                        <button
                          onClick={handleReset}
                          className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Reset Angle"
                        >
                          <RotateCcw size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">速度</span>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          {[0.5, 1, 2].map((s) => (
                            <button
                              key={s}
                              onClick={() => setSpeed(s)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                speed === s 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'physics' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <PhysicsDemo 
              angle={angle} 
              onAngleChange={setAngle}
              isPlaying={isPlaying} 
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            
            {/* Detailed Explanation for Physics */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-3">简谐运动与匀速圆周运动</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    简谐运动 (SHM) 可以看作是匀速圆周运动在一条直径上的投影。
                    <br/><br/>
                    当一个质点在圆周上以恒定角速度 ω 转动时，它在 Y 轴上的投影位置 $y$ 随时间 $t$ 的变化规律就是正弦函数：
                    <br/>
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono mt-2 block w-fit">y = A sin(ωt)</code>
                  </p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-3">现实中的应用</h3>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                    <li><strong>弹簧振子：</strong> 如左图所示，理想弹簧挂重物的振动。</li>
                    <li><strong>单摆：</strong> 在小角度摆动下，单摆的运动近似为简谐运动。</li>
                    <li><strong>交流电：</strong> 家庭电路中的电流和电压随时间按正弦规律变化。</li>
                    <li><strong>声波：</strong> 纯音也是一种正弦波形式的振动。</li>
                  </ul>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;