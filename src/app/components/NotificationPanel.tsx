import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMenu } from "./MenuContext";
import imgAvatar1 from "@/assets/109b45115e6cae70563f18222565ef1658795233.png";
import imgAvatar2 from "@/assets/c456c257d3afb30112c96701963e7d5a9961f01a.png";
import imgAvatar3 from "@/assets/ba2f29fa0edae9166043e99ba9c38a268998ad84.png";

type NotifTab = "all" | "unread";

interface Notification {
  id: string;
  avatar: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: "vote" | "challenge" | "system" | "social";
}

const notifications: Notification[] = [
  {
    id: "1",
    avatar: imgAvatar1,
    title: "Lan Anh",
    body: "đã bình chọn cho trang phục của bạn trong Autumn Challenge",
    time: "2 phút trước",
    unread: true,
    type: "vote",
  },
  {
    id: "2",
    avatar: imgAvatar2,
    title: "Hoàng Nam",
    body: "đã theo dõi bạn",
    time: "15 phút trước",
    unread: true,
    type: "social",
  },
  {
    id: "3",
    avatar: "",
    title: "Tách nền AI hoàn tất",
    body: "3 trang phục đã được xử lý xong. Xem ngay!",
    time: "30 phút trước",
    unread: true,
    type: "system",
  },
  {
    id: "4",
    avatar: imgAvatar3,
    title: "Thanh Lam",
    body: "đã thích phối đồ 'Beige Minimalist' của bạn",
    time: "1 giờ trước",
    unread: false,
    type: "social",
  },
  {
    id: "5",
    avatar: "",
    title: "Autumn Elegance Challenge",
    body: "Còn 3 ngày để tham gia! Đừng bỏ lỡ cơ hội nhận voucher 200k.",
    time: "2 giờ trước",
    unread: false,
    type: "challenge",
  },
  {
    id: "6",
    avatar: imgAvatar1,
    title: "Lan Anh",
    body: "đã bình luận: 'Phối đồ đẹp quá!'",
    time: "3 giờ trước",
    unread: false,
    type: "social",
  },
  {
    id: "7",
    avatar: "",
    title: "Vòng Xoay May Mắn",
    body: "Bạn có 1 lượt quay miễn phí hôm nay!",
    time: "5 giờ trước",
    unread: false,
    type: "system",
  },
];

function TypeIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "vote":
      return (
        <div className="w-[36px] h-[36px] rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      );
    case "challenge":
      return (
        <div className="w-[36px] h-[36px] rounded-full bg-[#dbeafe] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
      );
    case "system":
      return (
        <div className="w-[36px] h-[36px] rounded-full bg-[#e0e7ff] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

export function NotificationPanel() {
  const { isNotifOpen, closeNotif } = useMenu();
  const [activeTab, setActiveTab] = useState<NotifTab>("all");

  const unreadCount = notifications.filter((n) => n.unread).length;
  const displayNotifs =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.unread);

  return (
    <AnimatePresence>
      {isNotifOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] z-40"
            onClick={closeNotif}
          />

          {/* Panel — slide from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute top-0 right-0 bottom-0 w-[320px] max-w-[85%] bg-[#fdfaf6] z-50 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.12)]"
          >
            {/* Header */}
            <div className="px-[20px] pt-[48px] pb-[16px]">
              <div className="flex items-center justify-between mb-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[20px] text-[#4a3728]">
                  Thông báo
                </div>
                <button
                  onClick={closeNotif}
                  className="bg-transparent border-none cursor-pointer p-[4px] active:opacity-60 transition-opacity"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a3728"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-[4px] bg-[#f0e6d9] rounded-[10px] p-[3px]">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-[8px] rounded-[8px] border-none cursor-pointer font-['Manrope',sans-serif] text-[13px] transition-all duration-150 ${activeTab === "all"
                      ? "bg-white text-[#4a3728] font-bold shadow-[0px_1px_3px_rgba(0,0,0,0.08)]"
                      : "bg-transparent text-[rgba(74,55,40,0.5)] font-medium"
                    }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-[8px] rounded-[8px] border-none cursor-pointer font-['Manrope',sans-serif] text-[13px] transition-all duration-150 flex items-center justify-center gap-[6px] ${activeTab === "unread"
                      ? "bg-white text-[#4a3728] font-bold shadow-[0px_1px_3px_rgba(0,0,0,0.08)]"
                      : "bg-transparent text-[rgba(74,55,40,0.5)] font-medium"
                    }`}
                >
                  Chưa đọc
                  {unreadCount > 0 && (
                    <span className="bg-[#d4a373] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-[5px]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto px-[12px] pb-[24px]">
              {displayNotifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[48px]">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(74,55,40,0.2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <div className="font-['Manrope',sans-serif] font-medium text-[14px] text-[rgba(74,55,40,0.35)] mt-[12px]">
                    Không có thông báo mới
                  </div>
                </div>
              ) : (
                displayNotifs.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <button className="w-full flex items-start gap-[12px] p-[12px] rounded-[12px] border-none cursor-pointer bg-transparent active:bg-[rgba(74,55,40,0.04)] transition-colors duration-100 text-left">
                      {/* Avatar or Type Icon */}
                      {notif.avatar ? (
                        <div className="relative shrink-0">
                          <div className="w-[36px] h-[36px] rounded-full overflow-hidden border border-[rgba(74,55,40,0.1)]">
                            <img
                              src={notif.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {notif.unread && (
                            <div className="absolute -top-[2px] -right-[2px] w-[10px] h-[10px] bg-[#d4a373] rounded-full border-2 border-[#fdfaf6]" />
                          )}
                        </div>
                      ) : (
                        <div className="relative shrink-0">
                          <TypeIcon type={notif.type} />
                          {notif.unread && (
                            <div className="absolute -top-[2px] -right-[2px] w-[10px] h-[10px] bg-[#d4a373] rounded-full border-2 border-[#fdfaf6]" />
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-['Manrope',sans-serif] text-[13px] text-[#4a3728] leading-[18px]">
                          <span
                            style={{
                              fontWeight: notif.unread ? 700 : 600,
                            }}
                          >
                            {notif.title}
                          </span>{" "}
                          <span
                            className={
                              notif.unread
                                ? "text-[#4a3728]"
                                : "text-[rgba(74,55,40,0.6)]"
                            }
                            style={{ fontWeight: notif.unread ? 500 : 400 }}
                          >
                            {notif.body}
                          </span>
                        </div>
                        <div className="font-['Manrope',sans-serif] font-normal text-[11px] text-[rgba(74,55,40,0.4)] mt-[4px]">
                          {notif.time}
                        </div>
                      </div>
                    </button>

                    {/* Divider (except last) */}
                    {index < displayNotifs.length - 1 && (
                      <div className="h-px bg-[rgba(74,55,40,0.06)] mx-[12px]" />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Mark all read */}
            {unreadCount > 0 && (
              <div className="px-[20px] pb-[32px] pt-[8px] border-t border-[rgba(74,55,40,0.08)]">
                <button className="w-full py-[12px] rounded-[12px] border border-[rgba(74,55,40,0.15)] bg-transparent cursor-pointer active:bg-[rgba(74,55,40,0.04)] transition-colors">
                  <span className="font-['Manrope',sans-serif] font-bold text-[13px] text-[#4a3728]">
                    Đánh dấu tất cả đã đọc
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
