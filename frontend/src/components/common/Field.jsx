import React from 'react';

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium ">
        {label}
      </label>
      {children}
    </div>
  );
}
export default Field;