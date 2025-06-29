import React, { useState, useRef, useEffect } from "react";
import { KeyRound, Mail, Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#28203c] via-[#403153] to-[#1a2032]">
      <div
        className="
          w-full max-w-[390px] rounded-[2.5rem] shadow-2xl p-0 border-0 flex flex-col items-center
          bg-white/10 backdrop-blur-[12px] overflow-hidden"
        style={{
          boxShadow: "0 8px 40px 0 rgba(44,34,68,0.32), 0 1.5px 0 #fff3 inset",
        }}
      >
        <div className="w-full flex flex-col items-center px-10 py-10">
          {/* Avatar/Logo */}
          <div className="flex flex-col items-center gap-3 mb-5">
            <div className="rounded-full bg-white/20 p-4 mb-2">
              <KeyRound size={40} className="text-white/80" />
            </div>
            {/* Optional: <img src="..." /> */}
          </div>
          {/* Title */}
          <h1 className="text-2xl font-black text-white/90 mb-7 text-center drop-shadow-lg">
            Secure Admin Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="w-full bg-gradient-to-r from-[#f34e6d]/80 to-[#fbbf24]/80 text-white text-[1rem] rounded-xl py-2 px-5 mb-3 font-bold shadow-md animate-pulse text-center">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="on">
            {/* Email */}
            <div className="flex flex-row items-center border-b border-white/30 focus-within:border-white/70 mb-2">
              <Mail className="text-white/60 mr-3" size={22} />
              <input
                type="email"
                id="email"
                ref={emailRef}
                className="w-full bg-transparent text-white/90 placeholder-white/40 py-2.5 focus:outline-none font-medium"
                placeholder="Email ID"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="username"
                spellCheck="false"
              />
            </div>
            {/* Password */}
            <div className="flex flex-row items-center border-b border-white/30 focus-within:border-white/70 mb-2">
              <Lock className="text-white/60 mr-3" size={22} />
              <input
                type="password"
                id="password"
                className="w-full bg-transparent text-white/90 placeholder-white/40 py-2.5 focus:outline-none font-medium"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                spellCheck="false"
              />
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex flex-row items-center justify-between mt-1">
              <label className="flex items-center text-white/60 text-xs font-medium select-none">
                <input type="checkbox" className="mr-2 accent-[#6cf2ea]" disabled />
                Remember me
              </label>
              <span className="text-white/40 text-xs font-medium italic cursor-pointer hover:text-white/70 transition">
                Forgot Password?
              </span>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#16d79c] text-[#181b25] shadow-lg text-lg transition-all flex items-center justify-center hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
              style={{
                letterSpacing: ".03em",
                boxShadow: "0 4px 24px #ffd70033",
                minWidth: "100%",
              }}
            >
              {loading ? (
                <svg className="animate-spin h-7 w-7 text-[#181b25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="#181b25" strokeWidth="4" />
                  <path className="opacity-75" fill="#FFD700" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
