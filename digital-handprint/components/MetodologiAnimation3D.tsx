"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  Sparkles,
  Sphere,
  MeshDistortMaterial,
  Torus
} from "@react-three/drei";
import * as THREE from "three";

// ==========================================
// KINETIC DATA STREAM PARTICLES (Vortex Mode)
// ==========================================
export function PartikelAliranData({ warna, faktorKecepatan = 1.0 }: { warna: string; faktorKecepatan?: number }) {
  const refTitik = useRef<THREE.Points>(null);
  const jumlah = 120;
  
  const [posisi, sudutAwal, jariJari, kecepatan] = useMemo(() => {
    const pos = new Float32Array(jumlah * 3);
    const sudut = new Float32Array(jumlah);
    const rad = new Float32Array(jumlah);
    const kcp = new Float32Array(jumlah);

    for (let i = 0; i < jumlah; i++) {
      sudut[i] = Math.random() * Math.PI * 2;
      rad[i] = 0.9 + Math.random() * 1.1;
      kcp[i] = (0.5 + Math.random() * 0.8) * faktorKecepatan;

      pos[i * 3] = Math.cos(sudut[i]) * rad[i];
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      pos[i * 3 + 2] = Math.sin(sudut[i]) * rad[i];
    }
    return [pos, sudut, rad, kcp];
  }, [jumlah, faktorKecepatan]);

  useFrame(({ clock }) => {
    if (!refTitik.current) return;
    const waktu = clock.getElapsedTime();
    const attrPos = refTitik.current.geometry.attributes.position;
    
    for (let i = 0; i < jumlah; i++) {
      sudutAwal[i] += kecepatan[i] * 0.015;
      const gelombangY = Math.sin(waktu * kecepatan[i] + sudutAwal[i]) * 0.1;
      
      attrPos.setX(i, Math.cos(sudutAwal[i]) * jariJari[i]);
      attrPos.setY(i, attrPos.getY(i) + gelombangY * 0.05); 
      attrPos.setZ(i, Math.sin(sudutAwal[i]) * jariJari[i]);
    }
    attrPos.needsUpdate = true;
    refTitik.current.rotation.y = waktu * 0.05;
  });

  return (
    <points ref={refTitik}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posisi, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={warna}
        size={0.055}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ==========================================
// BACKGROUND CYBER FLOOR
// ==========================================
export function LingkunganSekitar() {
  const refGrid = useRef<THREE.GridHelper>(null);
  
  useFrame(({ clock }) => {
    if (refGrid.current) {
      refGrid.current.position.z = (clock.getElapsedTime() * 0.18) % 1;
    }
  });

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper ref={refGrid} args={[28, 28, "#14b8a6", "#f1f5f9"]} />
      <Sparkles count={70} scale={[8, 4, 8]} size={2.2} speed={0.5} color="#14b8a6" opacity={0.3} />
    </group>
  );
}

// ==========================================
// HIGH-FIDELITY DYNAMIC CANVAS TEXTURE ENGINE
// ==========================================
export function gunakanTeksturCageur() {
  return useMemo(() => {
    const kanvas = document.createElement("canvas");
    kanvas.width = 512;
    kanvas.height = 1024;
    const konteks = kanvas.getContext("2d");
    if (!konteks) return new THREE.Texture();

    // 1. Latar Belakang Gradien
    const gradien = konteks.createLinearGradient(0, 0, 0, kanvas.height);
    gradien.addColorStop(0, "#090f1e");
    gradien.addColorStop(0.5, "#050914");
    gradien.addColorStop(1, "#02040a");
    konteks.fillStyle = gradien;
    konteks.fillRect(0, 0, kanvas.width, kanvas.height);

    // 2. Bar Status Atas Operasi Siber
    konteks.fillStyle = "rgba(6, 182, 212, 0.4)";
    konteks.font = "bold 18px monospace";
    konteks.fillText("SYS.OP // v2.0", 40, 75);
    konteks.fillText("BAT // 99%", 370, 75);

    const tekstur = new THREE.CanvasTexture(kanvas);
    tekstur.colorSpace = THREE.SRGBColorSpace;
    return tekstur;
  }, []);
}

// ==========================================
// MODEL 3D STAGE 1: PREMIUM SMARTPHONE NODE
// ==========================================
export function NodePerangkat() {
  const refGrup = useRef<THREE.Group>(null);
  const teksturLayar = gunakanTeksturCageur();

  useFrame(({ clock }) => {
    const waktu = clock.getElapsedTime();
    if (refGrup.current) {
      refGrup.current.position.y = Math.sin(waktu * 1.8) * 0.12;
      refGrup.current.rotation.y = waktu * 0.3;
    }
  });

  return (
    <group ref={refGrup}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
        <ringGeometry args={[1.0, 1.35, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      <RoundedBox args={[1.15, 2.15, 0.12]} radius={0.12} smoothness={8}>
        <meshPhysicalMaterial
          color="#0d1527"
          roughness={0.18}
          metalness={0.85}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>

      <RoundedBox args={[1.07, 2.07, 0.124]} radius={0.09} smoothness={8} position={[0, 0, 0.001]}>
        <meshPhysicalMaterial
          map={teksturLayar}
          roughness={0.1}
          metalness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>

      <group position={[-0.2, 0.5, -0.065]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[0.3, 0.3, 0.01]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.06, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 24]} />
          <meshStandardMaterial color="#020617" roughness={0.1} />
        </mesh>
      </group>

      <PartikelAliranData warna="#22d3ee" faktorKecepatan={1.1} />
    </group>
  );
}

// ==========================================
// MODEL 3D STAGE 2: QUANTUM VORTEX SERVER CORE
// ==========================================
export function NodeServer() {
  const refGrup = useRef<THREE.Group>(null);
  const refCincin = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const waktu = clock.getElapsedTime();
    if (refGrup.current) {
      refGrup.current.position.y = Math.sin(waktu * 1.8) * 0.12;
    }
    if (refCincin.current) {
      refCincin.current.rotation.x = waktu * 0.6;
      refCincin.current.rotation.y = waktu * 0.3;
    }
  });

  return (
    <group ref={refGrup}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      <Sphere args={[0.85, 64, 64]}>
        <MeshDistortMaterial
          color="#e0f2fe"
          emissive="#06b6d4"
          emissiveIntensity={1.8}
          roughness={0.05}
          distort={0.45}
          speed={3.5}
        />
      </Sphere>

      <Torus ref={refCincin} args={[1.35, 0.04, 16, 100]}>
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1.5} />
      </Torus>

      <PartikelAliranData warna="#2dd4bf" faktorKecepatan={1.6} />
    </group>
  );
}

// ==========================================
// MODEL 3D STAGE 3: ECO GLASS METAMORPHOSIS
// ==========================================
export function NodeKarbon() {
  const refGrup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const waktu = clock.getElapsedTime();
    if (refGrup.current) {
      refGrup.current.position.y = Math.sin(waktu * 1.8) * 0.12;
      refGrup.current.rotation.y = waktu * 0.2;
    }
  });

  return (
    <group ref={refGrup}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[1.1, 1.4, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      <group position={[0, 0, 0]}>
        <Sphere args={[0.75, 32, 32]}>
          <meshPhysicalMaterial 
            color="#f0fdf4" 
            roughness={0.1} 
            transmission={0.8} 
            thickness={1.2} 
            clearcoat={1}
          />
        </Sphere>
        <Sphere args={[0.55, 32, 32]} position={[-0.55, -0.15, 0.25]}>
          <meshPhysicalMaterial color="#ffffff" roughness={0.2} transmission={0.4} />
        </Sphere>
        <Sphere args={[0.55, 32, 32]} position={[0.55, 0.15, -0.25]}>
          <meshPhysicalMaterial color="#d1fae5" roughness={0.2} transmission={0.4} />
        </Sphere>
      </group>

      <PartikelAliranData warna="#34d399" faktorKecepatan={0.9} />
    </group>
  );
}