import React, { useEffect, useState } from "react";
import { UserCircle2, ShieldCheck, XCircle, Loader2, Eye, Trash2, BadgeCheck, AlertTriangle, Image } from "lucide-react";

// SET YOUR DEPLOYED ADMIN BACKEND URL HERE
const API_BASE = "https://novachain-admin-backend.onrender.com";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [userWinModes, setUserWinModes] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchWinModes();
    // eslint-disable-next-line
  }, []);

  const deleteUser = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    setActionLoading(user_id + "-delete");
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/admin/user/${user_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
    setActionLoading(null);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      setError(err.message || "Network error");
    }
    setLoading(false);
  };

  const fetchWinModes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      let map = {};
      (Array.isArray(data) ? data : []).forEach(u => {
        if (u.trade_mode) map[u.id] = u.trade_mode.toUpperCase();
      });
      setUserWinModes(map);
    } catch {
      setUserWinModes({});
    }
  };

  const setUserWinMode = async (user_id, mode) => {
    setActionLoading(user_id + "-winmode");
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      // Note: If this endpoint is handled by admin backend, use API_BASE, if by user backend, set correct URL.
      const res = await fetch(`${API_BASE}/api/admin/users/${user_id}/trade-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mode: mode === null ? null : (mode ? mode.toUpperCase() : null) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update win mode");
      await fetchWinModes();
    } catch (err) {
      setError(err.message || "Failed to update win mode");
    }
    setActionLoading(null);
  };

  const handleKYCStatus = async (user_id, kyc_status) => {
    setActionLoading(user_id + "-kyc");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/admin/user-kyc-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id, kyc_status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update KYC status");
      setShowKycModal(false);
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update KYC status");
    }
    setActionLoading(null);
  };

  function handleViewKYC(user) {
    setSelectedUser(user);
    setShowKycModal(true);
  }

  return (
  <>
    <div className="max-w-6xl mx-auto mt-10 px-2 sm:px-6 py-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white/5 via-[#191e29]/80 to-[#181b25]/90 border border-white/5">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-6 tracking-tight text-[#ffd700]">
        <UserCircle2 size={24} className="text-[#16d79c]" />
        All Users
      </h2>
      {/* ...User table code exactly as before... */}
    </div>

    {/*  --- KYC Modal: OUTSIDE main container, always at root --- */}
    {showKycModal && selectedUser && (
      <div className="fixed inset-0 bg-black/70 z-[99] flex items-center justify-center">
        <div
          className="bg-gradient-to-br from-white/10 via-[#181b25]/90 to-[#222b3a]/90 border border-[#16d79c44] rounded-2xl shadow-2xl
            w-full max-w-lg mx-2 relative flex flex-col max-h-[90vh] overflow-y-auto"
          style={{ overscrollBehavior: 'contain' }}
        >          
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#ffd700] mb-5 mt-4 px-4">
            <ShieldCheck size={19} className="text-[#16d79c]" />
            KYC Documents for User ID {selectedUser.id}
          </h3>
          <div className="w-full flex flex-col sm:flex-row gap-4 mb-3 px-4">
            {/* Selfie Image */}
            {selectedUser.kyc_selfie && (
              <div className="flex-1 flex flex-col items-center">
                <span className="font-bold mb-1 text-[#16d79c] flex items-center gap-1"><Image size={14}/>Selfie:</span>
                <img
                  src={`https://novachain-backend.onrender.com/uploads/${selectedUser.kyc_selfie}`}
                  alt="Selfie"
                  className="w-full max-w-[180px] sm:max-w-[160px] rounded-xl border-2 border-[#14B8A6] shadow object-cover aspect-[4/5]"
                />
              </div>
            )}
            {/* ID Card Image */}
            {selectedUser.kyc_id_card && (
              <div className="flex-1 flex flex-col items-center">
                <span className="font-bold mb-1 text-[#ffd700] flex items-center gap-1"><Image size={14}/>ID Card:</span>
                <img
                  src={`https://novachain-backend.onrender.com/uploads/${selectedUser.kyc_id_card}`}
                  alt="ID Card"
                  className="w-full max-w-[180px] sm:max-w-[160px] rounded-xl border-2 border-[#FFD700] shadow object-cover aspect-[4/5]"
                />
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-center mt-6 mb-6 px-4">
            {(selectedUser.kyc_status !== "approved") && (
              <button
                onClick={() => handleKYCStatus(selectedUser.id, "approved")}
                disabled={actionLoading === selectedUser.id + "-kyc"}
                className="px-4 py-2 bg-gradient-to-r from-[#16d79c] to-[#ffd700] text-[#181b25] rounded-lg font-bold shadow hover:opacity-90 transition flex items-center gap-1"
              >{actionLoading === selectedUser.id + "-kyc"
                ? <Loader2 className="animate-spin" size={15} />
                : <BadgeCheck size={15} />}{actionLoading === selectedUser.id + "-kyc" ? "" : "Approve"}</button>
            )}
            {(selectedUser.kyc_status !== "rejected") && (
              <button
                onClick={() => handleKYCStatus(selectedUser.id, "rejected")}
                disabled={actionLoading === selectedUser.id + "-kyc"}
                className="px-4 py-2 bg-gradient-to-r from-[#f34e6d] to-[#ffd700] text-[#181b25] rounded-lg font-bold shadow hover:opacity-90 transition flex items-center gap-1"
              ><XCircle size={15} /> Reject</button>
            )}
            <button onClick={() => setShowKycModal(false)}
              className="px-4 py-2 bg-gradient-to-r from-[#a5b4fc] to-[#232836] text-[#232836] rounded-lg font-bold shadow hover:opacity-90 transition">Close</button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
