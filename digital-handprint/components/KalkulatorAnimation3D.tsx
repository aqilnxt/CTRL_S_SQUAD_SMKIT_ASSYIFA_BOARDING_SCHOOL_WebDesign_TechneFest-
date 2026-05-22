"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- ANIMASI UTILITY 3D (MUNCUL) ---
function AnimasiMuncul3D({ children }: { children: React.ReactNode }) {
  const refGrup = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (refGrup.current) {
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

// --- KOMPONEN LINGKUNGAN DETAIL ---
function Awan3D({ posisi, skala = 1, warna = "#ffffff", kecepatan = 0.2 }: { posisi: [number, number, number], skala?: number, warna?: string, kecepatan?: number }) {
  const refAwan = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (refAwan.current) {
      refAwan.current.position.x = posisi[0] + Math.sin(clock.elapsedTime * kecepatan) * 0.5;
      refAwan.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={refAwan} position={posisi} scale={[skala, skala, skala]}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 7, 7]} />
        <meshStandardMaterial color={warna} roughness={1} flatShading />
      </mesh>
      <mesh position={[0.15, -0.05, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 7, 7]} />
        <meshStandardMaterial color={warna} roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.15, -0.05, -0.05]} castShadow>
        <sphereGeometry args={[0.18, 7, 7]} />
        <meshStandardMaterial color={warna} roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function PolusiAsap3D({ jumlah = 20, warna = "#475569", skala = 1, batas = 2.5 }) {
  const refGrup = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (refGrup.current) {
      const waktu = clock.elapsedTime;
      refGrup.current.children.forEach((kepulan, i) => {
        kepulan.position.y += 0.006;
        kepulan.position.x += Math.sin(waktu * 0.5 + i) * 0.003;
        kepulan.position.z += Math.cos(waktu * 0.5 + i) * 0.003;
        
        if (kepulan.position.y > 2.5) {
           kepulan.position.y = 0.2;
           kepulan.position.x = (Math.random() - 0.5) * batas;
           kepulan.position.z = (Math.random() - 0.5) * batas;
        }
      });
    }
  });

  return (
    <group ref={refGrup}>
      {[...Array(jumlah)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * batas, 
            Math.random() * 2 + 0.2, 
            (Math.random() - 0.5) * batas
          ]}
          scale={Math.random() * 0.4 * skala + 0.2}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color={warna} transparent opacity={0.35} flatShading depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Batu3D({ posisi, skala = 1 }: { posisi: [number, number, number], skala?: number }) {
  return (
    <mesh position={posisi} scale={[skala, skala, skala]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.8} flatShading />
    </mesh>
  );
}

function Pohon3D({ posisi, warna, skala = 1 }: { posisi: [number, number, number]; warna: string, skala?: number }) {
  return (
    <group position={posisi} scale={[skala, skala, skala]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.5, 5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 0.7, 6]} />
        <meshStandardMaterial color={warna} roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

// --- KOMPONEN KEHIDUPAN & URBANISASI ---
function Burung3D({ radius, kecepatan, tinggi, jeda }: { radius: number, kecepatan: number, tinggi: number, jeda: number }) {
  const refBurung = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (refBurung.current) {
      const waktu = clock.elapsedTime * kecepatan + jeda;
      refBurung.current.position.x = Math.cos(waktu) * radius;
      refBurung.current.position.z = Math.sin(waktu) * radius;
      refBurung.current.position.y = tinggi + Math.sin(waktu * 5) * 0.1;
      refBurung.current.rotation.y = -waktu + Math.PI;
      refBurung.current.rotation.z = Math.sin(waktu * 15) * 0.2;
    }
  });

  return (
    <group ref={refBurung}>
      <mesh castShadow>
        <coneGeometry args={[0.03, 0.1, 3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function Hewan3D({ radius, kecepatan, warna, jeda }: { radius: number, kecepatan: number, warna: string, jeda: number }) {
  const refHewan = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (refHewan.current) {
      const waktu = clock.elapsedTime * kecepatan + jeda;
      const radiusSaatIni = radius + Math.sin(waktu * 0.5) * 0.4;
      const sudut = waktu * 0.8 + Math.cos(waktu * 0.3) * 0.5;
      
      const x = Math.cos(sudut) * radiusSaatIni;
      const z = Math.sin(sudut) * radiusSaatIni;
      
      const waktuDepan = waktu + 0.05;
      const radiusDepan = radius + Math.sin(waktuDepan * 0.5) * 0.4;
      const sudutDepan = waktuDepan * 0.8 + Math.cos(waktuDepan * 0.3) * 0.5;
      const xDepan = Math.cos(sudutDepan) * radiusDepan;
      const zDepan = Math.sin(sudutDepan) * radiusDepan;

      refHewan.current.position.x = x;
      refHewan.current.position.z = z;
      refHewan.current.position.y = 0.45 + Math.abs(Math.sin(waktu * 8)) * 0.06;
      refHewan.current.rotation.y = Math.atan2(x - xDepan, z - zDepan);
    }
  });

  return (
    <group ref={refHewan}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.2]} />
        <meshStandardMaterial color={warna} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.12, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={warna} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Jalan3D() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.41, 0]} receiveShadow>
      <ringGeometry args={[0.9, 1.5, 32]} />
      <meshStandardMaterial color="#334155" roughness={0.8} />
    </mesh>
  );
}

function Mobil3D({ radius, kecepatan, jeda, warna = "#ef4444" }: { radius: number, kecepatan: number, jeda: number, warna?: string }) {
  const refMobil = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (refMobil.current) {
      const waktu = clock.elapsedTime * kecepatan + jeda;
      refMobil.current.position.x = Math.cos(waktu) * radius;
      refMobil.current.position.z = Math.sin(waktu) * radius;
      refMobil.current.rotation.y = -waktu + Math.PI; 
    }
  });

  return (
    <group ref={refMobil} position={[0, 0.45, 0]}>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.28]} />
        <meshStandardMaterial color={warna} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.12, -0.02]}>
        <boxGeometry args={[0.1, 0.06, 0.14]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Pekerja3D({ titikMulai, titikAkhir, kecepatan, tunda, warna = "#2563eb" }: { titikMulai: [number, number, number], titikAkhir: [number, number, number], kecepatan: number, tunda: number, warna?: string }) {
  const refPekerja = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (refPekerja.current) {
      const waktu = clock.elapsedTime * kecepatan + tunda;
      const bolakBalik = (Math.sin(waktu) + 1) / 2; 
      refPekerja.current.position.x = THREE.MathUtils.lerp(titikMulai[0], titikAkhir[0], bolakBalik);
      refPekerja.current.position.z = THREE.MathUtils.lerp(titikMulai[2], titikAkhir[2], bolakBalik);
      refPekerja.current.position.y = titikMulai[1] + Math.abs(Math.sin(waktu * 12)) * 0.04;

      const sedangMaju = Math.cos(waktu) > 0;
      refPekerja.current.rotation.y = sedangMaju 
        ? Math.atan2(titikAkhir[0] - titikMulai[0], titikAkhir[2] - titikMulai[2])
        : Math.atan2(titikMulai[0] - titikAkhir[0], titikMulai[2] - titikAkhir[2]);
    }
  });

  return (
    <group ref={refPekerja}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshStandardMaterial color={warna} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#eab308" flatShading />
      </mesh>
    </group>
  );
}

// --- KOMPONEN PABRIK & GEDUNG ---
function Pabrik3D({ posisi, skala = 1, warnaAsap = "#94a3b8" }: { posisi: [number, number, number], skala?: number, warnaAsap?: string }) {
  const refAsap = useRef<THREE.Group>(null);
  useFrame(() => {
    if (refAsap.current) {
      refAsap.current.children.forEach((partikel) => {
        partikel.position.y += 0.015 * skala;
        partikel.position.x += (Math.random() - 0.5) * 0.01;
        if (partikel.position.y > 1.8 * skala) {
          partikel.position.y = 0.7 * skala;
          partikel.position.x = (Math.random() - 0.5) * 0.1 * skala;
        }
      });
    }
  });

  return (
    <group position={posisi} scale={[skala, skala, skala]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.6, 0.15]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <group ref={refAsap}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.1, 0.7 + i * 0.2, (Math.random() - 0.5) * 0.1]}>
            <sphereGeometry args={[0.15, 5, 5]} />
            <meshStandardMaterial color={warnaAsap} transparent opacity={0.4} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function GedungKantor3D({ posisi, tinggi, warnaLampu = "#fbbf24" }: { posisi: [number, number, number], tinggi: number, warnaLampu?: string }) {
  return (
    <group position={posisi}>
      <mesh position={[0, tinggi / 2 + 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, tinggi, 0.35]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0, tinggi / 2 + 0.4, 0.176]}>
        <planeGeometry args={[0.15, tinggi * 0.8]} />
        <meshBasicMaterial color={warnaLampu} wireframe />
      </mesh>
    </group>
  );
}

// --- CORE LINGKUNGAN PULAU 3D ---
export default function PulauTerapung3D({ kondisiLingkungan }: { kondisiLingkungan: "lush" | "struggling" | "damaged" }) {
  const refPulau = useRef<THREE.Group>(null);
  useFrame(() => {
    if (refPulau.current) refPulau.current.rotation.y += 0.0015;
  });

  const warnaTanah = kondisiLingkungan === "lush" ? "#10b981" : kondisiLingkungan === "struggling" ? "#d97706" : "#475569";
  const warnaAir = kondisiLingkungan === "lush" ? "#0ea5e9" : kondisiLingkungan === "struggling" ? "#0369a1" : "#020617";
  const opasitasAir = kondisiLingkungan === "lush" ? 0.7 : 0.9;

  return (
    <group ref={refPulau} position={[0, -0.5, 0]}>
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.8, 12]} />
        <meshStandardMaterial color={warnaTanah} roughness={1} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <ringGeometry args={[2.2, 3.5, 24]} />
        <meshStandardMaterial color={warnaAir} transparent opacity={opasitasAir} roughness={0.1} metalness={0.3} />
      </mesh>

      {kondisiLingkungan === "lush" && (
        <AnimasiMuncul3D key="kondisi-lush">
          <Pohon3D posisi={[-0.6, 0.4, 0.5]} warna="#047857" skala={1.2} />
          <Pohon3D posisi={[0.5, 0.4, -0.8]} warna="#059669" />
          <Pohon3D posisi={[-0.8, 0.4, -0.5]} warna="#10b981" skala={0.8} />
          <Pohon3D posisi={[0.8, 0.4, 0.6]} warna="#34d399" skala={0.9} />
          <Pohon3D posisi={[0.2, 0.4, -1.2]} warna="#047857" skala={1.1} />
          <Batu3D posisi={[-1.2, 0.45, 0.2]} skala={1.5} />
          <Batu3D posisi={[1.0, 0.42, -0.2]} skala={1} />
          <Awan3D posisi={[-1.5, 2, -1]} skala={1.2} />
          <Awan3D posisi={[1.5, 2.5, 1]} skala={0.8} />
          <Hewan3D radius={1.2} kecepatan={0.4} warna="#ffffff" jeda={0} />
          <Hewan3D radius={1.4} kecepatan={0.5} warna="#fef08a" jeda={Math.PI} />
          <Hewan3D radius={0.9} kecepatan={0.3} warna="#ffedd5" jeda={Math.PI / 2} />
          <Burung3D radius={2.5} kecepatan={0.3} tinggi={2} jeda={0} />
          <Burung3D radius={2.4} kecepatan={0.3} tinggi={2.1} jeda={0.2} />
          <Burung3D radius={2.6} kecepatan={0.3} tinggi={1.9} jeda={0.4} />
        </AnimasiMuncul3D>
      )}

      {kondisiLingkungan === "struggling" && (
        <AnimasiMuncul3D key="kondisi-struggling">
          <Pohon3D posisi={[-0.6, 0.4, 0.5]} warna="#b45309" skala={1} />
          <Pohon3D posisi={[0.7, 0.4, 0.6]} warna="#d97706" skala={0.8} />
          <Batu3D posisi={[-1.2, 0.45, 0.2]} skala={1.5} />
          <Jalan3D />
          <Mobil3D radius={1.2} kecepatan={0.8} jeda={0} warna="#eab308" />
          <Pabrik3D posisi={[0.2, 0.4, -0.5]} />
          <Awan3D posisi={[0, 2, 0]} skala={1.5} warna="#cbd5e1" kecepatan={0.1} />
          <PolusiAsap3D jumlah={15} skala={0.8} warna="#94a3b8" />
          <Pekerja3D titikMulai={[0.5, 0.4, -0.2]} titikAkhir={[1.5, 0.4, 0.5]} kecepatan={1} tunda={0} />
          <Pekerja3D titikMulai={[-0.2, 0.4, -0.8]} titikAkhir={[-1.2, 0.4, -0.2]} kecepatan={1.2} tunda={2} />
        </AnimasiMuncul3D>
      )}

      {kondisiLingkungan === "damaged" && (
        <AnimasiMuncul3D key="kondisi-damaged">
          <Jalan3D />
          <Mobil3D radius={1.2} kecepatan={1.2} jeda={0} warna="#ef4444" />
          <Mobil3D radius={1.2} kecepatan={1.2} jeda={Math.PI} warna="#3b82f6" />
          <Mobil3D radius={1.2} kecepatan={1.2} jeda={Math.PI / 2} warna="#10b981" />
          <mesh position={[-0.5, 0.45, 0.4]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.15, 4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <Pabrik3D posisi={[-0.4, 0.4, 0.4]} skala={1.2} warnaAsap="#475569" />
          <Pabrik3D posisi={[0.5, 0.4, -0.4]} skala={1} warnaAsap="#334155" />
          <Pabrik3D posisi={[-1.4, 0.4, -1.4]} skala={0.9} warnaAsap="#1e293b" />
          <GedungKantor3D posisi={[1.7, 0, 0.5]} tinggi={1.8} warnaLampu="#ef4444" />
          <GedungKantor3D posisi={[-0.8, 0, 1.7]} tinggi={1.4} warnaLampu="#ef4444" />
          <GedungKantor3D posisi={[0.4, 0, 1.8]} tinggi={2.2} />
          <Awan3D posisi={[-1, 1.8, -1]} skala={2} warna="#475569" kecepatan={0.05} />
          <Awan3D posisi={[1, 2.2, 1]} skala={1.5} warna="#334155" kecepatan={0.08} />
          <PolusiAsap3D jumlah={45} skala={1.5} warna="#475569" batas={3} />
          <PolusiAsap3D jumlah={20} skala={1.2} warna="#1e293b" batas={2} />
          <Pekerja3D titikMulai={[0, 0.4, 0]} titikAkhir={[1.6, 0.4, 1.6]} kecepatan={0.5} tunda={0} warna="#64748b" />
        </AnimasiMuncul3D>
      )}
    </group>
  );
}