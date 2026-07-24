import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTerminal, FiX, FiSearch, FiCode, FiUser, FiBriefcase, FiMail, FiZap } from 'react-icons/fi';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Toggle with CMD+K or CTRL+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commands = [
    { id: 'hero', label: 'Go to Top / Hero Section', icon: <FiZap className="text-accent-cyan" />, action: () => scrollToSection('hero') },
    { id: 'projects', label: 'View Flagship Projects (APEX, CITADEL, ORBIT)', icon: <FiBriefcase className="text-accent-blue" />, action: () => scrollToSection('projects') },
    { id: 'about', label: 'Explore Education & Background (GIET University)', icon: <FiUser className="text-accent-purple" />, action: () => scrollToSection('about') },
    { id: 'skills', label: 'Inspect Full Stack & AI Skill Ecosystem', icon: <FiCode className="text-accent-gold" />, action: () => scrollToSection('skills') },
    { id: 'contact', label: 'Transmit Encrypted Project Query', icon: <FiMail className="text-emerald-400" />, action: () => scrollToSection('contact') },
    { id: 'resume', label: 'Download Official Resume PDF', icon: <FiTerminal className="text-pink-400" />, action: () => window.open('/resume.pdf', '_blank') },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating CMD+K Trigger Badge */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[999] px-3.5 py-2.5 rounded-full bg-surface/90 border border-white/15 backdrop-blur-xl text-[10px] font-mono text-white/70 hover:text-white hover:border-accent-cyan flex items-center gap-2 shadow-2xl transition-all group cursor-pointer min-h-[48px]"
      >
        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shrink-0" />
        <span className="tracking-widest uppercase hidden xs:inline">COMMAND MATRIX</span>
        <kbd className="px-2 py-1 rounded bg-white/10 text-[9px] font-bold text-accent-cyan border border-white/10 group-hover:bg-accent-cyan group-hover:text-black transition-colors">
          ⌘K
        </kbd>
      </motion.button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-[#0F172A] border border-accent-cyan/30 rounded-2xl shadow-glow-cyan overflow-hidden z-10"
            >
              {/* Header Input */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <FiSearch className="text-accent-cyan text-lg shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search section..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white text-lg p-1"
                >
                  <FiX />
                </button>
              </div>

              {/* Commands List */}
              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-white/5 hover:border hover:border-white/10 transition-all text-xs font-mono group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                          {cmd.icon}
                        </div>
                        <span className="text-white/80 group-hover:text-white font-medium">
                          {cmd.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 group-hover:text-accent-cyan uppercase">
                        EXECUTE ↵
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs font-mono text-white/40">
                    No commands matching "{query}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>NEXORITH IT SOLUTIONS // JARVIS ENGINE</span>
                <span className="flex items-center gap-2">
                  <span>ESC to exit</span>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
