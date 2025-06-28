import React from "react";
import { Sparkles } from "lucide-react";

export default function AdminView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-2">
      <div className="bg-gradient-to-br from-[#23294a]/80 via-[#181b25]/90 to-[#1a1c28]/95 rounded-2xl shadow-2xl border border-white/10 max-w-xl w-full p-10 flex flex-col items-center">
        <Sparkles size={42} className="mb-3 text-[#ffd700] animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-[#ffd700] to-[#16d79c] bg-clip-text mb-2 text-center">
          AdminView Coming Soon
        </h2>
        <p className="text-base md:text-lg text-slate-200/90 mt-2 text-center font-medium">
          This section will unlock advanced admin features in future NovaChain updates.
        </p>
      </div>
    </div>
  );
}
