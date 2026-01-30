import React, { useEffect, useMemo, useState } from "react";
import { getMeAttendance, checkIn, checkOut } from "../../api/attendance.api";

const pad2 = (n) => String(n).padStart(2, "0");

const fmtTime = (d) =>
  `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;

// Robust: nhận cả "08:00:00", "08:00", hoặc datetime "2026-01-10 08:00:00"
const fmtHM = (v) => {
  if (!v) return "--:--";
  if (typeof v === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(v)) return v.slice(0, 5);
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "--:--";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const fmtDMY = (v) => {
  if (!v) return "--/--/----";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "--/--/----";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const weekdayVI = (v) => {
  const d = new Date(v);
  const map = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return Number.isNaN(d.getTime()) ? "--" : map[d.getDay()];
};

const fmtMinutes = (mins) => {
  const m = Math.max(0, Number(mins || 0));
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
};

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const cls = s.includes("đúng")
    ? "bg-green-100 text-green-700"
    : s.includes("muộn")
    ? "bg-amber-100 text-amber-700"
    : s.includes("về sớm")
    ? "bg-rose-100 text-rose-700"
    : s.includes("làm thêm") || s.includes("tăng ca")
    ? "bg-indigo-100 text-indigo-700"
    : s.includes("nghỉ")
    ? "bg-slate-100 text-slate-700"
    : s.includes("đang")
    ? "bg-sky-100 text-sky-700"
    : "bg-slate-100 text-slate-500";

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${cls}`}>
      {status || "—"}
    </span>
  );
}

export default function Attendance() {
  const [now, setNow] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [today, setToday] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMeAttendance();

      // DEBUG nếu cần:
      // console.log("[/attendance/me]", data);

      setToday(data?.today || null);
      setMonthly(data?.monthly || null);
      setRecent(Array.isArray(data?.recent) ? data.recent : []);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== TODAY mapping (đúng schema attendancelogs) =====
  const inTime = fmtHM(today?.checkInAt);
  const outTime = fmtHM(today?.checkOutAt);
  const workedMinutes = Number(today?.workedMinutes || 0);

  const canCheckIn = useMemo(() => !today || !today.checkInAt, [today]);
  const canCheckOut = useMemo(() => !!today?.checkInAt && !today?.checkOutAt, [today]);

  const handleCheckIn = async () => {
    setSubmitting(true);
    setError("");
    try {
      await checkIn();
      await fetchData();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "CHECK IN failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmitting(true);
    setError("");
    try {
      await checkOut();
      await fetchData();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "CHECK OUT failed");
    } finally {
      setSubmitting(false);
    }
  };

  const monthLabel = useMemo(() => {
    const d = new Date();
    return `${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  }, []);

  const overtimeHours = useMemo(() => {
    const totalMinutes = Number(monthly?.totalMinutes || 0);
    const presentDays = Number(monthly?.present || 0);
    const overtimeMins = Math.max(0, totalMinutes - presentDays * 8 * 60);
    return overtimeMins / 60;
  }, [monthly]);

  return (
    <div className="min-h-screen bg-background-light p-8 text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        {error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl">
            {error}
          </div>
        ) : null}

        {/* Khối chấm công chính */}
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 text-center">
          <div className="mb-2 text-slate-400 font-medium uppercase tracking-widest text-xs">
            Thời gian hiện tại
          </div>

          <div className="text-6xl font-bold text-slate-900 mb-8 tracking-tighter">
            {fmtTime(now)}
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={handleCheckIn}
              disabled={loading || submitting || !canCheckIn}
              className={[
                "flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold shadow-lg transition-all w-52",
                loading || submitting || !canCheckIn
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-primary text-white shadow-teal-500/30 hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98]",
              ].join(" ")}
            >
              <span className="material-icons-round">login</span>
              CHECK IN
            </button>

            <button
              onClick={handleCheckOut}
              disabled={loading || submitting || !canCheckOut}
              className={[
                "flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold transition-all w-52",
                loading || submitting || !canCheckOut
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:scale-[1.02] active:scale-[0.98]",
              ].join(" ")}
            >
              <span className="material-icons-round">logout</span>
              CHECK OUT
            </button>
          </div>

          <div className="flex justify-center items-center gap-12 py-6 border-t border-slate-100">
            <TimeBlock label="Giờ vào" value={inTime} />
            <Divider />
            <TimeBlock label="Giờ ra" value={outTime} />
            <Divider />
            <TimeBlock label="Tổng giờ" value={fmtMinutes(workedMinutes)} />
          </div>

          <div className="mt-3 text-sm text-slate-500">
            Trạng thái hôm nay: <b>{today?.status || "Chưa chấm công"}</b>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon="event_available"
            color="teal"
            label={`Công tháng ${monthLabel}`}
            value={`${monthly?.present || 0} ngày`}
          />
          <StatCard
            icon="history_toggle_off"
            color="amber"
            label="Đi muộn / Về sớm"
            value={`${(monthly?.late || 0) + (monthly?.early || 0)} lần`}
          />
          <StatCard
            icon="more_time"
            color="indigo"
            label="Giờ tăng ca"
            value={`${overtimeHours.toFixed(1)}h`}
          />
        </div>

        {/* Lịch sử chấm công */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Lịch sử chấm công gần đây</h3>
            <button onClick={fetchData} className="text-xs font-bold text-primary hover:underline">
              Tải lại
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Ngày</th>
                  <th className="px-6 py-3">Thứ</th>
                  <th className="px-6 py-3">Giờ vào</th>
                  <th className="px-6 py-3">Giờ ra</th>
                  <th className="px-6 py-3">Tổng giờ</th>
                  <th className="px-6 py-3">Trạng thái</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td className="px-6 py-6 text-slate-400" colSpan={6}>
                      Đang tải...
                    </td>
                  </tr>
                ) : recent.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-slate-400" colSpan={6}>
                      Chưa có lịch sử
                    </td>
                  </tr>
                ) : (
                  recent.map((r) => {
                    const date = r.workDate || r.date;
                    const inAt = r.checkInAt ?? r.checkInTime ?? r.checkIn ?? null;
                    const outAt = r.checkOutAt ?? r.checkOutTime ?? r.checkOut ?? null;
                    const mins = r.workedMinutes ?? r.totalMinutes ?? 0;

                    return (
                      <tr key={r.id || date}>
                        <td className="px-6 py-4 font-medium">{fmtDMY(date)}</td>
                        <td className="px-6 py-4 text-slate-500">{weekdayVI(date)}</td>
                        <td className="px-6 py-4">{fmtHM(inAt)}</td>
                        <td className="px-6 py-4">{fmtHM(outAt)}</td>
                        <td className="px-6 py-4">{fmtMinutes(mins)}</td>
                        <td className="px-6 py-4">
                          <StatusPill status={r.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeBlock({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xs text-slate-400 font-bold uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-700">{value}</p>
    </div>
  );
}
function Divider() {
  return <div className="h-8 w-px bg-slate-200" />;
}
function StatCard({ icon, color, label, value }) {
  const colorMap = {
    teal: "bg-teal-50 text-primary",
    amber: "bg-amber-50 text-amber-500",
    indigo: "bg-indigo-50 text-indigo-500",
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorMap[color]}`}>
        <span className="material-icons-round">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
