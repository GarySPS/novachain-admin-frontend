// frontend/src/Profile.jsx
import React from "react";
import { User, ShieldCheck, Mail, Award } from "lucide-react"; // lucide icons: clean and modern

export default function Profile() {
  return (
    <div className="flex items-center justify-center min-h-[65vh]">
      <div className="bg-gradient-to-br from-white/5 via-[#20253b]/70 to-[#16192a]/90 rounded-2xl shadow-2xl px-8 py-10 max-w-md w-full flex flex-col items-center gap-4 border border-white/10">
        <div className="bg-[#1a223b] rounded-full shadow-lg p-4 mb-2">
          <User size={48} className="text-[#FFD700]" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-1 tracking-tight">Admin Profile</h1>
        <p className="text-base text-slate-300 mb-2">
          View and manage your admin account, security settings, and verification status.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 text-slate-200">
            <Mail size={18} className="text-[#3af0ff]" />
            <span className="font-medium">admin@novachain.pro</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldCheck size={18} className="text-green-400" />
            <span className="font-medium">2FA Enabled</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Award size={18} className="text-[#FFD700]" />
            <span className="font-medium">Verified Super Admin</span>
          </div>
        </div>
        <div className="mt-5 text-sm text-slate-400">* Full profile editing coming soon</div>
      </div>
    </div>
  );
}
