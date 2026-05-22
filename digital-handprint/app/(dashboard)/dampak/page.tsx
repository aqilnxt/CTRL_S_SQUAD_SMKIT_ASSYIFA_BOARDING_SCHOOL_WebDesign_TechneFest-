"use client";

import { Suspense } from "react";
import { motion, Variants } from "framer-motion";
import { 
  TreePine, Plane, MonitorPlay, Mail, Globe2, ArrowRight
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

// Memanggil nama komponen baru (bahasa Indonesia) dari file aset 3D
import PulauDigitalEko from "../../../components/DampakAnimation3D"; 

export default function DampakPage() {
  // Pengaturan Animasi Utama untuk Transisi Antarmuka
  const wadahAnimasi: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const variasiElemen: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 35 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 120, damping: 16, mass: 0.9 } 
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans overflow-hidden">
      <motion.div variants={wadahAnimasi} initial="hidden" animate="show">
        
        {/* BAGIAN UTAMA DENGAN KANVAS PULAU DIGITAL 3D */}
        <section className="relative px-6 pt-12 md:pt-20 pb-16 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
          
          {/* KIRI: Blok Konten Teks */}
          <div className="order-last lg:order-first z-10">
            <motion.div variants={variasiElemen} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              <Globe2 size={16} className="text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
              Realita Internet Kita
            </motion.div>
            
            <motion.h1 variants={variasiElemen} className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
              Jejak Tak Terlihat <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Berdampak Nyata.
              </span>
            </motion.h1>
            
            <motion.p variants={variasiElemen} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
              Internet menyumbang sekitar 4% dari total emisi gas rumah kaca global—lebih besar dari industri penerbangan sipil. Mari lihat dampak nyata dari kebiasaan digital kita.
            </motion.p>
          </div>

          {/* KANAN: Kontainer Kanvas Real 3D Studio */}
          <motion.div variants={variasiElemen} className="relative w-full h-[400px] md:h-[480px] flex items-center justify-center order-first lg:order-last cursor-grab active:cursor-grabbing">
            <div className="absolute w-80 h-80 bg-emerald-200/40 rounded-full blur-[100px] -z-10" />

            <div className="w-full h-full">
              <Canvas camera={{ position: [3.2, 3.2, 4.2], fov: 45 }} shadows>
                <ambientLight intensity={0.6} />
                <hemisphereLight groundColor="#1e293b" intensity={0.4} />
                <directionalLight 
                  position={[5, 8, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize={[1024, 1024]} 
                />
                <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#06b6d4" />

                <Suspense fallback={null}>
                  <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                    {/* Render komponen 3D yang sudah diperbarui namanya */}
                    <PulauDigitalEko />
                  </Float>
                </Suspense>
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.8}
                />
              </Canvas>
            </div>
          </motion.div>
        </section>

        {/* INFOGRAFIS 1: FAKTA INTERNET */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div variants={variasiElemen} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Fakta Internet Global</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Angka di balik layar gawai Anda.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { ikon: MonitorPlay, warna: "group-hover:bg-teal-500 group-hover:text-teal-600", nilai: "60%", keterangan: "Dari seluruh lalu lintas internet global digunakan semata-mata untuk <strong>Video Streaming</strong> (Netflix, YouTube, dll)." },
              { ikon: Globe2, warna: "group-hover:bg-emerald-500 group-hover:text-emerald-600", nilai: "Top 4", keterangan: "Jika internet adalah sebuah negara, ia akan menjadi <strong>penyumbang polusi terbesar ke-4</strong> di dunia, tepat di bawah India." },
              { ikon: Mail, warna: "group-hover:bg-blue-500 group-hover:text-blue-600", nilai: "50g", keterangan: "Adalah jumlah emisi CO₂ rata-rata dari <strong>satu email dengan lampiran foto besar</strong>. Bayangkan dikalikan miliaran email per hari." }
            ].map((kartu, urutan) => (
              <motion.div 
                key={urutan}
                variants={variasiElemen}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 text-slate-50/70 group-hover:scale-110 transition-transform duration-500 z-0 pointer-events-none">
                  <kartu.ikon size={130} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-teal-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-600 mb-6 transition-colors duration-300">
                    <kartu.ikon size={24} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 mb-2 transition-colors">{kartu.nilai}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: kartu.keterangan }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* INFOGRAFIS 2: EKUIVALENSI */}
        <section className="bg-white py-20 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div variants={variasiElemen} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Apa Artinya 1 Ton CO₂ Digital?</h2>
              <p className="text-slate-500">Menganalogikan data maya ke dalam bentuk fisik agar mudah dipahami.</p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {[
                { ikon: Plane, warna: "bg-blue-50 text-blue-500", gayaSentuh: "hover:border-teal-200", judul: "1 Penerbangan Paris - New York", penjelasan: "Konsumsi energi server setara dengan bahan bakar satu penumpang pesawat rute trans-atlantik." },
                { ikon: TreePine, warna: "bg-emerald-50 text-emerald-500", gayaSentuh: "hover:border-emerald-200", judul: "Butuh 50 Pohon Dewasa", penjelasan: "Dibutuhkan 50 pohon yang tumbuh selama satu tahun penuh hanya untuk menyerap emisi tersebut." }
              ].map((baris, urutan) => (
                <motion.div 
                  key={urutan}
                  variants={variasiElemen}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-all duration-300"
                >
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center p-4 shrink-0">
                    <div className="text-4xl font-black text-slate-800">1 Ton</div>
                    <div className="text-sm text-slate-500 font-semibold mt-1">Karbon Digital</div>
                  </div>
                  <div className="hidden md:flex items-center text-slate-300"><ArrowRight size={32}/></div>
                  <div className="w-full md:w-2/3 flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm">
                    <div className={`w-16 h-16 rounded-full ${baris.warna} flex items-center justify-center shrink-0`}>
                      <baris.ikon size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{baris.judul}</h4>
                      <p className="text-sm text-slate-500 mt-1">{baris.penjelasan}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </motion.div>
    </div>
  );
}