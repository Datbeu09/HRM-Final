import React, { useState, useMemo } from "react";

const FilterBar = ({ onSearch, onReset }) => {
  const [name, setName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [department, setDepartment] = useState("Tất cả phòng ban");
  const [position, setPosition] = useState("Tất cả vị trí");
  const [contractType, setContractType] = useState("Tất cả loại HĐ");

  const deptOptions = useMemo(
    () => ["Tất cả phòng ban", "Công nghệ thông tin", "Ban giám đốc", "Nhân sự", "Kế toán", "Marketing"],
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      name,
      employeeCode,
      department,
      position,
      contractType,
    });
  };

  const handleReset = () => {
    setName("");
    setEmployeeCode("");
    setDepartment("Tất cả phòng ban");
    setPosition("Tất cả vị trí");
    setContractType("Tất cả loại HĐ");
    if (onReset) onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Họ và tên</label>
          <input
            type="text"
            placeholder="Nhập họ tên..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Mã nhân viên</label>
          <input
            type="text"
            placeholder="Nhập mã nhân viên..."
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Phòng ban</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
          >
            {deptOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Vị trí (position)</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
          >
            <option value="Tất cả vị trí">Tất cả vị trí</option>
            <option value="ADMIN">ADMIN</option>
            <option value="DIRECTOR">DIRECTOR</option>
            <option value="HR">HR</option>
            <option value="ACCOUNTANT">ACCOUNTANT</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Loại HĐ (contractType)</label>
          <select
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
          >
            <option value="Tất cả loại HĐ">Tất cả loại HĐ</option>
            <option value="Hợp đồng">Hợp đồng</option>
            <option value="Biên chế">Biên chế</option>
          </select>
        </div>

      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-100 transition"
        >
          Làm mới
        </button>

        <button
          type="submit"
          className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary-dark shadow-lg transition"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default FilterBar;