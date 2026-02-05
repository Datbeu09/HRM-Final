import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEmployeeById } from "../../api/employees.api";
import { getMonthlyAttendanceById } from "../../api/monthlyAttendance.api";
import { getEmployeeMonthDetail, updateDailyAttendance } from "../../api/attendance.api";

import DetailHeader from "../../components/AttendanceSummary/DetailHeader";
import SummaryCards from "../../components/AttendanceSummary/SummaryCards";
import AttendanceDetailTable from "../../components/AttendanceSummary/AttendanceDetailTable";
import EditNoteModal from "../../components/AttendanceSummary/EditNoteModal";

// utils
const pad2 = (n) => String(n).padStart(2, "0");
const formatDMY = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "--";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const weekdayVI = (dateStr) => {
  const d = new Date(dateStr);
  const map = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return Number.isNaN(d.getTime()) ? "--" : map[d.getDay()];
};
const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

export default function AttendanceDetail() {
  const { attendanceId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [monthly, setMonthly] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  // backend return: { summary, days }
  const [detail, setDetail] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // edit notes
  const [editing, setEditing] = useState({ open: false, id: null, notes: "" });

  useEffect(() => {
    if (!attendanceId) return;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const m = await getMonthlyAttendanceById(attendanceId);
        if (!m) throw new Error("Không tìm thấy bảng chấm công tháng (monthlyAttendance)");

        setMonthly(m);
        setMonth(Number(m.month));
        setYear(Number(m.year));

        const empRes = await getEmployeeById(m.employeeId);
        setEmployee(empRes?.data ?? empRes ?? null);

        const d = await getEmployeeMonthDetail({
          employeeId: m.employeeId,
          month: Number(m.month),
          year: Number(m.year),
        });
        setDetail(d);
        setPage(1);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, [attendanceId]);

  // build full days (fill missing)
  const dayRows = useMemo(() => {
    if (!month || !year) return [];
    const total = daysInMonth(month, year);

    const map = new Map();
    (detail?.days || []).forEach((x) => {
      const d = new Date(x.date);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      map.set(key, x);
    });

    const arr = [];
    for (let d = 1; d <= total; d++) {
      const dateStr = `${year}-${pad2(month)}-${pad2(d)}`;
      const wd = new Date(dateStr).getDay();
      const isSunday = wd === 0;

      const x = map.get(dateStr);

      let kind = "ABSENT";
      if (isSunday && !x) kind = "WEEKEND";
      else if (x?.status === "PRESENT") kind = "PRESENT";
      else if (x?.status === "LEAVE") kind = "LEAVE";
      else if (x?.status === "ABSENT") kind = "ABSENT";

      arr.push({
        dateStr,
        dateLabel: formatDMY(dateStr),
        weekday: weekdayVI(dateStr),
        id: x?.id ?? null,
        kind,
        status: x?.status ?? (isSunday ? "WEEKEND" : "ABSENT"),
        hoursWorked: x?.hoursWorked ?? 0,
        notes: x?.notes ?? "",

        // 🔥 GIỮ GIỜ VÀO / GIỜ RA
        checkInAt: x?.checkInAt ?? null,
        checkOutAt: x?.checkOutAt ?? null,
      });
    }
    return arr;
  }, [detail, month, year]);

  const summary = useMemo(() => {
    const s = detail?.summary;
    if (s) return s;

    return {
      totalPresentDays: dayRows.filter((x) => x.kind === "PRESENT").length,
      totalAbsentDays: dayRows.filter((x) => x.kind === "ABSENT").length,
      totalLeaveDays: dayRows.filter((x) => x.kind === "LEAVE").length,
    };
  }, [detail, dayRows]);

  const totalPages = Math.max(1, Math.ceil(dayRows.length / itemsPerPage));
  const pageRows = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return dayRows.slice(start, start + itemsPerPage);
  }, [dayRows, page]);

  const empName = employee?.name || "N/A";
  const empCode = employee?.employeeCode || employee?.code || "N/A";

  const openEditNote = (id, notes) => setEditing({ open: true, id, notes: notes || "" });
  const closeEditNote = () => setEditing({ open: false, id: null, notes: "" });

  const saveNote = async () => {
    if (!editing?.id) return;
    try {
      const updated = await updateDailyAttendance({ id: editing.id, notes: editing.notes });

      setDetail((prev) => {
        if (!prev) return prev;
        const nextDays = (prev.days || []).map((d) =>
          d.id === editing.id ? { ...d, notes: updated?.notes ?? editing.notes } : d
        );
        return { ...prev, days: nextDays };
      });

      closeEditNote();
    } catch (e) {
      console.error(e);
      alert("Lưu ghi chú thất bại");
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-6">
        <DetailHeader
          loading={loading}
          error={error}
          month={month}
          year={year}
          empName={empName}
          empCode={empCode}
          onBack={() => navigate(-1)}
          onExport={() => alert("Bạn muốn xuất PDF hay Excel?")}
        />

       <SummaryCards days={detail?.days || []} />


        <AttendanceDetailTable
          loading={loading}
          month={month}
          year={year}
          rows={pageRows}
          page={page}
          totalPages={totalPages}
          pageSize={itemsPerPage}
          totalDays={dayRows.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          onPage={(p) => setPage(p)}
          onEditNote={(id, notes) => openEditNote(id, notes)}
        />

        <EditNoteModal
          open={editing.open}
          value={editing.notes}
          onChange={(v) => setEditing((s) => ({ ...s, notes: v }))}
          onClose={closeEditNote}
          onSave={saveNote}
        />
      </div>
    </div>
  );
}