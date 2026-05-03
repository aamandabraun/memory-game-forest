import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CardSymbol, SYMBOL_COLORS } from "../types";

/**
 * Animais low-poly — cada um é uma pequena escultura usando primitivas
 * (esferas, caixas, cones). Mantém poucos polígonos pra rodar leve.
 */
export function CardSymbol3D({ symbol }: { symbol: CardSymbol }) {
  const ref = useRef<THREE.Group>(null);
  // Animal MUITO maior e bem visível
  const BASE_SCALE = 0.7;
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.5;
      const s = 1 + Math.sin(performance.now() * 0.003) * 0.05;
      ref.current.scale.setScalar(BASE_SCALE * s);
    }
  });

  const c = SYMBOL_COLORS[symbol];
  const body = useMemo(() => new THREE.MeshStandardMaterial({
    color: c.body, roughness: 0.7, flatShading: true,
  }), [c.body]);
  const accent = useMemo(() => new THREE.MeshStandardMaterial({
    color: c.accent, roughness: 0.7, flatShading: true,
  }), [c.accent]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1410", roughness: 0.5, flatShading: true,
  }), []);

  return (
    <group ref={ref} position={[0, 0.15, 0]} scale={0.7}>
      {symbol === "fox" && (
        <group>
          {/* corpo */}
          <mesh material={body} position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.45, 0.5]} />
          </mesh>
          {/* cabeça */}
          <mesh material={body} position={[0, 0.15, 0.45]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          </mesh>
          {/* focinho claro */}
          <mesh material={accent} position={[0, 0.05, 0.7]}>
            <boxGeometry args={[0.3, 0.25, 0.2]} />
          </mesh>
          {/* orelhas triangulares */}
          <mesh material={body} position={[-0.18, 0.45, 0.4]}>
            <coneGeometry args={[0.12, 0.25, 4]} />
          </mesh>
          <mesh material={body} position={[0.18, 0.45, 0.4]}>
            <coneGeometry args={[0.12, 0.25, 4]} />
          </mesh>
          {/* cauda */}
          <mesh material={accent} position={[0, 0.05, -0.4]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.18, 0.5, 6]} />
          </mesh>
        </group>
      )}

      {symbol === "owl" && (
        <group>
          {/* corpo gordinho */}
          <mesh material={body}>
            <sphereGeometry args={[0.55, 8, 6]} />
          </mesh>
          {/* peito claro */}
          <mesh material={accent} position={[0, -0.05, 0.3]}>
            <sphereGeometry args={[0.35, 8, 6]} />
          </mesh>
          {/* olhos enormes */}
          <mesh material={accent} position={[-0.18, 0.2, 0.42]}>
            <sphereGeometry args={[0.16, 8, 6]} />
          </mesh>
          <mesh material={accent} position={[0.18, 0.2, 0.42]}>
            <sphereGeometry args={[0.16, 8, 6]} />
          </mesh>
          <mesh material={dark} position={[-0.18, 0.2, 0.55]}>
            <sphereGeometry args={[0.07, 6, 6]} />
          </mesh>
          <mesh material={dark} position={[0.18, 0.2, 0.55]}>
            <sphereGeometry args={[0.07, 6, 6]} />
          </mesh>
          {/* bico */}
          <mesh material={dark} position={[0, 0.05, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.15, 4]} />
          </mesh>
        </group>
      )}

      {symbol === "frog" && (
        <group>
          <mesh material={body}>
            <sphereGeometry args={[0.5, 8, 6]} />
          </mesh>
          {/* barriga */}
          <mesh material={accent} position={[0, -0.15, 0.2]} scale={[0.9, 0.5, 0.5]}>
            <sphereGeometry args={[0.4, 8, 6]} />
          </mesh>
          {/* olhos saltados */}
          <mesh material={body} position={[-0.22, 0.35, 0.15]}>
            <sphereGeometry args={[0.18, 8, 6]} />
          </mesh>
          <mesh material={body} position={[0.22, 0.35, 0.15]}>
            <sphereGeometry args={[0.18, 8, 6]} />
          </mesh>
          <mesh material={dark} position={[-0.22, 0.42, 0.28]}>
            <sphereGeometry args={[0.08, 6, 6]} />
          </mesh>
          <mesh material={dark} position={[0.22, 0.42, 0.28]}>
            <sphereGeometry args={[0.08, 6, 6]} />
          </mesh>
        </group>
      )}

      {symbol === "bunny" && (
        <group>
          <mesh material={body}>
            <sphereGeometry args={[0.4, 8, 6]} />
          </mesh>
          {/* cabeça */}
          <mesh material={body} position={[0, 0.45, 0.1]}>
            <sphereGeometry args={[0.32, 8, 6]} />
          </mesh>
          {/* orelhas longas */}
          <mesh material={body} position={[-0.12, 0.85, 0.05]}>
            <capsuleGeometry args={[0.07, 0.4, 4, 6]} />
          </mesh>
          <mesh material={body} position={[0.12, 0.85, 0.05]}>
            <capsuleGeometry args={[0.07, 0.4, 4, 6]} />
          </mesh>
          {/* dentro orelha */}
          <mesh material={accent} position={[-0.12, 0.85, 0.12]} scale={[0.5, 1, 0.3]}>
            <capsuleGeometry args={[0.07, 0.35, 4, 6]} />
          </mesh>
          <mesh material={accent} position={[0.12, 0.85, 0.12]} scale={[0.5, 1, 0.3]}>
            <capsuleGeometry args={[0.07, 0.35, 4, 6]} />
          </mesh>
          {/* rabinho */}
          <mesh material={accent} position={[0, -0.05, -0.4]}>
            <sphereGeometry args={[0.13, 6, 6]} />
          </mesh>
        </group>
      )}

      {symbol === "deer" && (
        <group>
          {/* corpo */}
          <mesh material={body} position={[0, 0, 0]}>
            <boxGeometry args={[0.45, 0.4, 0.7]} />
          </mesh>
          {/* pescoço */}
          <mesh material={body} position={[0, 0.3, 0.35]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 0.25]} />
          </mesh>
          {/* cabeça */}
          <mesh material={body} position={[0, 0.55, 0.5]}>
            <boxGeometry args={[0.28, 0.3, 0.4]} />
          </mesh>
          {/* chifres */}
          <mesh material={dark} position={[-0.1, 0.85, 0.4]}>
            <coneGeometry args={[0.04, 0.3, 4]} />
          </mesh>
          <mesh material={dark} position={[0.1, 0.85, 0.4]}>
            <coneGeometry args={[0.04, 0.3, 4]} />
          </mesh>
          {/* manchas claras */}
          <mesh material={accent} position={[0, 0.05, -0.2]}>
            <sphereGeometry args={[0.1, 6, 4]} />
          </mesh>
        </group>
      )}

      {symbol === "bear" && (
        <group>
          <mesh material={body}>
            <sphereGeometry args={[0.5, 8, 6]} />
          </mesh>
          {/* focinho */}
          <mesh material={accent} position={[0, -0.05, 0.4]}>
            <sphereGeometry args={[0.22, 8, 6]} />
          </mesh>
          {/* orelhas redondas */}
          <mesh material={body} position={[-0.32, 0.35, 0.05]}>
            <sphereGeometry args={[0.15, 6, 6]} />
          </mesh>
          <mesh material={body} position={[0.32, 0.35, 0.05]}>
            <sphereGeometry args={[0.15, 6, 6]} />
          </mesh>
          {/* nariz */}
          <mesh material={dark} position={[0, 0, 0.55]}>
            <sphereGeometry args={[0.08, 6, 6]} />
          </mesh>
          {/* olhinhos */}
          <mesh material={dark} position={[-0.15, 0.15, 0.45]}>
            <sphereGeometry args={[0.05, 6, 6]} />
          </mesh>
          <mesh material={dark} position={[0.15, 0.15, 0.45]}>
            <sphereGeometry args={[0.05, 6, 6]} />
          </mesh>
        </group>
      )}

      {symbol === "fish" && (
        <group rotation={[0, Math.PI / 2, 0]}>
          {/* corpo elipsoidal */}
          <mesh material={body} scale={[1.2, 0.7, 0.5]}>
            <sphereGeometry args={[0.45, 8, 6]} />
          </mesh>
          {/* cauda */}
          <mesh material={body} position={[-0.55, 0, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.25, 0.35, 4]} />
          </mesh>
          {/* nadadeira topo */}
          <mesh material={accent} position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.12, 0.3, 3]} />
          </mesh>
          {/* olho */}
          <mesh material={accent} position={[0.35, 0.1, 0.2]}>
            <sphereGeometry args={[0.08, 6, 6]} />
          </mesh>
          <mesh material={dark} position={[0.4, 0.1, 0.22]}>
            <sphereGeometry args={[0.04, 6, 6]} />
          </mesh>
        </group>
      )}

      {symbol === "snail" && (
        <group>
          {/* concha (espiral fake = torus + cone) */}
          <mesh material={accent} position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.2, 6, 12]} />
          </mesh>
          <mesh material={body} position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.18, 6, 6]} />
          </mesh>
          {/* corpo (base) */}
          <mesh material={body} position={[0, -0.2, 0.25]} scale={[0.8, 0.4, 1.4]}>
            <sphereGeometry args={[0.3, 6, 6]} />
          </mesh>
          {/* antenas */}
          <mesh material={body} position={[-0.08, 0.05, 0.55]}>
            <capsuleGeometry args={[0.025, 0.2, 3, 4]} />
          </mesh>
          <mesh material={body} position={[0.08, 0.05, 0.55]}>
            <capsuleGeometry args={[0.025, 0.2, 3, 4]} />
          </mesh>
          <mesh material={dark} position={[-0.08, 0.18, 0.55]}>
            <sphereGeometry args={[0.04, 4, 4]} />
          </mesh>
          <mesh material={dark} position={[0.08, 0.18, 0.55]}>
            <sphereGeometry args={[0.04, 4, 4]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
