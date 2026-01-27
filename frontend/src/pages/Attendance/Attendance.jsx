import React from "react";

export default function Attendance() {
  return (
    <div className="bg-background-light text-slate-800 transition-colors duration-200 font-sans">
      <div className="flex h-screen overflow-hidden">

        {/* MAIN */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-6">

              <div className="bg-white rounded-2xl p-10 border text-center">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                  Thời gian hiện tại
                </p>
                <p className="text-6xl font-bold mb-8">08:25:42</p>

                <div className="flex justify-center gap-6 mb-8">
                  <button className="w-52 px-10 py-4 bg-primary text-white rounded-xl font-bold flex gap-2 justify-center">
                    <span className="material-icons-round">login</span>
                    CHECK IN
                  </button>

                  <button className="w-52 px-10 py-4 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed flex gap-2 justify-center">
                    <span className="material-icons-round">logout</span>
                    CHECK OUT
                  </button>
                </div>

                <div className="flex justify-center gap-12 border-t pt-6">
                  <div>
                    <p className="text-xs text-slate-400 font-bold">GIỜ VÀO</p>
                    <p className="font-bold">--:--</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold">GIỜ RA</p>
                    <p className="font-bold">--:--</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold">TỔNG GIỜ</p>
                    <p className="font-bold">0h</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
