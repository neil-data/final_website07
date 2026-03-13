import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ---------- Mouse-reactive morphing particle field ---------- */
const MorphField = () => {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const { positions, velocities, colors, sizes } = useMemo(() => {
    const googleColors = [
      new THREE.Color('#4285F4'),
      new THREE.Color('#EA4335'),
      new THREE.Color('#34A853'),
      new THREE.Color('#FBBC05'),
    ];
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const s = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 16;
      p[i * 3 + 1] = (Math.random() - 0.5) * 12;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
      v[i * 3] = (Math.random() - 0.5) * 0.005;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      const col = googleColors[i % 4];
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
      s[i] = Math.random() * 0.06 + 0.02;
    }
    return { positions: p, velocities: v, colors: c, sizes: s };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorAttr = useMemo(() => {
    const arr = new Float32Array(count * 3);
    arr.set(colors);
    return arr;
  }, [colors]);

  useFrame(({ pointer, clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    mouseRef.current.x += (pointer.x * viewport.width * 0.5 - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (pointer.y * viewport.height * 0.5 - mouseRef.current.y) * 0.05;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Base drift
      positions[i3] += velocities[i3] + Math.sin(t * 0.3 + i) * 0.002;
      positions[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.2 + i) * 0.002;
      positions[i3 + 2] += velocities[i3 + 2];

      // Mouse repulsion
      const dx = positions[i3] - mouseRef.current.x;
      const dy = positions[i3 + 1] - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        const force = (3 - dist) * 0.008;
        positions[i3] += dx * force;
        positions[i3 + 1] += dy * force;
      }

      // Wrap around boundaries
      if (positions[i3] > 8) positions[i3] = -8;
      if (positions[i3] < -8) positions[i3] = 8;
      if (positions[i3 + 1] > 6) positions[i3 + 1] = -6;
      if (positions[i3 + 1] < -6) positions[i3 + 1] = 6;

      const scl = sizes[i] * (1 + Math.sin(t * 2 + i * 0.5) * 0.3);
      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      dummy.scale.setScalar(scl);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
      </sphereGeometry>
      <meshBasicMaterial transparent opacity={0.7} vertexColors toneMapped={false} />
    </instancedMesh>
  );
};

/* ---------- Connection lines ---------- */
const ConnectionLines = () => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const count = 40;

  const linePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const verts: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 16) {
          verts.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          );
        }
      }
    }
    return new Float32Array(verts);
  }, []);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.2;
      lineRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.04) * 0.1;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={linePositions}
          count={linePositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.03} />
    </lineSegments>
  );
};

/* ---------- Central orb ---------- */
const CentralOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12;
      meshRef.current.rotation.z = t * 0.08;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(2.0 + Math.sin(t * 0.6) * 0.2);
    }
  });

  return (
    <group>
      <Sphere ref={glowRef} args={[1.8, 16, 16]}>
        <meshBasicMaterial color="#4285F4" transparent opacity={0.025} />
      </Sphere>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <Sphere ref={meshRef} args={[0.7, 32, 32]}>
          <meshStandardMaterial
            color="#0a0f2e"
            emissive="#4285F4"
            emissiveIntensity={0.12}
            transparent
            opacity={0.9}
            roughness={0.3}
            metalness={0.7}
          />
        </Sphere>
      </Float>
    </group>
  );
};

/* ---------- Orbiting rings ---------- */
const OrbitRings = () => {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const speeds = useMemo(() => [0.25, -0.18, 0.12, -0.35], []);

  const rings = useMemo(() => [
    { color: '#4285F4', radius: 2.0, tilt: 0.5 },
    { color: '#EA4335', radius: 2.6, tilt: -0.7 },
    { color: '#34A853', radius: 3.2, tilt: 1.1 },
    { color: '#FBBC05', radius: 1.4, tilt: -0.3 },
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((mesh, i) => {
      if (mesh) mesh.rotation.z = t * speeds[i];
    });
  });

  return (
    <>
      {rings.map((r, i) => (
        <group key={i} rotation={[r.tilt, 0, 0]}>
          <mesh ref={(el) => { refs.current[i] = el; }}>
            <torusGeometry args={[r.radius, 0.008, 8, 64]} />
            <meshBasicMaterial color={r.color} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
};

/* ---------- Floating geometric shapes ---------- */
const FloatingGeo = () => {
  const torusRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.25;
      torusRef.current.rotation.y = t * 0.18;
    }
    if (icoRef.current) {
      icoRef.current.rotation.y = t * 0.12;
      icoRef.current.rotation.z = t * 0.08;
    }
    if (octRef.current) {
      octRef.current.rotation.x = t * 0.18;
      octRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <>
      <mesh ref={torusRef} position={[-5, 2, -3]}>
        <torusKnotGeometry args={[0.5, 0.12, 48, 12]} />
        <meshBasicMaterial color="#4285F4" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh ref={icoRef} position={[5.5, -1.5, -2]}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#EA4335" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={octRef} position={[4, 3, -4]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial color="#34A853" wireframe transparent opacity={0.15} />
      </mesh>
    </>
  );
};

/* ============================================================
   MAIN HERO SCENE
   ============================================================ */
export const HeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <color attach="background" args={['#050816']} />
        <fog attach="fog" args={['#050816', 12, 30]} />

        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#4285F4" />
        <pointLight position={[-10, -5, 5]} intensity={0.35} color="#EA4335" />

        <MorphField />
        <ConnectionLines />
        <CentralOrb />
        <OrbitRings />
        <FloatingGeo />

        <Stars radius={80} depth={60} count={1200} factor={2.5} saturation={0.1} fade speed={0.2} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/50 to-bg-base pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-bg-base)_75%)] pointer-events-none" />
    </div>
  );
};
