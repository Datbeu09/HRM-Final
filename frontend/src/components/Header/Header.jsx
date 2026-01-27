import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Header = ({ pageTitles }) => {
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    // Lấy title theo pathname
    const currentTitle = pageTitles[location.pathname] || "HR Dashboard";
    setTitle(currentTitle);
  }, [location, pageTitles]);

  return (
    <header className="flex items-center justify-between h-14 bg-white shadow rounded px-4">
      <h1 className="text-xl sm:text-2xl font-bold tracking-wide">{title}</h1>
      {/* <div className="flex gap-2">
        <button className="p-2 sm:p-3 rounded hover:bg-primarySoft text-primary transition">
          <span className="material-symbols-outlined text-base sm:text-lg">search</span>
        </button>
        <button className="p-2 sm:p-3 rounded hover:bg-primarySoft text-primary transition">
          <span className="material-symbols-outlined text-base sm:text-lg">notifications</span>
        </button>
      </div> */}
    </header>
  );
};

export default Header;
