import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { sound } from '../utils/audio';
import { CandlestickMotionBackground } from './CandlestickMotionBackground';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    // If the actual browser screen is small (mobile device), default to full screen
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsPhoneFrameMode(false);
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMode = (frame: boolean) => {
    sound.playTap();
    setIsPhoneFrameMode(frame);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Trading Candlesticks Moving Motion */}
      <CandlestickMotionBackground />

      {/* Background Animated Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[15%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[140px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Mode Switcher Floating Pill (Visible on Desktop / Tablets) */}
      <div className="sticky top-2 z-50 mb-2 mt-2 px-3 py-1.5 rounded-full ios-glass flex items-center gap-2 border border-white/10 shadow-xl hidden md:flex">
        <button
          onClick={() => toggleMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            isPhoneFrameMode
              ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          قاب آیفون ۱۶ پرو
        </button>
        <button
          onClick={() => toggleMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            !isPhoneFrameMode
              ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          نمای تمام صفحه
        </button>
      </div>

      {isPhoneFrameMode ? (
        /* iPhone 16 Pro Titanium Chassis */
        <div className="relative my-4 pb-10 z-10">
          {/* External Hardware Buttons Simulators */}
          {/* Action Button & Volume Up/Down on Left */}
          <div className="absolute -left-[5px] top-[115px] w-[5px] h-[30px] bg-[#222834] rounded-l-md border-l border-white/20 shadow-sm" />
          <div className="absolute -left-[5px] top-[165px] w-[5px] h-[56px] bg-[#222834] rounded-l-md border-l border-white/20 shadow-sm" />
          <div className="absolute -left-[5px] top-[235px] w-[5px] h-[56px] bg-[#222834] rounded-l-md border-l border-white/20 shadow-sm" />

          {/* Power Button & Camera Control on Right */}
          <div className="absolute -right-[5px] top-[180px] w-[5px] h-[80px] bg-[#222834] rounded-r-md border-r border-white/20 shadow-sm" />
          <div className="absolute -right-[5px] top-[300px] w-[5px] h-[48px] bg-[#222834] rounded-r-md border-r border-white/20 shadow-sm opacity-80" />

          {/* Outer Titanium Frame */}
          <div className="w-[395px] h-[844px] rounded-[55px] p-[10px] bg-gradient-to-b from-[#2b3342] via-[#1a202c] to-[#252c3a] shadow-[0_25px_70px_rgba(0,0,0,0.8),_0_0_0_2px_rgba(255,255,255,0.08),_inset_0_0_0_2px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-white/10">
            {/* Screen Inner Bezel */}
            <div className="w-full h-full bg-[#0a0d14]/92 rounded-[46px] overflow-hidden flex flex-col relative border border-black shadow-inner">
              {/* Candlestick Motion Background INSIDE the iPhone Screen */}
              <CandlestickMotionBackground insideFrame={true} />
              
              {/* iOS System Status Bar */}
              <div className="h-[46px] w-full px-7 flex items-center justify-between text-white text-[13px] font-semibold tracking-tight select-none z-30 pt-1 shrink-0" dir="ltr">
                <span className="font-mono font-medium pl-1 text-[13px]">{currentTime}</span>
                <div className="flex items-center gap-2 pr-1 text-slate-200">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <Battery className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Main Content Viewport */}
              <div className="flex-1 overflow-y-auto ios-scrollbar relative flex flex-col z-10">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="h-6 w-full flex items-center justify-center pointer-events-none shrink-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                <div className="w-36 h-1 bg-white/40 rounded-full" />
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen View (Native Mobile & Direct Browser View) */
        <div className="w-full max-w-[430px] min-h-screen flex flex-col relative z-10 shadow-2xl bg-[#0a0d14]/92 border-x border-white/5 overflow-hidden">
          {/* Candlestick Motion Background INSIDE Mobile Screen */}
          <CandlestickMotionBackground insideFrame={true} />

          {/* Native Top Safe Space */}
          <div className="h-2 w-full shrink-0 relative z-10" />
          
          <div className="flex-1 flex flex-col relative z-10">
            {children}
          </div>

          {/* iOS Bottom Home Bar */}
          <div className="h-6 w-full flex items-center justify-center pointer-events-none shrink-0 z-40 relative">
            <div className="w-32 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};
