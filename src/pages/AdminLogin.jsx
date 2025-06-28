// src/pages/AdminLogin.jsx
import React, { useState, useRef, useEffect } from "react";
import { KeyRound, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill in both email and password.');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return setError('Please enter a valid email address.');
    setLoading(true);
    try {
      const response = await fetch('https://novachain-admin-backend.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.message || 'Login failed.');
      else {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/dashboard';
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121725] via-[#192032] to-[#181b25] px-4">
      <div
        className="
          w-full max-w-[380px] flex flex-col justify-center items-center
          p-0 rounded-2xl shadow-[0_8px_40px_0_rgba(8,16,24,0.37)]
          border border-[#212941]/60
          bg-gradient-to-b from-[#23294aee] via-[#181b25d6] to-[#181b25f2]
          backdrop-blur-[6px] overflow-hidden
        "
        style={{
          boxShadow: "0 4px 48px 0 #191d33cc, 0 1.5px 0 #ffd70070 inset",
          border: "1.5px solid #2e354a",
        }}
      >
        {/* Content Wrapper for Perfect Centering */}
        <div className="flex flex-col items-center justify-center px-7 py-10 w-full h-full">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 mb-5">
            <span className="rounded-full bg-[#1e2236] p-2.5 shadow-lg border border-[#ffd70033] flex items-center justify-center">
              <KeyRound size={30} className="text-[#FFD700]" />
            </span>
            <span className="text-[1.7rem] font-extrabold tracking-tight bg-gradient-to-r from-[#ffd700] to-[#16d79c] bg-clip-text text-transparent">
              NovaChain Admin
            </span>
          </div>
          <h1 className="text-2xl font-black text-white/90 mb-6 text-center drop-shadow-lg">
            Secure Admin Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="w-full bg-gradient-to-r from-[#f34e6d]/80 to-[#fbbf24]/80 text-white text-[1rem] rounded-xl py-2 px-5 mb-3 font-bold shadow-md animate-pulse text-center">
              {error}
            </div>
          )}

          {/* FORM: Centered, fixed width */}
          <form className="w-full flex flex-col gap-5 items-center justify-center" onSubmit={handleSubmit} autoComplete="on">
            {/* Email */}
            <div className="w-full">
              <label htmlFor="email" className="block text-[#b8c0d6] font-semibold mb-1 ml-1 text-[1.05rem]">
                Email
              </label>
              <input
  type="email"
  id="email"
  ref={emailRef}
  className="
    w-full bg-[#181b25] text-slate-100 rounded-xl px-4 py-2.5
    focus:outline-none focus:ring-2 focus:ring-[#16d79c] focus:bg-[#181b25cc]
    border border-[#232836] hover:border-[#16d79c66]
    text-base font-semibold shadow-inner transition
  "
  placeholder="admin@example.com"
  value={email}
  onChange={e => setEmail(e.target.value)}
  disabled={loading}
  autoComplete="username"
  spellCheck="false"
/>

            </div>

            {/* Password */}
            <div className="w-full">
              <label htmlFor="password" className="block text-[#b8c0d6] font-semibold mb-1 ml-1 text-[1.05rem]">
                Password
              </label>
              <input
  type="password"
  id="password"
  className="
    w-full bg-[#181b25] text-slate-100 rounded-xl px-4 py-2.5
    focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:bg-[#181b25cc]
    border border-[#232836] hover:border-[#ffd70066]
    text-base font-semibold shadow-inner transition
  "
  placeholder="••••••••"
  value={password}
  onChange={e => setPassword(e.target.value)}
  disabled={loading}
  autoComplete="current-password"
  spellCheck="false"
/>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-1 py-2.5 rounded-xl font-bold
                bg-gradient-to-r from-[#FFD700] to-[#16d79c] text-[#181b25] shadow-lg text-lg
                transition-all flex items-center justify-center
                border border-[#ffd70040] hover:opacity-90 hover:scale-[1.025] active:scale-95
                focus:outline-none focus:ring-2 focus:ring-[#ffd700]
              "
              style={{
                letterSpacing: ".03em",
                boxShadow: "0 4px 24px #ffd70033",
                minWidth: "100%",
              }}
            >
              {loading ? (
                <svg
                  className="animate-spin h-7 w-7 text-[#181b25]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-40"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#181b25"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="#FFD700" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
