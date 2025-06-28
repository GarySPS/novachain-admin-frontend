// src/components/NavBar.jsx
import React from "react";
import { LogOut } from "lucide-react";

export default function NavBar() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#191e2a]/90 via-[#161923]/95 to-[#131622]/95 shadow-2xl border-b border-white/10
      backdrop-blur-[3.5px] flex items-center justify-between px-5 md:px-8 py-3"
      style={{ WebkitBackdropFilter: "blur(4px)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="font-extrabold text-2xl md:text-3xl tracking-tight gold-logo drop-shadow-glow"
          style={{
            color: "#ffd700",
            letterSpacing: "0.04em",
            textShadow: "0 0 12px #181b25,0 2px 16px #FFD70022",
            fontFamily: "Inter, Poppins, Arial, sans-serif"
          }}
        >
          NovaChain
        </span>
        <span className="ml-2 px-2 py-1 rounded-lg font-bold text-base md:text-lg tracking-widest bg-gradient-to-r from-[#16d79c]/90 to-[#1fbfff]/90 text-[#181b25] shadow">
          ADMIN
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/';
        }}
        className="flex items-center gap-1 bg-gradient-to-r from-[#FFD700] to-[#16d79c] text-[#232836] font-bold rounded-xl px-4 py-2 shadow-lg hover:opacity-90 transition"
        title="Logout"
      >
        <LogOut size={20} />
        Logout
      </button>
    </header>
  );
}
