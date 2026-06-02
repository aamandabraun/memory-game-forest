import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function DaySky() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 16; c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#3b8ad9");
    g.addColorStop(0.55, "#7fc1ec");
    g.addColorStop(1, "#fef3b8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0, 10, -22]} rotation={[0, 0, 0]}>
      <planeGeometry args={[120, 60]} />
      <meshBasicMaterial map={tex} depthWrite={false} />
    </mesh>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, flatShading: true, emissive: "#cce4ff", emissiveIntensity: 0.15 }),
    [],
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.1) * 0.3;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh material={mat}><sphereGeometry args={[0.8, 6, 5]} /></mesh>
      <mesh material={mat} position={[0.8, 0.1, 0]}><sphereGeometry args={[0.6, 6, 5]} /></mesh>
      <mesh material={mat} position={[-0.7, -0.1, 0]}><sphereGeometry args={[0.55, 6, 5]} /></mesh>
      <mesh material={mat} position={[0.3, 0.4, 0]}><sphereGeometry args={[0.5, 6, 5]} /></mesh>
    </group>
  );
}

function Hills() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5a9ad0", roughness: 1, flatShading: true }), []);
  const peaks = [
    [-9, 0, -15, 2.4, 5],
    [-3, 0, -15.5, 2.8, 6],
    [2, 0, -15.2, 2.6, 5.5],
    [8, 0, -15, 2.2, 4.5],
  ] as const;
  return (
    <group>
      {peaks.map(([x, y, z, h, r], i) => (
        <mesh key={i} material={mat} position={[x, y + h / 2 - 0.5, z]}>
          <coneGeometry args={[r, h, 5]} />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, scale = 1, leafColor = "#f6d24a" }: { position: [number, number, number]; scale?: number; leafColor?: string }) {
  const trunk = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2c4a6a", roughness: 0.95, flatShading: true }), []);
  const leaf = useMemo(() => new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.85, flatShading: true }), [leafColor]);
  return (
    <group position={position} scale={scale}>
      <mesh material={trunk} position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 1.2, 6]} />
      </mesh>
      <mesh material={leaf} position={[0, 1.6, 0]} castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
      </mesh>
      <mesh material={leaf} position={[0.4, 1.95, 0.2]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
      </mesh>
      <mesh material={leaf} position={[-0.3, 2.05, -0.15]} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
      </mesh>
    </group>
  );
}

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6a8aae", roughness: 1, flatShading: true }), []);
  return (
    <mesh material={mat} position={position} scale={scale} rotation={[Math.random(), Math.random(), 0]} castShadow>
      <dodecahedronGeometry args={[0.4, 0]} />
    </mesh>
  );
}

function Flower({ position }: { position: [number, number, number] }) {
  const stem = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3a7a8a", flatShading: true }), []);
  const petal = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffd84a", emissive: "#a07020", emissiveIntensity: 0.3, flatShading: true }), []);
  const center = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ff9a30", flatShading: true }), []);
  return (
    <group position={position}>
      <mesh material={stem} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 4]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} material={petal} position={[Math.cos(a) * 0.1, 0.42, Math.sin(a) * 0.1]}>
            <sphereGeometry args={[0.07, 4, 3]} />
          </mesh>
        );
      })}
      <mesh material={center} position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.06, 6, 4]} />
      </mesh>
    </group>
  );
}

function Pond({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#4ab4f0", emissive: "#2080c8", emissiveIntensity: 0.4,
    roughness: 0.2, metalness: 0.6, flatShading: true,
  }), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mat.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.1;
  });
  return (
    <mesh ref={ref} material={mat} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[1.6, 16]} />
    </mesh>
  );
}

function Butterflies({ count = 14 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12;
      p[i * 3 + 1] = 0.5 + Math.random() * 2.5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      s[i] = Math.random() * Math.PI * 2;
    }
    return { positions: p, seeds: s };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += Math.sin(t * 1.2 + seeds[i]) * 0.008;
      arr[i * 3 + 1] += Math.cos(t * 0.9 + seeds[i] * 1.3) * 0.006;
      arr[i * 3 + 2] += Math.sin(t * 0.7 + seeds[i] * 2) * 0.005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffe760"
        size={0.22}
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function CafeDiorama() {
  const ground = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#7ec96a", roughness: 1, flatShading: true }),
    [],
  );
  const platform = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3a7ec0", roughness: 0.6, flatShading: true }),
    [],
  );

  const trees = useMemo(
    () =>
      [
        [-9.0, -7.5, 1.6, "#f6d24a"],
        [-6.2, -8.2, 1.4, "#ffe070"],
        [-3.0, -8.8, 1.7, "#9ad96a"],
        [0.5, -9.2, 1.5, "#f0c040"],
        [3.8, -8.6, 1.6, "#ffe060"],
        [6.8, -8.0, 1.3, "#bfe080"],
        [9.2, -7.2, 1.5, "#f6d24a"],
        [-8.5, -4.5, 1.2, "#ffe070"],
        [-4.8, -5.8, 1.0, "#9ad96a"],
        [-1.5, -6.4, 1.3, "#f6d24a"],
        [2.2, -6.2, 1.1, "#ffe060"],
        [5.4, -5.5, 1.4, "#f0c040"],
        [8.8, -4.8, 1.1, "#bfe080"],
        [-9.5, -1.5, 1.3, "#f0c040"],
        [9.6, -1.2, 1.2, "#ffe060"],
        [-8.8, 1.2, 1.0, "#9ad96a"],
        [9.0, 1.5, 1.1, "#f6d24a"],
        [-7.2, 4.5, 0.95, "#ffe070"],
        [7.5, 4.8, 1.0, "#f0c040"],
      ] as const,
    [],
  );

  return (
    <group>
      <mesh position={[0, 8, -22]}>
        <planeGeometry args={[120, 60]} />
        <meshBasicMaterial color="#7ec96a" />
      </mesh>

      <mesh material={ground} position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 32]} />
      </mesh>

      <mesh material={platform} position={[0, -0.6, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.4, 3.6, 0.3, 16]} />
      </mesh>
      <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.3, 16]} />
        <meshStandardMaterial color="#ffd84a" side={THREE.DoubleSide} flatShading emissive="#a07020" emissiveIntensity={0.2} />
      </mesh>

      {/* Lago e pedras */}
      <Pond position={[-4.8, -0.83, -1.0]} />
      <Rock position={[-3.4, -0.7, -0.2]} scale={0.8} />
      <Rock position={[-6.2, -0.7, -0.8]} scale={1.1} />
      <Rock position={[-4.2, -0.7, -2.8]} scale={0.9} />
      <Rock position={[-6.5, -0.7, 1.5]} scale={0.7} />

      <Pond position={[1.5, -0.83, 5.5]} />
      <Rock position={[0.8, -0.6, 5.8]} scale={1.4} />
      <Rock position={[-0.6, -0.6, 6.5]} scale={1.2} />
      <Rock position={[-1.2, -0.6, 4.8]} scale={1.3} />

      <Rock position={[6.4, -0.7, 0.8]} scale={0.9} />
      <Rock position={[5.8, -0.7, -2.2]} scale={0.8} />
      <Rock position={[-7.8, -0.7, -5.0]} scale={1.1} />
      <Rock position={[7.2, -0.7, -4.5]} scale={1.0} />
      <Rock position={[-5.2, -0.7, 4.0]} scale={0.7} />

      {trees.map(([x, z, s, c], i) => (
        <Tree key={i} position={[x as number, -0.85, z as number]} scale={s as number} leafColor={c as string} />
      ))}

      {/* Flores */}
      <Flower position={[-2.0, -0.85, 2.6]} />
      <Flower position={[2.2, -0.85, 2.6]} />
      <Flower position={[-1.0, -0.85, 3.4]} />
      <Flower position={[1.0, -0.85, 3.4]} />
      <Flower position={[-5.5, -0.85, 1.8]} />
      <Flower position={[5.5, -0.85, 1.8]} />
      <Flower position={[-4.5, -0.85, -0.5]} />
      <Flower position={[4.5, -0.85, -0.5]} />
      <Flower position={[-6.0, -0.85, -3.5]} />
      <Flower position={[6.0, -0.85, -3.5]} />
      <Flower position={[-1.5, -0.85, 5.5]} />
      <Flower position={[1.5, -0.85, 5.5]} />
      <Flower position={[-3.8, -0.85, -6.0]} />
      <Flower position={[3.5, -0.85, -6.2]} />
      <Flower position={[0, -0.85, -7.0]} />

      <Butterflies count={20} />
    </group>
  );
}