"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- ANIMASI UTILITY 3D (MUNCUL DENGAN JEDA WAKTU) ---
function Muncul3D({ children, jedaWaktu = 0 }: { children: React.ReactNode; jedaWaktu?: number }) {
  const refGrup = useRef<THREE.Group>(null);
  const akumulasiWaktu = useRef(0);
  
  useFrame((_, delta) => {
    akumulasiWaktu.current += delta;
    if (refGrup.current && akumulasiWaktu.current >= jedaWaktu) {
      const skalaTarget = 1;
      const skalaHalus = THREE.MathUtils.damp(refGrup.current.scale.x, skalaTarget, 12, delta);
      refGrup.current.scale.set(skalaHalus, skalaHalus, skalaHalus);
    }
  });

  return (
    <group ref={refGrup} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

// --- KOMPONEN UTAMA 3D: PULAU DIGITAL EKO ---
export default function PulauDigitalEko() {
  const refPulau = useRef<THREE.Group>(null);
  const refBalingTurbin = useRef<THREE.Mesh>(null);

  // Animasi Mengapung & Rotasi Lambat Idle
  useFrame(({ clock }) => {
    if (refPulau.current) {
      refPulau.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (refBalingTurbin.current) {
      // Kincir angin berputar konstan mewakili energi terbarukan
      refBalingTurbin.current.rotation.z = clock.getElapsedTime() * 1.5;
    }
  });

  // Konstruksi Lampu Indikator Server (Data Center Emisi)
  const lampuServer = useMemo(() => {
    return [...Array(6)].map((_, indeks) => ({
      posisi: [
        -0.4 + (indeks % 2) * 0.15, 
        0.3 + Math.floor(indeks / 2) * 0.2, 
        0.51
      ] as [number, number, number],
      warna: indeks % 3 === 0 ? "#ef4444" : "#10b981" // Merah (Beban) & Hijau (Eko)
    }));
  }, []);

  return (
    <group ref={refPulau} position={[0, -0.2, 0]}>
      
      {/* 1. DASAR PULAU (Heksagonal Low-Poly Platform) */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2, 2.2, 0.4, 6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} flatShading />
      </mesh>
      
      {/* Lapisan Rumput Sisi Alam */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.95, 1.95, 0.4, 6]} />
        <meshStandardMaterial color="#10b981" roughness={0.9} flatShading />
      </mesh>

      {/* Lapisan Aspal/Server Sisi Digital (Kontras Grid Geometri) */}
      <mesh position={[-0.5, 0.23, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.02, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* ================= SISI DIGITAL: CLUSTER SERVER ================= */}
      <group position={[-0.5, 0.25, 0.4]}>
        <Muncul3D jedaWaktu={0.2}>
          {/* Rak Server Utama */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[0.8, 1.0, 0.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Neon Glow Data Bar */}
          <mesh position={[0, 0.5, 0.41]}>
            <boxGeometry args={[0.6, 0.04, 0.02]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} />
          </mesh>
          {/* Lampu Indikator Kedip */}
          {lampuServer.map((lampu, indeks) => (
            <mesh key={indeks} position={lampu.posisi}>
              <sphereGeometry args={[0.025, 4, 4]} />
              <meshStandardMaterial color={lampu.warna} emissive={lampu.warna} emissiveIntensity={0.8} />
            </mesh>
          ))}
        </Muncul3D>
      </group>

      {/* ================= SISI ALAM: ENERGI HIJAU & VEGETASI ================= */}
      {/* Kincir Angin (Turbin Angin) */}
      <group position={[0.8, 0.2, -0.6]}>
        <Muncul3D jedaWaktu={0.4}>
          {/* Tiang Utama */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 1.6, 6]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          {/* Kepala Generator */}
          <mesh position={[0, 1.6, 0.08]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          {/* Baling-Baling Generator */}
          <group position={[0, 1.6, 0.19]}>
            <mesh ref={refBalingTurbin} castShadow>
              <boxGeometry args={[1.2, 0.06, 0.02]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[1.2, 0.06, 0.02]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
            </mesh>
          </group>
        </Muncul3D>
      </group>

      {/* Cluster Pohon Makro */}
      <group position={[0.8, 0.2, 0.6]}>
        <Muncul3D jedaWaktu={0.6}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.05, 0.2, 4]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <coneGeometry args={[0.2, 0.4, 5]} />
            <meshStandardMaterial color="#047857" flatShading roughness={0.7} />
          </mesh>
        </Muncul3D>
      </group>

      <group position={[1.3, 0.2, 0.1]}>
        <Muncul3D jedaWaktu={0.7}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.04, 0.16, 4]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <coneGeometry args={[0.15, 0.32, 5]} />
            <meshStandardMaterial color="#065f46" flatShading roughness={0.7} />
          </mesh>
        </Muncul3D>
      </group>

    </group>
  );
}