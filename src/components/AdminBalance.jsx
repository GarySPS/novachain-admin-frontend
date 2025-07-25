import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE } from "../config";

export default function AdminBalance() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [coin, setCoin] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("add");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch users (from Supabase, via backend)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data || []);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSearch = (e) => {
    setUserId(e.target.value);
    setMsg("");
    setSelectedUser(null);
    if (e.target.value.length > 0) {
      const u = users.find(
        (usr) =>
          usr.id === Number(e.target.value) ||
          (usr.email && usr.email.toLowerCase() === e.target.value.toLowerCase())
      );
      if (u) setSelectedUser(u);
      else setSelectedUser(null);
    } else {
      setSelectedUser(null);
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("adminToken");
      let url, payload;
      if (action === "add") {
        url = `${API_BASE}/api/admin/add-balance`;
        payload = { user_id: selectedUser.id, coin, amount };
      } else {
        url = `${API_BASE}/api/admin/user/${selectedUser.id}/reduce-balance`;
        payload = { coin, amount };
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setMsg(data.message || "Success!");
      setAmount("");
    } catch (err) {
      setMsg(err.message || "Error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-4 py-8 rounded-2xl shadow-xl bg-gradient-to-br from-white/5 via-[#191e29]/80 to-[#181b25]/90 border border-white/5">
      <h2 className="text-xl font-bold mb-5 text-[#ffd700] tracking-tight">Manual Add/Reduce User Balance</h2>
      {/* User Search */}
      <div className="mb-5">
        <input
          type="text"
          className="px-4 py-2 rounded-xl border border-[#232836] bg-[#191e29] text-[#ffd700] font-semibold w-full shadow"
          placeholder="Enter User ID or Email"
          value={userId}
          onChange={handleUserSearch}
        />
        {selectedUser && (
          <div className="mt-2 px-3 py-1 rounded bg-[#232836] text-[#ffd700] text-xs">
            <b>User:</b> {selectedUser.email} (ID: {selectedUser.id})
          </div>
        )}
      </div>
      {/* Adjust Form */}
      {selectedUser && (
        <form className="flex flex-col gap-3" onSubmit={handleAdjustBalance}>
          <div className="flex gap-2">
            <select
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              className="rounded p-1 bg-[#232836] text-[#ffd700] text-xs"
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="TON">TON</option>
              <option value="SOL">SOL</option>
              <option value="XRP">XRP</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              min={0}
              step={0.0001}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="rounded p-1 bg-[#232836] text-[#ffd700] text-xs w-32"
            />
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rounded p-1 bg-[#232836] text-[#ffd700] text-xs"
            >
              <option value="add">Add</option>
              <option value="reduce">Reduce</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#ffd700] to-[#16d79c] text-[#181b25] font-bold py-2 rounded shadow"
          >
            {loading ? <Loader2 className="animate-spin inline" size={18} /> : "Submit"}
          </button>
          {msg && <div className="text-xs mt-2 text-[#ffd700]">{msg}</div>}
        </form>
      )}
    </div>
  );
}
