import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SlideUp, StaggerContainer, StaggerItem } from "./PageTransition";
import { useLanguage } from "./LanguageContext";

interface SettingItemProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    destructive?: boolean;
}

function SettingItem({ label, icon, onClick, destructive }: SettingItemProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.98, backgroundColor: "rgba(74,55,40,0.04)" }}
            onClick={onClick}
            className={`bg-white flex items-center justify-between px-[20px] py-[18px] border-none cursor-pointer w-full transition-colors`}
        >
            <div className="flex items-center gap-[16px]">
                <div className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0 ${destructive ? 'bg-[rgba(231,76,60,0.1)]' : 'bg-[#f0e6da]'}`}>
                    {icon}
                </div>
                <span className={`font-['Manrope',sans-serif] font-medium text-[16px] ${destructive ? 'text-[#e74c3c]' : 'text-[#4a3728]'}`}>
                    {label}
                </span>
            </div>
            <svg width="8" height="14" viewBox="0 0 4.90625 8.33333" fill="none">
                <path
                    d="M0.739583 8.33333L0 7.59375L3.42708 4.16667L0 0.739583L0.739583 0L4.90625 4.16667L0.739583 8.33333V8.33333"
                    fill={destructive ? "rgba(231,76,60,0.4)" : "rgba(74,55,40,0.4)"}
                />
            </svg>
        </motion.button>
    );
}

export function SettingsPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="bg-[#fdfaf6] w-full min-h-full flex flex-col">
            {/* Header */}
            <div className="backdrop-blur-[6px] bg-[rgba(253,250,246,0.9)] flex items-center p-[16px] sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-transparent border-none cursor-pointer p-[8px] -ml-[8px] active:opacity-60 transition-opacity"
                >
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="flex-1 text-center pr-[18px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#4a3728] tracking-[-0.45px] uppercase">
                        {t("settings")}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-[40px]">
                {/* Section: Tài khoản */}
                <div className="mt-[24px] px-[20px] mb-[12px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[13px] text-[rgba(74,55,40,0.45)] uppercase tracking-[1px]">
                        {t("account")}
                    </span>
                </div>
                <StaggerContainer className="flex flex-col mx-[16px] overflow-hidden rounded-[20px] border border-[rgba(74,55,40,0.08)]">
                    <StaggerItem>
                        <SettingItem
                            label={t("personalInfo")}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                            onClick={() => navigate("/app/settings/edit-profile")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <SettingItem
                            label={t("changePassword")}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                            onClick={() => navigate("/app/settings/change-password")}
                        />
                    </StaggerItem>
                </StaggerContainer>

                {/* Section: Thông báo & Bảo mật */}
                <div className="mt-[32px] px-[20px] mb-[12px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[13px] text-[rgba(74,55,40,0.45)] uppercase tracking-[1px]">
                        App
                    </span>
                </div>
                <StaggerContainer className="flex flex-col mx-[16px] overflow-hidden rounded-[20px] border border-[rgba(74,55,40,0.08)]">
                    <StaggerItem>
                        <SettingItem
                            label={t("notifications")}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>}
                            onClick={() => navigate("/app/settings/notifications")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <SettingItem
                            label="Quyền riêng tư"
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                            onClick={() => toast("Cài đặt quyền riêng tư")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <SettingItem
                            label={t("language")}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>}
                            onClick={() => navigate("/app/settings/language")}
                        />
                    </StaggerItem>
                </StaggerContainer>

                {/* Section: Hỗ trợ */}
                <div className="mt-[32px] px-[20px] mb-[12px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[13px] text-[rgba(74,55,40,0.45)] uppercase tracking-[1px]">
                        Hỗ trợ & Pháp lý
                    </span>
                </div>
                <StaggerContainer className="flex flex-col mx-[16px] overflow-hidden rounded-[20px] border border-[rgba(74,55,40,0.08)]">
                    <StaggerItem>
                        <SettingItem
                            label="Điều khoản dịch vụ"
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                            onClick={() => toast("Xem điều khoản")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <SettingItem
                            label="Liên hệ chúng tôi"
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
                            onClick={() => toast("Liên hệ hỗ trợ")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <SettingItem
                            label="Xóa tài khoản"
                            destructive
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                            onClick={() => toast.error("Cảnh báo: Hành động này không thể hoàn tác!")}
                        />
                    </StaggerItem>
                </StaggerContainer>

                {/* Footer info */}
                <div className="mt-[40px] flex flex-col items-center">
                    <div className="font-['Manrope',sans-serif] font-[700] text-[14px] text-[#4a3728]">
                        V-Closet
                    </div>
                    <div className="font-['Manrope',sans-serif] font-[400] text-[12px] text-[rgba(74,55,40,0.4)] mt-[4px]">
                        Phiên bản 1.0.2 (Build 2026)
                    </div>
                </div>
            </div>
        </div>
    );
}
