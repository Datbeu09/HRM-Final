import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById, deleteEmployee } from "../../api/employees.api";
import { getProfessionalQualifications } from "../../api/professionalQualifications.api";

import ProfileInfo from "../../components/EmployeesDetail/ProfileInfo";
import EducationInfo from "../../components/EmployeesDetail/EducationInfo";
import SocialInfo from "../../components/EmployeesDetail/SocialInfo";
import EmployeesPopup from "../../components/Popup/Employees/EmployeesPopup";
import { getDepartments } from "../../api/departments.api";  // Import getDepartments

export default function EmployeesDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [departments, setDepartments] = useState([]);  // Biến lưu danh sách phòng ban
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const fetchEmployeeAndDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error("ID nhân viên không hợp lệ.");

      // Chạy song song để lấy thông tin nhân viên và phòng ban
      const [employeeData, pqList, departmentData] = await Promise.all([
        getEmployeeById(id),
        getProfessionalQualifications({ employeeId: id }).catch((e) => {
          console.error("[EmployeesDetail] PQ error:", e?.response?.data || e);
          return [];
        }),
        getDepartments()  // Lấy thông tin phòng ban
      ]);

      if (!employeeData) throw new Error("Không tìm thấy nhân viên với ID: " + id);

      setEmployee(employeeData);
      setQualifications(Array.isArray(pqList) ? pqList : []);
      setDepartments(departmentData);  // Lưu phòng ban vào state
    } catch (err) {
      console.error("Lỗi khi lấy thông tin nhân viên:", err);
      setError(err.message || "Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.");
      setEmployee(null);
      setQualifications([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployeeAndDepartments();
  }, [fetchEmployeeAndDepartments]);

  const handleEditClick = () => setIsPopupVisible(true);
  const handlePopupClose = () => setIsPopupVisible(false);

  const handleSaved = async () => {
    setIsPopupVisible(false);
    await fetchEmployeeAndDepartments(); // Reload lại thông tin nhân viên và phòng ban
  };

  const handleDeleteClick = async () => {
    if (!employee?.id) return;

    const ok = window.confirm(
      `Bạn chắc chắn muốn xóa nhân viên ${employee.employeeCode} - ${employee.name}?\nHành động này sẽ xóa luôn account liên quan (nếu có).`
    );
    if (!ok) return;

    setDeleting(true);
    try {
      await deleteEmployee(employee.id);
      alert("Đã xóa nhân viên (và account liên quan nếu có).");
      navigate("/employees");
    } catch (e) {
      console.error("[EmployeesDetail] delete error:", e?.response?.data || e);
      alert(e?.response?.data?.message || "Xóa thất bại.");
    } finally {
      setDeleting(false);
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "N/A";
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Quay lại"
            >
              <span className="material-icons-outlined">arrow_back</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-600"
            >
              Sửa thông tin
            </button>

            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="bg-red-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? "Đang xóa..." : "Xóa nhân viên"}
            </button>
          </div>
        </div>

        <ProfileInfo
          employee={employee}
          departmentName={getDepartmentName(employee.departmentId)} // Hiển thị tên phòng ban
        />
        <EducationInfo employee={employee} qualifications={qualifications} />
        <SocialInfo employee={employee} />

        {isPopupVisible && (
          <EmployeesPopup
            onClose={handlePopupClose}
            employeeId={employee.id}
            onSaved={handleSaved}
          />
        )}
      </div>
    </main>
  );
}