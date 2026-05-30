import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

type Palette = {
  grid: string;
  glow: string;
  stars: string;
  beam: string;
};

function paletteForTheme(theme: 'amber' | 'violet'): Palette {
  if (theme === 'violet') {
    return {
      grid: '#a78bfa',
      glow: '#818cf8',
      stars: '#c4b5fd',
      beam: '#c084fc',
    };
  }
  return {
    grid: '#fbbf24',
    glow: '#fb923c',
    stars: '#fde68a',
    beam: '#7dd3fc',
  };
}

/**
 * Big undulating wave grid plane — Stripe/Linear-style.
 * Subdivided plane, vertices animate via sine/cosine on each frame.
 */
function WaveGrid({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const size = 60;
    const segments = 90;
    return new THREE.PlaneGeometry(size, size, segments, segments);
  }, []);

  // Pre-compute "phase" attribute so different rows wave a bit differently
  useMemo(() => {
    const positions = geometry.attributes.position;
    const phases = new Float32Array(positions.count);
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      phases[i] = Math.atan2(y, x);
    }
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
  }, [geometry]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      // Layered waves — main slow swell + faster ripples + radial component
      const wave =
        Math.sin(x * 0.18 + t * 0.6) * 0.55 +
        Math.cos(y * 0.18 + t * 0.45) * 0.55 +
        Math.sin(dist * 0.25 - t * 0.9) * 0.4;
      positions.setZ(i, wave);
    }
    positions.needsUpdate = true;

    // Gentle yaw on both layers so the plane breathes
    if (ref.current) ref.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    if (pointsRef.current) pointsRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <group position={[0, -2.4, 0]} rotation={[-Math.PI / 2.4, 0, 0]}>
      {/* Wireframe lines */}
      <mesh ref={ref} geometry={geometry}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
      </mesh>
      {/* Glowing dots at the same positions */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          color={color}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/**
 * Drifting background stars / particles — atmospheric depth behind the grid.
 */
function StarField({ color, count = 240 }: { color: string; count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread across a wide volume above & around the grid
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 18 - 1; // mostly above the grid
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * A single soft horizon "sun" disc — adds a focal point on the horizon line.
 */
function Horizon({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    // gentle pulse
    const s = 1 + Math.sin(t * 0.6) * 0.04;
    ref.current.scale.set(s, s, 1);
  });
  return (
    <mesh ref={ref} position={[0, 1.3, -10]}>
      <circleGeometry args={[2.4, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/**
 * Three faint light beams emanating outward from the horizon — like rays through fog.
 */
function HorizonBeams({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.08;
  });
  const beams = [
    { rotation: 0, opacity: 0.10 },
    { rotation: 0.25, opacity: 0.07 },
    { rotation: -0.25, opacity: 0.07 },
  ];
  return (
    <group ref={group} position={[0, 1.3, -9.5]}>
      {beams.map((b, i) => (
        <mesh key={i} rotation={[0, 0, b.rotation]} position={[0, 7, 0]}>
          <planeGeometry args={[0.6, 18]} />
          <meshBasicMaterial color={color} transparent opacity={b.opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  const { theme } = useTheme();
  const palette = paletteForTheme(theme);

  return (
    <Canvas
      camera={{ position: [0, 1.6, 9], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />

        {/* Background atmosphere */}
        <StarField color={palette.stars} count={260} />

        {/* Horizon glow */}
        <Horizon color={palette.glow} />
        <HorizonBeams color={palette.beam} />

        {/* Main wave grid */}
        <WaveGrid color={palette.grid} />
      </Suspense>
    </Canvas>
  );
}
