export const DisplayValue = (value) =>
  value === null || value === undefined || value === ""
    ? "Null"
    : value;
