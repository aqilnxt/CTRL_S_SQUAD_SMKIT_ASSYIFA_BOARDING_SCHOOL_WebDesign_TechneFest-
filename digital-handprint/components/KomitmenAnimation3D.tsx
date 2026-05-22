"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";

interface PropertiBumiInteraktif3D {
  rasioKesehatan: number;
}

export default function BumiInteraktif3D({ rasioKesehatan }: PropertiBumiInteraktif3D) {
  const refGrupBumi = useRef<THREE.Group>(null);
  const refGrupAwan = useRef<THREE.Group>(null);
  const refMatAir = useRef<THREE.MeshStandardMaterial>(null);
  const refMatDaratan = useRef<THREE.MeshStandardMaterial[]>([]);
  const refMatAwan = useRef<THREE.MeshStandardMaterial[]>([]);
  const refGrupPohon = useRef<THREE.Group>(null);

  // Nilai kesehatan bumi saat ini untuk animasi (damped)
  const kesehatanSaatIni = useRef(0);

  // Warna transisi (Buruk/Gersang -> Baik/Asri)
  const paletWarna = useMemo(() => ({
    airBuruk: new THREE.Color("#4a4f44"), // Air keruh/tercemar
    airBaik: new THREE.Color("#0ea5e9"), // Biru samudra
    daratanBuruk: new THREE.Color("#78716c"), // Tanah gersang berbatu
    daratanBaik: new THREE.Color("#22c55e"), // Hijau subur
    awanBuruk: new THREE.Color("#52525b"), // Polusi / Smog
    awanBaik: new THREE.Color("#ffffff"), // Awan putih bersih
  }), []);

  // Data koordinat pulau dan pohon (Distribusi bola pseudo-acak)
  const massaDaratan = useMemo(() => [
    { posisi: [1.2, 0.8, 1.2], ukuran: 1.1 },
    { posisi: [-1.2, 0.5, 1.4], ukuran: 0.9 },
    { posisi: [0.5, -1.3, 1.2], ukuran: 1.3 },
    { posisi: [-1.4, -0.8, -1], ukuran: 1.0 },
    { posisi: [1.3, -0.5, -1.2], ukuran: 1.2 },
    { posisi: [0, 1.6, -0.8], ukuran: 0.8 },
  ], []);

  const daftarPohon = useMemo(() => {
    const dataPohon = [];
    for (let i = 0; i < 20; i++) {
      const phi = Math.acos(-1 + (2 * i) / 20);
      const theta = Math.sqrt(20 * Math.PI) * phi;
      const r = 1.95; 
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      dataPohon.push({ posisi: [x, y, z], ambangBatas: Math.random() * 0.8 });
    }
    return dataPohon;
  }, []);

  const daftarAwan = useMemo(() => {
    return Array.from({ length: 8 }).map(() => {
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = 2.6;
      return {
        posisi: [r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)],
        ukuran: 0.3 + Math.random() * 0.3
      };
    });
  }, []);

  useFrame((_, delta) => {
    // 1. Interpolasi halus untuk Rasio Kesehatan
    kesehatanSaatIni.current = THREE.MathUtils.damp(kesehatanSaatIni.current, rasioKesehatan, 4, delta);
    const k = kesehatanSaatIni.current;

    // 2. Rotasi Otomatis Bumi & Awan
    if (refGrupBumi.current) refGrupBumi.current.rotation.y += delta * 0.1;
    if (refGrupAwan.current) {
      refGrupAwan.current.rotation.y += delta * 0.15;
      refGrupAwan.current.rotation.z += delta * 0.05;
    }

    // 3. Transisi Warna Material
    if (refMatAir.current) {
      refMatAir.current.color.lerpColors(paletWarna.airBuruk, paletWarna.airBaik, k);
    }
    refMatDaratan.current.forEach(mat => {
      if (mat) mat.color.lerpColors(paletWarna.daratanBuruk, paletWarna.daratanBaik, k);
    });
    refMatAwan.current.forEach(mat => {
      if (mat) mat.color.lerpColors(paletWarna.awanBuruk, paletWarna.awanBaik, k);
    });

    // 4. Skala Pohon (Tumbuh seiring naiknya kesehatan)
    if (refGrupPohon.current) {
      refGrupPohon.current.children.forEach((meshPohon, indeks) => {
        const ambang = daftarPohon[indeks].ambangBatas;
        let skalaTarget = 0;
        if (k > ambang) {
          skalaTarget = THREE.MathUtils.clamp((k - ambang) * 3, 0, 1);
        }
        const skalaSaatIni = meshPohon.scale.x;
        const skalaHalus = THREE.MathUtils.damp(skalaSaatIni, skalaTarget, 6, delta);
        meshPohon.scale.set(skalaHalus, skalaHalus, skalaHalus);
      });
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* KELOMPOK BUMI */}
      <group ref={refGrupBumi}>
        {/* Lautan (Base Sphere) */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.8, 3]} />
          <meshStandardMaterial ref={refMatAir} roughness={0.2} metalness={0.1} flatShading />
        </mesh>

        {/* Daratan (Pulau / Benua) */}
        {massaDaratan.map((daratan, i) => (
          <mesh key={`daratan-${i}`} position={daratan.posisi as [number, number, number]} castShadow receiveShadow>
            <icosahedronGeometry args={[daratan.ukuran, 1]} />
            <meshStandardMaterial 
              ref={(el) => { if(el) refMatDaratan.current[i] = el; }} 
              roughness={0.9} 
              flatShading 
            />
          </mesh>
        ))}

        {/* Pohon & Pegunungan */}
        <group ref={refGrupPohon}>
          {daftarPohon.map((pohon, i) => {
            const vec = new THREE.Vector3(...pohon.posisi).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
            const euler = new THREE.Euler().setFromQuaternion(quaternion);

            return (
              <group key={`pohon-${i}`} position={pohon.posisi as [number, number, number]} rotation={euler} scale={[0, 0, 0]}>
                {/* Batang */}
                <mesh castShadow position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.04, 0.06, 0.2, 5]} />
                  <meshStandardMaterial color="#713f12" roughness={1} />
                </mesh>
                {/* Daun */}
                <mesh castShadow position={[0, 0.3, 0]}>
                  <coneGeometry args={[0.15, 0.4, 5]} />
                  <meshStandardMaterial color="#16a34a" roughness={0.8} flatShading />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* KELOMPOK AWAN & ATMOSFER */}
      <group ref={refGrupAwan}>
        {daftarAwan.map((awan, i) => (
          <mesh key={`awan-${i}`} position={awan.posisi as [number, number, number]} castShadow>
            <dodecahedronGeometry args={[awan.ukuran, 0]} />
            <meshStandardMaterial 
              ref={(el) => { if(el) refMatAwan.current[i] = el; }} 
              transparent 
              opacity={0.8} 
              flatShading 
            />
          </mesh>
        ))}
      </group>

      {/* PARTIKEL */}
      {rasioKesehatan > 0.2 && (
        <DreiSparkles 
          count={Math.floor(rasioKesehatan * 150)} 
          scale={3} 
          size={4} 
          speed={0.4} 
          color="#a7f3d0" 
        />
      )}

      {/* Bayangan Dasar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </group>
  );
}