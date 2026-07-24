import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiCompass, FiBriefcase, FiLayers, FiRadio, FiMenu, FiX, FiArrowRight } from 'react-icons/fi';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [ping, setPing] = useState(12);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Dynamic IST Time
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
      setScrolled(window.scrollY > 30);

      // Active section spy
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

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
    { name: 'Explore', id: 'hero', icon: <FiCompass />, href: '#hero' },
    { name: 'Story', id: 'about', icon: <FiLayers />, href: '#about' },
    { name: 'Projects', id: 'projects', icon: <FiBriefcase />, href: '#projects' },
    { name: 'Contact', id: 'contact', icon: <FiMessageSquare />, href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-background/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#hero" onClick={() => handleNavClick('#hero')} className="flex items-center gap-2.5 sm:gap-3.5 group min-h-[48px] py-1">
            <img 
              src="/nexorith-logo.png" 
              alt="Nexorith Logo" 
              className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-wider font-display text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-blue transition-all duration-300">
                ROHAN PATTNAIK
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-accent-cyan tracking-widest leading-none">
                NEXORITH CO-FOUNDER
              </span>
            </div>
          </a>

          {/* Navigation - Desktop Center */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-xl shadow-lg">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 min-h-[38px] ${
                    isActive 
                      ? 'bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple text-white shadow-glow-cyan font-bold' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Header Area: Live Status & Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
            {/* IST Time */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] text-white/40 leading-none">LOCAL TIME (IST)</span>
              <span className="text-white font-medium mt-1 tracking-wider">{time || '00:00:00'}</span>
            </div>

            {/* API Node Status */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/10">
              <FiRadio className="text-green-400 animate-pulse" />
              <span className="text-[9px] font-bold text-green-400">API ACTIVE</span>
              <span className="text-[9px] text-white/30">| {ping}ms</span>
            </div>

            {/* Mobile Hamburger Button (Min 48x48px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden flex items-center justify-center min-w-[48px] min-h-[48px] rounded-xl bg-white/5 border border-white/10 text-white hover:text-accent-cyan active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Full-Screen Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-2xl pt-24 px-6 pb-12 flex flex-col justify-between md:hidden border-b border-white/10"
          >
            {/* Background cyber grid */}
            <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

            <div className="flex flex-col gap-4 relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-accent-cyan uppercase mb-2">
                SYSTEM NAVIGATION
              </span>
              
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className={`flex items-center justify-between p-4 rounded-xl font-display font-bold text-lg border transition-all min-h-[56px] ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-blue/20 via-accent-cyan/20 to-accent-purple/20 border-accent-cyan/50 text-white shadow-glow-cyan'
                        : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-accent-cyan text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <FiArrowRight className="text-white/40" />
                  </a>
                );
              })}
            </div>

            {/* Drawer Footer Status */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col gap-3 font-mono text-xs text-white/50">
              <div className="flex items-center justify-between">
                <span>TIME: {time || '00:00:00'} IST</span>
                <span className="text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <a
                href="/resume.pdf"
                download
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-accent-gold text-center font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>[DOWNLOAD OFFICIAL RESUME]</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
