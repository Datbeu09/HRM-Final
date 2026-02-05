// serializers/pqSerializer.js
export const serializePQToApi = (form, employeeId) => {
  const degree = (form.degree || "").trim();
  const educationLevel = (form.educationLevel || "").trim();
  const fieldOfStudy = (form.fieldOfStudy || "").trim();
  const institution = (form.institution || "").trim();
  const graduationYear = String(form.graduationYear || "").trim();
  const foreignLanguageProficiency = (form.foreignLanguageProficiency || "").trim();

  const userTouched =
    degree ||
    educationLevel ||
    fieldOfStudy ||
    institution ||
    graduationYear ||
    foreignLanguageProficiency;

  if (!userTouched) return null;

  const finalDegree = degree || educationLevel;

  const missing = [];
  if (!finalDegree) missing.push("Bằng cấp/Trình độ (degree)");
  if (!fieldOfStudy) missing.push("Chuyên ngành (fieldOfStudy)");
  if (!educationLevel) missing.push("Trình độ (educationLevel)");
  if (!institution) missing.push("Trường (institution)");
  if (!graduationYear) missing.push("Năm tốt nghiệp (graduationYear)");

  if (missing.length) return { __invalid: true, __missing: missing };

  return {
    employeeId,
    degree: finalDegree,
    fieldOfStudy,
    educationLevel,
    institution,
    graduationYear: Number(graduationYear),
    foreignLanguageProficiency: foreignLanguageProficiency || null,
  };
};

export const normalizePQToForm = (pq = {}, baseForm) => ({
  ...baseForm,
  pqId: pq?.id ?? "",
  degree: pq?.degree ?? "",
  fieldOfStudy: pq?.fieldOfStudy ?? "",
  educationLevel: pq?.educationLevel ?? "",
  institution: pq?.institution ?? "",
  graduationYear: pq?.graduationYear ?? "",
  foreignLanguageProficiency: pq?.foreignLanguageProficiency ?? "",
  pqCreatedAt: pq?.createdAt ?? pq?.created_at ?? null,
  pqUpdatedAt: pq?.updatedAt ?? pq?.updated_at ?? null,
});