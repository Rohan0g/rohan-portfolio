import React, { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Touch interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.0005;
      targetMouseY = (e.clientY - height / 2) * 0.0005;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        targetMouseX = (e.touches[0].clientX - width / 2) * 0.0008;
        targetMouseY = (e.touches[0].clientY - height / 2) * 0.0008;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Generate 3D Spiral Galaxy Particles
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1200 : 2500;
    const particles = [];

    const branches = 4;
    const galaxyRadius = Math.min(width, height) * (isMobile ? 0.75 : 0.55);

    const colors = [
      '#FFFFFF', // Core white
      '#06B6D4', // Cyan
      '#3B82F6', // Electric Blue
      '#8B5CF6', // Violet
      '#EC4899', // Nebula Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 2.0) * galaxyRadius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * 0.008;

      const spreadX = (Math.random() - 0.5) * (15 + r * 0.15);
      const spreadY = (Math.random() - 0.5) * (12 + r * 0.1);
      const spreadZ = (Math.random() - 0.5) * (20 + r * 0.15);

      const baseAngle = branchAngle + spinAngle;

      const x = Math.cos(baseAngle) * r + spreadX;
      const y = spreadY;
      const z = Math.sin(baseAngle) * r + spreadZ;

      // Color based on distance from core
      const normR = r / galaxyRadius;
      let color = colors[0];
      if (normR > 0.15 && normR <= 0.4) color = colors[1];
      else if (normR > 0.4 && normR <= 0.7) color = colors[2];
      else if (normR > 0.7 && normR <= 0.9) color = colors[3];
      else if (normR > 0.9) color = colors[4];

      particles.push({
        x,
        y,
        z,
        baseAngle,
        radius: r,
        spreadX,
        spreadY,
        spreadZ,
        size: Math.random() * (isMobile ? 2.2 : 1.8) + (normR < 0.2 ? 2.5 : 0.8),
        alpha: Math.random() * 0.5 + 0.5,
        color,
      });
    }

    // Generate Background Stars
    const bgStarsCount = isMobile ? 300 : 700;
    const bgStars = [];
    for (let i = 0; i < bgStarsCount; i++) {
      bgStars.push({
        x: (Math.random() - 0.5) * width * 1.8,
        y: (Math.random() - 0.5) * height * 1.8,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    let rotationAngle = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep obsidian space backdrop
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Ambient Center Core Nebula Glow
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        isMobile ? 180 : 280
      );
      coreGlow.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      coreGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.12)');
      coreGlow.addColorStop(0.8, 'rgba(139, 92, 246, 0.05)');
      coreGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      // 1. Render Background Static Stars
      ctx.fillStyle = '#FFFFFF';
      bgStars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(centerX + star.x, centerY + star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Render 3D Rotating Milky Way Galaxy
      rotationAngle += 0.002;
      const tiltX = 0.65 + mouseY; // Tilt galaxy in 3D
      const cosTilt = Math.cos(tiltX);
      const sinTilt = Math.sin(tiltX);

      // Sort particles by Z position for proper depth rendering
      particles.sort((a, b) => b.z - a.z);

      particles.forEach((p) => {
        const angle = p.baseAngle + rotationAngle + mouseX;

        // 3D Polar calculation
        const px = Math.cos(angle) * p.radius + p.spreadX;
        const py = p.spreadY;
        const pz = Math.sin(angle) * p.radius + p.spreadZ;

        // 3D Perspective Projection
        const rotY = py * cosTilt - pz * sinTilt;
        const rotZ = py * sinTilt + pz * cosTilt;

        const fov = 400;
        const scale = fov / (fov + rotZ);

        const screenX = centerX + px * scale;
        const screenY = centerY + rotY * scale;

        if (screenX >= -20 && screenX <= width + 20 && screenY >= -20 && screenY <= height + 20) {
          ctx.globalAlpha = p.alpha * Math.min(1, Math.max(0.2, scale));
          ctx.fillStyle = p.color;

          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.6, p.size * scale), 0, Math.PI * 2);
          ctx.fill();

          // Add glowing aura for core stars
          if (p.size > 2) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
          } else {
            ctx.shadowBlur = 0;
          }
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] pointer-events-none overflow-hidden">
      {/* Soft gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/40 via-transparent to-[#030712]/70 z-[1] pointer-events-none" />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[0]"
      />
    </div>
  );
}
