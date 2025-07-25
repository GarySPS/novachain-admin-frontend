// src/components/BalanceAdjuster.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function BalanceAdjuster({ userId, onDone }) {
  const [coin, setCoin] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("add"); // 'add', 'reduce', or 'freeze'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("adminToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      let url, payload;
      if (action === "add") {
        url = `${API_BASE}/api/admin/add-balance`;
        payload = { user_id: userId, coin, amount };
      } else if (action === "reduce") {
        url = `${API_BASE}/api/admin/user/${userId}/reduce-balance`;
        payload = { coin, amount };
      } else if (action === "freeze") { // <--
        url = `${API_BASE}/api/admin/freeze-balance`; // <--
        payload = { user_id: userId, coin, amount }; // <--
      }
      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(res.data.message || "Success!");
      if (onDone) onDone();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl shadow bg-white max-w-xs">
      <div className="mb-2">
        <label>Coin:</label>
        <select value={coin} onChange={e => setCoin(e.target.value)} className="border rounded px-2 py-1 ml-2">
          <option value="USDT">USDT</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="TON">TON</option>
          <option value="SOL">SOL</option>
          <option value="XRP">XRP</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          className="border rounded px-2 py-1 ml-2"
        />
      </div>
      <div className="mb-2">
        <label>Action:</label>
        <select value={action} onChange={e => setAction(e.target.value)} className="border rounded px-2 py-1 ml-2">
          <option value="add">Add Balance</option>
          <option value="reduce">Reduce Balance</option>
          <option value="freeze">Freeze Balance</option> {/* <-- */}
        </select>
      </div>
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Processing..." : "Submit"}
      </button>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </form>
  );
}
