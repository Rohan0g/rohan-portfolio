import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('BOOTING CORE ENGINE...');
  const [exiting, setExiting] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated but don't re-run the effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 1;
      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current > 15 && current < 40) {
        setLoadingText('INITIALIZING QUANTUM SHADERS...');
      } else if (current >= 40 && current < 65) {
        setLoadingText('ESTABLISHING MONGODB SYNC...');
      } else if (current >= 65 && current < 85) {
        setLoadingText('LOADING 3D PARALLAX DESK ENVIRONMENT...');
      } else if (current >= 85 && current < 100) {
        setLoadingText('OPTIMIZING LIGHTHOUSE PERFORMANCE MATRIX...');
      } else if (current >= 100) {
        setLoadingText('SYSTEM READY.');
        clearInterval(interval);
        // Start exit sequence
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            onCompleteRef.current?.();
          }, 900);
        }, 600);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []); // Stable — no deps

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={exiting ? { y: '-100%' } : { y: 0 }}
      transition={exiting ? { duration: 0.8, ease: [0.76, 0, 0.24, 1] } : {}}
      className="fixed inset-0 bg-[#030712] z-[99999] flex flex-col items-center justify-center select-none"
    >
      {/* Animated Tech Grid background */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      {/* Top subtle light bloom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }} />

      {/* Central Logo and Loading Ring */}
      <div className="relative flex flex-col items-center text-center px-4">
        
        {/* Glowing Logo Frame */}
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          {/* Spinning Ring */}
          <svg className="absolute w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="72"
              cy="72"
              r="66"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="2"
            />
            <circle
              cx="72"
              cy="72"
              r="66"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3"
              strokeDasharray="415"
              strokeDashoffset={415 - (415 * progress) / 100}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))',
                transition: 'stroke-dashoffset 0.1s ease',
              }}
            />
          </svg>

          {/* NEXORITH Symbol inside loader */}
          <div className="flex flex-col items-center justify-center z-10">
            <span 
              className="text-4xl font-extrabold tracking-widest font-sans"
              style={{ 
                color: '#fff',
                textShadow: '0 0 20px rgba(6, 182, 212, 0.6)',
                fontFamily: 'Outfit, Inter, sans-serif',
              }}
            >
              N
            </span>
            <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: '#06B6D4', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          </div>
        </div>

        {/* Glowing Text Logo: NEXORITH */}
        <h2 
          className="text-2xl font-black tracking-[0.4em] mb-2 glitch-text"
          data-text="NEXORITH"
          style={{ color: '#fff', fontFamily: 'Outfit, Inter, sans-serif' }}
        >
          NEXORITH
        </h2>
        
        {/* Subtext */}
        <div className="h-4 flex items-center justify-center">
          <span 
            className="text-[10px] tracking-widest uppercase"
            style={{ 
              color: '#06B6D4', 
              opacity: 0.8,
              fontFamily: 'monospace',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          >
            {loadingText}
          </span>
        </div>

        {/* Loading Percentage with Gold Glint */}
        <div className="mt-12">
          <span 
            className="text-7xl font-light"
            style={{ 
              color: '#fff', 
              fontFamily: 'Outfit, Inter, sans-serif',
              fontFeatureSettings: '"tnum"',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {progress}
          </span>
          <span className="text-xl font-medium ml-1" style={{ color: '#FFD700', fontFamily: 'monospace' }}>%</span>
        </div>

        {/* Futuristic energy pulse bar */}
        <div className="w-64 h-[2px] rounded-full mt-6 overflow-hidden relative" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <div 
            className="h-full transition-all duration-100 ease-out" 
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(to right, #3B82F6, #06B6D4, #7C3AED)',
            }}
          />
        </div>

        {/* Micro details */}
        <div className="mt-16 flex items-center gap-6 text-[9px] tracking-wider" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
          <span>LOC: IN_DELHI_NCR</span>
          <span>VER: 2.0.7</span>
          <span>PING: 14MS</span>
        </div>
      </div>

      {/* Lower corner status indicators */}
      <div className="absolute bottom-6 left-6 text-[9px] hidden md:block" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
        <span>STABLE CONNECTION // SECURE SEC_TLS_1.3</span>
      </div>
      <div className="absolute bottom-6 right-6 text-[9px] hidden md:block" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
        <span>© NEXORITH IT SOLUTIONS</span>
      </div>
    </motion.div>
  );
}
