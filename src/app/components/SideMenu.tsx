import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { useMenu } from "./MenuContext";
import svgPaths from "../../imports/svg-38y878fasw";

const menuItems = [
  { label: "Cộng đồng", path: "/app/community", icon: "community" },
  { label: "Tủ đồ", path: "/app/wardrobe", icon: "wardrobe" },
  { label: "Chụp ảnh", path: "/app/camera", icon: "camera" },
  { label: "Phối đồ", path: "/app/outfit", icon: "outfit" },
  { label: "Cá nhân", path: "/app/profile", icon: "profile" },
];

const secondaryItems = [
  { label: "Cài đặt", icon: "settings", path: "/app/settings" },
  { label: "Quản trị hệ thống", icon: "admin", path: "/admin" },
  { label: "Trợ giúp & Hỗ trợ", icon: "help" },
  { label: "Về V-Closet", icon: "about" },
];

function MenuIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#4a3728" : "#8b7355";
  switch (icon) {
    case "community":
      return (
        <svg width="20" height="17" viewBox="0 0 19.1 15.6741" fill="none">
          <path
            d={svgPaths.p27c25f80}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "wardrobe":
      return (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path d={svgPaths.p23c4d380} fill={color} />
        </svg>
      );
    case "camera":
      return (
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path d={svgPaths.p6da5600} fill={color} />
        </svg>
      );
    case "outfit":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d={svgPaths.p11c2d500} fill={color} />
        </svg>
      );
    case "profile":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d={svgPaths.p85bff00} fill={color} />
        </svg>
      );
    default:
      return (
        <div className="size-[20px] rounded-full bg-current opacity-30" />
      );
  }
}

export function SideMenu() {
  const { isMenuOpen, closeMenu } = useMenu();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    if (!path) return;
    navigate(path);
    closeMenu();
  };

  const handleLogout = () => {
    closeMenu();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] z-40"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#fdfaf6] z-50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.12)]"
          >
            {/* Header */}
            <div className="px-[20px] pt-[48px] pb-[24px] border-b border-[rgba(74,55,40,0.08)]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#e3d5ca] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d={svgPaths.p85bff00} fill="#4a3728" />
                  </svg>
                </div>
                <div>
                  <div className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#4a3728]">
                    Người dùng V-Closet
                  </div>
                  <div className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(74,55,40,0.5)]">
                    @vcloset_user
                  </div>
                </div>
              </div>
            </div>

            {/* Main Nav Items */}
            <div className="flex-1 overflow-y-auto py-[12px]">
              <div className="px-[12px]">
                {menuItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-[14px] px-[16px] py-[13px] rounded-[12px] border-none cursor-pointer transition-colors duration-100 ${active
                          ? "bg-[rgba(74,55,40,0.08)]"
                          : "bg-transparent active:bg-[rgba(74,55,40,0.04)]"
                        }`}
                    >
                      <div className="w-[24px] flex items-center justify-center">
                        <MenuIcon icon={item.icon} active={active} />
                      </div>
                      <span
                        className={`font-['Manrope',sans-serif] text-[15px] ${active
                            ? "text-[#4a3728] font-bold"
                            : "text-[#7f5539] font-medium"
                          }`}
                      >
                        {item.label}
                      </span>
                      {active && (
                        <div className="ml-auto w-[6px] h-[6px] rounded-full bg-[#4a3728]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-[rgba(74,55,40,0.08)] mx-[20px] my-[12px]" />

              {/* Secondary Items */}
              <div className="px-[12px]">
                {secondaryItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.path && handleNav(item.path)}
                    className="w-full flex items-center gap-[14px] px-[16px] py-[12px] rounded-[12px] border-none cursor-pointer bg-transparent active:bg-[rgba(74,55,40,0.04)] transition-colors duration-100"
                  >
                    <div className="w-[24px] flex items-center justify-center">
                      <SecondaryIcon type={item.icon} />
                    </div>
                    <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[rgba(74,55,40,0.6)]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <div className="px-[20px] pb-[32px] pt-[12px] border-t border-[rgba(74,55,40,0.08)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-[14px] px-[16px] py-[12px] rounded-[12px] border-none cursor-pointer bg-transparent active:bg-[rgba(220,80,60,0.06)] transition-colors duration-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[#c0392b]">
                  Đăng xuất
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SecondaryIcon({ type }: { type: string }) {
  const color = "rgba(74,55,40,0.45)";
  switch (type) {
    case "settings":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "admin":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case "help":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "about":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    default:
      return null;
  }
}
