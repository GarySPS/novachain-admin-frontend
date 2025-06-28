import React from "react";
import { NavLink } from "react-router-dom";
import { Users, TrendingUp, DollarSign, Settings, Banknote, BadgeCheck } from "lucide-react";

const tabs = [
  { label: "Users", path: "/users", icon: <Users size={16} className="mr-1" /> },
  { label: "Trades", path: "/trades", icon: <TrendingUp size={16} className="mr-1" /> },
  { label: "Deposits", path: "/deposits", icon: <DollarSign size={16} className="mr-1" /> },
  { label: "Deposit Settings", path: "/wallet-settings", icon: <Settings size={16} className="mr-1" /> },
  { label: "Withdrawals", path: "/withdrawals", icon: <Banknote size={16} className="mr-1" /> },
  { label: "KYC Requests", path: "/kyc", icon: <BadgeCheck size={16} className="mr-1" /> },
];

export default function AdminTabsBar() {
  return (
    <nav className="w-full flex items-center gap-1 md:gap-3 px-2 md:px-8 py-2 bg-gradient-to-r from-[#191e2a]/80 via-[#191C26]/92 to-[#131622]/92 border-b border-white/10 shadow-2xl z-40 sticky top-[58px] overflow-x-auto scrollbar-hide">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-xl font-bold tracking-wide text-sm md:text-base transition-all duration-200 whitespace-nowrap 
            ${isActive
              ? "bg-gradient-to-r from-[#16d79c] to-[#ffd700] text-[#232836] shadow-lg scale-105 ring-2 ring-[#ffd70088]"
              : "text-[#ffd700] hover:bg-[#232836] hover:text-[#16d79c]"
            }`
          }
          end
        >
          {tab.icon}
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
