// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import AdminUsers from "../components/AdminUsers";
import AdminTrades from "../components/AdminTrades";
import AdminDeposits from "../components/AdminDeposits";
import AdminWithdrawals from "../components/AdminWithdrawals";
import DepositWalletSettings from "../components/DepositWalletSettings";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, DollarSign, Settings, Banknote } from "lucide-react";

// Premium tab data with icons
const tabList = [
  { key: "users", label: "Users", icon: <Users size={18} className="mr-1 text-[#16d79c]" /> },
  { key: "trades", label: "Trades", icon: <TrendingUp size={18} className="mr-1 text-[#ffd700]" /> },
  { key: "deposits", label: "Deposits", icon: <DollarSign size={18} className="mr-1 text-[#2dd4bf]" /> },
  { key: "walletSettings", label: "Deposit Settings", icon: <Settings size={18} className="mr-1 text-[#3af0ff]" /> },
  { key: "withdrawals", label: "Withdrawals", icon: <Banknote size={18} className="mr-1 text-[#f34e6d]" /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-2 pb-8">

      {/* Premium Glass Tab Bar */}
      <div
  className="overflow-x-auto flex-nowrap mb-8 bg-gradient-to-r from-[#1a243c]/80 via-[#21253e]/90 to-[#131622]/90 rounded-2xl px-2 py-2 shadow-2xl backdrop-blur-[2.5px] w-full max-w-4xl border border-white/5 items-center no-scrollbar"
  style={{
    WebkitOverflowScrolling: "touch",
    minHeight: 64,
  }}
>
  <div className="flex flex-nowrap items-center min-w-max">
    {tabList.map(tab => (
      <button
        key={tab.key}
        className={
          `flex items-center gap-1 px-6 py-2 rounded-xl font-extrabold text-base tracking-wide
          transition-all duration-200 shadow-md
          ${activeTab === tab.key 
            ? "bg-gradient-to-r from-[#16d79c] via-[#ffd700]/90 to-[#fffbe8] text-[#181b25] shadow-lg scale-105 ring-2 ring-[#ffd70088]" 
            : "bg-[#23243a] text-slate-100 hover:bg-[#1f283c] hover:text-[#ffd700]"}
          `
        }
        style={{
          letterSpacing: 1,
          boxShadow: activeTab === tab.key ? "0 0 16px #16d79c33" : "none"
        }}
        onClick={() => setActiveTab(tab.key)}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}

    <div className="flex-1"></div> {/* Pushes logout to the right */}

    {/* LOGOUT BUTTON */}
    <button
      onClick={() => {
        localStorage.removeItem('adminToken');
        window.location.href = '/';
      }}
      className="flex items-center gap-1 px-6 py-2 rounded-xl font-extrabold text-base tracking-wide
        transition-all duration-200 shadow-md
        bg-gradient-to-r from-[#f34e6d] via-[#ffd700]/80 to-[#16d79c]/80
        text-[#181b25] shadow-lg hover:scale-105 hover:ring-2 hover:ring-[#ffd700bb]"
      style={{ letterSpacing: 1, minWidth: 120 }}
    >
      {/* Icon (Logout) */}
      <svg width={20} height={20} fill="none" stroke="#f34e6d" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Logout
    </button>
  </div>
</div>

      {/* Premium Glass Content Container with animation */}
      <div className="bg-gradient-to-br from-white/5 via-[#20253b]/70 to-[#16192a]/90 rounded-2xl p-8 shadow-2xl min-h-[420px] w-full max-w-6xl border border-white/10 relative">
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="w-full"
            >
              <AdminUsers />
            </motion.div>
          )}
          {activeTab === "trades" && (
            <motion.div
              key="trades"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="w-full"
            >
              <AdminTrades />
            </motion.div>
          )}
          {activeTab === "deposits" && (
            <motion.div
              key="deposits"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="w-full"
            >
              <AdminDeposits />
            </motion.div>
          )}
          {activeTab === "walletSettings" && (
            <motion.div
              key="walletSettings"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="w-full"
            >
              <DepositWalletSettings />
            </motion.div>
          )}
          {activeTab === "withdrawals" && (
            <motion.div
              key="withdrawals"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="w-full"
            >
              <AdminWithdrawals />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
