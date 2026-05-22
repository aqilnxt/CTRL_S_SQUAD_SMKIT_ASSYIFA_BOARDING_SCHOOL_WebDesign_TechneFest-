"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- KOMPONEN UTILITAS ---
function Muncul3D({ children }: { children: React.ReactNode }) {
  const refGrup = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (refGrup.current) {
      const skalaHalus = THREE.MathUtils.damp(refGrup.current.scale.x, 1, 12, delta);
      refGrup.current.scale.set(skalaHalus, skalaHalus, skalaHalus);
    }
  });
  return <group ref={refGrup} scale={[0, 0, 0]}>{children}</group>;
}

// --- MODEL BANGUNAN (Y-Fixed & Transformasi Level) ---
function PanelSurya3D({ posisi, level }: { posisi: [number, number, number], level: number }) {
  const sudahCanggih = level >= 3;
  const warnaPanel = sudahCanggih ? "#fbbf24" : "#0284c7"; // Berubah emas di level 3

  return (
    <group position={posisi} scale={[0.8, 0.8, 0.8]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 0.3]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.3]} />
        <meshStandardMaterial color={warnaPanel} metalness={sudahCanggih ? 1 : 0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TurbinAngin3D({ posisi, level }: { posisi: [number, number, number], level: number }) {
  const refBaling = useRef<THREE.Group>(null);
  const sudahCanggih = level >= 3;
  const pengaliKecepatan = sudahCanggih ? 2 : 1;

  useFrame(() => {
    if (refBaling.current) refBaling.current.rotation.z -= 0.05 * pengaliKecepatan;
  });

  return (
    <group position={posisi} scale={[1, 1, 1]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.08, 1]} />
        <meshStandardMaterial color={sudahCanggih ? "#cbd5e1" : "#f8fafc"} metalness={sudahCanggih ? 0.5 : 0} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.2]} />
        <meshStandardMaterial color={sudahCanggih ? "#3b82f6" : "#e2e8f0"} />
      </mesh>
      <group ref={refBaling} position={[0, 1, 0.12]}>
        {[0, Math.PI/2, Math.PI, (3*Math.PI)/2].map((rotasi, i) => (
          <mesh key={i} position={[Math.sin(rotasi)*0.3, Math.cos(rotasi)*0.3, 0]} rotation={[0, 0, -rotasi]} castShadow>
            <boxGeometry args={[0.04, 0.6, 0.02]} />
            <meshStandardMaterial color={sudahCanggih ? "#60a5fa" : "#f1f5f9"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function PabrikDigital3D({ posisi, warna, level }: { posisi: [number, number, number], warna: string, level: number }) {
  const sudahCanggih = level >= 3;
  const warnaBangunan = sudahCanggih ? "#ffffff" : warna;

  return (
    <group position={posisi}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={warnaBangunan} roughness={sudahCanggih ? 0.2 : 0.8} />
      </mesh>
      <mesh position={[0.1, 0.4, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.2]} />
        <meshStandardMaterial color={sudahCanggih ? "#3b82f6" : "#334155"} emissive={sudahCanggih ? "#3b82f6" : "#000"} emissiveIntensity={sudahCanggih ? 0.5 : 0} />
      </mesh>
    </group>
  );
}

// --- FUNGSI DISTRIBUSI POSISI DINAMIS ---
function ambilPosisi(jumlah: number, radiusAwal: number, pelesatanSudut: number = 0) {
  return Array.from({ length: jumlah }).map((_, i) => {
    const radius = radiusAwal + Math.floor(i / 8) * 0.4;
    const sudut = (i % 8) * (Math.PI / 4) + pelesatanSudut;
    return [Math.cos(sudut) * radius, 0.4, Math.sin(sudut) * radius] as [number, number, number];
  });
}

// --- KESELURUHAN PULAU 3D ---
export default function PulauTerapung3D({ statusPermainan }: { statusPermainan: any }) {
  const refPulau = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (refPulau.current) refPulau.current.rotation.y += 0.0005;
  });

  // PENJAGA (GUARD CLAUSE): Mencegah crash jika data API belum di-load
  if (!statusPermainan) {
    return null; 
  }

  // Penentuan warna dasar pulau berdasarkan data dari backend
  const warnaTanah = statusPermainan.status_lingkungan === "subur" 
    ? "#10b981" 
    : statusPermainan.status_lingkungan === "terancam" 
    ? "#d97706" 
    : "#475569";

  // Pengambilan titik koordinat bangunan berdasarkan status permainan terkini
  const posisiServer = ambilPosisi(statusPermainan.jumlah_server || 0, 0.5, 0);
  const posisiPusatData = ambilPosisi(statusPermainan.jumlah_pusat_data || 0, 1.2, Math.PI / 4);
  const posisiPanelSurya = ambilPosisi(statusPermainan.jumlah_panel_surya || 0, 0.8, Math.PI);
  const posisiTurbinAngin = ambilPosisi(statusPermainan.jumlah_turbin_angin || 0, 1.6, Math.PI / 2);

  return (
    <group ref={refPulau} position={[0, -0.5, 0]}>
      {/* Tanah Dasar */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.4, 2.8, 0.8, 16]} />
        <meshStandardMaterial color={warnaTanah} roughness={1} flatShading />
      </mesh>

      {/* PROSES RENDER SELURUH ELEMEN BANGUNAN */}
      {posisiServer.map((pos, i) => (
        <Muncul3D key={`server-${i}`}><PabrikDigital3D posisi={pos} warna="#64748b" level={statusPermainan.level_server || 1} /></Muncul3D>
      ))}
      {posisiPusatData.map((pos, i) => (
        <Muncul3D key={`pusat-data-${i}`}><PabrikDigital3D posisi={pos} warna="#1e293b" level={statusPermainan.level_pusat_data || 1} /></Muncul3D>
      ))}
      {posisiPanelSurya.map((pos, i) => (
        <Muncul3D key={`panel-surya-${i}`}><PanelSurya3D posisi={pos} level={statusPermainan.level_panel_surya || 1} /></Muncul3D>
      ))}
      {posisiTurbinAngin.map((pos, i) => (
        <Muncul3D key={`turbin-angin-${i}`}><TurbinAngin3D posisi={pos} level={statusPermainan.level_turbin_angin || 1} /></Muncul3D>
      ))}
    </group>
  );
}