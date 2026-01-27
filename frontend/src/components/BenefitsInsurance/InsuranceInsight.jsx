import React from "react";

export default function InsuranceInsight({ total }) {
  const items = [
    ["health_and_safety", "BHXH đang tham gia", total],
    ["card_giftcard", "Phúc lợi tháng này", "NN"],
    ["request_quote", "Tổng chi trả", "NN"],
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map(([icon, label, value]) => (
        <div
          key={label}
          className="bg-white rounded-2xl border shadow-sm p-6 flex gap-5"
        >
          <div className="size-14 rounded-full bg-primarySoft text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              {icon}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-textMuted uppercase">
              {label}
            </p>
            <p className="text-2xl font-black">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
