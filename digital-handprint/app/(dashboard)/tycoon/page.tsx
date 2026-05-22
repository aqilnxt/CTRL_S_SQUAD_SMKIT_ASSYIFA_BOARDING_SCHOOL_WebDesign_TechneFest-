"use client";

import { useState, useEffect } from "react";
import { Server, Sun, Factory, Wind, Cpu, ArrowUpCircle, Coins } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sky } from "@react-three/drei";
// Pastikan path import ini sesuai dengan letak komponenmu
import FloatingIsland3D from "../../../components/GameAnimation3D"; 

const API_URL = "http://localhost:8000/api";

export default function DigitalTycoonGame() {
  // 1. STATE DISAMAKAN DENGAN BACKEND (Bahasa Indonesia)
  const [statusPermainan, setStatusPermainan] = useState({
    koin: 100, co2: 0, 
    jumlah_server: 0, jumlah_pusat_data: 0, jumlah_panel_surya: 0, jumlah_turbin_angin: 0,
    harga_server: 50, harga_pusat_data: 500, harga_panel_surya: 150, harga_turbin_angin: 800,
    level_server: 1, level_pusat_data: 1, level_panel_surya: 1, level_turbin_angin: 1, 
    biaya_upgrade_server: 300, biaya_upgrade_pusat_data: 1000, biaya_upgrade_panel_surya: 400, biaya_upgrade_turbin_angin: 1500,
    tingkat_produksi_co2: 0, tingkat_pengurangan_co2: 0,
    status_lingkungan: "subur"
  });

  // 2. ENDPOINT DISESUAIKAN (detik)
  useEffect(() => {
    const tickInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/detik`, { method: "POST" });
        if (res.ok) setStatusPermainan(await res.json());
      } catch (error) {
        console.error("Gagal terhubung ke server", error);
      }
    }, 1000);
    return () => clearInterval(tickInterval);
  }, []);

  // 3. ENDPOINT DISESUAIKAN (beli & upgrade)
  const buyItem = async (jenis_barang: string) => {
    const res = await fetch(`${API_URL}/beli/${jenis_barang}`, { method: "POST" });
    if (res.ok) setStatusPermainan(await res.json());
  };

  const upgradeItem = async (jenis_upgrade: string) => {
    const res = await fetch(`${API_URL}/upgrade/${jenis_upgrade}`, { method: "POST" });
    if (res.ok) setStatusPermainan(await res.json());
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL KIRI: UI GAME & STATISTIK */}
        <div className="lg:col-span-5 flex flex-col gap-6 max-h-screen overflow-y-auto pr-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h1 className="text-3xl font-black mb-2">Digital Tycoon</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center justify-center">
                <Coins size={24} className="text-amber-500 mb-1"/>
                <span className="text-3xl font-bold text-amber-600">{statusPermainan.koin}</span>
              </div>
              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center
                ${statusPermainan.co2 > 1000 ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-slate-50 border-slate-200"}`}>
                <Factory size={24} className="mb-1"/>
                <span className="text-3xl font-bold">{statusPermainan.co2}</span>
                <div className="flex gap-2 text-[10px] font-bold mt-1">
                  <span className="text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full">+{statusPermainan.tingkat_produksi_co2}/s</span>
                  <span className="text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full">-{statusPermainan.tingkat_pengurangan_co2}/s</span>
                </div>
              </div>
            </div>

            {/* UPGRADE SYSTEM LENGKAP */}
            <h2 className="font-bold mb-3 text-slate-700 bg-slate-100 py-1 px-3 rounded-md inline-block">Upgrade Gedung (Lv. 3 Visual Berubah)</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* String disesuaikan dengan backend: server, pusat_data, panel_surya, turbin_angin */}
              <UpgradeBtn title="Server" level={statusPermainan.level_server} cost={statusPermainan.biaya_upgrade_server} coins={statusPermainan.koin} theme="blue" onClick={() => upgradeItem("server")} />
              <UpgradeBtn title="Data Ctr" level={statusPermainan.level_pusat_data} cost={statusPermainan.biaya_upgrade_pusat_data} coins={statusPermainan.koin} theme="indigo" onClick={() => upgradeItem("pusat_data")} />
              <UpgradeBtn title="Solar" level={statusPermainan.level_panel_surya} cost={statusPermainan.biaya_upgrade_panel_surya} coins={statusPermainan.koin} theme="emerald" onClick={() => upgradeItem("panel_surya")} />
              <UpgradeBtn title="Wind" level={statusPermainan.level_turbin_angin} cost={statusPermainan.biaya_upgrade_turbin_angin} coins={statusPermainan.koin} theme="teal" onClick={() => upgradeItem("turbin_angin")} />
            </div>

            {/* SHOP SYSTEM */}
            <h2 className="font-bold mb-3 text-slate-700 bg-slate-100 py-1 px-3 rounded-md inline-block">Toko Infrastruktur</h2>
            <ShopBtn icon={<Server/>} title="Server Biasa" count={statusPermainan.jumlah_server} cost={statusPermainan.harga_server} desc={`+${5 * statusPermainan.level_server} Koin/s | +10 CO2/s`} coins={statusPermainan.koin} onClick={() => buyItem("server")} theme="blue" />
            <ShopBtn icon={<Cpu/>} title="Data Center" count={statusPermainan.jumlah_pusat_data} cost={statusPermainan.harga_pusat_data} desc={`+${60 * statusPermainan.level_pusat_data} Koin/s | +80 CO2/s`} coins={statusPermainan.koin} onClick={() => buyItem("pusat_data")} theme="indigo" />
            <ShopBtn icon={<Sun/>} title="Panel Surya" count={statusPermainan.jumlah_panel_surya} cost={statusPermainan.harga_panel_surya} desc={`-${15 * statusPermainan.level_panel_surya} CO2/s`} coins={statusPermainan.koin} onClick={() => buyItem("panel_surya")} theme="emerald" />
            <ShopBtn icon={<Wind/>} title="Kincir Angin" count={statusPermainan.jumlah_turbin_angin} cost={statusPermainan.harga_turbin_angin} desc={`-${100 * statusPermainan.level_turbin_angin} CO2/s`} coins={statusPermainan.koin} onClick={() => buyItem("turbin_angin")} theme="teal" />

          </div>
        </div>

        {/* PANEL KANAN: 3D VISUALIZATION + SKY */}
        <div className="lg:col-span-7 bg-sky-100 rounded-3xl overflow-hidden relative min-h-[600px] border-4 border-slate-200">
          <Canvas camera={{ position: [0, 4, 7], fov: 45 }} shadows>
            <Sky distance={450000} sunPosition={[5, 10, 5]} inclination={0} azimuth={0.25} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
              {/* Nama prop diubah dari gameState menjadi statusPermainan sesuai harapan GameAnimation3D.tsx */}
              <FloatingIsland3D statusPermainan={statusPermainan} />
            </Float>
            <OrbitControls enableZoom={true} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} />
          </Canvas>
        </div>

      </div>
    </div>
  );
}

// 4. FIX BUG TAILWIND DYNAMIC CLASSES DENGAN PEMETAAN WARNA (DICTIONARY)
const themeMap: any = {
  blue: { bg: "bg-blue-50", text: "text-blue-500", borderHover: "hover:border-blue-400", border: "border-blue-100", textDark: "text-blue-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-500", borderHover: "hover:border-indigo-400", border: "border-indigo-100", textDark: "text-indigo-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-500", borderHover: "hover:border-emerald-400", border: "border-emerald-100", textDark: "text-emerald-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-500", borderHover: "hover:border-teal-400", border: "border-teal-100", textDark: "text-teal-700" },
};

function ShopBtn({ icon, title, count, cost, desc, coins, onClick, theme }: any) {
  const t = themeMap[theme];
  return (
    <button onClick={onClick} disabled={coins < cost}
      className={`w-full flex items-center justify-between p-3 mb-3 bg-white border-2 border-slate-100 ${t.borderHover} disabled:opacity-50 disabled:cursor-not-allowed text-left transition-all rounded-xl`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 ${t.bg} ${t.text} rounded-lg`}>{icon}</div>
        <div>
          <div className="font-bold text-slate-700 text-sm">{title} <span className="text-slate-400 font-normal">({count})</span></div>
          <div className="text-[10px] text-slate-500">{desc}</div>
        </div>
      </div>
      <div className="font-bold text-amber-500 text-sm">{cost} <Coins size={12} className="inline"/></div>
    </button>
  )
}

function UpgradeBtn({ title, level, cost, coins, theme, onClick }: any) {
  const t = themeMap[theme];
  return (
    <button onClick={onClick} disabled={coins < cost}
      className={`p-3 ${t.bg} border ${t.border} ${t.borderHover} rounded-xl text-left disabled:opacity-50 transition-all`}>
      <div className={`text-xs font-bold ${t.textDark} flex items-center gap-1`}>
        <ArrowUpCircle size={14}/> {title} Lvl {level}
      </div>
      <div className="text-xs font-bold text-amber-500 mt-2">{cost} Koin</div>
    </button>
  )
}