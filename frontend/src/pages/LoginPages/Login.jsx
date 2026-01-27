import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext"; // Dùng useAuth từ AuthContext
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi login từ AuthContext thay vì từ API
      await authLogin(username, password);
      navigate("/"); // Điều hướng về trang chính sau khi đăng nhập thành công
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Kiểm tra console để biết thêm chi tiết.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f6fbfb] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-50/70 blur-3xl" />
      </div>

      <div className="relative w-[560px] max-w-[92vw]">
        <div className="bg-white rounded-2xl shadow-[0_18px_60px_-30px_rgba(0,0,0,0.25)] border border-teal-100/70 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-teal-300" />

          <form onSubmit={handleSubmit} className="px-10 py-10">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-teal-600">
                  <path d="M6 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 4h10l-1.5 3L16 10H6V4Z" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
            </div>

            <h2 className="mt-4 text-center text-[22px] font-extrabold text-slate-900">Đăng nhập hệ thống</h2>
            <p className="mt-1 text-center text-sm text-slate-500">Quản lý nhân sự &amp; Tiền lương</p>

            {/* Error message */}
            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {String(error)}
              </div>
            )}

            {/* Username */}
            <div className="mt-6">
              <label className="block text-xs font-semibold text-slate-600">Tên đăng nhập / Email</label>
              <div className="mt-2 relative">
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-200/60 focus:border-teal-400"
                  placeholder="nhanvien@congty.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-600">Mật khẩu</label>
              </div>

              <div className="mt-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-11 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-200/60 focus:border-teal-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="toggle password"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_25px_-12px_rgba(13,148,136,0.65)] hover:bg-teal-700 active:scale-[0.99] transition"
            >
              Đăng nhập <span className="ml-1">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
