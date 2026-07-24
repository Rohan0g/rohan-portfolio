import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 🌌 VIBRANT 3D MILKY WAY SPIRAL GALAXY COMPONENT
function MilkyWayGalaxy() {
  const pointsRef = useRef();
  const bgStarsRef = useRef();

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 1. Generate Vibrant 3D Galaxy Geometry
  const { positions, colors, scales } = useMemo(() => {
    const count = 14000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const branches = 4;
    const radius = 23;
    const spin = 1.4;

    const colorCore = new THREE.Color('#FFF5EA');       // Intense warm gold core
    const colorInner = new THREE.Color('#06B6D4');      // Electric Cyan
    const colorMid = new THREE.Color('#3B82F6');        // Deep Royal Blue
    const colorOuter = new THREE.Color('#8B5CF6');      // Cosmic Purple
    const colorDust = new THREE.Color('#EC4899');       // Bright Pink Dust

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

      // Brightness boost
      mixedColor.r = Math.min(1, mixedColor.r * 1.25);
      mixedColor.g = Math.min(1, mixedColor.g * 1.25);
      mixedColor.b = Math.min(1, mixedColor.b * 1.25);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 0.09 + 0.04;
    }

    return { positions, colors, scales };
  }, []);

  // 2. Background Deep Space Stars
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

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.035;
    }
    if (bgStarsRef.current) {
      bgStarsRef.current.rotation.y -= delta * 0.007;
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
          size={0.06}
          color="#CBD5E1"
          transparent
          opacity={0.65}
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
          size={0.12}
          vertexColors
          transparent
          opacity={0.88} // Full vibrant glowing opacity
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
      {/* Light edge vignette only so center stays ultra vibrant */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50 z-[1]" />
      
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 tech-grid opacity-[0.08] z-[0]" />

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
