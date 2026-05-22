from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatusPermainan(BaseModel):
    koin: int = 100
    co2: int = 0
    
    # Jumlah Bangunan
    jumlah_server: int = 0
    jumlah_pusat_data: int = 0
    jumlah_panel_surya: int = 0
    jumlah_turbin_angin: int = 0
    
    # Harga Bangunan Baru
    harga_server: int = 50
    harga_pusat_data: int = 500
    harga_panel_surya: int = 150
    harga_turbin_angin: int = 800
    
    # Level Bangunan Saat Ini
    level_server: int = 1
    level_pusat_data: int = 1
    level_panel_surya: int = 1
    level_turbin_angin: int = 1
    
    # Biaya Naik Level (Upgrade)
    biaya_upgrade_server: int = 300
    biaya_upgrade_pusat_data: int = 1000
    biaya_upgrade_panel_surya: int = 400
    biaya_upgrade_turbin_angin: int = 1500

    # Indikator Kecepatan Karbon
    tingkat_produksi_co2: int = 0
    tingkat_pengurangan_co2: int = 0
    
    # Status Kondisi Lingkungan Pulau ("subur", "terancam", "rusak")
    status_lingkungan: str = "subur"

# Inisialisasi status permainan awal
status_game = StatusPermainan()

@app.get("/api/status")
async def ambil_status():
    return status_game

@app.post("/api/detik")
async def jalankan_perhitungan_per_detik():
    global status_game
    
    # Produksi Koin (dipengaruhi oleh jumlah bangunan dan levelnya)
    status_game.koin += (status_game.jumlah_server * 5 * status_game.level_server)
    status_game.koin += (status_game.jumlah_pusat_data * 60 * status_game.level_pusat_data)
    
    # Kalkulasi Tingkat Polusi dan Reduksi Karbon
    status_game.tingkat_produksi_co2 = (status_game.jumlah_server * 10) + (status_game.jumlah_pusat_data * 80)
    status_game.tingkat_pengurangan_co2 = (status_game.jumlah_panel_surya * 15 * status_game.level_panel_surya) + (status_game.jumlah_turbin_angin * 100 * status_game.level_turbin_angin)
    
    # Aplikasi ke total CO2 (Tidak boleh kurang dari 0)
    status_game.co2 = max(0, status_game.co2 + status_game.tingkat_produksi_co2 - status_game.tingkat_pengurangan_co2)
    
    # Penentuan kondisi lingkungan berdasarkan akumulasi polusi CO2
    if status_game.co2 < 200:
        status_game.status_lingkungan = "subur"
    elif status_game.co2 < 1000:
        status_game.status_lingkungan = "terancam"
    else:
        status_game.status_lingkungan = "rusak"
        
    return status_game

@app.post("/api/beli/{jenis_barang}")
async def beli_barang(jenis_barang: str):
    global status_game
    if jenis_barang == "server" and status_game.koin >= status_game.harga_server:
        status_game.koin -= status_game.harga_server
        status_game.jumlah_server += 1
        status_game.harga_server = int(status_game.harga_server * 1.3)
        
    elif jenis_barang == "pusat_data" and status_game.koin >= status_game.harga_pusat_data:
        status_game.koin -= status_game.harga_pusat_data
        status_game.jumlah_pusat_data += 1
        status_game.harga_pusat_data = int(status_game.harga_pusat_data * 1.4)
        
    elif jenis_barang == "panel_surya" and status_game.koin >= status_game.harga_panel_surya:
        status_game.koin -= status_game.harga_panel_surya
        status_game.jumlah_panel_surya += 1
        status_game.harga_panel_surya = int(status_game.harga_panel_surya * 1.4)
        
    elif jenis_barang == "turbin_angin" and status_game.koin >= status_game.harga_turbin_angin:
        status_game.koin -= status_game.harga_turbin_angin
        status_game.jumlah_turbin_angin += 1
        status_game.harga_turbin_angin = int(status_game.harga_turbin_angin * 1.5)
        
    return status_game

@app.post("/api/upgrade/{jenis_upgrade}")
async def upgrade_barang(jenis_upgrade: str):
    global status_game
    if jenis_upgrade == "server" and status_game.koin >= status_game.biaya_upgrade_server:
        status_game.koin -= status_game.biaya_upgrade_server
        status_game.level_server += 1
        status_game.biaya_upgrade_server = int(status_game.biaya_upgrade_server * 2.5)
        
    elif jenis_upgrade == "pusat_data" and status_game.koin >= status_game.biaya_upgrade_pusat_data:
        status_game.koin -= status_game.biaya_upgrade_pusat_data
        status_game.level_pusat_data += 1
        status_game.biaya_upgrade_pusat_data = int(status_game.biaya_upgrade_pusat_data * 2.5)
        
    elif jenis_upgrade == "panel_surya" and status_game.koin >= status_game.biaya_upgrade_panel_surya:
        status_game.koin -= status_game.biaya_upgrade_panel_surya
        status_game.level_panel_surya += 1
        status_game.biaya_upgrade_panel_surya = int(status_game.biaya_upgrade_panel_surya * 2.5)
        
    elif jenis_upgrade == "turbin_angin" and status_game.koin >= status_game.biaya_upgrade_turbin_angin:
        status_game.koin -= status_game.biaya_upgrade_turbin_angin
        status_game.level_turbin_angin += 1
        status_game.biaya_upgrade_turbin_angin = int(status_game.biaya_upgrade_turbin_angin * 2.5)
        
    return status_game

@app.post("/api/reset")
async def reset_permainan():
    global status_game
    status_game = StatusPermainan()
    return status_game