import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ✦ ELEGANT LINEAR/VERCEL DEEP SPACE STARFIELD
function DeepSpaceConstellation() {
  const pointsRef = useRef();

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Faint high-density starfield
  const { positions, colors } = useMemo(() => {
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCyan = new THREE.Color('#06B6D4');
    const colorBlue = new THREE.Color('#3B82F6');
    const colorWhite = new THREE.Color('#E2E8F0');
    const colorPurple = new THREE.Color('#8B5CF6');

    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      let c = colorWhite;
      if (rand > 0.7) c = colorCyan;
      else if (rand > 0.55) c = colorBlue;
      else if (rand > 0.45) c = colorPurple;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.008;
    }

    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.04;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.04;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += mouse.current.x * 0.01;
      pointsRef.current.rotation.x += mouse.current.y * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
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
        size={0.07}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] pointer-events-none overflow-hidden">
      {/* Sleek Linear gradient spotlights */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[150px] pointer-events-none z-[0]" />
      <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[150px] pointer-events-none z-[0]" />
      <div className="absolute top-[40%] right-[25%] w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-[130px] pointer-events-none z-[0]" />

      {/* Cybernetic grid network layer */}
      <div className="absolute inset-0 tech-grid opacity-[0.06] z-[0]" />

      <Canvas
        camera={{ position: [0, 0, 25], fov: 55 }}
        gl={{ powerPreference: "high-performance", antialias: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <DeepSpaceConstellation />
      </Canvas>
    </div>
  );
}
