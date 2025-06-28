import React, { useEffect, useState } from "react";
import { UserCircle2, ShieldCheck, XCircle, Loader2, Eye, Trash2, BadgeCheck, AlertTriangle, Image } from "lucide-react";

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
      const res = await fetch(`http://localhost:5001/api/admin/user/${user_id}`, {
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
      const res = await fetch("http://localhost:5001/api/admin/users", {
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
      const res = await fetch("http://localhost:5001/api/admin/users", {
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
      const res = await fetch(`http://localhost:5000/api/admin/users/${user_id}/trade-mode`, {
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
      const res = await fetch("http://localhost:5001/api/admin/user-kyc-status", {
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
        <div className="overflow-x-auto rounded-xl">
          <table className="admin-table min-w-[950px]">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Win Mode</th>
                <th>Current Mode</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 font-semibold">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#23283644] hover:bg-[#232836cc] transition font-semibold">
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.kyc_status
                      ? (
                        user.kyc_status === "approved"
                          ? <span className="flex items-center gap-1 text-green-400 font-bold"><ShieldCheck size={14} />Approved</span>
                          : user.kyc_status === "rejected"
                            ? <span className="flex items-center gap-1 text-red-400 font-bold"><XCircle size={14} />Rejected</span>
                            : <span className="flex items-center gap-1 text-yellow-400 font-bold capitalize"><AlertTriangle size={14} />{user.kyc_status}</span>
                      )
                      : <span className="text-gray-400">Unverified</span>
                    }
                    {(user.kyc_selfie || user.kyc_id_card) && (
                      <button
                        onClick={() => handleViewKYC(user)}
                        className="ml-2 px-2 py-1 rounded-lg bg-gradient-to-r from-[#3af0ff]/80 to-[#16d79c]/80 text-xs font-bold text-[#181b25] shadow hover:opacity-90 transition flex items-center gap-1"
                      >
                        <Eye size={14} /> KYC
                      </button>
                    )}
                  </td>
                  <td className="capitalize">{user.status}</td>
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
                  {/* Current Mode column */}
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
                  <td>{user.created_at?.slice(0, 10)}</td>
                  <td>
                    <button
                      onClick={() => handleViewKYC(user)}
                      className="px-3 py-1 bg-gradient-to-r from-[#3af0ff] to-[#16d79c] rounded-lg text-xs font-bold text-[#181b25] shadow hover:opacity-90 transition flex items-center gap-1"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="ml-2 px-3 py-1 bg-gradient-to-r from-[#f34e6d] to-[#ffd700] rounded-lg text-xs font-bold text-[#181b25] shadow hover:opacity-90 transition flex items-center gap-1"
                      disabled={actionLoading === user.id + "-delete"}
                    >
                      <Trash2 size={14} />
                      {actionLoading === user.id + "-delete" ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KYC Modal */}
      {showKycModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-[99] flex items-center justify-center">
          <div className="bg-gradient-to-br from-white/10 via-[#181b25]/90 to-[#222b3a]/90 border border-[#16d79c44] rounded-2xl shadow-2xl px-8 py-6 w-[98vw] max-w-lg relative">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#ffd700] mb-5">
              <ShieldCheck size={19} className="text-[#16d79c]" />
              KYC Documents for User ID {selectedUser.id}
            </h3>
            <div className="flex flex-wrap gap-6 mb-3">
              <div>
                <div className="font-bold mb-2 text-[#16d79c] flex items-center gap-1"><Image size={14}/>Selfie:</div>
                {selectedUser.kyc_selfie
                  ? <img src={`http://localhost:5001/uploads/${selectedUser.kyc_selfie}`}
                      alt="Selfie" className="max-w-[150px] rounded-xl border-2 border-[#14B8A6] shadow" />
                  : <div className="text-gray-400">No selfie uploaded</div>
                }
              </div>
              <div>
                <div className="font-bold mb-2 text-[#ffd700] flex items-center gap-1"><Image size={14}/>ID Card:</div>
                {selectedUser.kyc_id_card
                  ? <img src={`http://localhost:5001/uploads/${selectedUser.kyc_id_card}`}
                      alt="ID Card" className="max-w-[150px] rounded-xl border-2 border-[#FFD700] shadow" />
                  : <div className="text-gray-400">No ID uploaded</div>
                }
              </div>
            </div>
            <div className="flex gap-3 justify-center mt-6">
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
    </div>
  );
}
