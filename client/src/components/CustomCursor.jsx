import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const innerSpringConfig = { damping: 20, stiffness: 600 };
  const innerXSpring = useSpring(cursorX, innerSpringConfig);
  const innerYSpring = useSpring(cursorY, innerSpringConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const handleHoverStart = () => setHovering(true);
    const handleHoverEnd = () => setHovering(false);

    const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"], .interactive-node');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Ring Glow */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-cyan/60 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: hovering ? 1.8 : 1,
          backgroundColor: hovering ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.02)',
          boxShadow: hovering ? '0 0 20px rgba(6, 182, 212, 0.6)' : '0 0 8px rgba(6, 182, 212, 0.2)',
          transition: 'scale 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-accent-blue rounded-full pointer-events-none z-[9999]"
        style={{
          x: innerXSpring,
          y: innerYSpring,
          left: '12px',
          top: '12px',
          scale: hovering ? 0.5 : 1,
          backgroundColor: hovering ? '#FFD700' : '#3B82F6',
          boxShadow: hovering ? '0 0 10px #FFD700' : '0 0 5px #3B82F6',
          transition: 'scale 0.2s, background-color 0.2s, box-shadow 0.2s',
        }}
      />
    </>
  );
}
