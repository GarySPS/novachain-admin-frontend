import React, { useEffect, useState } from "react";
import {
  UserCircle2,
  BadgeCheck,
  XCircle,
  Loader2
} from "lucide-react";

const API_BASE = "https://novachain-admin-backend.onrender.com";
const MAIN_API_BASE = "https://novachain-backend.onrender.com";

// Helper for resolving KYC URLs
function resolveKYCUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) return `${MAIN_API_BASE}${raw}`;
  return `${MAIN_API_BASE}/uploads/${raw}`;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [userWinModes, setUserWinModes] = useState({});

  // Fetch users from admin API
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

  // Fetch user win/lose mode map
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

  // Set WIN/LOSE mode for user
  const setUserWinMode = async (user_id, mode) => {
    setActionLoading(user_id + "-winmode");
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
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

  // Approve/Reject KYC
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
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update KYC status");
    }
    setActionLoading(null);
  };

  // Delete user
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

  useEffect(() => {
    fetchUsers();
    fetchWinModes();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-2 sm:px-6 py-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white/5 via-[#191e29]/80 to-[#181b25]/90 border border-white/5">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-6 tracking-tight text-[#ffd700]">
        <UserCircle2 size={24} className="text-[#16d79c]" />
        All Users
      </h2>
      {error && (
        <div className="bg-gradient-to-r from-[#f34e6d]/80 to-[#fbbf24]/80 text-white p-2 rounded-lg mb-4 font-semibold shadow">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-[#FFD700] mr-2" size={30} />
          <span className="text-yellow-200 font-bold">Loading users...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl max-w-full">
          <table className="admin-table min-w-[1200px]">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Selfie</th>
                <th>ID Card</th>
                <th>KYC Status</th>
                <th>Win Mode</th>
                <th>Current Mode</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400 font-semibold">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#23283644] hover:bg-[#232836cc] transition font-semibold">
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  {/* Selfie */}
                  <td>
                    {user.kyc_selfie ? (
                  <img
  src={resolveKYCUrl(user.kyc_selfie)}
  alt="Selfie"
  style={{
    width: '48px',
    height: '48px',
    maxWidth: '48px',
    maxHeight: '48px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #14B8A6',
    boxShadow: '0 2px 8px #0002',
    display: 'block'
  }}
/>


                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                  {/* ID Card */}
                  <td>
                    {user.kyc_id_card ? (
                  <img
  src={resolveKYCUrl(user.kyc_id_card)}
  alt="ID Card"
  style={{
    width: '48px',
    height: '48px',
    maxWidth: '48px',
    maxHeight: '48px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #FFD700',
    boxShadow: '0 2px 8px #0002',
    display: 'block'
  }}
/>

                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                  {/* KYC Status and Approve/Reject */}
                  <td>
                    {user.kyc_status === "approved" && (
                      <span className="flex items-center gap-1 text-green-400 font-bold">
                        <BadgeCheck size={14} /> Approved
                      </span>
                    )}
                    {user.kyc_status === "rejected" && (
                      <span className="flex items-center gap-1 text-red-400 font-bold">
                        <XCircle size={14} /> Rejected
                      </span>
                    )}
                    {user.kyc_status === "pending" && (
                      <span className="flex items-center gap-1 text-yellow-400 font-bold">
                        Pending
                      </span>
                    )}
                    {/* Approve/Reject buttons only if KYC is pending and both images exist */}
                    {user.kyc_status === "pending" && user.kyc_selfie && user.kyc_id_card && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleKYCStatus(user.id, "approved")}
                          disabled={actionLoading === user.id + "-kyc"}
                          className="px-2 py-1 bg-gradient-to-r from-[#16d79c] to-[#ffd700] text-[#181b25] rounded-lg font-bold shadow hover:opacity-90 transition flex items-center gap-1 text-xs"
                        >
                          {actionLoading === user.id + "-kyc"
                            ? <Loader2 className="animate-spin" size={15} />
                            : <BadgeCheck size={15} />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleKYCStatus(user.id, "rejected")}
                          disabled={actionLoading === user.id + "-kyc"}
                          className="px-2 py-1 bg-gradient-to-r from-[#f34e6d] to-[#ffd700] text-[#181b25] rounded-lg font-bold shadow hover:opacity-90 transition flex items-center gap-1 text-xs"
                        >
                          <XCircle size={15} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                  {/* Win Mode */}
                  <td className="flex gap-2 items-center">
                    <button
                      onClick={() => setUserWinMode(user.id, userWinModes[user.id] === "WIN" ? null : "WIN")}
                      className={`px-2 py-1 rounded-lg text-xs font-bold shadow transition flex items-center gap-1 ${
                        userWinModes[user.id] === "WIN"
                          ? "bg-gradient-to-r from-[#16d79c] to-[#ffd700] text-[#232836] ring-2 ring-[#16d79c66]"
                          : "bg-[#18241a] text-green-300"
                      }`}
                      disabled={actionLoading === user.id + "-winmode"}
                    >
                      {userWinModes[user.id] === "WIN" ? <BadgeCheck size={14} /> : null}
                      {userWinModes[user.id] === "WIN" ? "Auto Win" : "Set Win"}
                    </button>
                    <button
                      onClick={() => setUserWinMode(user.id, userWinModes[user.id] === "LOSE" ? null : "LOSE")}
                      className={`px-2 py-1 rounded-lg text-xs font-bold shadow transition flex items-center gap-1 ${
                        userWinModes[user.id] === "LOSE"
                          ? "bg-gradient-to-r from-[#f34e6d] to-[#ffd700] text-[#232836] ring-2 ring-[#ffd70066]"
                          : "bg-[#24181a] text-red-300"
                      }`}
                      disabled={actionLoading === user.id + "-winmode"}
                    >
                      {userWinModes[user.id] === "LOSE" ? <XCircle size={14} /> : null}
                      {userWinModes[user.id] === "LOSE" ? "Auto Lose" : "Set Lose"}
                    </button>
                  </td>
                  {/* Current Mode */}
                  <td>
                    {userWinModes[user.id] === "WIN" && (
                      <span className="px-2 py-1 rounded-lg bg-green-800 text-green-300 font-bold text-xs shadow">WIN</span>
                    )}
                    {userWinModes[user.id] === "LOSE" && (
                      <span className="px-2 py-1 rounded-lg bg-red-900 text-red-300 font-bold text-xs shadow">LOSE</span>
                    )}
                    {!userWinModes[user.id] && (
                      <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 font-semibold text-xs shadow">DEFAULT</span>
                    )}
                  </td>
                  {/* Joined */}
                  <td>{user.created_at?.slice(0, 10)}</td>
                  {/* Actions */}
                  <td>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1 bg-gradient-to-r from-[#f34e6d] to-[#ffd700] rounded-lg text-xs font-bold text-[#181b25] shadow hover:opacity-90 transition flex items-center gap-1"
                      disabled={actionLoading === user.id + "-delete"}
                    >
                      <XCircle size={14} />
                      {actionLoading === user.id + "-delete" ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
