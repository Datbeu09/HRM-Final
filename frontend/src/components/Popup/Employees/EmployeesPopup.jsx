// src/components/Popup/Employees/EmployeesPopup.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getEmployeeById, addEmployee, updateEmployee } from "../../../api/employees.api";
import PersonalInfo from "./PersonalInfo";
import JobContractInfo from "./JobContractInfo";
import OtherInfo from "./OtherInfo";

// ---- date normalize: "dd/mm/yyyy" -> "yyyy-mm-dd"
const normalizeDate = (v) => {
  if (!v) return null;

  // already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // dd/mm/yyyy -> yyyy-mm-dd
  const m = String(v).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }

  // ISO / other strings: keep (backend Date.parse may accept)
  return v;
};

const toDateInput = (v) => {
  if (!v) return "";
  try {
    return new Date(v).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// FE (HOP_DONG/BIEN_CHE) -> BE (CONTRACT/PERMANENT)
const mapContractTypeToBackend = (v) => {
  if (v === "HOP_DONG") return "Hợp đồng";
  if (v === "BIEN_CHE") return "Biên chế";
  return v || "";
};

const mapContractTypeFromBackend = (v) => {
  if (v === "Hợp đồng") return "HOP_DONG";
  if (v === "Biên chế") return "BIEN_CHE";
  return v || "";
};  

// FE đang dùng MALE/FEMALE/OTHER thì gửi thẳng
const mapGenderToBackend = (v) => v || "";
const mapGenderFromBackend = (v) => v || "";

// ✅ Auto-generate employeeCode: NV### tăng dần
const generateNextEmployeeCode = (employees = []) => {
  const nums = (employees || [])
    .map((e) => e?.employeeCode)
    .filter((code) => /^NV\d+$/i.test(String(code || "")))
    .map((code) => Number(String(code).toUpperCase().replace("NV", "")))
    .filter((n) => Number.isFinite(n));

  const max = nums.length ? Math.max(...nums) : 0;
  const next = String(max + 1).padStart(3, "0");
  return `NV${next}`;
};

// ✅ build payload đúng field backend service (FIELDS)
const serializeEmployeeToApi = (form) => {
  const payload = {
    employeeCode: (form.employeeCode || "").trim(),
    name: (form.name || "").trim(),

    // đúng fields backend
    title: form.title || "",
    position: form.jobTitle || "",
    department: form.department || "",
    status: form.status || "",

    dob: normalizeDate(form.dob),
    gender: mapGenderToBackend(form.gender),

    address: form.address || "",
    phone: form.phone || "",

    // ❌ không gửi email (backend tự sync)
    // email: undefined,

    education: form.education || "",

    politicalStatus: form.politicalStatus || "",
    politicalPartyDate: normalizeDate(form.politicalPartyDate),

    youthUnionMember: form.partyMember ? 1 : 0,
    youthUnionDate: normalizeDate(form.partyJoinDate),

    policyStatus: form.policyStatus || "",
    contractType: mapContractTypeToBackend(form.contractType),

    startDate: normalizeDate(form.contractStart),
    endDate: normalizeDate(form.contractEnd),

    workStatus: form.workStatus || "",

    // ✅ bạn yêu cầu luôn = 0
    familyInfo: 0,

    // policyId: để null hoặc số > 0 (backend đã normalize)
    policyId: form.policyId ?? null,
  };

  // IMPORTANT: đảm bảo không lỡ gửi email
  if ("email" in payload) delete payload.email;

  console.log("[EmployeesPopup] payload submit =", payload);
  return payload;
};

const normalizeEmployeeFromApi = (apiData, initialForm) => ({
  ...initialForm,
  id: apiData?.id ?? "",

  employeeCode: apiData?.employeeCode ?? "",
  name: apiData?.name ?? "",

  title: apiData?.title ?? "",
  jobTitle: apiData?.position ?? "",
  department: apiData?.department ?? "",
  status: apiData?.status ?? "",

  workStatus: apiData?.workStatus ?? "Đang làm việc",
  contractType: mapContractTypeFromBackend(apiData?.contractType ?? ""),

  dob: toDateInput(apiData?.dob),
  gender: mapGenderFromBackend(apiData?.gender ?? ""),

  phone: apiData?.phone ?? "",
  email: apiData?.email ?? "", // chỉ để hiển thị (backend sync)
  address: apiData?.address ?? "",
  education: apiData?.education ?? "",

  politicalStatus: apiData?.politicalStatus ?? "",
  politicalPartyDate: toDateInput(apiData?.politicalPartyDate),

  partyMember: Number(apiData?.youthUnionMember) === 1,
  partyJoinDate: toDateInput(apiData?.youthUnionDate),

  contractStart: toDateInput(apiData?.startDate),
  contractEnd: toDateInput(apiData?.endDate),

  policyStatus: apiData?.policyStatus ?? "",
  policyId: apiData?.policyId ?? null,

  familyInfo: apiData?.familyInfo ?? 0,
});

export default function EmployeesPopup({
  onClose,
  employeeId,
  onSaved,
  employees = [], // ✅ truyền từ Employees.jsx
}) {
  const initialForm = useMemo(
    () => ({
      id: "",
      employeeCode: "",
      name: "",

      title: "",
      status: "",

      dob: "",
      gender: "",
      phone: "",
      email: "", // chỉ hiển thị thôi (không gửi)
      address: "",

      department: "",
      jobTitle: "",
      workStatus: "Đang làm việc",
      contractType: "",
      contractStart: "",
      contractEnd: "",

      education: "",
      politicalStatus: "",
      politicalPartyDate: "",

      partyMember: false,
      partyJoinDate: "",

      policyStatus: "",
      policyId: null,

      familyInfo: 0,
    }),
    []
  );

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auto-fill employeeCode khi ADD (không phải EDIT)
  useEffect(() => {
    if (!employeeId) {
      const nextCode = generateNextEmployeeCode(employees);
      setForm((prev) => ({
        ...prev,
        employeeCode: prev.employeeCode?.trim() ? prev.employeeCode : nextCode,
        familyInfo: 0,
      }));
    }
  }, [employeeId, employees]);

  // ✅ Load data khi EDIT
  useEffect(() => {
    const run = async () => {
      if (!employeeId) {
        // Add mode -> reset nhưng vẫn giữ employeeCode auto
        setForm((prev) => ({
          ...initialForm,
          employeeCode: prev.employeeCode || generateNextEmployeeCode(employees),
          familyInfo: 0,
        }));
        return;
      }

      setLoading(true);
      setError("");
      try {
        const apiData = await getEmployeeById(employeeId);
        setForm(normalizeEmployeeFromApi(apiData, initialForm));
      } catch (e) {
        console.error("[EmployeesPopup] getEmployeeById error:", e?.response?.data || e);
        setError(e?.response?.data?.message || "Không tải được dữ liệu nhân viên.");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, initialForm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCancel = () => {
    setError("");
    setForm((prev) => ({
      ...initialForm,
      // giữ mã auto khi cancel add
      employeeCode: employeeId ? "" : prev.employeeCode || generateNextEmployeeCode(employees),
      familyInfo: 0,
    }));
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.employeeCode?.trim()) return setError("Vui lòng nhập Mã nhân viên.");
    if (!form.name?.trim()) return setError("Vui lòng nhập Họ tên.");

    setLoading(true);
    try {
      const payload = serializeEmployeeToApi(form);

      if (employeeId) {
        await updateEmployee(employeeId, payload);
      } else {
        await addEmployee(payload);
      }

      onSaved?.();
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      console.error("[EmployeesPopup] submit status:", status);
      console.error("[EmployeesPopup] submit data:", data);

      const msg =
        data?.message ||
        data?.error ||
        (status === 403 ? "Bạn không có quyền employees:create/update." : "") ||
        "Something went wrong";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={handleCancel} />

      <div className="relative w-full max-w-5xl p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold text-center mb-6">
          {employeeId ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* PersonalInfo: nếu bạn muốn khóa mã nhân viên khi edit thì xử lý ở component */}
          <PersonalInfo form={form} handleChange={handleChange} isEdit={!!employeeId} />
          <JobContractInfo form={form} handleChange={handleChange} />
          <OtherInfo form={form} handleChange={handleChange} />

          {error && <div className="text-red-500 text-sm mt-3">{error}</div>}

          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
