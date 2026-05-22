"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Leaf, Shield, Globe, 
  Server, CloudFog, MailWarning, Tv2
} from "lucide-react";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

// --- 1. KOMPONEN ANIMASI MUNCUL MEMANTUL ---
function Muncul3D({ children, jedaWaktu = 0 }: { children: React.ReactNode; jedaWaktu?: number }) {
  const referensiGrup = useRef<THREE.Group>(null);
  const [mulaiAnimasi, setMulaiAnimasi] = useState(false);

  useEffect(() => {
    const pengaturWaktu = setTimeout(() => setMulaiAnimasi(true), jedaWaktu * 1000);
    return () => clearTimeout(pengaturWaktu);
  }, [jedaWaktu]);

  useFrame((_, delta) => {
    if (referensiGrup.current) {
      const skalaTarget = mulaiAnimasi ? 1 : 0;
      const skalaHalus = THREE.MathUtils.damp(referensiGrup.current.scale.x, skalaTarget, 10, delta);
      referensiGrup.current.scale.set(skalaHalus, skalaHalus, skalaHalus);
    }
  });

  return (
    <group ref={referensiGrup} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

// --- 2. LOGIKA PENYESUAIAN POSISI DI ATAS BOLA BUMI ---
function SesuaikanArahPermukaan({ posisi, children, skala = 1 }: { posisi: [number, number, number], children: React.ReactNode, skala?: number }) {
  const vektorPosisi = useMemo(() => new THREE.Vector3(...posisi), [posisi]);
  const rotasiKuarternion = useMemo(() => {
    const kuarternion = new THREE.Quaternion();
    kuarternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vektorPosisi.clone().normalize());
    return kuarternion;
  }, [vektorPosisi]);

  return (
    <group position={vektorPosisi} quaternion={rotasiKuarternion} scale={skala}>
      {children}
    </group>
  );
}

// --- 3. DETEKTOR GEOGRAFIS BENUA & ALAM ---
function cekApakahDaratanAsli(lintang: number, bujur: number): { apakahDaratan: boolean; jenisBioma: "hutan" | "gunung" | "dataran" } {
  let apakahDaratan = false;
  
  // Deteksi batas koordinat bumi asli
  if (lintang < -60) apakahDaratan = true; 
  else if (lintang > -42 && lintang < -10 && bujur > 112 && bujur < 154) apakahDaratan = true; 
  else if (lintang > 12 && lintang < 72 && bujur > -168 && bujur < -52) apakahDaratan = true; 
  else if (lintang > -55 && lintang <= 12 && bujur > -82 && bujur < -34) apakahDaratan = true; 
  else if (lintang > -34 && lintang <= 37 && bujur > -17 && bujur < 51) apakahDaratan = true; 
  else if (lintang > 10 && lintang < 75 && bujur > -10 && bujur < 145) apakahDaratan = true; 
  else if (lintang > -10 && lintang < 8 && bujur > 95 && bujur < 141) apakahDaratan = true; 

  if (!apakahDaratan) return { apakahDaratan: false, jenisBioma: "dataran" };

  const angkaAcak = Math.random();
  if ((lintang > 35 && lintang < 55 && angkaAcak > 0.6) || (lintang > -30 && lintang < -10 && angkaAcak > 0.7)) {
    return { apakahDaratan: true, jenisBioma: "gunung" }; 
  }
  if (lintang > -15 && lintang < 25) {
    return { apakahDaratan: true, jenisBioma: "hutan" }; 
  }
  return { apakahDaratan: true, jenisBioma: angkaAcak > 0.5 ? "hutan" : "dataran" };
}

// --- 4. PERAKITAN MODEL BUMI LOW-POLY ---
function BumiLowPoly() {
  const referensiBumi = useRef<THREE.Group>(null);
  const JARI_JARI_BUMI = 1.8;

  useFrame(({ clock }) => {
    if (referensiBumi.current) {
      referensiBumi.current.rotation.y = clock.getElapsedTime() * 0.08;
      referensiBumi.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.05;
    }
  });

  const elemenElemenBumi = useMemo(() => {
    const daftarElemen: React.ReactNode[] = [];
    const totalSampel = 450; 

    for (let i = 0; i < totalSampel; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const lintang = 90.0 - (phi * 180.0 / Math.PI);
      const bujur = (theta * 180.0 / Math.PI) - 180.0;

      const bioma = cekApakahDaratanAsli(lintang, bujur);

      if (bioma.apakahDaratan) {
        const x = JARI_JARI_BUMI * Math.sin(phi) * Math.cos(theta);
        const y = JARI_JARI_BUMI * Math.cos(phi);
        const z = JARI_JARI_BUMI * Math.sin(phi) * Math.sin(theta);
        const posisi3D: [number, number, number] = [x, y, z];
        const jedaEfek = Math.random() * 0.8; 

        // Membuat Balok Tanah/Pulau
        daftarElemen.push(
          <SesuaikanArahPermukaan key={`tanah-${i}`} posisi={posisi3D} skala={0.4 + Math.random() * 0.3}>
            <Muncul3D jedaWaktu={jedaEfek}>
              <mesh receiveShadow castShadow position={[0, -0.05, 0]}>
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial 
                  color={lintang < -60 ? "#f8fafc" : bioma.jenisBioma === "hutan" ? "#059669" : "#10b981"} 
                  roughness={0.9} 
                  flatShading 
                />
              </mesh>
            </Muncul3D>
          </SesuaikanArahPermukaan>
        );

        // Jika wilayah pegunungan, pasang model gunung
        if (bioma.jenisBioma === "gunung") {
          daftarElemen.push(
            <SesuaikanArahPermukaan key={`gunung-${i}`} posisi={posisi3D} skala={0.3 + Math.random() * 0.3}>
              <Muncul3D jedaWaktu={jedaEfek + 0.2}>
                <group position={[0, 0.1, 0]}>
                  <mesh castShadow receiveShadow>
                    <coneGeometry args={[0.2, 0.5, 4]} />
                    <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
                  </mesh>
                  <mesh position={[0, 0.2, 0]}>
                    <coneGeometry args={[0.1, 0.16, 4]} />
                    <meshStandardMaterial color="#ffffff" roughness={1} flatShading />
                  </mesh>
                </group>
              </Muncul3D>
            </SesuaikanArahPermukaan>
          );
        }

        // Jika wilayah hutan tropis, pasang model pohon
        if (bioma.jenisBioma === "hutan" && Math.random() > 0.4 && lintang > -60) {
          daftarElemen.push(
            <SesuaikanArahPermukaan key={`pohon-${i}`} posisi={posisi3D} skala={0.3 + Math.random() * 0.4}>
              <Muncul3D jedaWaktu={jedaEfek + 0.1}>
                <group position={[0, 0.05, 0]}>
                  <mesh castShadow position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.02, 0.04, 0.12, 4]} />
                    <meshStandardMaterial color="#451a03" roughness={1} />
                  </mesh>
                  <mesh castShadow position={[0, 0.16, 0]}>
                    <coneGeometry args={[0.12, 0.22, 5]} />
                    <meshStandardMaterial color="#047857" roughness={0.6} flatShading />
                  </mesh>
                </group>
              </Muncul3D>
            </SesuaikanArahPermukaan>
          );
        }
      }
    }
    return daftarElemen;
  }, []);

  return (
    <group ref={referensiBumi}>
      {/* Objek Samudra Biru */}
      <mesh receiveShadow>
        <icosahedronGeometry args={[JARI_JARI_BUMI, 4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.1} flatShading />
      </mesh>
      
      {/* Objek Daratan, Gunung, & Pohon */}
      {elemenElemenBumi}
      
      {/* Membuat 6 Awan Mengorbit */}
      <group>
        {[...Array(6)].map((_, i) => (
          <AwanBumi key={`awan-${i}`} pergeseranY={(Math.random() - 0.5) * 1.8} kecepatan={0.15 + i * 0.05} sudutAwal={i * (Math.PI / 3)} />
        ))}
      </group>
    </group>
  );
}

// --- 5. MODEL DAN ANIMASI AWAN BERPUTAR ---
function AwanBumi({ pergeseranY, kecepatan, sudutAwal }: { pergeseranY: number, kecepatan: number, sudutAwal: number }) {
  const referensiGrupAwan = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (referensiGrupAwan.current) {
      referensiGrupAwan.current.rotation.y = clock.elapsedTime * kecepatan + sudutAwal;
    }
  });

  return (
    <group ref={referensiGrupAwan}>
      <group position={[2.3, pergeseranY, 0]} scale={0.7}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 5, 5]} />
          <meshStandardMaterial color="#ffffff" opacity={0.9} transparent flatShading />
        </mesh>
      </group>
    </group>
  );
}

// --- 6. HALAMAN UTAMA (LANDING PAGE) ---
export default function LandingPage() {
  const variasiKontainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    },
  };

  const variasiElemen: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 140, damping: 16 } 
    },
  };

  const variasiMunculScroll: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 20, staggerChildren: 0.15 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-200 selection:text-teal-900 overflow-hidden">
      
      {/* HERO SECTION */}
      <motion.div variants={variasiKontainer} initial="hidden" animate="show">
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Kolom Kiri: Studio Grafis Bumi 3D */}
          <motion.div variants={variasiElemen} className="relative w-full h-[450px] lg:h-[550px] flex items-center justify-center order-last lg:order-first">
            <div className="absolute w-85 h-85 bg-teal-300/30 rounded-full blur-[120px] -z-10" />

            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} shadows>
                <ambientLight intensity={0.6} />
                <hemisphereLight groundColor="#0f172a" intensity={0.5} />
                <directionalLight position={[6, 12, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
                <directionalLight position={[-6, 6, -6]} intensity={0.4} color="#38bdf8" />

                <Suspense fallback={null}>
                  <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
                    <BumiLowPoly />
                  </Float>
                </Suspense>
                
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.6} />
              </Canvas>
            </div>

            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-4 lg:left-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md text-emerald-500 border border-slate-100 pointer-events-none">
              <Leaf size={24} />
            </motion.div>
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-20 right-4 lg:right-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md text-teal-500 border border-slate-100 pointer-events-none">
              <Globe size={24} />
            </motion.div>
          </motion.div>

          {/* Kolom Kanan: Judul Promosi & Teks Utama */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left z-10">
            <motion.div variants={variasiElemen} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Gerakan Digital Cageur
            </motion.div>
            
            <motion.h1 variants={variasiElemen} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Kecilkan Jejak <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-400">
                Digitalmu.
              </span>
            </motion.h1>
            
            <motion.p variants={variasiElemen} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
              Dunia maya tidak mengambang di awan. Ia hidup di server fisik yang terus menyala. Pahami dampaknya dan selamatkan bumi lewat kebiasaan digitalmu.
            </motion.p>
            
            <motion.div variants={variasiElemen} className="flex flex-col sm:flex-row gap-4">
              <Link href="/sejarah-emisi">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full group flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-teal-600/20 transition-colors">
                  Lihat Sejarah
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* BENTO GRID SEKSYEN EDUKASI */}
      <section className="py-20 relative bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              Realitas di Balik Layar Kaca
            </h2>
            <p className="text-slate-500 max-w-2xl text-lg">
              Setiap kali kita memutar video, mengirim email, atau menyimpan foto di cloud, ada server raksasa yang bekerja keras memprosesnya.
            </p>
          </motion.div>

          <motion.div 
            variants={variasiMunculScroll}
            initial="hidden"
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {/* Bento Card 1 - Infrastruktur Server */}
            <motion.div variants={variasiElemen} className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-700" />
              <Server className="text-teal-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Infrastruktur Tak Kasat Mata</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Internet menyumbang sekitar <strong className="text-teal-300">3.7% dari emisi gas rumah kaca global</strong>. Angka ini setara dengan emisi dari seluruh industri penerbangan komersial di dunia.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-teal-200 bg-teal-900/40 px-4 py-2 rounded-full backdrop-blur-sm border border-teal-800/50">
                <Shield size={16} /> Butuh pendingin ekstra 24/7
              </div>
            </motion.div>

            {/* Bento Card 2 - Video Streaming */}
            <motion.div variants={variasiElemen} className="bg-teal-50 border border-teal-100 p-8 rounded-[2rem] group hover:shadow-lg transition-shadow">
              <Tv2 className="text-teal-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Streaming 1 Jam</h4>
              <p className="text-slate-500 text-sm mb-4">Menonton dalam resolusi tinggi memakan banyak bandwidth.</p>
              <div className="text-3xl font-black text-teal-700">~55g <span className="text-base font-medium text-slate-500">CO₂</span></div>
            </motion.div>

            {/* Bento Card 3 - Email */}
            <motion.div variants={variasiElemen} className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] group hover:shadow-lg transition-shadow">
              <MailWarning className="text-slate-700 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Email Mengendap</h4>
              <p className="text-slate-500 text-sm mb-4">1 Email biasa tanpa lampiran yang terus tersimpan di server.</p>
              <div className="text-3xl font-black text-teal-700">0.3g <span className="text-base font-medium text-slate-500">CO₂ / email</span></div>
            </motion.div>

            {/* Bento Card 4 - Tombol Simulasi Konten */}
            <motion.div variants={variasiElemen} className="md:col-span-2 bg-emerald-500 p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
               <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                  <CloudFog size={150} />
               </div>
               <div className="z-10 text-center sm:text-left">
                 <h3 className="text-2xl font-bold mb-2">Siap Melakukan Perubahan?</h3>
                 <p className="text-emerald-100">Langkah kecilmu menyehatkan paru-paru bumi.</p>
               </div>
               <Link href="/komitmen" className="z-10">
                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-slate-900 text-white whitespace-nowrap px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-black transition-colors">
                   Coba Simulasi 3D
                 </motion.button>
               </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}