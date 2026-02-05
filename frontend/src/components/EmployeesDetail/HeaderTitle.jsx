import React from "react";
const HeaderTitle = ({ title }) => (
 
  <div className="flex items-center gap-2 mb-6">
    <span className="w-1 h-6 bg-teal-600 rounded-full" />
    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
  </div>


);
export default HeaderTitle;