"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ==========================================
// KOMPONEN PARTIKEL DEKORATIF
// ==========================================
function PartikelMelayang({ jumlah = 20 }) {
  // Mengkalkulasi koordinat acak partikel di memori agar tidak dihitung ulang setiap frame
  const kumpulanPosisi = useMemo(() => {
    const posisi = new Float32Array(jumlah * 3);
    for (let i = 0; i < jumlah; i++) {
      posisi[i * 3] = (Math.random() - 0.5) * 4;     // Koordinat X
      posisi[i * 3 + 1] = Math.random() * 2;         // Koordinat Y
      posisi[i * 3 + 2] = (Math.random() - 0.5) * 4; // Koordinat Z
    }
    return posisi;
  }, [jumlah]);
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={jumlah} 
          array={kumpulanPosisi} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#2dd4bf" 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
      />
    </points>
  );
}

// ==========================================
// KOMPONEN UTAMA PULAU
// ==========================================
export default function PulauCeria() {
  const referensiGrup = useRef<THREE.Group>(null);
  const referensiBendera = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const waktu = clock.getElapsedTime();
    
    // Animasi putaran pulau secara keseluruhan
    if (referensiGrup.current) {
      referensiGrup.current.rotation.y = waktu * 0.1;
    }
    
    // Animasi ayunan bendera ditiup angin menggunakan gelombang sinus
    if (referensiBendera.current) {
      referensiBendera.current.rotation.x = Math.sin(waktu * 3) * 0.2;
    }
  });
  
  return (
    <group ref={referensiGrup} position={[0, -0.5, 0]}>
      {/* Fondasi Batu Pulau */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.5, 6]} />
        <meshStandardMaterial color="#cbd5e1" flatShading />
      </mesh>
      
      {/* Permukaan Rumput */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.1, 0.2, 6]} />
        <meshStandardMaterial color="#059669" roughness={0.8} />
      </mesh>
      
      {/* Struktur Bangunan / Rumah Kecil */}
      <group position={[0, 0.3, 0]}>
        {/* Tiang / Badan Bangunan */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        {/* Atap Bangunan */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.7]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Bendera di Atas Atap */}
        <mesh ref={referensiBendera} position={[0.26, 0.9, 0]} castShadow>
          <boxGeometry args={[0.02, 0.35, 0.12]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* Bunga / Jamur Mengelilingi Pulau */}
      {[...Array(5)].map((_, indeks) => (
        <group key={indeks} position={[Math.cos(indeks * 1.2) * 1.4, 0.3, Math.sin(indeks * 1.2) * 1.4]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 4, 4]} />
            <meshStandardMaterial color={indeks % 2 === 0 ? "#fde047" : "#fb7185"} />
          </mesh>
        </group>
      ))}
      
      {/* Awan Melayang (Menggunakan animasi Float bawaan Drei) */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-1.2, 1.8, 0.5]}>
          <sphereGeometry args={[0.3, 7, 7]} />
          <meshStandardMaterial color="white" transparent opacity={0.9} flatShading />
        </mesh>
        <mesh position={[-1.5, 1.7, 0.5]}>
          <sphereGeometry args={[0.2, 7, 7]} />
          <meshStandardMaterial color="white" transparent opacity={0.9} flatShading />
        </mesh>
      </Float>
      
      {/* Partikel Efek Debu Sihir / Angin */}
      <PartikelMelayang jumlah={30} />
    </group>
  );
}