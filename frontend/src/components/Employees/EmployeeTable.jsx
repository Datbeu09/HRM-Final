import React from "react";
import { useNavigate } from "react-router-dom";
import Action from "../common/Action";

const EmployeeTable = ({ employees, itemsPerPage = 5, onAdd }) => {
  const navigate = useNavigate();

  const emptyRows = Math.max(0, itemsPerPage - (employees?.length || 0));

  const contractLabel = (v) => {
    if (v === "Biên chế") return "Biên chế";
    if (v === "HĐLĐ") return "Hợp đồng";
    return v || "N/A";
  };

  const contractBadgeCls = (v) => {
    if (v === "Biên chế") return "bg-green-500";
    if (v === "HĐLĐ") return "bg-orange-500";
    return "bg-slate-400";
  };

  return (
    <div className="p-6 min-h-[340px]">
      <div className="flex justify-end mb-6">
        <Action
          onClick={onAdd}
          label={
            <div className="flex items-center gap-2">
              <span className="text-lg">＋</span>
              <span>Thêm nhân viên</span>
            </div>
          }
          className="
            flex items-center gap-2
            rounded-full
            bg-gradient-to-r from-primary to-indigo-600
            px-6 py-2.5
            text-sm font-semibold text-white
            shadow-md
            hover:shadow-xl hover:scale-105
            transition-all duration-200
            active:scale-95
          "
        />
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Mã NV</th>
            <th className="px-4 py-2 text-left">Họ và tên</th>
            <th className="px-4 py-2 text-left">Chức vụ</th>
            <th className="px-4 py-2 text-left">Phòng ban</th>
            <th className="px-4 py-2 text-left">Loại</th>
          </tr>
        </thead>

        <tbody>
          {(employees || []).map((emp) => (
            <tr
              key={emp.id}
              onClick={() => navigate(`/employees/${emp.id}`, { state: emp })}
              className="border-t h-14 cursor-pointer hover:bg-primary hover:text-white transition"
            >
              <td className="px-4 py-2">{emp.employeeCode}</td>
              <td className="px-4 py-2 font-medium">{emp.name || "Không có tên"}</td>
              <td className="px-4 py-2">{emp.position || "N/A"}</td>
              <td className="px-4 py-2">{emp.department || "N/A"}</td>
              <td className="px-4 py-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm ${contractBadgeCls(emp.contractType)}`}>
                  {contractLabel(emp.contractType)}
                </span>
              </td>
            </tr>
          ))}

          {Array.from({ length: emptyRows }).map((_, i) => (
            <tr key={`empty-${i}`} className="border-t h-14">
              <td colSpan={5}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
