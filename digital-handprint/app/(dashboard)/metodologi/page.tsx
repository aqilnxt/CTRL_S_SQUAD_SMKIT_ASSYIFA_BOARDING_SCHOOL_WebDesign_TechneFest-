"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Server,
  Zap,
  Leaf,
  Layers,
  Cpu,
  TrendingUp,
  MoveHorizontal
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";


import {
  NodePerangkat,
  NodeServer,
  NodeKarbon,
  LingkunganSekitar
} from "../../../components/MetodologiAnimation3D"; 

type KunciLangkah = 0 | 1 | 2;

function KartuLangkahPremium({
  indeks,
  judul,
  subjudul,
  deskripsi,
  rumus,
  ikon,
  aktif,
  saatDitekan,
  warnaAksen,
  warnaGarisTepi,
}: {
  indeks: string;
  judul: string;
  subjudul: string;
  deskripsi: string;
  rumus: string;
  ikon: React.ReactNode;
  aktif: boolean;
  saatDitekan: () => void;
  warnaAksen: string;
  warnaGarisTepi: string;
}) {
  return (
    <div
      onClick={saatDitekan}
      onMouseEnter={saatDitekan}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && saatDitekan()}
      className={`relative w-full text-left rounded-[32px] border p-8 transition-all duration-500 cursor-pointer group select-none ${
        aktif
          ? `bg-white ${warnaGarisTepi} shadow-[0_30px_60px_rgba(15,23,42,0.08)] scale-[1.02] z-10`
          : "bg-white/60 border-slate-100 opacity-60 hover:opacity-100"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${aktif ? warnaAksen + " text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
          {ikon}
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-slate-300 group-hover:text-slate-400">
          STAGE // {indeks}
        </span>
      </div>

      <div className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-400">{subjudul}</div>
      <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{judul}</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 h-12 overflow-hidden">{deskripsi}</p>

      <div className={`rounded-2xl border px-4 py-3 text-[11px] font-mono flex items-center justify-between transition-all ${aktif ? "bg-slate-900 text-teal-400 border-slate-900" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
        <span className="truncate max-w-[200px]">{rumus}</span>
        <ArrowRight size={14} className={`transition-transform duration-300 ${aktif ? "translate-x-1" : "text-slate-300"}`} />
      </div>
    </div>
  );
}

export default function HalamanMetodologi() {
  const [langkahAktif, setLangkahAktif] = useState<KunciLangkah>(0);
  const mulaiSentuhanX = useRef<number>(0);

  const tanganiAwalSentuhan = (e: React.TouchEvent) => {
    mulaiSentuhanX.current = e.touches[0].clientX;
  };

  const tanganiAkhirSentuhan = (e: React.TouchEvent) => {
    const akhirSentuhanX = e.changedTouches[0].clientX;
    tanganiGeser(mulaiSentuhanX.current, akhirSentuhanX);
  };

  const tanganiMouseTurun = (e: React.MouseEvent) => {
    mulaiSentuhanX.current = e.clientX;
  };

  const tanganiMouseNaik = (e: React.MouseEvent) => {
    const akhirMouseX = e.clientX;
    tanganiGeser(mulaiSentuhanX.current, akhirMouseX);
  };

  const tanganiGeser = (awal: number, akhir: number) => {
    const ambangGeser = 60;
    if (awal - akhir > ambangGeser) {
      setLangkahAktif((sebelumnya) => (sebelumnya < 2 ? ((sebelumnya + 1) as KunciLangkah) : 0));
    } else if (akhir - awal > ambangGeser) {
      setLangkahAktif((sebelumnya) => (sebelumnya > 0 ? ((sebelumnya - 1) as KunciLangkah) : 2));
    }
  };

  const kontenHUD = [
    {
      judul: "01 // COGNITIVE STREAM INGRESS",
      gayaAksen: "border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] text-cyan-400",
    },
    {
      judul: "02 // QUANTUM CORE PROCESSING",
      gayaAksen: "border-teal-500/40 shadow-[0_0_30px_rgba(45,212,191,0.25)] text-teal-400",
    },
    {
      judul: "03 // BIOPHILIC CARBON EGRESS",
      gayaAksen: "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] text-emerald-400",
    }
  ];

  return (
    <div className="min-h-screen pb-24 bg-[#fafafa] overflow-x-hidden antialiased selection:bg-teal-500 selection:text-white">
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.08),transparent_40%)] pointer-events-none" />

      {/* HEADER UTAMA */}
      <section className="relative px-6 pt-16 md:pt-24 pb-8 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Zap size={12} className="text-teal-400 fill-teal-400 animate-pulse" />
            National Championship Showcase
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
            Metodologi Konversi
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500">
              Siber-Ke-Karbon
            </span>
          </h1>

          <p className="text-base text-slate-500 mb-8 max-w-xl leading-relaxed">
            Inovasi kalkulator jejak karbon digital berbasis *Data Stream Math Mapping*. Mengukur emisi dari setiap bita aktivitas virtual Anda secara presisi dari hulu perangkat hingga hilir pembangkit listrik makro bumi.
          </p>

          {/* Quick Tab Select */}
          <div className="flex gap-2 max-w-md bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
            {(["01. Hulu Data", "02. Proses Jaringan", "03. Hilir Emisi"] as const).map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setLangkahAktif(idx as KunciLangkah)}
                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                  langkahAktif === idx ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D CANVAS VIEWPORT */}
        <div className="relative w-full h-[500px] md:h-[540px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-tr from-slate-200/40 to-slate-100/10 p-[1px] shadow-2xl">
            <div 
              className="w-full h-full bg-white rounded-[47px] overflow-hidden relative"
              onTouchStart={tanganiAwalSentuhan}
              onTouchEnd={tanganiAkhirSentuhan}
              onMouseDown={tanganiMouseTurun}
              onMouseUp={tanganiMouseNaik}
            >
              
              {/* CANVAS */}
              <div className="absolute inset-0 cursor-grab active:cursor-grabbing z-10">
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.0], fov: 45 }}>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[10, 15, 10]} intensity={2.2} />
                  <directionalLight position={[-10, -10, -5]} intensity={0.6} color="#14b8a6" />
                  <pointLight position={[0, 3, 0]} intensity={1.5} color="#22d3ee" />
                  
                  {langkahAktif === 0 && <NodePerangkat />}
                  {langkahAktif === 1 && <NodeServer />}
                  {langkahAktif === 2 && <NodeKarbon />}
                  
                  <LingkunganSekitar />
                  <ContactShadows position={[0, -1.75, 0]} opacity={0.35} scale={7} blur={2.2} />
                  
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.3}
                    maxPolarAngle={Math.PI / 1.8}
                    makeDefault 
                  />
                </Canvas>
              </div>

              {/* FLOATING CAPSULE HUD */}
              <div className="absolute inset-x-0 bottom-8 z-20 pointer-events-none flex flex-col items-center justify-center px-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={langkahAktif}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`px-8 py-3.5 bg-slate-950/95 backdrop-blur-xl border rounded-[22px] tracking-[0.2em] font-mono text-[10px] font-black text-center max-w-sm whitespace-nowrap ${kontenHUD[langkahAktif].gayaAksen}`}
                  >
                    {kontenHUD[langkahAktif].judul}
                  </motion.div>
                </AnimatePresence>

                {/* Tracker Indicator Dots */}
                <div className="flex gap-2 mt-4 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        langkahAktif === i ? "w-6 bg-teal-500" : "w-1.5 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Top Guidance Bar */}
              <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none flex justify-between items-center">
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                    Engine Active // Drag to Rotate
                  </div>
                </div>

                <div className="bg-slate-900/5 backdrop-blur-md px-3 py-2 rounded-xl border border-black/5 flex items-center gap-1.5 text-slate-500 font-medium text-[10px]">
                  <MoveHorizontal size={12} className="animate-bounce" /> Swipe Left/Right to Switch
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* THREE TIER INTERACTIVE CARDS */}
      <section className="max-w-7xl mx-auto px-6 mt-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KartuLangkahPremium
            indeks="01"
            subjudul="Ingress // Bit Stream"
            judul="Aktivitas Penjelajahan"
            deskripsi="Setiap megabita data dari interaksi layar gawai diubah ke bentuk request paket data siber kontinu yang meluncur ke internet."
            rumus="Data Paket = Vol (MB) × Waktu (s)"
            ikon={<Smartphone size={24} />}
            warnaAksen="bg-cyan-500"
            warnaGarisTepi="border-cyan-400"
            aktif={langkahAktif === 0}
            saatDitekan={() => setLangkahAktif(0)}
          />

          <KartuLangkahPremium
            indeks="02"
            subjudul="Processing // Compute"
            judul="Beban Kerja Server"
            deskripsi="Paket data diterima pusat server komputasi awan. Server memakan daya listrik dinamis murni guna mendinginkan core prosesor inti."
            rumus="Energi (kWh) = Data (GB) × PUE Data Center"
            ikon={<Server size={24} />}
            warnaAksen="bg-teal-500"
            warnaGarisTepi="border-teal-400"
            aktif={langkahAktif === 1}
            saatDitekan={() => setLangkahAktif(1)}
          />

          <KartuLangkahPremium
            indeks="03"
            subjudul="Egress // Carbonization"
            judul="Emisi Konversi Gas"
            deskripsi="Daya listrik dikonversikan dengan indeks intensitas karbon grid regional lokal guna merangkum berat emisi gas rumah kaca."
            rumus="CO2e (g) = Energi (kWh) × Faktor Emisi"
            ikon={<Leaf size={24} />}
            warnaAksen="bg-emerald-500"
            warnaGarisTepi="border-emerald-400"
            aktif={langkahAktif === 2}
            saatDitekan={() => setLangkahAktif(2)}
          />
        </div>
      </section>

      {/* TECH METRIC SPEC */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-teal-400 font-mono text-xs tracking-widest uppercase mb-3">
                <Layers size={16} /> Technical Spec Standard
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
                Metodologi Akurasi Tinggi Sesuai Standar Global GHG Protocol
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Formula matematika pengukur jejak siber kami mengadopsi koefisien mutakhir dari basis data sains terbuka industri lingkungan hidup global. Hal ini memastikan integritas aplikasi buatan kami bernilai jual tinggi saat dipresentasikan di depan dewan juri tingkat nasional.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Cpu size={20} className="text-cyan-400 mb-2" />
                <div className="text-xl font-bold font-mono">Real-Time</div>
                <div className="text-[11px] text-slate-400">Stream Processing Matrix</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <TrendingUp size={20} className="text-emerald-400 mb-2" />
                <div className="text-xl font-bold font-mono">99.8%</div>
                <div className="text-[11px] text-slate-400">Akurasi Formula Ilmiah</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}