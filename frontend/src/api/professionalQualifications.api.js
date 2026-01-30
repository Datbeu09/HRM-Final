// src/api/professionalQualifications.api.js
import axiosClient from "./axiosClient";

const PQ_FIELDS = [
  "id",
  "employeeId",
  "degree",
  "fieldOfStudy",
  "educationLevel",
  "institution",
  "graduationYear",
  "foreignLanguageProficiency",
  "created_at",
  "updated_at",
];

const normalizePQ = (r = {}) => ({
  id: r.id,
  employeeId: r.employeeId,
  degree: r.degree,
  fieldOfStudy: r.fieldOfStudy,
  educationLevel: r.educationLevel,
  institution: r.institution,
  graduationYear: r.graduationYear,
  foreignLanguageProficiency: r.foreignLanguageProficiency ?? null,
  createdAt: r.createdAt ?? r.created_at ?? null,
  updatedAt: r.updatedAt ?? r.updated_at ?? null,
});

const unwrap = (res) => res?.data ?? res;

export const getProfessionalQualifications = async ({ employeeId } = {}) => {
  const res = await axiosClient.get("/professional-qualifications", {
    params: employeeId ? { employeeId } : undefined,
  });
  const root = unwrap(res);

  const raw = Array.isArray(root?.data) ? root.data : Array.isArray(root) ? root : [];
  return raw.map(normalizePQ);
};

// (optional) nếu sau này bạn cần CRUD:
export const createProfessionalQualification = async (payload = {}) => {
  const res = await axiosClient.post("/professional-qualifications", payload);
  const root = unwrap(res);
  return normalizePQ(root?.data || root);
};

export const updateProfessionalQualification = async (id, payload = {}) => {
  const res = await axiosClient.put(`/professional-qualifications/${id}`, payload);
  const root = unwrap(res);
  return normalizePQ(root?.data || root);
};

export const deleteProfessionalQualification = async (id) => {
  const res = await axiosClient.delete(`/professional-qualifications/${id}`);
  return unwrap(res);
};
