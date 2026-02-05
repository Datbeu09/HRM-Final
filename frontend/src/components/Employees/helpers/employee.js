// helpers/employee.js
export const normalizeContractTypeLabel = (v) => {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "";
  if (s === "hop_dong" || s.includes("hợp đồng")) return "Hợp đồng";
  if (s === "bien_che" || s.includes("biên chế")) return "Biên chế";
  return String(v || "").trim();
};

export const mapGenderToBackend = (v) => v || "";
export const mapGenderFromBackend = (v) => v || "";

// frontend auto fill only
export const generateNextEmployeeCode = (employees = []) => {
  const nums = (employees || [])
    .map((e) => e?.employeeCode)
    .filter((code) => /^NV\d+$/i.test(String(code || "")))
    .map((code) => Number(String(code).toUpperCase().replace("NV", "")))
    .filter((n) => Number.isFinite(n));

  const max = nums.length ? Math.max(...nums) : 0;
  const next = String(max + 1).padStart(3, "0");
  return `NV${next}`;
};