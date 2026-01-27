import React from "react";

export default function EmployeeInfo({ employee }) {
  if (!employee) return null;

  // fallback fields (vì backend bạn lúc trước có lúc trả name/fullName, position/jobTitle)
  const name = employee.name || employee.fullName || "N/A";
  const department = employee.department || "N/A";
  const employeeCode = employee.employeeCode || employee.code || "N/A";
  const position = employee.position || employee.jobTitle || "N/A";
  const title = employee.title || "";
  const workStatus = employee.workStatus || employee.status || "N/A";

  const avatarSeed = (employee.id ?? 0) + 10;

  return (
    <div className="bg-primarySoft rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full bg-gray-200 bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${avatarSeed}')` }}
        />
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{name}</p>

          <p className="text-textMuted text-xs truncate">
            {department} • {employeeCode}
          </p>

          <p className="text-textMuted text-xs truncate">
            {position}{title ? ` - ${title}` : ""}
          </p>

          <p className="text-textMuted text-xs">Trạng thái: {workStatus}</p>
        </div>
      </div>
    </div>
  );
}
