// hooks/useEmployeesPopup.js
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getEmployeeById,
  addEmployee,
  updateEmployee,
  getEmployees,
} from "../../../api/employees.api";
import { getDepartments } from "../../../api/departments.api";

import {
  getProfessionalQualifications,
  createProfessionalQualification,
  updateProfessionalQualification,
} from "../../../api/professionalQualifications.api";

import { generateNextEmployeeCode, normalizeContractTypeLabel } from "../helpers/employee";
import { serializeEmployeeToApi, normalizeEmployeeFromApi } from "../serializers/employeeSerializer";
import { serializePQToApi, normalizePQToForm } from "../serializers/pqSerializer";

export const useEmployeesPopup = ({ employeeId, employeesProp = [], onSaved, onClose }) => {
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

      // ✅ dùng departmentId thống nhất
      departmentId: "",

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

  const [departments, setDepartments] = useState([]);
  const [employeesForOptions, setEmployeesForOptions] = useState(employeesProp);

  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasFetchedOptionsRef = useRef(false);

  // ✅ fetch departments
  useEffect(() => {
    const run = async () => {
      try {
        const departmentList = await getDepartments();
        setDepartments(Array.isArray(departmentList) ? departmentList : []);
      } catch (e) {
        console.error("[EmployeesPopup] Error fetching departments", e);
        setDepartments([]);
      }
    };
    run();
  }, []);

  // employees options (dùng để generate code / options)
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

  // options (nếu bạn vẫn cần positions/contractTypes)
  const options = useMemo(() => {
    const uniq = (arr) =>
      Array.from(new Set((arr || []).map((x) => String(x || "").trim()).filter(Boolean)));

    const rawPositions = uniq(employeesForOptions.map((e) => e?.position));
    const rawContractTypes = uniq(employeesForOptions.map((e) => e?.contractType)).map(
      normalizeContractTypeLabel
    );

    return {
      positions: uniq(rawPositions),
      contractTypes: uniq(rawContractTypes),
    };
  }, [employeesForOptions]);

  // auto fill code khi add mới
  useEffect(() => {
    if (isEdit) return;
    setForm((prev) => {
      const code = prev.employeeCode?.trim()
        ? prev.employeeCode
        : generateNextEmployeeCode(employeesForOptions);
      return { ...prev, employeeCode: code, familyInfo: 0 };
    });
  }, [isEdit, employeesForOptions]);

  // clear contractEnd nếu không phải hợp đồng
  useEffect(() => {
    const ct = normalizeContractTypeLabel(form.contractType);
    if (ct && ct !== "Hợp đồng" && form.contractEnd) {
      setForm((prev) => ({ ...prev, contractEnd: "" }));
    }
  }, [form.contractType, form.contractEnd]);

  // load data khi edit
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
  }, [isEdit, employeeId, initialForm, employeesForOptions]);

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

    // ✅ validate theo departmentId (đúng backend)
    if (!form.departmentId) return setError("Vui lòng chọn phòng ban.");

    setSaving(true);
    try {
      const empPayload = serializeEmployeeToApi(form);

      let savedEmp;
      if (isEdit) savedEmp = await updateEmployee(employeeId, empPayload);
      else savedEmp = await addEmployee(empPayload);

      const savedEmployeeId = savedEmp?.id || employeeId;

      const pqPayload = serializePQToApi(form, savedEmployeeId);
      if (pqPayload?.__invalid) {
        setError(`Học vấn thiếu: ${pqPayload.__missing.join(", ")}`);
        return;
      }

      if (pqPayload) {
        if (form.pqId) await updateProfessionalQualification(form.pqId, pqPayload);
        else await createProfessionalQualification(pqPayload);
      }

      onSaved?.();
    } catch (e2) {
      console.error("[EmployeesPopup] submit error:", e2?.response?.data || e2);
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

  return {
    isEdit,
    form,
    setForm,
    initialForm,
    departments,
    options,
    loadingInit,
    saving,
    error,
    disabledAll: loadingInit || saving,
    handleChange,
    handleCancel,
    handleSubmit,
  };
};