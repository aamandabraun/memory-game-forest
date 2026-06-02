import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MemoryCard, SYMBOL_COLORS } from "../types";
import { CardSymbol3D } from "./CardSymbol3D";

interface Props {
  card: MemoryCard;
  position: [number, number, number];
  tableFlipped?: boolean;
  onClick: () => void;
}

export function Card3D({ card, position, tableFlipped, onClick }: Props) {
  const ref = useRef<THREE.Group>(null);
  const targetY = useRef(0);
  const hover = useRef(false);

  useFrame((_, dt) => {
    if (!ref.current) return;
    targetY.current = card.flipped || card.matched ? Math.PI : 0;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetY.current,
      Math.min(1, dt * 8),
    );
    const liftTarget = hover.current && !card.flipped && !card.matched ? 0.25 : 0;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1] + liftTarget, dt * 10);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0], dt * 6);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, position[2], dt * 6);
    const targetScale = card.matched ? 0.9 : 1;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, dt * 6);
    ref.current.scale.set(s, s, s);
  });

  const backMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#2a6cb8",
      roughness: 0.6,
      flatShading: true,
      emissive: "#1a4078",
      emissiveIntensity: 0.2,
    }),
    [],
  );
  const frontMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: card.matched ? "#fff2a0" : "#fffaeb",
      roughness: 0.7,
      flatShading: true,
      emissive: card.matched ? "#d4a020" : "#000000",
      emissiveIntensity: card.matched ? 0.35 : 0,
    }),
    [card.matched],
  );

  const W = 1.15;
  const H = 0.1;
  const D = 1.45;
  const showFace = card.flipped || card.matched;

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); hover.current = true; document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { hover.current = false; document.body.style.cursor = "default"; }}
    >
      <mesh material={backMat} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
      </mesh>
      <mesh position={[0, -H / 2 - 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[W * 0.42, W * 0.5, 4]} />
        <meshStandardMaterial color="#ffd84a" side={THREE.DoubleSide} flatShading emissive="#806020" emissiveIntensity={0.3} />
      </mesh>
      <mesh material={frontMat} position={[0, H / 2 + 0.001, 0]} rotation={[Math.PI, 0, 0]}>
        <boxGeometry args={[W * 0.92, 0.005, D * 0.94]} />
      </mesh>
      <mesh position={[0, H / 2 + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[W * 0.45, W * 0.5, 4]} />
        <meshStandardMaterial color="#ffd84a" side={THREE.DoubleSide} flatShading emissive="#806020" emissiveIntensity={0.25} />
      </mesh>

      {showFace && !card.empty && (
        <group
          position={[0, H / 2 + 0.05, 0]}
          rotation={[Math.PI, 0, tableFlipped ? Math.PI : 0]}
        >
          <CardSymbol3D symbol={card.displayedSymbol} />
        </group>
      )}

      {showFace && card.empty && (
        <mesh position={[0, H / 2 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.12, 0.18, 16]} />
          <meshStandardMaterial color="#cdb89a" flatShading />
        </mesh>
      )}

      {!showFace && card.peeking && !card.empty && (
        <PeekingHead symbol={card.displayedSymbol} cardW={W} cardD={D} />
      )}
    </group>
  );
}

function PeekingHead({ symbol, cardW, cardD }: { symbol: MemoryCard["symbol"]; cardW: number; cardD: number }) {
  const ref = useRef<THREE.Group>(null);
  const c = SYMBOL_COLORS[symbol];
  const head = useMemo(
    () => new THREE.MeshStandardMaterial({ color: c.body, roughness: 0.7, flatShading: true }),
    [c.body],
  );
  const accent = useMemo(
    () => new THREE.MeshStandardMaterial({ color: c.accent, roughness: 0.7, flatShading: true }),
    [c.accent],
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1a1410", roughness: 0.5, flatShading: true }),
    [],
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = 0.07 + Math.sin(t * 4) * 0.015;
    ref.current.rotation.y = Math.sin(t * 2) * 0.25;
  });
  return (
    <group ref={ref} position={[cardW * 0.05, 0.07, cardD * 0.5]}>
      <mesh material={head} castShadow>
        <sphereGeometry args={[0.16, 12, 10]} />
      </mesh>
      <mesh material={head} position={[-0.1, 0.13, 0]}>
        <coneGeometry args={[0.05, 0.1, 6]} />
      </mesh>
      <mesh material={head} position={[0.1, 0.13, 0]}>
        <coneGeometry args={[0.05, 0.1, 6]} />
      </mesh>
      <mesh material={dark} position={[-0.06, 0.03, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
      </mesh>
      <mesh material={dark} position={[0.06, 0.03, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
      </mesh>
      <mesh material={accent} position={[0, -0.03, 0.14]}>
        <sphereGeometry args={[0.05, 8, 8]} />
      </mesh>
    </group>
  );
}
