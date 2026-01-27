import React, { useEffect, useState } from "react";
import EmployeesPopup from "../components/Popup/Employees/EmployeesPopup";
import { getEmployees } from "../api/employees.api";
import RecentEmployees from "../components/Dashboard/RecentEmployees";
import UpcomingEvents from "../components/Dashboard/UpcomingEvents";
import ReportsStatCard from "../components/Reports/ReportsStatCard";
import { useAuth } from "../auth/AuthContext";
import Action from "../components/common/Action";

const isWithinLastDays = (dateString, days = 30) => {
  if (!dateString) return false;
  const today = new Date();
  const start = new Date(dateString);
  if (Number.isNaN(start.getTime())) return false;
  const diffDays = (today - start) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newEmployees: 0,
    resignedEmployees: 0,
    pendingRequests: 0,
  });

  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { user } = useAuth();
  const role = user?.role?.toUpperCase();
  const isHRorAdmin = role === "ADMIN" || role === "HR";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const employees = await getEmployees();

      const list = Array.isArray(employees) ? employees : [];
      const totalEmployees = list.length;

      // ✅ đúng yêu cầu "30 ngày" (khớp RecentEmployees)
      const newEmployees = list.filter((e) => isWithinLastDays(e.startDate, 30)).length;

      // ✅ workStatus trong data bạn là "Đang làm" (không phải "Đang làm việc")
      const resignedEmployees = list.filter((e) => {
        if (!e.workStatus) return false;
        return e.workStatus !== "Đang làm";
      }).length;

      const pendingRequests = 5;

      setStats({ totalEmployees, newEmployees, resignedEmployees, pendingRequests });
    } catch (error) {
      console.error("Lỗi khi tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full bg-gray-50 p-4 flex flex-col gap-4">
      {/* ================= STATS ================= */}
      <div
        className={`grid gap-4 ${
          isHRorAdmin
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
        }`}
      >
        {loading ? (
          <p className="text-sm text-slate-500 col-span-full text-center">Đang tải thống kê...</p>
        ) : (
          <>
            <ReportsStatCard title="Tổng nhân sự" value={stats.totalEmployees} />
            <ReportsStatCard title="Nhân viên mới (30 ngày)" value={stats.newEmployees} highlight />
            {isHRorAdmin && (
              <>
                <ReportsStatCard title="Đã nghỉ việc" value={stats.resignedEmployees} />
                <ReportsStatCard title="Đang chờ duyệt" value={stats.pendingRequests} />
              </>
            )}
          </>
        )}
      </div>

      {/* ================= TABLES ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
        <RecentEmployees />
        <UpcomingEvents />
      </div>

      {/* ================= ACTIONS ================= */}
      <div className={`grid gap-4 ${isHRorAdmin ? "grid-cols-3" : "grid-cols-2"}`}>
        {isHRorAdmin && (
          <Action icon="person_add" label="Thêm nhân viên" onClick={() => setOpenModal(true)} />
        )}
        <Action icon="description" label="Xuất báo cáo PDF" />
        <Action icon="mail" label="Gửi thông báo" />
      </div>

      {/* ================= POPUP (CHỈ THÊM) ================= */}
      {openModal && (
        <EmployeesPopup
          onClose={() => setOpenModal(false)}
          onSaved={() => {
            setOpenModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
