import React from 'react';

export default function Action({ icon, label, onClick  }) {
  return (
    <button className="flex items-center justify-center gap-2 p-4 border rounded-lg bg-white hover:bg-primarySoft transition" onClick={onClick}>
      <span className="material-symbols-outlined text-primary">
        {icon}
      </span>
      <span className="text-xs font-bold uppercase">{label}</span>
    </button>
  );
}
