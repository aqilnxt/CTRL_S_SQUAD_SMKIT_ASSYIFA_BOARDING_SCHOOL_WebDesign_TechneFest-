"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Sparkles,
  ContactShadows,
  Cloud,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

// ==========================================
// ATMOSFER & LANGIT DINAMIS
// ==========================================
function EfekAtmosfer({ dampak }: { dampak: number }) {
  const referensiMatahari = useRef<THREE.Mesh>(null);
  const referensiKabut = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const waktu = clock.getElapsedTime();
    if (referensiMatahari.current) {
      referensiMatahari.current.position.x = Math.sin(waktu * 0.15) * 0.4 + 2.6;
      referensiMatahari.current.position.y = 2.9 + Math.cos(waktu * 0.18) * 0.12;
      referensiMatahari.current.rotation.z += 0.002;
    }
    if (referensiKabut.current) {
      referensiKabut.current.rotation.z += 0.0015;
    }
  });

  return (
    <group>
      <mesh ref={referensiMatahari} position={[2.6, 2.9, -3]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshBasicMaterial
          color={dampak > 0.65 ? "#f59e0b" : "#fde68a"}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh position={[2.6, 2.9, -3.2]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial
          color={dampak > 0.65 ? "#fb923c" : "#fef3c7"}
          transparent
          opacity={0.18}
        />
      </mesh>

      <mesh ref={referensiKabut} position={[0, 1.6, -2.8]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[4.6, 0.12, 24, 100]} />
        <meshBasicMaterial
          color={dampak > 0.6 ? "#64748b" : "#a5f3fc"}
          transparent
          opacity={dampak > 0.6 ? 0.16 : 0.08}
        />
      </mesh>

      <Cloud
        position={[-2.4, 2.3, -2.8]}
        speed={0.15}
        opacity={dampak > 0.7 ? 0.12 : 0.3}
        color={dampak > 0.65 ? "#94a3b8" : "#ffffff"}
        segments={18}
      />
      <Cloud
        position={[1.2, 2.0, -2.6]}
        speed={0.12}
        opacity={dampak > 0.7 ? 0.1 : 0.26}
        color={dampak > 0.65 ? "#94a3b8" : "#ffffff"}
        segments={14}
      />

      {dampak > 0.8 && (
        <Stars
          radius={20}
          depth={12}
          count={400}
          factor={2}
          saturation={0}
          fade
          speed={0.15}
        />
      )}
    </group>
  );
}

// ==========================================
// BURUNG TERBANG
// ==========================================
function BurungTerbang({ dampak }: { dampak: number }) {
  const referensiGrup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (referensiGrup.current) {
      referensiGrup.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  const skalaBurung = Math.max(0, 1 - dampak * 1.25);
  const kumpulanBurung = [
    [1.5, 0.2, 0],
    [-1.2, 0.5, 0.8],
    [0.2, 0, -1.4],
    [1.9, 0.55, 0.9],
    [-1.8, 0.15, -0.7],
    [0.7, 0.35, 1.4],
  ];

  return (
    <group ref={referensiGrup} scale={[skalaBurung, skalaBurung, skalaBurung]} position={[0, 2.5, 0]}>
      {kumpulanBurung.map((posisi, i) => (
        <group key={i} position={posisi as [number, number, number]}>
          <mesh rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.11, 0.02, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.11, 0.02, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// MAKHLUK HIDUP
// ==========================================
function MakhlukHidup({ dampak }: { dampak: number }) {
  const referensiGrup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (referensiGrup.current) {
      referensiGrup.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.02;
    }
  });

  const skalaKehidupanAlam = Math.max(0, 1 - dampak * 1.2);
  const skalaKehidupanKota = Math.min(1, dampak * 1.5);

  return (
    <group ref={referensiGrup} position={[0, 0.25, 0]}>
      <group scale={[skalaKehidupanAlam, skalaKehidupanAlam, skalaKehidupanAlam]}>
        <group position={[-0.8, 0, 0.8]}>
          <mesh castShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          <mesh castShadow position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fdba74" />
          </mesh>
        </group>
        <group position={[0.8, -0.05, -0.5]} rotation={[0, Math.PI / 4, 0]}>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.1]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh castShadow position={[0.08, 0.18, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.08]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
        <group position={[1.15, -0.02, 0.9]} rotation={[0, -Math.PI / 5, 0]}>
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.16, 0.1, 0.08]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
          <mesh castShadow position={[0.06, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.08, 0.06]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
        </group>
      </group>

      <group scale={[skalaKehidupanKota, skalaKehidupanKota, skalaKehidupanKota]}>
        <group position={[0.6, -0.1, 0.6]} rotation={[0, -Math.PI / 3, 0]}>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.25, 0.12, 0.14]} />
            <meshStandardMaterial color="#ef4444" metalness={0.6} />
          </mesh>
          <mesh castShadow position={[-0.02, 0.2, 0]}>
            <boxGeometry args={[0.14, 0.09, 0.12]} />
            <meshStandardMaterial color="#93c5fd" />
          </mesh>
        </group>
        <group position={[-0.1, -0.08, 1.0]} rotation={[0, Math.PI / 6, 0]}>
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.5} />
          </mesh>
          <mesh castShadow position={[0.02, 0.17, 0]}>
            <boxGeometry args={[0.11, 0.07, 0.1]} />
            <meshStandardMaterial color="#bfdbfe" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// POHON
// ==========================================
function Pohon({
  posisi,
  tipe = "cone",
  batang = "#451a03",
  daun = "#16a34a",
  skala = 1,
}: {
  posisi: [number, number, number];
  tipe?: "cone" | "round";
  batang?: string;
  daun?: string;
  skala?: number;
}) {
  return (
    <group position={posisi} scale={skala}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.4, 8]} />
        <meshStandardMaterial color={batang} />
      </mesh>
      {tipe === "cone" ? (
        <mesh castShadow position={[0, 0.6, 0]}>
          <coneGeometry args={[0.32, 0.7, 6]} />
          <meshStandardMaterial color={daun} flatShading />
        </mesh>
      ) : (
        <mesh castShadow position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.26, 6, 6]} />
          <meshStandardMaterial color={daun} flatShading />
        </mesh>
      )}
    </group>
  );
}

// ==========================================
// KOTA / INDUSTRI
// ==========================================
function KotaIndustri({ dampak }: { dampak: number }) {
  const referensiGrup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (referensiGrup.current) {
      referensiGrup.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.03;
    }
  });

  return (
    <group ref={referensiGrup}>
      <mesh castShadow position={[0.4, 0.85, -0.4]}>
        <boxGeometry args={[0.5, 1.7, 0.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0.95, 0.65, -0.1]}>
        <boxGeometry args={[0.34, 1.2, 0.34]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0.25, 0.48, 0.42]}>
        <boxGeometry args={[0.28, 0.85, 0.28]} />
        <meshStandardMaterial color="#475569" roughness={0.25} metalness={0.55} />
      </mesh>

      <group position={[-0.5, 0.4, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.8, 0.6]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0.2, 0.7, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.9, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh castShadow position={[-0.15, 0.6, 0.12]}>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Sparkles
          count={dampak > 0.3 ? Math.floor(dampak * 80) : 0}
          scale={1.4}
          size={6}
          speed={0.7}
          opacity={0.45}
          color="#1e293b"
          position={[0.12, 1.25, 0]}
        />
      </group>

      <mesh position={[0.15, 0.06, 0.1]} rotation={[-Math.PI / 2, 0.35, 0]}>
        <torusGeometry args={[0.95, 0.06, 10, 80]} />
        <meshStandardMaterial color="#334155" roughness={1} />
      </mesh>
    </group>
  );
}

// ==========================================
// DEKORASI PULAU
// ==========================================
function DetailPinggiranPulau({ dampak }: { dampak: number }) {
  const referensiGrup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (referensiGrup.current) {
      referensiGrup.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={referensiGrup}>
      <mesh position={[1.85, 0.08, -0.6]} castShadow>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={dampak > 0.6 ? "#78716c" : "#14532d"} flatShading />
      </mesh>
      <mesh position={[-1.55, 0.1, -1.0]} castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={dampak > 0.6 ? "#57534e" : "#166534"} flatShading />
      </mesh>
      <mesh position={[1.25, 0.12, 1.25]} castShadow>
        <dodecahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color={dampak > 0.6 ? "#78716c" : "#22c55e"} flatShading />
      </mesh>
      <mesh position={[-0.25, 0.11, -1.55]} castShadow>
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color={dampak > 0.6 ? "#57534e" : "#15803d"} flatShading />
      </mesh>
    </group>
  );
}

// ==========================================
// LAUT / RING GELOMBANG
// ==========================================
function CincinLautan({ dampak }: { dampak: number }) {
  const cincin1 = useRef<THREE.Mesh>(null);
  const cincin2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const waktu = clock.getElapsedTime();
    if (cincin1.current) cincin1.current.rotation.z = waktu * 0.05;
    if (cincin2.current) cincin2.current.rotation.z = -waktu * 0.03;
  });

  return (
    <group position={[0, -0.15, 0]}>
      <mesh ref={cincin1} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3.35, 64]} />
        <meshBasicMaterial color={dampak > 0.7 ? "#334155" : "#67e8f9"} transparent opacity={0.14} />
      </mesh>
      <mesh ref={cincin2} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.55, 4.05, 64]} />
        <meshBasicMaterial color={dampak > 0.7 ? "#475569" : "#38bdf8"} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// ==========================================
// DINAMIKA INTERPOLASI MATERIAL PULAU
// ==========================================
function PulauDinamis({ targetDampak }: { targetDampak: number }) {
  const materialRumput = useRef<THREE.MeshStandardMaterial>(null);
  const materialAir = useRef<THREE.MeshStandardMaterial>(null);
  const grupPohon = useRef<THREE.Group>(null);
  const grupKota = useRef<THREE.Group>(null);
  const materialPermukaanTanah = useRef<THREE.MeshStandardMaterial>(null);

  const kumpulanWarna = useMemo(
    () => ({
      rumputAlami: new THREE.Color("#22c55e"),
      rumputTercemar: new THREE.Color("#451a03"),
      tanahAtasAlami: new THREE.Color("#2fb75b"),
      tanahAtasTercemar: new THREE.Color("#6b4423"),
      airAlami: new THREE.Color("#0ea5e9"),
      airTercemar: new THREE.Color("#1c1917"),
      langitAlami: new THREE.Color("#bae6fd"),
      langitTercemar: new THREE.Color("#334155"),
    }),
    []
  );

  useFrame((state, delta) => {
    if (materialRumput.current) {
      materialRumput.current.color.lerpColors(kumpulanWarna.rumputAlami, kumpulanWarna.rumputTercemar, targetDampak);
    }
    if (materialPermukaanTanah.current) {
      materialPermukaanTanah.current.color.lerpColors(kumpulanWarna.tanahAtasAlami, kumpulanWarna.tanahAtasTercemar, targetDampak);
    }
    if (materialAir.current) {
      materialAir.current.color.lerpColors(kumpulanWarna.airAlami, kumpulanWarna.airTercemar, targetDampak);
    }

    const kabutDekat = THREE.MathUtils.lerp(15, 6, targetDampak);
    const kabutJauh = THREE.MathUtils.lerp(40, 16, targetDampak);
    const warnaLangitSekarang = new THREE.Color().lerpColors(kumpulanWarna.langitAlami, kumpulanWarna.langitTercemar, targetDampak);

    state.scene.fog = new THREE.Fog(warnaLangitSekarang, kabutDekat, kabutJauh);
    state.scene.background = warnaLangitSekarang;

    if (grupPohon.current) {
      const skalaPohon = THREE.MathUtils.damp(grupPohon.current.scale.x, 1 - targetDampak * 0.9, 4, delta);
      grupPohon.current.scale.set(skalaPohon, skalaPohon, skalaPohon);
    }
    if (grupKota.current) {
      const skalaKota = THREE.MathUtils.damp(grupKota.current.scale.x, targetDampak, 4, delta);
      grupKota.current.scale.set(skalaKota, skalaKota, skalaKota);
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      <EfekAtmosfer dampak={targetDampak} />

      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.4, 64]} />
        <meshStandardMaterial ref={materialAir} transparent opacity={0.88} roughness={0.15} metalness={0.1} />
      </mesh>

      <CincinLautan dampak={targetDampak} />

      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.3, 2.6, 0.5, 32]} />
        <meshStandardMaterial ref={materialRumput} roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[2.05, 2.2, 0.18, 32]} />
        <meshStandardMaterial ref={materialPermukaanTanah} roughness={1} />
      </mesh>

      <BurungTerbang dampak={targetDampak} />
      <MakhlukHidup dampak={targetDampak} />
      <DetailPinggiranPulau dampak={targetDampak} />

      <group ref={grupPohon}>
        <Pohon posisi={[-0.8, 0.25, -0.8]} tipe="cone" daun="#16a34a" skala={1} />
        <Pohon posisi={[0.3, 0.25, 1.2]} tipe="round" daun="#15803d" skala={1} />
        <Pohon posisi={[-1.35, 0.22, 0.55]} tipe="round" daun="#166534" skala={0.8} />
        <Pohon posisi={[1.2, 0.22, -0.95]} tipe="cone" daun="#22c55e" skala={0.85} />
        <Pohon posisi={[1.45, 0.24, 0.2]} tipe="round" daun="#16a34a" skala={0.7} />
        <Pohon posisi={[-0.15, 0.22, -1.35]} tipe="cone" daun="#15803d" skala={0.72} />
        <mesh position={[-1.2, 0.3, 0.2]} castShadow>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#166534" flatShading />
        </mesh>
        <mesh position={[1, 0.28, 0.3]} castShadow>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#22c55e" flatShading />
        </mesh>
      </group>

      <group ref={grupKota} scale={[0, 0, 0]}>
        <KotaIndustri dampak={targetDampak} />
      </group>

      <Sparkles
        count={80}
        scale={[9, 5, 9]}
        size={targetDampak > 0.6 ? 4 : 2}
        speed={targetDampak > 0.6 ? 0.35 : 0.2}
        opacity={targetDampak > 0.6 ? 0.22 : 0.12}
        color={targetDampak > 0.6 ? "#94a3b8" : "#ffffff"}
        position={[0, 1.8, 0]}
      />
    </group>
  );
}

// ==========================================
// EXPORT VIEWPORT UTAMA (CANVAS BUNDLE)
// ==========================================
export default function PemandanganPulauDinamis({ targetDampak }: { targetDampak: number }) {
  return (
    <Canvas camera={{ position: [4, 3, 5], fov: 45 }} shadows dpr={[1, 2]}>
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-6, 8, 4]} intensity={0.45} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <PulauDinamis targetDampak={targetDampak} />
      </Float>

      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.42}
        scale={12}
        blur={2.2}
        far={3}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.42}
      />
    </Canvas>
  );
}