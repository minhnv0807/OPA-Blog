"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" as const }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-center gap-3">
            <div className="flex-grow min-w-0">
              <p className="text-slate-700 font-semibold text-sm leading-tight">
                🔥 Chỉ còn X slot
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                cho đợt học tuần này
              </p>
            </div>
            <button
            onClick={() => router.push("/khoa-hoc-ai/checkout?package=10tr")}
              className="bg-opa-orange text-white font-bold px-5 py-2 rounded-xl text-sm
                         whitespace-nowrap hover:bg-orange-500 active:scale-95
                         transition-all duration-150 flex-shrink-0"
              style={{ boxShadow: "0 4px 12px rgba(255,107,0,0.35)" }}
            >
              ĐĂNG KÝ
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
