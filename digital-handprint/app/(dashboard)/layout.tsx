"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calculator, 
  BookOpen, 
  BarChart2, 
  HeartHandshake, 
  Menu, 
  X, 
  Gamepad2,
  Leaf,
  MessageSquare 
} from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. STATE & UTILITY (Memori internal komponen)
  const [apakahSidebarTerbuka, setSidebarTerbuka] = useState(false);
  const [apakahLayarDesktop, setLayarDesktop] = useState(true); 
  const jalurSaatIni = usePathname();

  // 2. LIFECYCLE (Mendeteksi perubahan ukuran layar)
  useEffect(() => {
    const aturUkuranLayar = () => setLayarDesktop(window.innerWidth >= 768);
    aturUkuranLayar(); // Jalankan sekali di awal
    window.addEventListener("resize", aturUkuranLayar);
    return () => window.removeEventListener("resize", aturUkuranLayar);
  }, []);

  // 3. DATA MENU (Data navigasi yang telah diindonesiakan propertinya)
  const daftarMenu = [
    { nama: "Home", ikon: LayoutDashboard, jalur: "/" },
    { nama: "Kalkulator", ikon: Calculator, jalur: "/calculator" },
    { nama: "Metodologi", ikon: BookOpen, jalur: "/metodologi" },
    { nama: "Dampak & Info", ikon: BarChart2, jalur: "/dampak" },
    { nama: "Komitmen Bersama", ikon: HeartHandshake, jalur: "/komitmen" },
    { nama: "Sejarah Emisi", ikon: BookOpen, jalur: "/sejarah-emisi" },
    { nama: "Pesan untuk Bumi", ikon: MessageSquare, jalur: "/pesan" }, 
    { nama: "Game", ikon: Gamepad2, jalur: "/tycoon" }, 
  ];

  return (
      <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col md:flex-row">
        
        {/* NAVBAR MOBILE - EFEK GLASSMORPHISM */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/40 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-black/5 w-full">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-lg">
            <Leaf size={24} /> CAGEUR
          </div>
          <button onClick={() => setSidebarTerbuka(true)} className="p-2 text-slate-600 bg-white/50 backdrop-blur-md rounded-lg border border-white/40">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex flex-1 w-full relative">
          
          {/* SIDEBAR - EFEK GLASSMORPHISM PREMIUM */}
          <AnimatePresence>
            {(apakahSidebarTerbuka || apakahLayarDesktop) && (
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white/40 backdrop-blur-2xl border-r border-white/20 shadow-[10px_0_40px_rgba(0,0,0,0.04)] p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2 text-teal-600 font-extrabold text-2xl">
                    <Leaf size={28} /> CAGEUR
                  </div>
                  <button onClick={() => setSidebarTerbuka(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {daftarMenu.map((menu) => {
                    const apakahAktif = jalurSaatIni === menu.jalur;
                    return (
                      <Link href={menu.jalur} key={menu.jalur} onClick={() => setSidebarTerbuka(false)}>
                        <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                          apakahAktif 
                            ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20 font-bold" 
                            : "text-slate-500 hover:bg-white/50 hover:text-teal-600 border border-transparent hover:border-white/40"
                        }`}>
                          <menu.ikon size={20} className={apakahAktif ? "text-white" : "text-slate-400"} />
                          {menu.nama}
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Bagian Bawah Sidebar */}
                <div className="mt-auto p-4 bg-teal-600/5 rounded-2xl border border-teal-600/10 text-center">
                  <p className="text-xs text-teal-600 font-semibold">Eco-Friendly Web</p>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* OVERLAY MOBILE - BLUR BACKGROUND */}
          <AnimatePresence>
            {apakahSidebarTerbuka && !apakahLayarDesktop && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSidebarTerbuka(false)}
                className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-40 md:hidden"
              />
            )}
          </AnimatePresence>

          {/* AREA KONTEN UTAMA */}
          <main className="flex-1 min-w-0 w-full relative overflow-x-hidden">
            {children}
          </main>
          
        </div>
      </div>
  );
}