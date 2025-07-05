import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MovingStars: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>();

  useEffect(() => {
    if (starsRef.current) {
      const geometry = starsRef.current.geometry;
      const positions = geometry.attributes.position.array as Float32Array;
      
      // Create velocity array for each star
      velocitiesRef.current = new Float32Array(positions.length);
      for (let i = 0; i < velocitiesRef.current.length; i += 3) {
        velocitiesRef.current[i] = (Math.random() - 0.5) * 0.01; // x velocity (slower)
        velocitiesRef.current[i + 1] = (Math.random() - 0.5) * 0.01; // y velocity (slower)
        velocitiesRef.current[i + 2] = (Math.random() - 0.5) * 0.01; // z velocity (slower)
      }
    }
  }, []);

  useFrame(() => {
    if (starsRef.current && velocitiesRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocitiesRef.current[i];
        positions[i + 1] += velocitiesRef.current[i + 1];
        positions[i + 2] += velocitiesRef.current[i + 2];
        
        // Wrap around boundaries
        if (positions[i] > 500) positions[i] = -500;
        if (positions[i] < -500) positions[i] = 500;
        if (positions[i + 1] > 500) positions[i + 1] = -500;
        if (positions[i + 1] < -500) positions[i + 1] = 500;
        if (positions[i + 2] > 500) positions[i + 2] = -500;
        if (positions[i + 2] < -500) positions[i + 2] = 500;
      }
      
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Generate star positions
  const starPositions = new Float32Array(20000); // More stars
  for (let i = 0; i < starPositions.length; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 1000;
    starPositions[i + 1] = (Math.random() - 0.5) * 1000;
    starPositions[i + 2] = (Math.random() - 0.5) * 1000;
  }

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        color="#ffffff"
        transparent
        opacity={0.6} // Dimmer stars
        sizeAttenuation={true}
      />
    </points>
  );
};

const ShootingStars: React.FC = () => {
  const shootingStarsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shootingStarsRef.current) {
      shootingStarsRef.current.children.forEach((star, index) => {
        star.position.x += 1.5; // Slower movement
        star.position.y -= 0.3;
        
        // Reset position when off screen
        if (star.position.x > 600) {
          star.position.x = -600;
          star.position.y = Math.random() * 400 - 200;
          star.position.z = Math.random() * 400 - 200;
        }
      });
    }
  });

  const shootingStarPositions = [];
  for (let i = 0; i < 3; i++) { // Fewer shooting stars
    shootingStarPositions.push([
      Math.random() * 1200 - 600,
      Math.random() * 400 - 200,
      Math.random() * 400 - 200
    ]);
  }

  return (
    <group ref={shootingStarsRef}>
      {shootingStarPositions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color="#ffff88" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export const StarfieldBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-slate-950"> {/* Much darker background */}
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <MovingStars />
        <ShootingStars />
        {/* Add a subtle dark overlay */}
        <mesh position={[0, 0, -100]}>
          <planeGeometry args={[2000, 2000]} />
          <meshBasicMaterial color="#0f0f23" transparent opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};