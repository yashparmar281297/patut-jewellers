"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#d9a84e";

function useDiamondGeometry(size = 1) {
  return useMemo(() => {
    // Brilliant-cut profile (radius, height), lathed with few segments so every face reads as a facet.
    const profile = [
      [0, -0.42],
      [0.33, -0.02],
      [0.34, 0.0],
      [0.34, 0.03],
      [0.2, 0.2],
      [0, 0.2],
    ].map(([r, y]) => new THREE.Vector2(r * size, y * size));
    const geometry = new THREE.LatheGeometry(profile, 16);
    return geometry.toNonIndexed();
  }, [size]);
}

function DiamondMaterial() {
  return (
    // Mirror-like facets plus iridescence read as brilliance and "fire" on a dark background,
    // where a transmissive material would only show the black behind it.
    <meshPhysicalMaterial
      color="#ffffff"
      emissive="#e4ebf7"
      emissiveIntensity={0.42}
      metalness={0.65}
      roughness={0.02}
      clearcoat={1}
      clearcoatRoughness={0}
      iridescence={1}
      iridescenceIOR={1.9}
      iridescenceThicknessRange={[200, 900]}
      envMapIntensity={4.5}
      flatShading
    />
  );
}

function GoldMaterial({ roughness = 0.16 }: { roughness?: number }) {
  return <meshStandardMaterial color={GOLD} metalness={1} roughness={roughness} envMapIntensity={1.6} />;
}

function SolitaireRing() {
  const group = useRef<THREE.Group>(null);
  const diamond = useDiamondGeometry(1);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    // Gentle parallax toward the pointer
    const { x, y } = state.pointer;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.25 + 0.15, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x * 0.15, 0.05);
  });

  const prongs = [0, 1, 2, 3].map((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    return [Math.cos(a) * 0.26, Math.sin(a) * 0.26] as const;
  });

  return (
    <group ref={group}>
      {/* Band */}
      <mesh castShadow>
        <torusGeometry args={[1, 0.11, 64, 220]} />
        <GoldMaterial />
      </mesh>

      {/* Setting basket */}
      <group position={[0, 1.16, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.12, 0.16, 32]} />
          <GoldMaterial />
        </mesh>
        {prongs.map(([px, pz], i) => (
          <mesh key={i} position={[px, 0.26, pz]} rotation={[pz * 0.9, 0, -px * 0.9]}>
            <cylinderGeometry args={[0.022, 0.028, 0.42, 12]} />
            <GoldMaterial />
          </mesh>
        ))}
        {/* The diamond, table facing up */}
        <mesh geometry={diamond} position={[0, 0.46, 0]} scale={0.95}>
          <DiamondMaterial />
        </mesh>
      </group>
    </group>
  );
}

function FloatingGem({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useDiamondGeometry(1);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.z += delta * speed * 0.3;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} geometry={geometry} position={position} scale={scale}>
        <DiamondMaterial />
      </mesh>
    </Float>
  );
}

function FloatingBand({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.25;
    ref.current.rotation.y += delta * 0.4;
  });
  return (
    <Float speed={1.1} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[1, 0.18, 48, 160]} />
        <GoldMaterial roughness={0.2} />
      </mesh>
    </Float>
  );
}

function StudioLights() {
  return (
    <Environment resolution={256}>
      {/* Warm mid-tone backdrop so facets never reflect pure black */}
      <color attach="background" args={["#4a3a2a"]} />
      <Lightformer form="ring" intensity={6} position={[0, 0, 6]} scale={3} color="#ffffff" />
      <Lightformer form="rect" intensity={5} position={[-4, 3, 4]} scale={[3, 3, 1]} color="#fff6e6" />
      <Lightformer form="rect" intensity={4} position={[4, -2, 4]} scale={[2, 4, 1]} color="#e9f0ff" />
      <group rotation={[-Math.PI / 3, 0, 0]}>
        <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
          <Lightformer key={i} form="circle" intensity={3} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
        ))}
        <Lightformer intensity={2.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} color="#ffe7b8" />
        <Lightformer intensity={2.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} color="#fff4e0" />
      </group>
    </Environment>
  );
}

function Responsive({ children }: { children: React.ReactNode }) {
  const { width, height } = useThree((state) => state.viewport);
  // Shrink the composition when the canvas is narrow or short so the ring stays in frame.
  const scale = Math.min(1, width / 5.2, height / 3.6);
  return <group scale={scale}>{children}</group>;
}

export default function JewelScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5.6], fov: 35 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <ambientLight intensity={0.3} />
      <spotLight position={[4, 6, 5]} angle={0.4} penumbra={1} intensity={60} color="#fff1d6" />
      <pointLight position={[-4, -2, 3]} intensity={20} color="#e6c47f" />

      <Responsive>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <group position={[0, -0.35, 0]} rotation={[0.15, 0, 0]}>
            <SolitaireRing />
          </group>
        </Float>

        <FloatingGem position={[-2.1, 1.1, -0.8]} scale={0.55} speed={0.6} />
        <FloatingGem position={[2.2, -0.9, -0.4]} scale={0.4} speed={0.9} />
        <FloatingGem position={[1.7, 1.55, -1.6]} scale={0.3} speed={0.7} />
        <FloatingBand position={[-1.9, -1.3, -1.2]} scale={0.32} />
      </Responsive>

      <Sparkles count={60} scale={[7, 5, 3]} size={3} speed={0.35} color="#c39fba" opacity={0.95} />

      <ContactShadows position={[0, -1.9, 0]} opacity={0.35} scale={8} blur={2.8} far={3} color="#7b5321" />
      <StudioLights />
    </Canvas>
  );
}
