import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 🌌 3D MILKY WAY SPIRAL GALAXY COMPONENT
function MilkyWayGalaxy({ isMobile }) {
  const pointsRef = useRef();
  const bgStarsRef = useRef();

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.current.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.5;
        mouse.current.targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.5;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Generate 3D Milky Way Galaxy Spiral Arms
  const { positions, colors } = useMemo(() => {
    const count = isMobile ? 8000 : 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const branches = 4;
    const radius = isMobile ? 22 : 24;
    const spin = 1.4;

    const colorCore = new THREE.Color('#FFF5EA');
    const colorInner = new THREE.Color('#06B6D4');
    const colorMid = new THREE.Color('#3B82F6');
    const colorOuter = new THREE.Color('#8B5CF6');
    const colorDust = new THREE.Color('#EC4899');

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 2.2) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.35 + r * 0.14);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.25 + r * 0.09);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.35 + r * 0.14);

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

    return { positions, colors };
  }, [isMobile]);

  const bgStarsPositions = useMemo(() => {
    const count = isMobile ? 2000 : 3500;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 35 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [isMobile]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
    }
    if (bgStarsRef.current) {
      bgStarsRef.current.rotation.y -= delta * 0.008;
    }

    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    if (pointsRef.current) {
      pointsRef.current.rotation.x = 0.55 + mouse.current.y * 0.25;
      pointsRef.current.rotation.z = -0.25 + mouse.current.x * 0.25;
    }
  });

  return (
    <>
      <points ref={bgStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={bgStarsPositions.length / 3}
            array={bgStarsPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.12 : 0.06}
          color="#CBD5E1"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <points ref={pointsRef} rotation={[0.55, 0, -0.25]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.22 : 0.11}
          vertexColors
          transparent
          opacity={0.88}
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
      {/* Soft gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-[#030712]/30 to-[#030712]/75 z-[1]" />
      
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 tech-grid opacity-[0.08] z-[0]" />

      <Canvas
        camera={{ position: [0, 0, isMobile ? 32 : 24], fov: isMobile ? 65 : 60 }}
        dpr={isMobile ? [1, 2] : [1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: false }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.9} />
        <MilkyWayGalaxy isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
