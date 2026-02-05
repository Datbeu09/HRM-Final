import React from "react";

export default function Legend() {
  const Item = ({ color, label }) => (
    <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );

  return (
    <div className="flex items-center gap-4">
      <Item color="bg-teal-500" label="Có công" />
      <Item color="bg-rose-500" label="Không công" />
      <Item color="bg-amber-500" label="Nghỉ phép" />
    </div>
  );
}