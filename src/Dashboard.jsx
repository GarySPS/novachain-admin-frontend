// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from 'recharts';
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";

const generateFakeOHLCData = () => {
  const data = [];
  let base = 30000;
  for (let i = 0; i < 30; i++) {
    const open = base + (Math.random() - 0.5) * 500;
    const close = open + (Math.random() - 0.5) * 500;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    const date = `Day ${i + 1}`;
    data.push({ date, open, high, low, close });
    base = close;
  }
  return data;
};

const PremiumNewsTicker = () => (
  <div className="mt-8 bg-gradient-to-br from-[#222947]/70 to-[#171d31]/80 rounded-2xl p-3 overflow-hidden shadow-xl border-t border-white/5 relative">
    <motion.div
      className="whitespace-nowrap text-sm text-slate-200 flex items-center gap-10"
      initial={{ x: "100%" }}
      animate={{ x: "-150%" }}
      transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
    >
      {fakeNews.map((n, i) => (
        <span key={i} className="mr-12">
          <span className="font-semibold text-[#FFD700]">• </span>
          {n}
        </span>
      ))}
    </motion.div>
  </div>
);

const Dashboard = () => {
  const [ohlcData, setOhlcData] = useState([]);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    setOhlcData(generateFakeOHLCData());
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = coins.join(',');
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
        const response = await axios.get(url);
        const data = response.data;
        const priceArray = coins.map(coin => ({
          id: coin,
          price: data[coin]?.usd || 0,
          change24h: data[coin]?.usd_24h_change || 0,
        }));
        setPrices(priceArray);
      } catch (error) {
        // Optional: Add premium error UI here
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-tr from-[#1a2636] via-[#191e29] to-[#11151c] pt-20 px-3 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Candlestick Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-10 rounded-2xl shadow-2xl bg-gradient-to-br from-white/5 via-[#1a243c]/80 to-[#16203c]/90 p-6"
          >
            <h2 className="text-2xl font-bold mb-5 text-slate-100 tracking-tight">BTC/USDT Candlestick Chart (Simulated)</h2>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={ohlcData}>
                <XAxis dataKey="date" stroke="#a7b5ff" />
                <YAxis domain={['dataMin - 500', 'dataMax + 500']} stroke="#4fd1c5" />
                <Tooltip contentStyle={{ background: "#242d3d", border: "none", color: "#f7f8fa" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#2c374f" />
                <Bar
                  dataKey="close"
                  fill="#4fd1c5"
                  shape={(props) => {
                    const { x, y, width, height, payload, cy } = props;
                    const openY = cy - (payload.open - payload.close);
                    const closeY = y;
                    const color = payload.close > payload.open ? '#30e78c' : '#f34e6d';
                    return (
                      <g>
                        {/* Wick */}
                        <line
                          x1={x + width / 2}
                          y1={cy - (payload.high - payload.close)}
                          x2={x + width / 2}
                          y2={cy - (payload.low - payload.close)}
                          stroke={color}
                          strokeWidth={2}
                        />
                        {/* Body */}
                        <rect
                          x={x}
                          y={Math.min(openY, closeY)}
                          width={width}
                          height={Math.abs(openY - closeY)}
                          fill={color}
                          rx={2}
                        />
                      </g>
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crypto Prices Table */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="bg-gradient-to-b from-white/5 via-[#22273f]/80 to-[#171c29]/80 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl mb-4 font-bold text-slate-100">Market Prices (USD)</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-center text-base font-medium rounded-xl">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-300 uppercase text-xs tracking-widest">
                    <th className="py-2 font-bold">Coin</th>
                    <th className="py-2 font-bold">Price</th>
                    <th className="py-2 font-bold">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map(({ id, price, change24h }) => (
                    <tr key={id} className="border-b border-slate-800 hover:bg-[#28314c]/80 transition">
                      <td className="py-2 capitalize tracking-tight">{id.replace(/-/g, ' ')}</td>
                      <td className="py-2">${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                      <td className={`py-2 ${change24h >= 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>
                        {change24h ? (change24h > 0 ? '+' : '') + change24h.toFixed(2) : '0.00'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Premium News Ticker */}
          <PremiumNewsTicker />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
