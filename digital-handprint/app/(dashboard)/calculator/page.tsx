"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tv, Mail, Smartphone, Plus, Minus, Zap, BarChart3, TreePine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

import PulauTerapung3D from "../../../components/KalkulatorAnimation3D";
import { type Variants } from "framer-motion"

// --- KOMPONEN UTAMA KALKULATOR ---
export default function HalamanKalkulator() {
  // 1. STATUS INTERNAL (STATE)
  const [dataAktivitas, setDataAktivitas] = useState({ 
    durasiStreaming: 0, 
    jumlahEmail: 0, 
    durasiMedsos: 0 
  });
  const [apakahSudahDimuat, setApakahSudahDimuat] = useState(false);

  // Efek daur hidup untuk memastikan sisi klien siap merender 3D
  useEffect(() => { 
    setApakahSudahDimuat(true); 
  }, []);

  // 2. RUMUS KALKULASI JEJAK KARBON (Matematika Emisi)
  const totalEmisiKarbon = (dataAktivitas.durasiStreaming * 100) + (dataAktivitas.jumlahEmail * 4) + (dataAktivitas.durasiMedsos * 50);
  const jumlahPohonDibutuhkan = Math.ceil(totalEmisiKarbon / 60);

  // Format data khusus untuk diagram Recharts
  const dataGrafik = [
    { nama: "Streaming", emisiCO2: dataAktivitas.durasiStreaming * 100, warna: "#2dd4bf" },
    { nama: "Email", emisiCO2: dataAktivitas.jumlahEmail * 4, warna: "#34d399" },
    { nama: "Medsos", emisiCO2: dataAktivitas.durasiMedsos * 50, warna: "#10b981" },
  ];

  // 3. FUNGSI PENGUBAH ANGKA AKTIVITAS (Tambah/Kurang)
  const ubahDataAktivitas = (kunci: keyof typeof dataAktivitas, perubahan: number, batasMaksimal: number) => {
    setDataAktivitas((sebelumnya) => ({
      ...sebelumnya,
      [kunci]: Math.max(0, Math.min(batasMaksimal, sebelumnya[kunci] + perubahan)),
    }));
  };

  // 4. LOGIKA EVALUASI KONDISI LINGKUNGAN PULAU
  const tentukanKondisiLingkungan = (): "lush" | "struggling" | "damaged" => {
    if (totalEmisiKarbon < 500) return "lush";
    if (totalEmisiKarbon < 1800) return "struggling";
    return "damaged";
  };

  const kondisiLingkungan = tentukanKondisiLingkungan();

  // Kamus teks deskripsi berdasarkan status kesehatan alam
  const teksInformasiLingkungan = {
    lush: { judulTeks: "Ekosistem Lestari", deskripsi: "Kadar emisi rendah. Pulau hidup dengan subur, udara bersih, dan kehidupan berkembang alami.", warnaTeks: "text-emerald-600", warnaBg: "bg-emerald-50" },
    struggling: { judulTeks: "Ekosistem Tertekan", deskripsi: "Emisi meningkat tajam. Suhu naik, struktur jalan perkotaan, polusi udara, dan pabrik mulai mengambil alih lahan hijau.", warnaTeks: "text-amber-600", warnaBg: "bg-amber-50" },
    damaged: { judulTeks: "Ekosistem Hancur", deskripsi: "Krisis Iklim! Tata kota padat industri, polusi pekat berbahaya, alam mati digantikan jalan raya serta gedung bertingkat.", warnaTeks: "text-rose-600", warnaBg: "bg-rose-50" }
  };

  const visualisasiInfo = teksInformasiLingkungan[kondisiLingkungan];

  // Konfigurasi variasi gerakan animasi (Framer Motion)
  const variasiKontainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {  staggerChildren: 0.15 }
    }
  };

const variasiElemen: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
}

  // --- SUB-KOMPONEN KARTU INPUT INTERAKTIF ---
  const KartuInteraktif = ({ judul, icon: Ikon, nilai, batasMaksimal, satuan, kunciData }: any) => {
    const persentaseProgres = (nilai / batasMaksimal) * 100;
    return (
      <motion.div variants={variasiElemen} whileHover={{ y: -5 }} className="relative bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
        <div className="absolute bottom-0 left-0 w-full bg-teal-50/40 -z-10 transition-all duration-500 ease-out" style={{ height: `${persentaseProgres}%` }} />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <div className="p-3 bg-white shadow-sm rounded-xl text-teal-500 ring-1 ring-slate-100"><Ikon size={20}/></div>
            {judul}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => ubahDataAktivitas(kunciData, -1, batasMaksimal)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors active:scale-95">
            <Minus size={18} />
          </button>
          <div className="text-center">
            <AnimatePresence mode="popLayout">
              <motion.span key={nilai} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="inline-block text-3xl font-black text-teal-700">
                {nilai}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-400 text-sm ml-1">{satuan}</span>
          </div>
          <button onClick={() => ubahDataAktivitas(kunciData, 1, batasMaksimal)} className="w-10 h-10 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-colors active:scale-95 shadow-md shadow-teal-500/30">
            <Plus size={18} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12 selection:bg-teal-100">
      <motion.div 
        variants={variasiKontainer}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        {/* PANEL ATAS: INFORMASI STATUS & TAMPILAN ISLAND 3D */}
        <motion.div variants={variasiElemen} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 bg-white p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-slate-100 items-center overflow-hidden">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${visualisasiInfo.warnaBg} ${visualisasiInfo.warnaTeks}`}>
              ● {visualisasiInfo.judulTeks}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Kalkulator Dampak <br />
              Jejak <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Karbon Digital.</span>
            </h1>
            <p className="text-slate-500 text-base max-w-md leading-relaxed">
              {visualisasiInfo.deskripsi} Tambah atau kurangi aktivitas harianmu untuk mengontrol kondisi simulasi pulau 3D di samping.
            </p>
          </div>

          {/* STUDIO VIEWPORT MODEL 3D */}
          <div className="lg:col-span-6 h-72 md:h-80 w-full relative bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 flex items-center justify-center cursor-grab active:cursor-grabbing">
            {apakahSudahDimuat ? (
              <Canvas camera={{ position: [0, 2.5, 5], fov: 45 }} shadows>
                <ambientLight intensity={0.5} />
                <hemisphereLight groundColor="#000000" intensity={0.6} />
                <directionalLight 
                  position={[5, 10, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize={[1024, 1024]} 
                />
                
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                  {/* Komponen PulauTerapung3D dipanggil dengan properti baru */}
                  <PulauTerapung3D kondisiLingkungan={kondisiLingkungan} />
                </Float>
                <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1} />
              </Canvas>
            ) : (
              <div className="text-sm font-medium text-slate-400 animate-pulse">Memuat Grafis 3D Resolusi Tinggi...</div>
            )}
            <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono pointer-events-none bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
              ▲ Drag 3D untuk Orbit
            </div>
          </div>
        </motion.div>
        
        {/* PANEL BAWAH: PANEL KONTROL INPUT & DIAGRAM AKUMULASI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Kumpulan Kartu Input */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <KartuInteraktif judul="Streaming Video" icon={Tv} nilai={dataAktivitas.durasiStreaming} batasMaksimal={24} satuan="Jam" kunciData="durasiStreaming" />
            <KartuInteraktif judul="Kirim/Baca Email" icon={Mail} nilai={dataAktivitas.jumlahEmail} batasMaksimal={100} satuan="Email" kunciData="jumlahEmail" />
            <KartuInteraktif judul="Media Sosial" icon={Smartphone} nilai={dataAktivitas.durasiMedsos} batasMaksimal={24} satuan="Jam" kunciData="durasiMedsos" />
            
            <motion.div variants={variasiElemen} className="bg-teal-600 text-white p-6 rounded-3xl flex items-center gap-4 shadow-lg shadow-teal-600/20">
              <Zap size={32} className="text-teal-200 shrink-0" />
              <p className="text-sm leading-relaxed font-medium">Tips: Menurunkan resolusi YouTube dari 4K ke 1080p dapat mengurangi emisi karbon hingga 75%.</p>
            </motion.div>
          </div>

          {/* Kolom Kanan: Hasil Statistik Akhir & Grafik Bar */}
          <motion.div variants={variasiElemen} className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-500"/> Akumulasi Emisi Harian
            </h2>
            
            <div className="flex items-end gap-2 mb-8">
              <motion.span key={totalEmisiKarbon} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl font-black text-slate-800 tracking-tighter">
                {totalEmisiKarbon}
              </motion.span>
              <span className="text-xl font-medium text-slate-400 mb-2">g CO2e</span>
            </div>

            <div className={`mt-0 mb-8 p-4 rounded-2xl flex items-start gap-3 border transition-colors ${visualisasiInfo.warnaBg} border-slate-100`}>
              <TreePine size={24} className="text-teal-500 shrink-0 mt-1"/> 
              <p className="text-sm leading-relaxed text-slate-600">
                Bumi membutuhkan sekitar <strong>{jumlahPohonDibutuhkan} pohon</strong> dewasa yang tumbuh selama setahun untuk menyerap emisi digital harianmu ini.
              </p>
            </div>
            
            {/* Render Grafik Recharts */}
            <div className="h-56 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrafik} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="nama" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="emisiCO2" radius={[6, 6, 0, 0]}>
                    {dataGrafik.map((entri, indeks) => (
                      <Cell key={`cell-${indeks}`} fill={entri.warna} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
