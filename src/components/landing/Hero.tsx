"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

const avatarSrcs = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/17.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
];
const sizes = [46, 40, 42, 38, 36, 44];

const farPos = [
  { x: 200, y: -20 }, { x: 370, y: 50 }, { x: 380, y: 250 },
  { x: 210, y: 320 }, { x: 60, y: 260 }, { x: 50, y: 60 },
];
const nearPos = [
  { x: 200, y: 35 }, { x: 325, y: 100 }, { x: 325, y: 230 },
  { x: 200, y: 295 }, { x: 105, y: 230 }, { x: 105, y: 100 },
];

const DURATIONS = [2200, 1800, 2200, 9000, 1500, 2000];
const TOTAL = 6;

const labels: { text: string; color: string }[] = [
  { text: "Prospect Discovery", color: "#155eef" },
  { text: "Processing", color: "#7c3aed" },
  { text: "Intelligent Connection", color: "#155eef" },
  { text: "Filtering Leads", color: "#7c3aed" },
  { text: "Qualified Leads", color: "#059669" },
  { text: "Ready to Deploy", color: "#155eef" },
];

export function Hero() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setStage((s) => (s + 1) % TOTAL), DURATIONS[stage]);
    return () => clearTimeout(t);
  }, [stage]);

  const positions = stage === 0 ? farPos : nearPos;
  const showAvatars = stage <= 2;
  const showLines = stage === 2;
  const showMockup = stage === 3 || stage === 4;
  const orbInPhone = stage === 3 || stage === 4;
  const showRadar = stage === 0;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 pb-8 pt-24 sm:px-6 md:pt-16"
    >

      {/* ===== HERO TEXT ===== */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 mx-auto max-w-4xl px-2 text-center sm:px-6">
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5c9cfc] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5c9cfc]" />
            </span>
            AI-Powered Agency
          </span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-[4rem] font-bold font-[family-name:var(--font-heading)] leading-[1.1] tracking-tight text-[#101828]">
          Marketing x Công Nghệ x AI<br />
          <span className="bg-gradient-to-r from-[#5c9cfc] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">Giải Pháp Thực Chiến</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-5 text-base md:text-lg text-[#667085] max-w-lg mx-auto leading-relaxed">
          OPA kết hợp sức mạnh Marketing, Công nghệ và AI tiên tiến để giúp doanh nghiệp Việt Nam tăng trưởng bền vững.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 rounded-full bg-[#155eef] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#155eef]/30 hover:bg-[#2970ff] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#155eef]/40">
              Tư Vấn Miễn Phí <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/services">
            <button className="inline-flex items-center rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-[#101828] hover:bg-gray-50 transition-all shadow-sm">
              Xem Dịch Vụ
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ===== ROBOTS + ORBIT VISUAL ===== */}
      <div className="relative z-5 mt-8 w-full md:mt-12">
        {/* Orbit center */}
        <div className="flex justify-center">
        <div className="relative h-[229px] w-[285px] sm:h-[296px] sm:w-[368px] md:h-[370px] md:w-[460px] shrink-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative origin-top-left scale-[0.62] sm:scale-[0.8] md:scale-100"
          style={{ width: 460, height: 370 }}
        >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 370">
          <circle cx="230" cy="175" r="130" fill="none" stroke="#155eef" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 6" />
        </svg>

        <AnimatePresence>
          {showRadar && (
            <>
              <motion.div className="absolute rounded-full border-2 border-[#155eef]/30"
                style={{ left: 230 - 20, top: 175 - 20, width: 40, height: 40 }}
                animate={{ scale: [1, 8], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity }} exit={{ opacity: 0 }} />
              <motion.div className="absolute rounded-full border border-[#155eef]/20"
                style={{ left: 230 - 20, top: 175 - 20, width: 40, height: 40 }}
                animate={{ scale: [1, 6], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} exit={{ opacity: 0 }} />
            </>
          )}
        </AnimatePresence>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 370">
          {nearPos.map((p, i) => (
            <motion.line key={i} x1="230" y1="175" x2={p.x + sizes[i] / 2} y2={p.y + sizes[i] / 2}
              stroke="#155eef" strokeWidth="1.5"
              animate={{ strokeOpacity: showLines ? [0.06, 0.25, 0.06] : 0 }}
              transition={{ strokeOpacity: { duration: 2, repeat: Infinity, delay: i * 0.25 } }} />
          ))}
        </svg>

        <AnimatePresence>
          {showAvatars && avatarSrcs.map((src, i) => (
            <motion.div key={i} className="absolute"
              animate={{ left: positions[i].x, top: positions[i].y, opacity: 1 }}
              initial={{ left: farPos[i].x, top: farPos[i].y, opacity: 0 }}
              exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.3 } }}
              transition={{
                left: { duration: 0.8, ease: "easeInOut", delay: stage === 0 ? 0.6 + i * 0.1 : 0 },
                top: { duration: 0.8, ease: "easeInOut", delay: stage === 0 ? 0.6 + i * 0.1 : 0 },
                opacity: { duration: 0.5, delay: stage === 0 ? 0.6 + i * 0.1 : 0 },
              }}>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="rounded-full overflow-hidden border-2 border-gray-200 shadow-lg shadow-black/10" style={{ width: sizes[i], height: sizes[i] }}>
                  <Image src={src} alt="" width={sizes[i]} height={sizes[i]} className="object-cover" unoptimized />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div className="absolute z-30"
          animate={{ left: orbInPhone ? 192 : 230 - 38, top: orbInPhone ? 160 : 175 - 38, scale: orbInPhone ? 0.6 : 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}>
          <motion.div animate={{ scale: [1, 1.5], opacity: [0.2, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute -inset-4 rounded-full border border-[#155eef]/30" />
          <motion.div animate={{ scale: [1, 1.8], opacity: [0.1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
            className="absolute -inset-7 rounded-full border border-[#155eef]/15" />
          <motion.div
            animate={{ boxShadow: ["0 0 25px 8px rgba(21,94,239,0.2)", "0 0 50px 18px rgba(21,94,239,0.35)", "0 0 25px 8px rgba(21,94,239,0.2)"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#155eef] to-[#5c9cfc] flex items-center justify-center relative">
            <motion.svg className="w-10 h-10" viewBox="0 0 40 40" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <circle cx="20" cy="20" r="14" fill="none" stroke="white" strokeWidth="5" strokeOpacity="0.3" />
              <circle cx="20" cy="20" r="14" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeDasharray="60 28" />
            </motion.svg>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showMockup && (
            <motion.div className="absolute" style={{ left: 170, top: 25 }}
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: "easeOut" }}>
              <div className="w-[120px] h-[240px] rounded-[24px] bg-gradient-to-b from-[#155eef] to-[#3b82f6] shadow-2xl shadow-[#155eef]/30 border border-white/20 flex flex-col items-center pt-6 px-3">
                <div className="w-8 h-8 rounded-full bg-white/20 mb-4 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/40" />
                </div>
                <div className="w-full space-y-2.5">
                  <div className="h-2 bg-white/25 rounded-full w-full" />
                  <div className="h-2 bg-white/18 rounded-full w-3/4" />
                  <div className="h-2 bg-white/12 rounded-full w-5/6" />
                </div>
                <div className="mt-5 w-full space-y-2">
                  <div className="h-1.5 bg-white/12 rounded-full w-full" />
                  <div className="h-1.5 bg-white/08 rounded-full w-2/3" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 3 && (
          <div key="filter-stage" className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 370">
              <motion.path d="M100 105 Q140 105 165 120 Q180 130 180 145" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 2, ease: "easeOut", delay: 0.5 }} />
              <motion.path d="M95 155 Q130 155 160 160 Q180 165 180 175" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 2, ease: "easeOut", delay: 2 }} />
              <motion.path d="M100 205 Q135 205 160 195 Q180 188 180 180" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 2, ease: "easeOut", delay: 3.5 }} />
              <motion.path d="M290 145 Q310 130 330 115 Q345 107 360 105" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 1.5, ease: "easeOut", delay: 4.5 }} />
              <motion.path d="M290 170 Q310 165 330 158 Q345 152 355 150" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 1.5, ease: "easeOut", delay: 5.8 }} />
              <motion.path d="M290 185 Q310 195 330 200 Q345 203 350 205" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 1.5, ease: "easeOut", delay: 7 }} />
            </svg>
            <motion.div className="absolute" style={{ top: 95 }}
              initial={{ left: -40, opacity: 0 }} animate={{ left: [-40, -5, 160], opacity: [0, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut", times: [0, 0.12, 1] }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 shadow-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />Cold Lead List</span>
            </motion.div>
            <motion.div className="absolute" style={{ top: 145 }}
              initial={{ left: -50, opacity: 0 }} animate={{ left: [-50, -10, 160], opacity: [0, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut", times: [0, 0.12, 1], delay: 1.5 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 shadow-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />Abandoned Leads</span>
            </motion.div>
            <motion.div className="absolute" style={{ top: 195 }}
              initial={{ left: -45, opacity: 0 }} animate={{ left: [-45, -8, 160], opacity: [0, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut", times: [0, 0.12, 1], delay: 3 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 shadow-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />Missed Calls</span>
            </motion.div>
            <motion.div className="absolute" style={{ top: 95 }}
              initial={{ left: 240, opacity: 0, scale: 0.8 }} animate={{ left: 310, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 4.5 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 shadow-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />Qualified Leads</span>
            </motion.div>
            <motion.div className="absolute" style={{ top: 145 }}
              initial={{ left: 240, opacity: 0, scale: 0.8 }} animate={{ left: 305, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 5.8 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 shadow-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />Booked Meetings</span>
            </motion.div>
            <motion.div className="absolute" style={{ top: 195 }}
              initial={{ left: 240, opacity: 0, scale: 0.8 }} animate={{ left: 300, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 7 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 shadow-lg border border-amber-200 px-3 py-1.5 text-[11px] font-medium text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />Scheduled Callbacks</span>
            </motion.div>
          </div>
        )}

        {stage === 4 && (
          <div key="result-stage" className="absolute inset-0">
            <motion.div className="absolute" style={{ left: 310, top: 95 }}
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 shadow-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />Qualified Leads</span>
            </motion.div>
            <motion.div className="absolute" style={{ left: 305, top: 145 }}
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.55 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 shadow-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />Booked Meetings</span>
            </motion.div>
            <motion.div className="absolute" style={{ left: 300, top: 195 }}
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 shadow-lg border border-amber-200 px-3 py-1.5 text-[11px] font-medium text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />Scheduled Callbacks</span>
            </motion.div>
          </div>
        )}

        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[220px] h-[32px]">
          <AnimatePresence mode="wait">
            <motion.span key={stage}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-100 shadow-md border border-gray-200 text-xs font-medium text-gray-700"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}>
              <span className="h-1.5 w-1.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: labels[stage].color }} />
              {labels[stage].text}
            </motion.span>
          </AnimatePresence>
        </div>
        </motion.div>
        </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-8">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="h-10 w-6 rounded-full border-2 border-gray-300 flex justify-center pt-2">
          <div className="h-2 w-1 rounded-full bg-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
