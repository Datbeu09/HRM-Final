import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/common/Toast";

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // giữ error để hiển thị box đỏ trong UI
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ loading state (FIX LỖI)
  const [loading, setLoading] = useState(false);

  // ✅ Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ open: true, message, type });
  };

  const closeToast = () =>
    setToast((t) => ({ ...t, open: false }));

  const handleLoginError = (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "LOGIN_FAILED";

    if (msg === "INVALID_USERNAME") return "Sai tên đăng nhập.";
    if (msg === "INVALID_PASSWORD") return "Sai mật khẩu.";
    if (msg === "ACCOUNT_INACTIVE")
      return "Tài khoản bị khóa. Vui lòng liên hệ admin.";
    if (msg === "MISSING_CREDENTIALS")
      return "Vui lòng nhập đầy đủ thông tin.";

    return "Đăng nhập thất bại. Vui lòng thử lại.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // chặn spam submit
    if (loading) return;

    setError("");

    const u = username.trim();
    const p = password;

    // ===== validate input =====
    if (!u && !p) {
      const m = "Vui lòng nhập tên đăng nhập và mật khẩu.";
      setError(m);
      showToast(m, "warning");
      return;
    }

    if (!u) {
      const m = "Vui lòng nhập tên đăng nhập / email.";
      setError(m);
      showToast(m, "warning");
      return;
    }

    if (!p) {
      const m = "Vui lòng nhập mật khẩu.";
      setError(m);
      showToast(m, "warning");
      return;
    }

    try {
      setLoading(true);

      await authLogin(u, p);

      showToast("Đăng nhập thành công!", "success");
      navigate("/");
    } catch (err) {
      // lỗi mạng / server down
      if (!err?.response) {
        const m = "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.";
        setError(m);
        showToast(m, "error");
        return;
      }

      const m = handleLoginError(err);
      setError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast overlay */}
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
        duration={5000}
      />

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
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-teal-600"
                  >
                    <path
                      d="M6 3v18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 4h10l-1.5 3L16 10H6V4Z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="mt-4 text-center text-[22px] font-extrabold text-slate-900">
                Đăng nhập hệ thống
              </h2>
              <p className="mt-1 text-center text-sm text-slate-500">
                Quản lý nhân sự &amp; Tiền lương
              </p>

              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Username */}
              <div className="mt-6">
                <label className="block text-xs font-semibold text-slate-600">
                  Tên đăng nhập / Email
                </label>
                <div className="mt-2 relative">
                  <input
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-200/60 focus:border-teal-400"
                    placeholder="nhanvien@congty.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-600">
                  Mật khẩu
                </label>

                <div className="mt-2 relative">
                  <input
                    disabled={loading}
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
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 3l18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.6 10.6a2 2 0 002.8 2.8"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M7.1 7.1C4.5 8.9 3 12 3 12s3 6 9 6c1.2 0 2.3-.2 3.3-.6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M14.9 14.9C17.5 13.1 19 12 21 12c0 0-3-6-9-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_25px_-12px_rgba(13,148,136,0.65)] hover:bg-teal-700 active:scale-[0.99] transition"
              >
                {loading ? "Đang đăng nhập..." : <>Đăng nhập <span className="ml-1">→</span></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
