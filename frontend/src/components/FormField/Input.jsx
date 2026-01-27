import React from 'react';
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-2 border rounded-lg"
    />
  </div>
);


export default Input;