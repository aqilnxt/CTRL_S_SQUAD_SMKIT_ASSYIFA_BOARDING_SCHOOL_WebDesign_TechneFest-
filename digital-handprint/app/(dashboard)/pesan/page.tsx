"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { Send, Heart, Globe, X, ChevronRight, Sparkles, Leaf } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import { supabase } from "@/lib/supabase";

import PulauCeria from "../../../components/PesanAnimation3D";

function KartuPesan({ dataPesan, indeks }: { dataPesan: any; indeks: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 100, damping: 14, delay: indeks * 0.06 }}
      className="group relative min-h-[140px] flex flex-col bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(13,148,136,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default"
    >
      <div className="flex gap-4 items-start relative z-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{dataPesan.nama}</h4>
            <Leaf size={10} className="shrink-0 text-teal-400 opacity-70" />
          </div>
          <p className="text-slate-500 text-md leading-relaxed line-clamp-2 italic">
            "{dataPesan.isi_pesan}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function KartuPesanModal({ dataPesan, indeks }: { dataPesan: any; indeks: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: indeks * 0.05 }}
      className="group relative isolate rounded-[24px] p-[1px] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/40 via-transparent to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
      
      <div className="relative min-h-[140px] h-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-[23px] p-5 shadow-sm hover:shadow-md flex flex-col justify-between z-10">
        <div className="flex gap-4 items-start relative z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">{dataPesan.nama}</h4>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>
            
            <div className="relative">
              <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-medium italic">
                "{dataPesan.isi_pesan}"
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 opacity-30 group-hover:opacity-100 transition-opacity">
           <Leaf size={14} className="text-teal-600 rotate-12" />
        </div>
      </div>
    </motion.div>
  );
}

export default function HalamanPesan() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [daftarPesan, setDaftarPesan] = useState<any[]>([]);
  const [semuaPesan, setSemuaPesan] = useState<any[]>([]);
  const [sedangMengirim, setSedangMengirim] = useState(false);
  const [tampilSukses, setTampilSukses] = useState(false);
  const [tampilSemuaModal, setTampilSemuaModal] = useState(false);

  const ambilPesanTampilan = async () => {
    const { data } = await supabase
      .from("pesan").select("*").order("created_at", { ascending: false }).limit(6);
    if (data) setDaftarPesan(data);
  };
  
  const ambilSemuaPesan = async () => {
    const { data } = await supabase
      .from("pesan").select("*").order("created_at", { ascending: false });
    if (data) setSemuaPesan(data);
  };

  useEffect(() => {
    ambilPesanTampilan();
    ambilSemuaPesan();
    const saluran = supabase
      .channel("realtime-pesan")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pesan" }, (muatan) => {
        setDaftarPesan((sebelumnya) => [muatan.new, ...sebelumnya.slice(0, 5)]);
        setSemuaPesan((sebelumnya) => [muatan.new, ...sebelumnya]);
      })
      .subscribe();
    return () => { supabase.removeChannel(saluran); };
  }, []);

  const tanganiKirim = async () => {
    if (!nama || !pesan) return alert("Lengkapi namamu dan pesanmu");
    setSedangMengirim(true);
    const { error } = await supabase.from("pesan").insert([{ nama, isi_pesan: pesan }]);
    if (error) { alert("Error: " + error.message); }
    else {
      setNama(""); setPesan("");
      setTampilSukses(true);
      setTimeout(() => setTampilSukses(false), 3000);
    }
    setSedangMengirim(false);
  };

  const varianWadah: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  
  const varianItem: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 12 } },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 overflow-x-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-50/50 rounded-full blur-[120px]" />
      </div>

      <motion.div variants={varianWadah} initial="hidden" animate="show" className="max-w-7xl mx-auto px-6">
        <section className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center pt-12 md:pt-20">
          <div className="order-2 lg:order-1 relative">
            <motion.div variants={varianItem} className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-1.5 rounded-full shadow-sm">
                <Sparkles size={14} className="text-teal-600 animate-pulse" />
                <span className="text-teal-700 font-bold text-[10px] md:text-xs uppercase tracking-[0.15em]">
                  Kirim Harapan Digital
                </span>
              </div>
            </motion.div>
            <motion.h1 variants={varianItem} className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Pesan untuk <br />
              <span className="relative">
                <span className="relative z-10 text-teal-600">Bumi Kita.</span>
                <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                  <motion.path d="M5 15Q150 2 295 15" stroke="#2dd4bf" strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }} />
                </motion.svg>
              </span>
            </motion.h1>
            <motion.p variants={varianItem} className="text-lg text-slate-500 max-w-md leading-relaxed mb-10">
              Kumpulkan niat baikmu dalam sebuah botol digital. Mari bersama-sama menurunkan jejak karbon lewat aksi nyata.
            </motion.p>
          </div>
          
          <motion.div variants={varianItem} className="h-[400px] md:h-[550px] w-full order-1 lg:order-2 relative group">
            <Canvas camera={{ position: [5, 5, 5], fov: 30 }} shadows>
              <ambientLight intensity={0.7} />
              <pointLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
              <Suspense fallback={null}>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                  {/* KOMPONEN 3D DIPANGGIL DI SINI */}
                  <PulauCeria />
                </Float>
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>
        </section>

        <section className="grid lg:grid-cols-12 gap-12 mt-24">
          <motion.div variants={varianItem} className="lg:col-span-5">
            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative">
              <div className="absolute -top-6 -left-6 bg-teal-600 text-white p-4 rounded-2xl shadow-xl rotate-[-10deg]">
                <Heart size={24} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Apa Komitmenmu?</h2>
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 block ml-1">Nickname</label>
                  <input
                    type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                    placeholder="GreenGuardian"
                    className="w-full bg-slate-100/50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 block ml-1">Pesan / Harapan</label>
                  <textarea
                    rows={4} value={pesan} onChange={(e) => setPesan(e.target.value)}
                    placeholder="Tuliskan janji kecilmu..."
                    className="w-full bg-slate-100/50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold resize-none"
                  />
                </div>
                <motion.button
                  onClick={tanganiKirim}
                  disabled={sedangMengirim}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -10px rgba(20, 184, 166, 0.5)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full overflow-hidden group rounded-[24px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center gap-3 py-5 px-8 text-white font-black tracking-widest uppercase text-sm z-10">
                    {sedangMengirim ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>MENGIRIM...</span>
                      </>
                    ) : (
                      <>
                        <span>KIRIM</span>
                        <div className="bg-white/20 p-1.5 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                          <Send size={18} className="text-white" />
                        </div>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.div
              variants={varianItem}
              className="relative rounded-[48px] p-1 overflow-hidden h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 via-white to-emerald-100 animate-gradient-xy" />
              <div className="relative bg-white/60 backdrop-blur-2xl rounded-[46px] min-h-full border border-white/80 shadow-2xl shadow-teal-900/5">
                <div className="px-10 pt-10 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-teal-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl">
                        <Globe size={24} className="text-teal-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Harapan Kalian</h3>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setTampilSemuaModal(true)}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 text-xs font-black text-slate-800 bg-white/80 border border-slate-200 px-6 py-3 rounded-2xl shadow-sm transition-all"
                  >
                    EXPLORE ALL <ChevronRight size={14} className="text-teal-500" />
                  </motion.button>
                </div>

                <div className="px-8 pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                      {daftarPesan.map((dataPesan, i) => (
                        <KartuPesan key={dataPesan.id} dataPesan={dataPesan} indeks={i} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {daftarPesan.length === 0 && (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                        <Sparkles size={24} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">Menunggu harapan pertamamu...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {tampilSemuaModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 60, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[40px] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
            >
              <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-gradient-to-r from-slate-50 to-teal-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center shadow-md">
                    <Globe size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Seluruh Harapan</h2>
                    <p className="text-xs text-teal-600 font-semibold">{semuaPesan.length} orang telah berkomitmen</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setTampilSemuaModal(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="p-2.5 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                {semuaPesan.map((dataPesan, i) => (
                  <KartuPesanModal key={dataPesan.id} dataPesan={dataPesan} indeks={i} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tampilSukses && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="bg-white rounded-[40px] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col items-center text-center max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400" />
              <motion.div
                initial={{ rotateY: 180, scale: 0 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-3xl mb-6 flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(20,184,166,0.4)] rotate-12"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.div>
              <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl font-black text-slate-900 mb-2">
                Berhasil Terkirim!
              </motion.h3>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-slate-500 font-medium">
                Pesanmu telah mendarat di pulau harapan. Terima kasih!
              </motion.p>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 text-teal-400"
              >
                <Sparkles size={40} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}