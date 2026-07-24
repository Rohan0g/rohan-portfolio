import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiMessageSquare, FiCompass, FiBriefcase, FiLayers, FiRadio } from 'react-icons/fi';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [ping, setPing] = useState(12);

  useEffect(() => {
    // Dynamic India Local Time (IST)
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Randomize ping slightly to simulate live API health checks
    const pingInterval = setInterval(() => {
      setPing(Math.floor(Math.random() * 8) + 8);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { name: 'Explore', icon: <FiCompass />, href: '#hero' },
    { name: 'Story', icon: <FiLayers />, href: '#about' },
    { name: 'Projects', icon: <FiBriefcase />, href: '#projects' },
    { name: 'Contact', icon: <FiMessageSquare />, href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/70 backdrop-blur-md border-b border-white/5 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-purple p-[1px] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-background rounded-[7px] flex items-center justify-center font-display font-black text-sm group-hover:text-accent-cyan transition-colors">
              R
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider font-display text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-blue transition-all duration-300">
              ROHAN PATTNAIK
            </span>
            <span className="text-[9px] font-mono text-accent-cyan tracking-widest leading-none">
              NEXORITH FOUNDER
            </span>
          </div>
        </a>

        {/* Navigation - Middle */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 rounded-full p-1.5 backdrop-blur-lg">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Live Status Indicators - Right */}
        <div className="flex items-center gap-6 text-xs font-mono">
          {/* IST Time */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] text-white/40 leading-none">LOCAL TIME (IST)</span>
            <span className="text-white font-medium mt-1 tracking-wider">{time || '00:00:00'}</span>
          </div>

          {/* API Node Status */}
          <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
            <FiRadio className="text-green-400 animate-pulse" />
            <span className="text-[10px] font-bold text-green-400">API ACTIVE</span>
            <span className="text-[9px] text-white/30">| {ping}ms</span>
          </div>
        </div>

      </div>
    </motion.header>
  );
}
