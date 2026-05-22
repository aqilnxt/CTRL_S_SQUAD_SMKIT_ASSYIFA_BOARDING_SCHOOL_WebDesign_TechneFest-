"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Wind,
  Factory,
  Trees,
  Droplets,
} from "lucide-react";

import PemandanganPulauDinamis from "../../../components/SejarahAnimation3D";

const LINI_WAKTU = [
  {
    id: 0,
    tahun: "Pra-1750",
    judul: "Masa Pra-Industri",
    subjudul: "Keseimbangan Alam yang Sempurna",
    deskripsi: "Sebelum manusia menemukan mesin uap, bumi bernapas dengan ritme alaminya. Hutan lebat menyerap seluruh jejak karbon alami, hewan berkembang biak bebas, manusia hidup selaras dengan alam, dan udara benar-benar murni tanpa polusi.",
    dampak: 0,
    co2: "~280 ppm",
    ikon: Trees,
  },
  {
    id: 1,
    tahun: "1850 - 1950",
    judul: "Revolusi Industri",
    subjudul: "Asap Pertama di Udara",
    deskripsi: "Manusia mulai membakar batu bara secara massal untuk pabrik dan kereta api uap. Pemukiman mulai padat, beberapa wilayah hijau beralih fungsi, dan kepulan asap industri pertama mulai mengotori atmosfer bumi.",
    dampak: 0.35,
    co2: "300 - 310 ppm",
    ikon: Factory,
  },
  {
    id: 2,
    tahun: "1950 - 2000",
    judul: "Akselerasi Hebat",
    subjudul: "Ledakan Industri dan Urbanisasi",
    deskripsi: "Penggunaan minyak bumi meledak. Jutaan kendaraan bermotor mulai memadati jalan raya, gedung-gedung beton dibangun tinggi, aktivitas alam tergusur, dan langit mulai kehilangan warna birunya akibat polusi.",
    dampak: 0.7,
    co2: "310 - 370 ppm",
    ikon: Wind,
  },
  {
    id: 3,
    tahun: "2000 - Saat Ini",
    judul: "Krisis Iklim Modern",
    subjudul: "Tanda Bahaya untuk Bumi",
    deskripsi: "Era digital dan globalisasi membuat konsumsi energi mencapai rekor tertinggi. Polusi udara menebal secara ekstrem, ekosistem alam rusak parah, populasi makhluk hidup menyusut, dan bumi memasuki fase krisis iklim kritis.",
    dampak: 1,
    co2: "420+ ppm",
    ikon: Droplets,
  },
];

export default function SejarahEmisiPage() {
  const [indeksFase, setIndeksFase] = useState(0);
  const faseSekarang = LINI_WAKTU[indeksFase];
  const [[halaman, arah], setHalaman] = useState([0, 0]);

  const pindahHalaman = (arahBaru: number) => {
    if (
      (arahBaru === 1 && indeksFase === LINI_WAKTU.length - 1) ||
      (arahBaru === -1 && indeksFase === 0)
    ) {
      return;
    }
    setHalaman([halaman + arahBaru, arahBaru]);
    setIndeksFase((prev) => prev + arahBaru);
  };

  const varianWadah: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const varianItem: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  const varianGeser = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <motion.div
      variants={varianWadah}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-slate-100 flex flex-col font-sans overflow-hidden selection:bg-teal-100 selection:text-teal-900"
    >
      {/* Header */}
      <motion.div variants={varianItem} className="w-full text-center py-6 md:py-8 z-10 relative px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 text-slate-700 text-xs font-bold tracking-wider backdrop-blur-md mb-2 border border-slate-200">
          VISUALISASI DATA INTERAKTIF
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          Timeline Jejak Karbon Bumi
        </h1>
      </motion.div>

      {/* Main Grid Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10 pb-32 lg:pb-16">
        
        {/* 3D CANVAS COMPONENT CONTAINER */}
        <motion.div
          variants={varianItem}
          className="relative w-full h-[42vh] lg:h-[68vh] rounded-[2rem] shadow-inner bg-gradient-to-b from-sky-200 to-slate-200 overflow-hidden border border-white lg:col-span-7"
        >
          <div className="absolute inset-0 z-0">
            <PemandanganPulauDinamis targetDampak={faseSekarang.dampak} />
          </div>

          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_80%_85%,rgba(20,184,166,0.10),transparent_28%)]" />

          {/* Info Overlays */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-white/60 pointer-events-none">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
              Konsentrasi CO₂
            </div>
            <div className="text-xl font-black text-slate-800 tracking-tight">{faseSekarang.co2}</div>
          </div>

          <div className="absolute left-4 bottom-4 bg-slate-900/70 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 pointer-events-none">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300 mb-1">Fase</div>
            <div className="text-sm font-bold">{faseSekarang.tahun}</div>
          </div>
        </motion.div>

        {/* CONTENT INTERACTION PANEL */}
        <motion.div variants={varianItem} className="relative flex flex-col justify-center w-full lg:col-span-5 h-full">
          <AnimatePresence mode="wait" custom={arah}>
            <motion.div
              key={halaman}
              custom={arah}
              variants={varianGeser}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white p-6 md:p-10 rounded-[2rem] shadow-lg shadow-slate-200/60 border border-slate-100"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 border border-teal-100 shadow-sm">
                <faseSekarang.ikon size={28} />
              </div>

              <div className="text-teal-500 font-black text-lg md:text-xl tracking-wider mb-1">
                {faseSekarang.tahun}
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight leading-tight">
                {faseSekarang.judul}
              </h2>

              <h3 className="text-sm md:text-base font-semibold text-slate-400 mb-5">
                {faseSekarang.subjudul}
              </h3>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed">{faseSekarang.deskripsi}</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-500 transition-all duration-700"
                    style={{ width: `${Math.max(6, faseSekarang.dampak * 100)}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Dampak {Math.round(faseSekarang.dampak * 100)}%
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FOOTER CONTROLS BAR */}
      <motion.div
        variants={varianItem}
        className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-xl border-t border-slate-200/80 z-50 p-4 md:p-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between md:justify-center md:gap-16">
          <button
            onClick={() => pindahHalaman(-1)}
            disabled={indeksFase === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              indeksFase === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-md active:scale-95"
            }`}
          >
            <ChevronLeft size={18} /> <span>Sebelumnya</span>
          </button>

          <div className="flex gap-2">
            {LINI_WAKTU.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === indeksFase ? "w-6 bg-teal-500" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => pindahHalaman(1)}
            disabled={indeksFase === LINI_WAKTU.length - 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              indeksFase === LINI_WAKTU.length - 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-500/20 active:scale-95"
            }`}
          >
            <span>Berikutnya</span> <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}