// src/components/Popup/Employees/EmployeesPopup.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getEmployeeById,
  addEmployee,
  updateEmployee,
  getEmployees,
} from "../../../api/employees.api";

import {
  getProfessionalQualifications,
  createProfessionalQualification,
  updateProfessionalQualification,
} from "../../../api/professionalQualifications.api";

import PersonalInfo from "./PersonalInfo";
import JobContractInfo from "./JobContractInfo";
import OtherInfo from "./OtherInfo";

// ================= DATE HELPERS (FIX DOB -1 day) =================
// YYYY-MM-DD -> keep string (no Date() parse)
const isYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());

// dd/mm/yyyy -> yyyy-mm-dd
const normalizeDate = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (isYmd(s)) return s;

  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }
  return s;
};

// Convert API date/datetime -> input[type=date] value (YYYY-MM-DD)
// - If already YYYY-MM-DD => use directly (NO timezone shift)
// - If ISO datetime => parse and take LOCAL date parts
const toDateInput = (v) => {
  if (!v) return "";
  const s = String(v).trim();

  if (isYmd(s)) return s;

  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // fallback: try extract YYYY-MM-DD prefix
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];

  return "";
};

// ================= CONTRACT TYPE =================
const normalizeContractTypeLabel = (v) => {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "";
  if (s === "hop_dong" || s.includes("hợp đồng")) return "Hợp đồng";
  if (s === "bien_che" || s.includes("biên chế")) return "Biên chế";
  return String(v || "").trim();
};

const mapGenderToBackend = (v) => v || "";
const mapGenderFromBackend = (v) => v || "";

// ================= EMPLOYEE CODE (frontend auto fill only) =================
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

// ================= SERIALIZE EMPLOYEE =================
const serializeEmployeeToApi = (form) => {
  const contractType = normalizeContractTypeLabel(form.contractType);

  const payload = {
    employeeCode: (form.employeeCode || "").trim(),
    name: (form.name || "").trim(),
    title: form.title || "",
    position: form.jobTitle || "",
    department: form.department || "",
    status: form.status || "",

    dob: normalizeDate(form.dob),
    gender: mapGenderToBackend(form.gender),

    address: form.address || "",
    phone: form.phone || "",

    education: form.education || "",

    politicalStatus: form.politicalStatus || "",
    politicalPartyDate: normalizeDate(form.politicalPartyDate),

    youthUnionMember: form.partyMember ? 1 : 0,
    youthUnionDate: normalizeDate(form.partyJoinDate),

    policyStatus: form.policyStatus || "",
    contractType,

    startDate: normalizeDate(form.contractStart),

    // ✅ chỉ gửi endDate nếu Hợp đồng, còn lại null
    endDate: contractType === "Hợp đồng" ? normalizeDate(form.contractEnd) : null,

    workStatus: form.workStatus || "",

    familyInfo: 0,
    policyId: form.policyId ?? null,

    // ✅ quan trọng: nếu backend tạo account mặc định, FE không cần gửi createAccount
    // createAccount: false, // nếu muốn tắt tạo account tự động thì bật dòng này
  };

  // không gửi email (vì backend bạn không sync nữa)
  if ("email" in payload) delete payload.email;

  return payload;
};

// ================= SERIALIZE PQ (FIX degree required) =================
// Backend validateCreate bắt buộc: degree, fieldOfStudy, educationLevel, institution, graduationYear
const serializePQToApi = (form, employeeId) => {
  const degree = (form.degree || "").trim();
  const educationLevel = (form.educationLevel || "").trim();
  const fieldOfStudy = (form.fieldOfStudy || "").trim();
  const institution = (form.institution || "").trim();
  const graduationYear = String(form.graduationYear || "").trim();
  const foreignLanguageProficiency = (form.foreignLanguageProficiency || "").trim();

  // ✅ Nếu user chưa nhập gì ở phần học vấn => không tạo PQ
  const userTouched =
    degree ||
    educationLevel ||
    fieldOfStudy ||
    institution ||
    graduationYear ||
    foreignLanguageProficiency;

  if (!userTouched) return null;

  // ✅ FIX: user chỉ chọn "Trình độ" (educationLevel) nhưng không có "degree"
  // => lấy educationLevel làm degree để pass validate
  const finalDegree = degree || educationLevel;

  // ✅ Nếu user có nhập nhưng thiếu field bắt buộc => return special object để báo lỗi UI
  const missing = [];
  if (!finalDegree) missing.push("Bằng cấp/Trình độ (degree)");
  if (!fieldOfStudy) missing.push("Chuyên ngành (fieldOfStudy)");
  if (!educationLevel) missing.push("Trình độ (educationLevel)");
  if (!institution) missing.push("Trường (institution)");
  if (!graduationYear) missing.push("Năm tốt nghiệp (graduationYear)");

  if (missing.length) {
    return { __invalid: true, __missing: missing };
  }

  return {
    employeeId,
    degree: finalDegree, // ✅ đảm bảo không rỗng
    fieldOfStudy,
    educationLevel,
    institution,
    graduationYear: Number(graduationYear),
    foreignLanguageProficiency: foreignLanguageProficiency || null,
  };
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
  contractType: normalizeContractTypeLabel(apiData?.contractType ?? ""),

  dob: toDateInput(apiData?.dob), // ✅ FIX -1 day
  gender: mapGenderFromBackend(apiData?.gender ?? ""),

  phone: apiData?.phone ?? "",
  email: apiData?.email ?? "",
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

const normalizePQToForm = (pq = {}, baseForm) => ({
  ...baseForm,
  pqId: pq?.id ?? "",
  // ✅ map lại: degree/educationLevel về form
  degree: pq?.degree ?? "",
  fieldOfStudy: pq?.fieldOfStudy ?? "",
  educationLevel: pq?.educationLevel ?? "",
  institution: pq?.institution ?? "",
  graduationYear: pq?.graduationYear ?? "",
  foreignLanguageProficiency: pq?.foreignLanguageProficiency ?? "",
  pqCreatedAt: pq?.createdAt ?? pq?.created_at ?? null,
  pqUpdatedAt: pq?.updatedAt ?? pq?.updated_at ?? null,
});

export default function EmployeesPopup({
  onClose,
  employeeId,
  onSaved,
  employees: employeesProp = [],
}) {
  const isEdit = !!employeeId;

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
      email: "",
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

      // ✅ PQ fields
      pqId: "",
      degree: "",
      fieldOfStudy: "",
      educationLevel: "",
      institution: "",
      graduationYear: "",
      foreignLanguageProficiency: "",
      pqCreatedAt: null,
      pqUpdatedAt: null,
    }),
    []
  );

  const [form, setForm] = useState(initialForm);

  // mượt: tách loading
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // options
  const [employeesForOptions, setEmployeesForOptions] = useState(employeesProp);
  const hasFetchedOptionsRef = useRef(false);

  useEffect(() => {
    if (employeesProp?.length) setEmployeesForOptions(employeesProp);
  }, [employeesProp]);

  useEffect(() => {
    const run = async () => {
      if (employeesProp?.length) return;
      if (hasFetchedOptionsRef.current) return;
      hasFetchedOptionsRef.current = true;

      try {
        const list = await getEmployees();
        setEmployeesForOptions(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("[EmployeesPopup] getEmployees options error:", e?.response?.data || e);
        setEmployeesForOptions([]);
      }
    };
    run();
  }, [employeesProp]);

  const options = useMemo(() => {
    const uniq = (arr) =>
      Array.from(new Set((arr || []).map((x) => String(x || "").trim()).filter(Boolean)));

    const rawDepartments = uniq(employeesForOptions.map((e) => e?.department));
    const rawPositions = uniq(employeesForOptions.map((e) => e?.position));
    const rawContractTypes = uniq(employeesForOptions.map((e) => e?.contractType)).map(
      normalizeContractTypeLabel
    );

    return {
      departments: uniq(rawDepartments),
      positions: uniq(rawPositions),
      contractTypes: uniq(rawContractTypes),
    };
  }, [employeesForOptions]);

  // Auto-fill employeeCode when ADD
  useEffect(() => {
    if (isEdit) return;
    setForm((prev) => {
      const code = prev.employeeCode?.trim()
        ? prev.employeeCode
        : generateNextEmployeeCode(employeesForOptions);
      return { ...prev, employeeCode: code, familyInfo: 0 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, employeesForOptions]);

  // Change contract type => clear end date if not contract
  useEffect(() => {
    const ct = normalizeContractTypeLabel(form.contractType);
    if (ct && ct !== "Hợp đồng" && form.contractEnd) {
      setForm((prev) => ({ ...prev, contractEnd: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.contractType]);

  // Load edit data (DO NOT depend on employeesForOptions)
  useEffect(() => {
    const run = async () => {
      if (!isEdit) {
        setForm((prev) => ({
          ...initialForm,
          employeeCode: prev.employeeCode || generateNextEmployeeCode(employeesForOptions),
          familyInfo: 0,
        }));
        return;
      }

      setLoadingInit(true);
      setError("");
      try {
        const [emp, pqList] = await Promise.all([
          getEmployeeById(employeeId),
          getProfessionalQualifications({ employeeId }).catch(() => []),
        ]);

        const base = normalizeEmployeeFromApi(emp, initialForm);
        const pq = Array.isArray(pqList) && pqList.length ? pqList[0] : null;

        setForm(pq ? normalizePQToForm(pq, base) : base);
      } catch (e) {
        console.error("[EmployeesPopup] load edit error:", e?.response?.data || e);
        setError(e?.response?.data?.message || "Không tải được dữ liệu nhân viên.");
      } finally {
        setLoadingInit(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, employeeId, initialForm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCancel = () => {
    setError("");
    setForm((prev) => ({
      ...initialForm,
      employeeCode: isEdit ? "" : prev.employeeCode || generateNextEmployeeCode(employeesForOptions),
      familyInfo: 0,
    }));
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.employeeCode?.trim()) return setError("Vui lòng nhập Mã nhân viên.");
    if (!form.name?.trim()) return setError("Vui lòng nhập Họ tên.");

    setSaving(true);
    try {
      // 1) upsert employee
      const empPayload = serializeEmployeeToApi(form);

      let savedEmp;
      if (isEdit) {
        savedEmp = await updateEmployee(employeeId, empPayload);
      } else {
        savedEmp = await addEmployee(empPayload);
      }

      const savedEmployeeId = savedEmp?.id || employeeId;

      // 2) upsert PQ (only if user touched + valid)
      const pqPayload = serializePQToApi(form, savedEmployeeId);

      if (pqPayload?.__invalid) {
        setError(`Học vấn thiếu: ${pqPayload.__missing.join(", ")}`);
        return;
      }

      if (pqPayload) {
        if (form.pqId) {
          await updateProfessionalQualification(form.pqId, pqPayload);
        } else {
          await createProfessionalQualification(pqPayload);
        }
      }

      onSaved?.();
    } catch (e2) {
      console.error("[EmployeesPopup] submit error:", e2?.response?.data || e2);

      // show friendly messages
      const msg = e2?.response?.data?.message || e2?.message || "Something went wrong";
      if (String(msg).includes("employeeCode already exists")) {
        setError("Mã nhân viên đã tồn tại. Hãy thử lại (hoặc refresh danh sách).");
      } else {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const disabledAll = loadingInit || saving;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={handleCancel} />

      <div className="relative w-full max-w-5xl p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold text-center mb-6">
          {isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </h2>

        {(loadingInit || saving) && (
          <div className="mb-4 text-sm text-slate-500 text-center">
            {loadingInit ? "Đang tải dữ liệu..." : "Đang lưu..."}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset disabled={disabledAll} className="disabled:opacity-80">
            <PersonalInfo form={form} handleChange={handleChange} isEdit={isEdit} />
            <JobContractInfo
              form={form}
              handleChange={handleChange}
              isEdit={isEdit}
              options={options}
            />
            <OtherInfo form={form} handleChange={handleChange} isEdit={isEdit} options={options} />
          </fieldset>

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
              disabled={disabledAll}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
