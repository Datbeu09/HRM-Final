import React from "react";
const Info = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="font-medium text-slate-900">{value}</p>
  </div>
);
export default Info;