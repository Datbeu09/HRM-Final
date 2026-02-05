import React, { useState, useEffect, useCallback } from "react";
import { getEmployeeById } from "../../api/employees.api";
import { getProfessionalQualifications } from "../../api/professionalQualifications.api";
import { getDepartments } from "../../api/departments.api";

import ProfileInfo from "../../components/EmployeesDetail/ProfileInfo";
import EducationInfo from "../../components/EmployeesDetail/EducationInfo";
import SocialInfo from "../../components/EmployeesDetail/SocialInfo";
import { useAuth } from "../../auth/AuthContext";

// unwrap { success:true, data: ... } hoặc trả thẳng object
const unwrap = (res) => {
  if (!res) return null;
  if (res?.data && typeof res.data === "object" && "success" in res.data) {
    return res.data.data;
  }
  if (res?.success && res?.data) return res.data;
  return res;
};

export default function Profile() {
  const { user } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const employeeId = user?.employeeId ?? user?.id;
      if (!employeeId) throw new Error("Không có thông tin người dùng (employeeId).");

      const [employeeRes, pqListRes, depRes] = await Promise.all([
        getEmployeeById(employeeId),
        getProfessionalQualifications({ employeeId }).catch((e) => {
          console.error("[Profile] PQ error:", e?.response?.data || e);
          return [];
        }),
        getDepartments().catch((e) => {
          console.error("[Profile] Departments error:", e?.response?.data || e);
          return [];
        }),
      ]);

      const employeeData = unwrap(employeeRes);
      const pqList = unwrap(pqListRes);
      const depList = unwrap(depRes);

      if (!employeeData?.id) {
        throw new Error("Không tìm thấy nhân viên với ID: " + employeeId);
      }

      setEmployee(employeeData);
      setQualifications(Array.isArray(pqList) ? pqList : []);
      setDepartments(Array.isArray(depList) ? depList : []);
    } catch (err) {
      console.error("[Profile] Lỗi khi lấy dữ liệu:", err);
      setError(err?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
      setEmployee(null);
      setQualifications([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.employeeId, user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getDepartmentName = (departmentId) => {
    const idNum = Number(departmentId);
    const dep = (departments || []).find((d) => Number(d.id) === idNum);
    // tùy backend: departmentName / name
    return dep?.departmentName || dep?.name || "N/A";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải thông tin nhân viên...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Không tìm thấy nhân viên
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <ProfileInfo
          employee={employee}
          departmentName={getDepartmentName(employee.departmentId)}
        />
        <EducationInfo employee={employee} qualifications={qualifications} />
        <SocialInfo employee={employee} />
      </div>
    </main>
  );
}