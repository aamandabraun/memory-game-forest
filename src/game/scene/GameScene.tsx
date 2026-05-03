import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CafeDiorama } from "./CafeDiorama";
import { Card3D } from "./Card3D";
import { MemoryCard } from "../types";

interface Props {
  cards: MemoryCard[];
  shaking: boolean;
  tableFlipped: boolean;
  onCardClick: (id: number) => void;
}

function slotToPosition(slot: number): [number, number, number] {
  const col = slot % 4;
  const row = Math.floor(slot / 4);
  const x = (col - 1.5) * 1.3;
  const z = (row - 1.5) * 1.55 + 0.2;
  return [x, -0.4, z];
}

function CameraShake({ shaking }: { shaking: boolean }) {
  useFrame(({ camera, clock }) => {
    if (!shaking) return;
    const t = clock.getElapsedTime();
    camera.position.x += Math.sin(t * 50) * 0.02;
    camera.position.y += Math.cos(t * 47) * 0.02;
  });
  return null;
}

function Board({
  cards,
  tableFlipped,
  onCardClick,
}: Pick<Props, "cards" | "tableFlipped" | "onCardClick">) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = tableFlipped ? Math.PI : 0;
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      target,
      Math.min(1, dt * 4),
    );
  });
  return (
    <group ref={ref}>
      {cards.map((card) => (
        <Card3D
          key={card.id}
          card={card}
          position={slotToPosition(card.slot)}
          tableFlipped={tableFlipped}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </group>
  );
}

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));
  useEffect(() => {
    const onR = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onR);
    window.addEventListener("orientationchange", onR);
    return () => {
      window.removeEventListener("resize", onR);
      window.removeEventListener("orientationchange", onR);
    };
  }, []);
  return vp;
}

export function GameScene({ cards, shaking, tableFlipped, onCardClick }: Props) {
  const { w, h } = useViewport();
  const isPortrait = h > w;
  const isMobile = w < 640;

  let camPos: [number, number, number] = [0, 4.5, 7];
  let fov = 42;
  let boardScale = 1;
  if (isPortrait) {
  camPos = [0, 8, 11];
  fov = 44;
  boardScale = 0.78;
  } else if (isMobile) {
    camPos = [0, 5.2, 8.2];
    fov = 50;
  }

  return (
    <Canvas
      key={`${isPortrait}-${isMobile}`}
      shadows
      dpr={[1, 1.5]}
      camera={{ position: camPos, fov }}
      gl={{ antialias: true, powerPreference: "default" }}
    >
      <fog attach="fog" args={["#7ec96a", isPortrait ? 22 : 18, isPortrait ? 42 : 34]} />
      <color attach="background" args={["#7ec96a"]} />

      <ambientLight intensity={0.95} color="#fff5d0" />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.6}
        color="#fff2b0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 6, -2]} intensity={0.5} color="#a8d4ff" />

      <CafeDiorama />

      <group scale={boardScale}>
        <Board cards={cards} tableFlipped={tableFlipped} onCardClick={onCardClick} />
      </group>

      <CameraShake shaking={shaking} />
    </Canvas>
  );
}