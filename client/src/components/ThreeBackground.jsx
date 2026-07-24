import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// Simple import of random from math helper isn't strictly needed; we can generate inside
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();
  
  // Generate random points in a sphere shape
  const [positions] = useState(() => {
    const count = 1500;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      const r = THREE.MathUtils.randFloat(5, 30);
      
      arr[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      arr[i * 3 + 2] = r * Math.cos(theta);
    }
    return arr;
  });

  // Track mouse coordinates for subtle parallax
  const mouse = useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Gentle orbital rotation
      ref.current.rotation.x += delta * 0.05;
      ref.current.rotation.y += delta * 0.03;
      
      // Interpolate rotation based on mouse position
      ref.current.rotation.x += (mouse.current.y * 0.2 - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (mouse.current.x * 0.2 - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#06B6D4"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-background pointer-events-none overflow-hidden">
      {/* Absolute dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1]" />
      
      {/* Cybernetic grid network layer */}
      <div className="absolute inset-0 tech-grid opacity-[0.12] z-[0]" />
      
      {/* Radial soft blooms */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-[0]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-purple/5 rounded-full blur-[140px] pointer-events-none z-[0]" />

      <Canvas 
        camera={{ position: [0, 0, 10] }}
        gl={{ powerPreference: "high-performance", antialias: false }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
