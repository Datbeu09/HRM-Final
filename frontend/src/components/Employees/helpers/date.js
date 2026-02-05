// helpers/date.js
export const isYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());

// dd/mm/yyyy -> yyyy-mm-dd
export const normalizeDate = (v) => {
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

// API date/datetime -> input[type=date] (YYYY-MM-DD)
export const toDateInput = (v) => {
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

  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];

  return "";
};