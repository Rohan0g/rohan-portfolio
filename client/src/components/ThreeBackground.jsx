import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 🌌 MILKY WAY SPIRAL GALAXY COMPONENT
function MilkyWayGalaxy() {
  const pointsRef = useRef();
  const bgStarsRef = useRef();

  // Track mouse coordinates for smooth interactive rotation parallax
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 1. Generate Milky Way Spiral Galaxy Geometry & Colors
  const { positions, colors, scales } = useMemo(() => {
    const count = 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const branches = 4;
    const radius = 22;
    const spin = 1.4;

    const colorCore = new THREE.Color('#FFF5EA');       // Dense warm white/gold core
    const colorInner = new THREE.Color('#06B6D4');      // Vibrant Cyan
    const colorMid = new THREE.Color('#3B82F6');        // Deep Electric Blue
    const colorOuter = new THREE.Color('#8B5CF6');      // Cosmic Violet
    const colorDust = new THREE.Color('#EC4899');       // Pink nebula dust accent

    for (let i = 0; i < count; i++) {
      // Distance from center (power distribution creates dense core)
      const r = Math.pow(Math.random(), 2.2) * radius;

      // Spiral angle calculation
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      // Scatter randomness along spiral arms (denser near center, wider spread at edges)
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.3 + r * 0.12);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.2 + r * 0.08);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.3 + r * 0.12);

      const x = Math.cos(branchAngle + spinAngle) * r + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color Interpolation based on radius from center
      const mixedColor = colorCore.clone();
      const normalizedRadius = r / radius;

      if (normalizedRadius < 0.15) {
        mixedColor.lerp(colorCore, normalizedRadius / 0.15);
      } else if (normalizedRadius < 0.4) {
        mixedColor.lerp(colorInner, (normalizedRadius - 0.15) / 0.25);
      } else if (normalizedRadius < 0.75) {
        mixedColor.lerp(colorMid, (normalizedRadius - 0.4) / 0.35);
      } else {
        // Outer arm dust mixes purple and pink
        const blend = Math.random() > 0.5 ? colorOuter : colorDust;
        mixedColor.lerp(blend, (normalizedRadius - 0.75) / 0.25);
      }

      // Add subtle random color variation per star
      mixedColor.r += (Math.random() - 0.5) * 0.08;
      mixedColor.g += (Math.random() - 0.5) * 0.08;
      mixedColor.b += (Math.random() - 0.5) * 0.08;

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      // Variable star sizes
      scales[i] = Math.random() * 0.08 + 0.03;
    }

    return { positions, colors, scales };
  }, []);

  // 2. Background Deep Space Starfield (Distributed in sphere)
  const bgStarsPositions = useMemo(() => {
    const count = 4000;
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
  }, []);

  // Animation Loop
  useFrame((state, delta) => {
    // Rotate Galaxy
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04; // Smooth galaxy spin
    }

    // Faint reverse rotation for background stars
    if (bgStarsRef.current) {
      bgStarsRef.current.rotation.y -= delta * 0.008;
      bgStarsRef.current.rotation.x += delta * 0.004;
    }

    // Lerp mouse parallax for cinematic response
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    if (pointsRef.current) {
      pointsRef.current.rotation.x = 0.55 + mouse.current.y * 0.3; // 55 deg tilt
      pointsRef.current.rotation.z = -0.25 + mouse.current.x * 0.3;
    }
  });

  return (
    <>
      {/* 🌟 Background Deep Space Starfield */}
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
          size={0.06}
          color="#94A3B8"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 🌀 3D Milky Way Spiral Galaxy */}
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
          size={0.11}
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
  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] pointer-events-none overflow-hidden">
      {/* Dark vignette gradient overlay */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-[1]" />
      
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 tech-grid opacity-[0.07] z-[0]" />

      <Canvas
        camera={{ position: [0, 0, 24], fov: 60 }}
        gl={{ powerPreference: "high-performance", antialias: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <MilkyWayGalaxy />
      </Canvas>
    </div>
  );
}
