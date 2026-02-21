import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function PayrollConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  totalAmount = 0,
  loading = false,
  monthLabel = "",
  departmentLabel = "",
  isApproved = false,

  // ✅ NEW
  defaultEmail = "",
}) {
  const sigCanvas = useRef(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [toEmail, setToEmail] = useState(defaultEmail || "");

  useEffect(() => {
    if (isOpen) {
      setHasSigned(false);
      setToEmail(defaultEmail || "");
      if (sigCanvas.current) sigCanvas.current.clear();
    }
  }, [isOpen, defaultEmail]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (!sigCanvas.current) return;
    sigCanvas.current.clear();
    setHasSigned(false);
  };

  const handleEnd = () => {
    if (!sigCanvas.current) return;
    if (!sigCanvas.current.isEmpty()) setHasSigned(true);
  };

  const handleConfirm = () => {
    if (isApproved) {
      onClose?.();
      return;
    }

    const email = String(toEmail || "").trim();
    if (!email) {
      alert("Vui lòng nhập email để nhận file Excel.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Email không hợp lệ.");
      return;
    }

    if (!hasSigned) {
      alert("Vui lòng ký tên trước khi xác nhận.");
      return;
    }

    onConfirm?.({ toEmail: email });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Xác nhận bảng lương</h2>
            <p className="text-sm text-slate-500 mt-1">
              {monthLabel
                ? `Kỳ lương: ${monthLabel}`
                : "Kiểm tra thông tin và ký tên để hoàn tất."}
              {departmentLabel ? ` • ${departmentLabel}` : ""}
            </p>

            {isApproved ? (
              <p className="text-xs mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                ✔ Bảng lương đã được duyệt (locked)
              </p>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-4 space-y-6">
          <div className="bg-slate-50 rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-bold">
                Tổng lương chi trả
              </p>
              <p className="text-3xl font-bold mt-1">
                {Number(totalAmount).toLocaleString("vi-VN")}{" "}
                <span className="text-sm">VNĐ</span>
              </p>
            </div>

            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-600 text-xl">
              💰
            </div>
          </div>

          {/* ✅ NEW: email nhận file */}
          <div>
            <label className="text-sm font-semibold">Email nhận file Excel</label>
            <input
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              disabled={isApproved}
              placeholder="vd: ketoan@congty.com"
              className="mt-2 w-full h-11 px-4 rounded-xl border outline-none text-sm disabled:opacity-60"
            />
            <p className="text-[11px] text-slate-400 italic mt-2">
              Sau khi chốt, hệ thống sẽ gửi file Excel qua email này.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold">Ký tên xác nhận</label>

              <button
                onClick={handleClear}
                disabled={isApproved}
                className="text-xs text-teal-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xóa chữ ký
              </button>
            </div>

            <div className="border-2 border-dashed rounded-xl p-2">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  className:
                    "w-full h-48 rounded-xl bg-white " +
                    (isApproved ? "opacity-60 pointer-events-none" : ""),
                }}
                onEnd={handleEnd}
              />
            </div>

            <p className="text-[11px] text-slate-400 italic mt-2">
              Bằng cách ký tên, bạn xác nhận duyệt và khóa bảng lương kỳ này.
            </p>
          </div>
        </div>

        <div className="p-8 border-t flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-xl font-semibold hover:bg-slate-100"
          >
            Đóng
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading || isApproved}
            className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isApproved ? "Đã duyệt" : loading ? "Đang xử lý..." : "Xác nhận & Khóa"}
          </button>
        </div>
      </div>
    </div>
  );
}