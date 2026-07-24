import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';

function App() {
  const [loading, setLoading] = useState(true);

  // Stable callback ref so Loader doesn't re-run its effect
  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Instantiate Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      {/* Interactive custom liquid cursor */}
      <CustomCursor />

      {/* Futuristic Command Palette (CMD + K) */}
      <CommandPalette />

      {/* Intro Preloader screen — overlays everything */}
      {loading && <Loader onComplete={handleLoaderComplete} />}

      {/* Always render content — loader just overlays on top */}
      <ThreeBackground />
      <Navbar />
      <main className="relative z-10 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
