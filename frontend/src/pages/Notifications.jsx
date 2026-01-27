import React, { useMemo, useState } from "react";

const TABS = ["Tất cả", "Cần xử lý", "Sự kiện", "Hệ thống"];

export default function NotificationsCenter() {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Yêu cầu nghỉ phép quá hạn",
      content: "Yêu cầu nghỉ phép của Nguyễn Văn A đã chờ duyệt quá 48 giờ.",
      unread: true,
      action: true,
    },
    {
      id: 2,
      type: "event",
      title: "Sinh nhật nhân viên hôm nay",
      content: "Chúc mừng sinh nhật Phạm Minh C 🎉",
      unread: false,
    },
    {
      id: 3,
      type: "system",
      title: "Cập nhật hệ thống",
      content: "Hệ thống HR đã được nâng cấp phiên bản 2.1",
      unread: true,
    },
    {
      id: 4,
      type: "event",
      title: "Review lương định kỳ",
      content: "Đợt review lương sẽ bắt đầu từ ngày 15/11",
      unread: false,
    },
  ];

  /* ================= FILTER LOGIC ================= */
  const filteredNotifications = useMemo(() => {
    if (activeTab === "Tất cả") return notifications;
    if (activeTab === "Cần xử lý")
      return notifications.filter((n) => n.type === "warning");
    if (activeTab === "Sự kiện")
      return notifications.filter((n) => n.type === "event");
    if (activeTab === "Hệ thống")
      return notifications.filter((n) => n.type === "system");
    return notifications;
  }, [activeTab]);
  /* ================================================= */

  return (
    <div className="flex h-screen bg-backgroundLight text-slate-800 font-display overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT */}
            <div className="flex-1 space-y-6">

              {/* TABS */}
              <div className="flex bg-white border rounded-xl p-1 w-fit">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition
                      ${
                        activeTab === tab
                          ? "bg-primarySoft text-primary"
                          : "text-slate-500 hover:text-primary"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* LIST */}
              <div className="space-y-4 min-h-[546px]">
                {filteredNotifications.length === 0 ? (
                  <div className="bg-white border rounded-xl min-h-[420px] flex items-center justify-center text-slate-500">
                    Không có thông báo phù hợp
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`bg-white rounded-2xl border shadow-sm p-5 flex gap-4 min-h-[120px]
                        ${n.unread ? "border-primary/40" : "opacity-80"}`}
                    >
                      {/* ICON */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center
                          ${
                            n.type === "warning"
                              ? "bg-red-100 text-red-600"
                              : n.type === "event"
                              ? "bg-primarySoft text-primary"
                              : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        <span className="material-symbols-outlined">
                          {n.type === "warning"
                            ? "warning"
                            : n.type === "event"
                            ? "event"
                            : "settings"}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{n.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">
                          {n.content}
                        </p>

                        {n.action && (
                          <div className="flex gap-3">
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold">
                              Duyệt ngay
                            </button>
                            <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold">
                              Xem chi tiết
                            </button>
                          </div>
                        )}
                      </div>

                      {/* UNREAD DOT */}
                      {n.unread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-white rounded-2xl border shadow-sm">
                <div className="p-4 border-b font-bold">
                  Sự kiện sắp tới
                </div>
                <div className="p-4 space-y-3 text-sm text-slate-600">
                  <p>
                    <strong className="text-slate-800">15/11</strong> – Review lương
                  </p>
                  <p>
                    <strong className="text-slate-800">18/11</strong> – Sinh nhật CEO
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="text-center text-sm text-slate-400 pt-6 border-t">
            © 2023 HR Portal System. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
