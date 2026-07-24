import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 🌌 3D MILKY WAY SPIRAL GALAXY COMPONENT (GUARANTEED NATIVE THREE.JS GEOMETRY)
function MilkyWayGalaxy({ isMobile }) {
  const pointsRef = useRef();
  const bgStarsRef = useRef();
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.current.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.8;
        mouse.current.targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.8;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 1. Native BufferGeometry for Spiral Galaxy
  const galaxyGeometry = useMemo(() => {
    const count = isMobile ? 12000 : 16000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const branches = 4;
    const radius = isMobile ? 26 : 24;
    const spin = 1.4;

    const colorCore = new THREE.Color('#FFFFFF');
    const colorInner = new THREE.Color('#06B6D4');
    const colorMid = new THREE.Color('#3B82F6');
    const colorOuter = new THREE.Color('#A855F7');
    const colorDust = new THREE.Color('#EC4899');

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 2.2) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.4 + r * 0.14);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.3 + r * 0.1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.4 + r * 0.14);

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const mixedColor = colorCore.clone();
      const normalizedRadius = r / radius;

      if (normalizedRadius < 0.15) {
        mixedColor.lerp(colorCore, normalizedRadius / 0.15);
      } else if (normalizedRadius < 0.4) {
        mixedColor.lerp(colorInner, (normalizedRadius - 0.15) / 0.25);
      } else if (normalizedRadius < 0.75) {
        mixedColor.lerp(colorMid, (normalizedRadius - 0.4) / 0.35);
      } else {
        const blend = Math.random() > 0.4 ? colorOuter : colorDust;
        mixedColor.lerp(blend, (normalizedRadius - 0.75) / 0.25);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [isMobile]);

  // 2. Native BufferGeometry for Background Stars
  const bgStarsGeometry = useMemo(() => {
    const count = isMobile ? 3500 : 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [isMobile]);

  // 3. Animation Loop
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
    if (bgStarsRef.current) {
      bgStarsRef.current.rotation.y -= delta * 0.01;
    }

    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    if (pointsRef.current) {
      pointsRef.current.rotation.x = 0.55 + mouse.current.y * 0.3;
      pointsRef.current.rotation.z = -0.2 + mouse.current.x * 0.3;
    }
  });

  return (
    <>
      {/* Background Starfield */}
      <points ref={bgStarsRef} geometry={bgStarsGeometry}>
        <pointsMaterial
          size={isMobile ? 0.3 : 0.12}
          color="#CBD5E1"
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Main 3D Spiral Galaxy */}
      <points ref={pointsRef} geometry={galaxyGeometry} rotation={[0.55, 0, -0.2]}>
        <pointsMaterial
          size={isMobile ? 0.45 : 0.18}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export default function ThreeBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] pointer-events-none overflow-hidden">
      {/* Ambient Spotlight Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-cyan/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-purple/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle tech grid background */}
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, isMobile ? 32 : 24], fov: isMobile ? 65 : 60 }}
        dpr={isMobile ? [1, 2] : [1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <MilkyWayGalaxy isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
