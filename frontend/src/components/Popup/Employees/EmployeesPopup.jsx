import React from "react";
import PersonalInfo from "./PersonalInfo";
import JobContractInfo from "./JobContractInfo";
import OtherInfo from "./OtherInfo";
import { useEmployeesPopup } from "../../Employees/hooks/useEmployeesPopup";

export default function EmployeesPopup({
  onClose,
  employeeId,
  onSaved,
  employees: employeesProp = [],
}) {
  const {
    isEdit,
    form,
    departments,
    options,
    loadingInit,
    saving,
    error,
    disabledAll,
    handleChange,
    handleCancel,
    handleSubmit,
  } = useEmployeesPopup({
    employeeId,
    employeesProp,
    onSaved,
    onClose,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={handleCancel} />
      <div className="relative w-full max-w-5xl p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold text-center mb-6">
          {isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </h2>

        {(loadingInit || saving) && (
          <div className="mb-4 text-sm text-slate-500 text-center">
            {loadingInit ? "Đang tải dữ liệu..." : "Đang lưu..."}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset disabled={disabledAll} className="disabled:opacity-80">
            <PersonalInfo form={form} handleChange={handleChange} isEdit={isEdit} />

            <JobContractInfo
              form={form}
              handleChange={handleChange}
              isEdit={isEdit}
              options={options}
              departments={departments}
            />

            <OtherInfo form={form} handleChange={handleChange} isEdit={isEdit} options={options} />
          </fieldset>

          {error && <div className="text-red-500 text-sm mt-3">{error}</div>}

          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={disabledAll}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}