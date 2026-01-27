// src/api/employees.api.js
import axiosClient from "./axiosClient";

const EMP_FIELDS = [
  "employeeCode",
  "name",
  "title",
  "position",
  "department",
  "status",
  "dob",
  "gender",
  "address",
  "phone",
  "email",
  "education",
  "politicalStatus",
  "politicalPartyDate",
  "youthUnionMember",
  "youthUnionDate",
  "policyStatus",
  "contractType",
  "startDate",
  "endDate",
  "workStatus",
  "familyInfo",
  "policyId",
];

const pickEmployeePayload = (obj = {}) => {
  const out = {};
  for (const k of EMP_FIELDS) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
};

const normalizeEmployee = (e = {}) => ({
  id: e.id,
  employeeCode: e.employeeCode,
  name: e.name,
  title: e.title,
  position: e.position,
  department: e.department,
  status: e.status,
  dob: e.dob,
  gender: e.gender,
  address: e.address,
  phone: e.phone,
  email: e.email,
  education: e.education,
  politicalStatus: e.politicalStatus,
  politicalPartyDate: e.politicalPartyDate,
  youthUnionMember: e.youthUnionMember,
  youthUnionDate: e.youthUnionDate,
  policyStatus: e.policyStatus,
  contractType: e.contractType,
  startDate: e.startDate,
  endDate: e.endDate,
  workStatus: e.workStatus,
  familyInfo: e.familyInfo,
  policyId: e.policyId,
  createdAt: e.createdAt ?? e.created_at ?? null,
  updatedAt: e.updatedAt ?? e.updated_at ?? null,
});

// helper: chịu cả 2 kiểu axiosClient
const unwrap = (res) => {
  // res có thể là: {data: {...}} hoặc {...} luôn
  const root = res?.data ?? res;
  return root;
};

export const getEmployees = async () => {
  const res = await axiosClient.get("/employees");
  const root = unwrap(res);

  const raw = Array.isArray(root?.data) ? root.data : Array.isArray(root) ? root : [];
  return raw.map(normalizeEmployee);
};

export const getEmployeeById = async (id) => {
  const res = await axiosClient.get(`/employees/${id}`);
  const root = unwrap(res);

  const raw = root?.data ?? root ?? {};
  return normalizeEmployee(raw);
};

export const addEmployee = async (employeeData) => {
  try {
    const payload = pickEmployeePayload(employeeData);
    const res = await axiosClient.post("/employees", payload);
    const root = unwrap(res);
    return normalizeEmployee(root?.data || root);
  } catch (error) {
    console.error("[addEmployee] status =", error?.response?.status);
    console.error("[addEmployee] data =", error?.response?.data);
    console.error("[addEmployee] message =", error?.message);
    throw error;
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const payload = pickEmployeePayload(employeeData);
    const res = await axiosClient.put(`/employees/${employeeId}`, payload);
    const root = unwrap(res);
    return normalizeEmployee(root?.data || root);
  } catch (error) {
    console.error("[updateEmployee] status =", error?.response?.status);
    console.error("[updateEmployee] data =", error?.response?.data);
    console.error("[updateEmployee] message =", error?.message);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const res = await axiosClient.delete(`/employees/${employeeId}`);
    return unwrap(res);
  } catch (error) {
    console.error("[deleteEmployee] status =", error?.response?.status);
    console.error("[deleteEmployee] data =", error?.response?.data);
    console.error("[deleteEmployee] message =", error?.message);
    throw error;
  }
};
