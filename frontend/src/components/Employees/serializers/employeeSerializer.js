// serializers/employeeSerializer.js
import { normalizeDate, toDateInput } from "../helpers/date.js";
import {
  normalizeContractTypeLabel,
  mapGenderToBackend,
  mapGenderFromBackend,
} from "../helpers/employee";

export const serializeEmployeeToApi = (form) => {
  const contractType = normalizeContractTypeLabel(form.contractType);

  const payload = {
    employeeCode: (form.employeeCode || "").trim(),
    name: (form.name || "").trim(),
    title: form.title || "",
    position: form.jobTitle || "",

    // ✅ QUAN TRỌNG: dùng departmentId (backend)
    departmentId: form.departmentId || "",

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
    endDate: contractType === "Hợp đồng" ? normalizeDate(form.contractEnd) : null,
    workStatus: form.workStatus || "",

    familyInfo: 0,
    policyId: form.policyId ?? null,
  };

  // nếu lỡ form có email nhưng backend không nhận
  if ("email" in payload) delete payload.email;

  return payload;
};

export const normalizeEmployeeFromApi = (apiData, initialForm) => ({
  ...initialForm,
  id: apiData?.id ?? "",

  employeeCode: apiData?.employeeCode ?? "",
  name: apiData?.name ?? "",
  title: apiData?.title ?? "",
  jobTitle: apiData?.position ?? "",

  // ✅ map về departmentId để form dùng thống nhất
  departmentId: apiData?.departmentId ?? "",

  status: apiData?.status ?? "",
  workStatus: apiData?.workStatus ?? "Đang làm việc",
  contractType: normalizeContractTypeLabel(apiData?.contractType ?? ""),

  dob: toDateInput(apiData?.dob),
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