"use client";

import { useState, Suspense } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  HeartHandshake, MailMinus, MonitorDown, PlayCircle, 
  Wifi, CloudOff, Bookmark, CheckCircle2, ArrowRight 
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

import dynamic from "next/dynamic";

function LoadingPulau3D() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-900/5 backdrop-blur-sm">
      {/* Efek Lingkaran 3D yang Berdenyut (Pulse) */}
      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
        {/* Ring Luar (Ocean Ring Mimic) */}
        <div className="absolute inset-0 rounded-full border border-teal-200/40 animate-ping opacity-25" />
        <div className="absolute inset-4 rounded-full border border-sky-300/30 animate-pulse duration-1000" />
        
        {/* Lapisan Pulau Utama */}
        <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-teal-100/50 via-emerald-100/40 to-sky-100/60 shadow-inner animate-pulse duration-700 flex items-center justify-center">
          {/* Inti Pusat */}
          <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-sm">
            <svg className="animate-spin h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Teks Status */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        className="mt-6 text-xs font-bold tracking-widest text-slate-500 uppercase text-center"
      >
        Membangun Ekosistem 3D...
      </motion.p>
    </div>
  );
}

const AnimasiBumiInteraktif = dynamic(
  () => import("../../../components/KomitmenAnimation3D"),
  {
    ssr: false, // Tetap matikan SSR
  }
);

const PILIHAN_JANJI = [
  { id: 1, judul: "Hapus Email Sampah", deskripsi: "Berhenti berlangganan newsletter yang tidak pernah dibaca untuk menghemat storage server.", ikon: MailMinus, co2: 12 },
  { id: 2, judul: "Turunkan Resolusi Video", deskripsi: "Streaming di 720p alih-alih 4K saat menonton di layar kecil (HP/Tablet).", ikon: MonitorDown, co2: 25 },
  { id: 3, judul: "Matikan Auto-Play", deskripsi: "Mencegah video atau media sosial memuat data tak berujung saat kita sedang tidak fokus.", ikon: PlayCircle, co2: 15 },
  { id: 4, judul: "Gunakan Wi-Fi", deskripsi: "Menggunakan Wi-Fi mengonsumsi lebih sedikit energi per byte dibandingkan jaringan seluler (4G/5G).", ikon: Wifi, co2: 10 },
  { id: 5, judul: "Bersihkan Cloud", deskripsi: "Hapus foto blur, duplikat, atau file lama dari Google Drive / iCloud Anda.", ikon: CloudOff, co2: 18 },
  { id: 6, judul: "Gunakan Bookmark", deskripsi: "Langsung ke situs web yang sering dikunjungi daripada mencarinya lewat mesin pencari setiap saat.", ikon: Bookmark, co2: 5 },
];

export default function HalamanKomitmen() {
  const [janjiTerpilih, setJanjiTerpilih] = useState<number[]>([]);
  const [sudahKirimJanji, setSudahKirimJanji] = useState(false);

  const pilihAtauBatalJanji = (id: number) => {
    setJanjiTerpilih(sebelumnya => 
      sebelumnya.includes(id) ? sebelumnya.filter(idJanji => idJanji !== id) : [...sebelumnya, id]
    );
  };

  const totalCO2Diselamatkan = janjiTerpilih.reduce((total, id) => {
    const dataJanji = PILIHAN_JANJI.find(j => j.id === id);
    return total + (dataJanji?.co2 || 0);
  }, 0);

  const rasioKesehatanBumi = janjiTerpilih.length / PILIHAN_JANJI.length;

  const variasiKontainer: Variants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    },
  };

  const variasiItem: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    show: { 
      opacity: 1, scale: 1, y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans overflow-hidden selection:bg-teal-100">
      
      <motion.section 
        variants={variasiKontainer} 
        initial="hidden" 
        animate="show" 
        className="relative px-6 pt-12 md:pt-20 pb-12 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center"
      >
        <div className="order-last lg:order-first z-10 lg:col-span-6">
          <motion.div variants={variasiItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
            <HeartHandshake size={16} className="text-teal-500" />
            Langkah Kecil, Dampak Besar
          </motion.div>
          
          <motion.h1 variants={variasiItem} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
            Saatnya Berubah, <br className="hidden md:block"/>
            Mulai dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Jari Kita.</span>
          </motion.h1>
          
          <motion.p variants={variasiItem} className="text-lg text-slate-500 mb-8 max-w-2xl leading-relaxed">
            Setiap komitmen digital yang kamu pilih akan memulihkan bumi kita. Pilih kebiasaan baikmu di bawah dan lihat perubahan nyata pada bumi secara langsung!
          </motion.p>
        </div>

        {/* KONTAINER 3D BUMI */}
        <motion.div variants={variasiItem} className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center order-first lg:order-last cursor-grab active:cursor-grabbing lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white">
          <div 
            className="absolute w-72 h-72 rounded-full blur-[100px] transition-colors duration-1000" 
            style={{ backgroundColor: rasioKesehatanBumi > 0.5 ? 'rgba(20, 184, 166, 0.4)' : 'rgba(239, 68, 68, 0.2)' }}
          />

          <Suspense fallback={<LoadingPulau3D />}></Suspense>
            <div className="w-full h-full">
              <Canvas camera={{ position: [0, 1.5, 8.5], fov: 50 }} shadows gl={{ antialias: true }}>
                <ambientLight intensity={0.6} />
                <hemisphereLight groundColor="#0f172a" intensity={0.4} color="#ffffff" />
                <directionalLight 
                  position={[5, 5, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ccfbf1" />
                
                  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    {/* Menggunakan nama properti baru "rasioKesehatan" */}
                    <AnimasiBumiInteraktif rasioKesehatan={rasioKesehatanBumi} />
                  </Float>
                
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
              </Canvas>
            </div>
          <Suspense fallback={<LoadingPulau3D />}></Suspense>
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
                Status: {rasioKesehatanBumi === 1 ? "Asri Sempurna 🌍" : rasioKesehatanBumi > 0.4 ? "Mulai Pulih 🌿" : "Kritis 🥀"}
             </div>
             <div className="text-xs font-mono text-slate-300 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                Drag untuk putar
             </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div variants={variasiKontainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <AnimatePresence mode="wait">
            {!sudahKirimJanji ? (
              <motion.div 
                key="grid-pilihan-janji"
                variants={variasiKontainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {PILIHAN_JANJI.map((pilihan) => {
                  const terpilih = janjiTerpilih.includes(pilihan.id);
                  return (
                    <motion.div
                      key={pilihan.id}
                      variants={variasiItem}
                      whileHover={{ scale: 1.03, y: -4, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => pilihAtauBatalJanji(pilihan.id)}
                      className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
                        terpilih 
                          ? "bg-teal-50 border-teal-500 shadow-[0_12px_30px_rgba(20,184,166,0.2)]" 
                          : "bg-white border-slate-100 hover:border-teal-300 hover:shadow-lg"
                      }`}
                    >
                      <AnimatePresence>
                        {terpilih && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0, rotate: -45 }} 
                            animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                            exit={{ scale: 0, opacity: 0, rotate: 45 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="absolute top-5 right-5 text-teal-500"
                          >
                            <CheckCircle2 size={26} className="fill-teal-100" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                        terpilih ? "bg-teal-500 text-white shadow-md shadow-teal-500/30" : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600"
                      }`}>
                        <pilihan.ikon size={26} />
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-2 transition-colors ${terpilih ? "text-teal-900" : "text-slate-800"}`}>
                        {pilihan.judul}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-4 ${terpilih ? "text-teal-700/80" : "text-slate-500"}`}>
                        {pilihan.deskripsi}
                      </p>

                      <div className={`text-xs font-bold inline-flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                        terpilih ? "bg-teal-200/60 text-teal-900" : "bg-slate-50 text-slate-500"
                      }`}>
                        Hemat ~{pilihan.co2}kg CO₂/tahun
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="tampilan-sukses"
                initial={{ opacity: 0, scale: 0.8, y: 30 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white border border-teal-100 shadow-2xl p-10 md:p-16 rounded-[2.5rem] text-center max-w-3xl mx-auto relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-50/50 to-white z-0 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1, rotate: [0, 15, -15, 0] }} 
                    transition={{ 
                      delay: 0.2, 
                      scale: { type: "spring", stiffness: 150 },
                      rotate: { type: "tween", duration: 0.5, ease: "easeInOut" }
                    }}
                    className="w-24 h-24 bg-teal-500 rounded-3xl rotate-3 flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(20,184,166,0.4)]"
                  >
                    <HeartHandshake size={48} />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Terima Kasih Atas Komitmenmu!</h2>
                  <p className="text-slate-500 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                    Bumi sedikit lebih bernapas lega berkat keputusanmu hari ini. Kami telah mencatat ikrarmu sebagai bagian dari gerakan <span className="font-semibold text-teal-600">Digital Handprint</span>.
                  </p>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="bg-slate-50 border border-slate-200 px-8 py-6 rounded-3xl w-full max-w-sm mb-8 shadow-inner"
                  >
                    <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Potensi Dampakmu</div>
                    <div className="text-4xl font-black text-teal-600">
                      -{totalCO2Diselamatkan} <span className="text-xl text-teal-400">kg CO₂/thn</span>
                    </div>
                  </motion.div>
                  <button 
                    onClick={() => { setSudahKirimJanji(false); setJanjiTerpilih([]); }}
                    className="text-slate-400 hover:text-teal-600 font-semibold transition-colors flex items-center gap-2"
                  >
                    Buat Komitmen Baru
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* BAR BAWAH MELAYANG (STICKY) */}
      <AnimatePresence>
        {janjiTerpilih.length > 0 && !sudahKirimJanji && (
          <motion.div 
            initial={{ y: 120, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] md:w-auto md:min-w-[450px]"
          >
            <div className="bg-slate-900 text-white p-4 pr-4 pl-6 rounded-full shadow-2xl shadow-slate-900/50 flex items-center justify-between gap-6 border border-slate-700">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-0.5">Total Pencegahan Emisi</div>
                <div className="text-xl font-black text-emerald-400">{totalCO2Diselamatkan} kg <span className="text-sm font-medium text-slate-400">CO₂ / thn</span></div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setSudahKirimJanji(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Ikrar Sekarang <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}