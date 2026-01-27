import React from "react";
import { DisplayValue } from "../common/displayValue";


export default function InsuranceRow({ employee }) {
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="px-6 py-4 font-bold">
        {DisplayValue(employee.employeeCode)}
      </td>

      <td className="px-6 py-4 font-semibold">
        {DisplayValue(employee.name)}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
          {DisplayValue(employee.policyStatus)}
        </span>
      </td>

      <td className="px-6 py-4 font-semibold">
        {DisplayValue(employee.insuranceRate)}
      </td>

      <td className="px-6 py-4 text-textMuted">
        {DisplayValue(employee.startDate)}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
          {DisplayValue(employee.workStatus)}
        </span>
      </td>
    </tr>
  );
}
