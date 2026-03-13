import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ==========================================================
   MOUSE STORE – Global mouse position for 3D reactivity
   ========================================================== */
const mouseStore = {
  x: 0, y: 0, targetX: 0, targetY: 0,
  velX: 0, velY: 0,
  exitVelX: 0, exitVelY: 0,
  exitStrength: 0,
  isOnScreen: true,
};

const useMouseTracker = () => {
  useEffect(() => {
    let prevX = 0, prevY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const newX = (e.clientX / window.innerWidth) * 2 - 1;
      const newY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseStore.velX = newX - prevX;
      mouseStore.velY = newY - prevY;
      prevX = newX;
      prevY = newY;
      mouseStore.targetX = newX;
      mouseStore.targetY = newY;
    };
    const handleMouseLeave = () => {
      mouseStore.isOnScreen = false;
      // Prefer measured velocity; fall back to exit-side direction
      const vx = Math.abs(mouseStore.velX) > 0.004 ? mouseStore.velX * 28 : mouseStore.targetX * 1.8;
      const vy = Math.abs(mouseStore.velY) > 0.004 ? mouseStore.velY * 28 : mouseStore.targetY * 1.8;
      const mag = Math.sqrt(vx * vx + vy * vy) || 1;
      const cap = Math.min(mag, 3) / mag;
      mouseStore.exitVelX = vx * cap;
      mouseStore.exitVelY = vy * cap;
      mouseStore.exitStrength = 1.0;
    };
    const handleMouseEnter = () => { mouseStore.isOnScreen = true; };
    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);
};

/* ==========================================================
   SCROLL-RESPONSIVE CAMERA – dramatic camera movement on scroll
   ========================================================== */
const ScrollCamera = () => {
  const { camera } = useThree();
  const smoothProgress = useRef(0);

  useFrame(() => {
    // Smooth mouse follow
    mouseStore.x += (mouseStore.targetX - mouseStore.x) * 0.05;
    mouseStore.y += (mouseStore.targetY - mouseStore.y) * 0.05;

    // Decay exit strength each frame (faster once mouse returns)
    if (mouseStore.exitStrength > 0) {
      mouseStore.exitStrength *= mouseStore.isOnScreen ? 0.93 : 0.968;
      if (mouseStore.exitStrength < 0.004) mouseStore.exitStrength = 0;
    }

    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const rawProgress = Math.min(scrollY / maxScroll, 1);
    smoothProgress.current += (rawProgress - smoothProgress.current) * 0.04;
    const p = smoothProgress.current;

    // Camera surges toward viewer and drifts in exit direction
    const ex = mouseStore.exitVelX * mouseStore.exitStrength;
    const ey = mouseStore.exitVelY * mouseStore.exitStrength;
    camera.position.x = mouseStore.x * 2 + ex * 2;
    camera.position.y = -p * 12 + mouseStore.y * 1.5 + ey * 1.5;
    camera.position.z = 20 - p * 4 - mouseStore.exitStrength * 6;
    camera.rotation.x = Math.sin(p * Math.PI * 0.5) * 0.12 + mouseStore.y * 0.05;
    camera.rotation.y = mouseStore.x * 0.08 + ex * 0.04;
    camera.rotation.z = Math.sin(p * Math.PI) * 0.03;
  });

  return null;
};

/* ==========================================================
   WIREFRAME SHAPES – Massive floating Google-colored wireframes
   ========================================================== */
const WireframeShapes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const shapes = useMemo(() => {
    const colors = ['#4285F4', '#EA4335', '#34A853', '#FBBC05'];
    return Array.from({ length: 40 }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 40 - 10
      ),
      baseY: (Math.random() - 0.5) * 120,
      scale: Math.random() * 1.2 + 0.3,
      rotSpeed: Math.random() * 0.08 + 0.02,
      parallax: Math.random() * 0.5 + 0.1,
      type: i % 6,
      color: colors[i % 4],
      opacity: Math.random() * 0.08 + 0.03,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const scrollY = window.scrollY;

    groupRef.current.rotation.y += (mouseRef.current.x * 0.04 - groupRef.current.rotation.y) * 0.015;
    groupRef.current.rotation.x += (-mouseRef.current.y * 0.02 - groupRef.current.rotation.x) * 0.015;

    // Edge push: objects drift toward the nearest edge as mouse approaches it
    const edgePushX = mouseStore.isOnScreen
      ? Math.max(0, (Math.abs(mouseStore.targetX) - 0.60) / 0.40) * Math.sign(mouseStore.targetX || 1)
      : 0;
    const edgePushY = mouseStore.isOnScreen
      ? Math.max(0, (Math.abs(mouseStore.targetY) - 0.60) / 0.40) * Math.sign(mouseStore.targetY || 1)
      : 0;
    // Exit push: fly off in the exit direction; deeper (higher parallax) objects go further
    const exitX = mouseStore.exitVelX * mouseStore.exitStrength;
    const exitY = mouseStore.exitVelY * mouseStore.exitStrength;

    groupRef.current.children.forEach((child, i) => {
      const s = shapes[i];
      child.rotation.x = t * s.rotSpeed;
      child.rotation.y = t * s.rotSpeed * 0.7;
      const offX = (edgePushX * 7 + exitX) * s.parallax * 14;
      const offY = (edgePushY * 7 + exitY) * s.parallax * 12;
      const offZ = mouseStore.exitStrength * s.parallax * 16; // burst toward viewer
      child.position.x = s.position.x + Math.sin(t * 0.08 + s.phase) * 1.2 + offX;
      child.position.y = s.baseY + scrollY * s.parallax * 0.012 + offY;
      child.position.z = s.position.z + Math.cos(t * 0.06 + s.phase) * 0.5 + offZ;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.position} scale={s.scale}>
          {s.type === 0 && <torusGeometry args={[1, 0.35, 8, 20]} />}
          {s.type === 1 && <icosahedronGeometry args={[1, 0]} />}
          {s.type === 2 && <octahedronGeometry args={[1, 0]} />}
          {s.type === 3 && <dodecahedronGeometry args={[1, 0]} />}
          {s.type === 4 && <tetrahedronGeometry args={[1, 0]} />}
          {s.type === 5 && <torusKnotGeometry args={[0.7, 0.2, 32, 8]} />}
          <meshBasicMaterial color={s.color} wireframe transparent opacity={s.opacity} />
        </mesh>
      ))}
    </group>
  );
};

/* ==========================================================
   DEPTH PARTICLES – Hundreds of floating dots at various depths
   ========================================================== */
const DepthParticles = () => {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 80;
      p[i * 3 + 1] = (Math.random() - 0.5) * 120;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
      s[i] = Math.random() * 0.12 + 0.03;
    }
    return { positions: p, sizes: s };
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const googleColors = [
      [0.26, 0.52, 0.96], // blue
      [0.92, 0.26, 0.21], // red
      [0.20, 0.66, 0.33], // green
      [0.98, 0.74, 0.02], // yellow
    ];
    for (let i = 0; i < count; i++) {
      const col = googleColors[i % 4];
      c[i * 3] = col[0];
      c[i * 3 + 1] = col[1];
      c[i * 3 + 2] = col[2];
    }
    return c;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const exitX = mouseStore.exitVelX * mouseStore.exitStrength;
      const exitY = mouseStore.exitVelY * mouseStore.exitStrength;
      ref.current.rotation.y = clock.getElapsedTime() * 0.005;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.003) * 0.02;
      ref.current.position.x += (exitX * 5 - ref.current.position.x) * 0.055;
      ref.current.position.y += (window.scrollY * 0.006 + exitY * 5 - ref.current.position.y) * 0.055;
      ref.current.position.z += (mouseStore.exitStrength * 7 - ref.current.position.z) * 0.055;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} transparent opacity={0.5} sizeAttenuation vertexColors />
    </points>
  );
};

/* ==========================================================
   PERSPECTIVE GRID – Massive receding grid floor for depth
   ========================================================== */
const GridFloor = () => {
  const ref = useRef<THREE.Group>(null);

  const gridLines = useMemo(() => {
    const verts: number[] = [];
    const size = 100;
    const step = 2;
    for (let i = -size / 2; i <= size / 2; i += step) {
      verts.push(-size / 2, 0, i, size / 2, 0, i);
      verts.push(i, 0, -size / 2, i, 0, size / 2);
    }
    return new Float32Array(verts);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = -15 + window.scrollY * 0.003;
    }
  });

  return (
    <group ref={ref} rotation={[Math.PI * 0.38, 0, 0]} position={[0, -15, -20]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={gridLines}
            count={gridLines.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4285F4" transparent opacity={0.04} />
      </lineSegments>
    </group>
  );
};

/* ==========================================================
   AMBIENT ORBITAL RINGS – Large dramatic orbiting rings
   ========================================================== */
const AmbientRings = () => {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const rings = useMemo(
    () => [
      { radius: 12, color: '#4285F4', tilt: [0.3, 0.5, 0] as [number, number, number], speed: 0.05, opacity: 0.06, tube: 0.02 },
      { radius: 18, color: '#EA4335', tilt: [-0.6, 0.3, 0.2] as [number, number, number], speed: -0.035, opacity: 0.04, tube: 0.015 },
      { radius: 25, color: '#34A853', tilt: [1.0, -0.2, 0] as [number, number, number], speed: 0.02, opacity: 0.03, tube: 0.018 },
      { radius: 7, color: '#FBBC05', tilt: [-0.2, 0.8, -0.3] as [number, number, number], speed: -0.07, opacity: 0.06, tube: 0.025 },
      { radius: 32, color: '#4285F4', tilt: [0.8, -0.4, 0.1] as [number, number, number], speed: 0.012, opacity: 0.02, tube: 0.01 },
      { radius: 15, color: '#EA4335', tilt: [-0.3, 1.2, -0.5] as [number, number, number], speed: -0.045, opacity: 0.04, tube: 0.015 },
    ],
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((mesh, i) => {
      if (mesh) mesh.rotation.z = t * rings[i].speed;
    });
  });

  return (
    <>
      {rings.map((r, i) => (
        <group key={i} rotation={r.tilt}>
          <mesh ref={(el) => { refs.current[i] = el; }}>
            <torusGeometry args={[r.radius, r.tube, 8, 100]} />
            <meshBasicMaterial color={r.color} transparent opacity={r.opacity} />
          </mesh>
        </group>
      ))}
    </>
  );
};

/* ==========================================================
   CONNECTION WEB – Dense interconnected node network
   ========================================================== */
const ConnectionWeb = () => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const count = 50;

  const linePositions = useMemo(() => {
    const nodes = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      nodes[i * 3] = (Math.random() - 0.5) * 50;
      nodes[i * 3 + 1] = (Math.random() - 0.5) * 80;
      nodes[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;
    }
    const verts: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodes[i * 3] - nodes[j * 3];
        const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
        const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 120) {
          verts.push(
            nodes[i * 3], nodes[i * 3 + 1], nodes[i * 3 + 2],
            nodes[j * 3], nodes[j * 3 + 1], nodes[j * 3 + 2],
          );
        }
      }
    }
    return new Float32Array(verts);
  }, []);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const exitX = mouseStore.exitVelX * mouseStore.exitStrength;
      const exitY = mouseStore.exitVelY * mouseStore.exitStrength;
      lineRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.02) * 0.2;
      lineRef.current.position.x += (exitX * 6 - lineRef.current.position.x) * 0.05;
      lineRef.current.position.y += (window.scrollY * 0.005 + exitY * 6 - lineRef.current.position.y) * 0.05;
      lineRef.current.position.z += (mouseStore.exitStrength * 8 - lineRef.current.position.z) * 0.05;
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
      <lineBasicMaterial color="#ffffff" transparent opacity={0.025} />
    </lineSegments>
  );
};

/* ==========================================================
   DNA HELIX – Spiraling double helix structure
   ========================================================== */
const DnaHelix = () => {
  const groupRef = useRef<THREE.Group>(null);

  const { positions1, positions2, connections } = useMemo(() => {
    const p1: number[] = [];
    const p2: number[] = [];
    const conn: number[] = [];
    const steps = 60;
    const radius = 3;
    const height = 40;

    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 4;
      const y = (i / steps) * height - height / 2;
      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;
      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;
      p1.push(x1, y, z1);
      p2.push(x2, y, z2);
      if (i % 4 === 0) {
        conn.push(x1, y, z1, x2, y, z2);
      }
    }
    return {
      positions1: new Float32Array(p1),
      positions2: new Float32Array(p2),
      connections: new Float32Array(conn),
    };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const exitX = mouseStore.exitVelX * mouseStore.exitStrength;
      const exitY = mouseStore.exitVelY * mouseStore.exitStrength;
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      groupRef.current.position.x += (20 + exitX * 7 - groupRef.current.position.x) * 0.04;
      groupRef.current.position.y += (-5 + window.scrollY * 0.008 + exitY * 7 - groupRef.current.position.y) * 0.04;
      groupRef.current.position.z += (-15 + mouseStore.exitStrength * 10 - groupRef.current.position.z) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[20, 0, -15]}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions1} count={positions1.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#4285F4" transparent opacity={0.06} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions2} count={positions2.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#EA4335" transparent opacity={0.06} />
      </line>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={connections} count={connections.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#34A853" transparent opacity={0.04} />
      </lineSegments>
    </group>
  );
};

/* ==========================================================
   MOUSE FOLLOWER SPHERE – Interactive glowing orb following cursor
   ========================================================== */
const MouseFollower = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const trailPositions = useRef(new Float32Array(30 * 3).fill(0));

  useFrame(() => {
    if (!meshRef.current) return;

    // Orb flies off screen in exit direction, bursting toward viewer
    const exitX = mouseStore.exitVelX * mouseStore.exitStrength;
    const exitY = mouseStore.exitVelY * mouseStore.exitStrength;
    const targetX = (mouseStore.x + exitX * 3) * 15;
    const targetY = (mouseStore.y + exitY * 3) * 10;
    const targetZ = 5 + mouseStore.exitStrength * 14;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.08;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.08;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.015;

    // Pulse more dramatically on exit
    const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 1 + mouseStore.exitStrength * 0.6;
    meshRef.current.scale.setScalar(pulse);

    // Update trail
    if (trailRef.current) {
      const positions = trailPositions.current;
      for (let i = positions.length - 3; i >= 3; i -= 3) {
        positions[i] = positions[i - 3];
        positions[i + 1] = positions[i - 2];
        positions[i + 2] = positions[i - 1];
      }
      positions[0] = meshRef.current.position.x;
      positions[1] = meshRef.current.position.y;
      positions[2] = meshRef.current.position.z;
      
      const geo = trailRef.current.geometry;
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 5]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#4285F4" wireframe transparent opacity={0.3} />
      </mesh>
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={trailPositions.current}
            count={10}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#4285F4" size={0.15} transparent opacity={0.2} sizeAttenuation />
      </points>
    </group>
  );
};

/* ==========================================================
   INTERACTIVE RIPPLES – Expanding rings on scroll
   ========================================================== */
const ScrollRipples = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ripples = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      scale: i * 0.5,
      speed: 0.01 + i * 0.002,
      opacity: 0.03 - i * 0.005,
      color: ['#4285F4', '#EA4335', '#34A853', '#FBBC05', '#4285F4'][i],
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const scrollY = window.scrollY;
    
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const r = ripples[i];
      // Ripples expand outward dramatically on mouse exit
      const exitExpand = mouseStore.exitStrength * (i + 1) * 0.8;
      const baseScale = 2 + r.scale + scrollY * 0.002 + exitExpand;
      mesh.scale.setScalar(baseScale);
      mesh.rotation.z += r.speed;
    });

    groupRef.current.position.z = -10 - scrollY * 0.005 + mouseStore.exitStrength * 5;
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {ripples.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3 + i, 0.02, 8, 64]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  );
};

/* ==========================================================
   GLOBAL 3D SCENE – Persistent immersive 3D background
   ========================================================== */
const Scene3DInner = () => {
  useMouseTracker();
  
  return (
    <>
      <ScrollCamera />
      <WireframeShapes />
      <DepthParticles />
      <GridFloor />
      <AmbientRings />
      <ConnectionWeb />
      <DnaHelix />
      <MouseFollower />
      <ScrollRipples />
    </>
  );
};

export const GlobalScene3D = () => (
  <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene3DInner />
    </Canvas>
  </div>
);
