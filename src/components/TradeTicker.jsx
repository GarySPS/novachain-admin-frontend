import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const usernames = ['User123', 'Satoshi21', 'CryptoQueen', 'ElonX', 'Whale9', 'GaryBTC', 'NovaVIP'];
const coins = ['BTC', 'ETH', 'SOL', 'XRP', 'TON'];

const generateMessage = () => {
  const user = usernames[Math.floor(Math.random() * usernames.length)];
  const coin = coins[Math.floor(Math.random() * coins.length)];
  const amount = (Math.random() * 1000 + 100).toFixed(2);
  return `${user} won $${amount} on ${coin}/USDT`;
};

export default function TradeTicker() {
  const [messages, setMessages] = useState(() => {
    // Fill ticker at start
    return Array.from({ length: 6 }, generateMessage);
  });
  const controls = useAnimation();
  const tickerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => {
        const newMsg = generateMessage();
        // Add to end for smooth scroll
        return [...prev.slice(1), newMsg];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // For infinite scroll effect, we duplicate messages
  const scrollMsgs = [...messages, ...messages];

  return (
    <div className="w-full mt-8 bg-gradient-to-r from-[#21253b]/85 via-[#181b25]/90 to-[#20253b]/85 rounded-xl shadow-lg border-t border-white/5 overflow-hidden relative px-2 py-3">
      <div className="overflow-hidden relative">
        <motion.div
          ref={tickerRef}
          className="flex whitespace-nowrap gap-12"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 22,
          }}
        >
          {scrollMsgs.map((msg, i) => (
            <span
              key={i}
              className="font-medium text-sm md:text-base text-[#FFD700] tracking-wide mr-8 flex-shrink-0"
              style={{
                textShadow: '0 1.5px 10px #181b25, 0 2px 4px #FFD70022',
                letterSpacing: 0.5,
              }}
            >
              <span className="inline-block px-2 py-1 rounded-md bg-[#222836]/70 text-[#ffd700] shadow-md border border-[#ffd70022] mr-2">
                🏆
              </span>
              {msg}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
