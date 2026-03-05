import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { SlideUp, StaggerContainer, StaggerItem } from "./PageTransition";

interface NotificationSwitchProps {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}

function NotificationSwitch({ label, description, enabled, onToggle }: NotificationSwitchProps) {
    return (
        <div className="bg-white flex items-center justify-between px-[20px] py-[18px] border-b border-[rgba(74,55,40,0.06)] last:border-none">
            <div className="flex-1 pr-[16px]">
                <div className="font-['Manrope',sans-serif] font-[700] text-[15px] text-[#4a3728] mb-[2px]">
                    {label}
                </div>
                <div className="font-['Manrope',sans-serif] font-[400] text-[12px] text-[rgba(74,55,40,0.5)] leading-[18px]">
                    {description}
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-[48px] h-[26px] rounded-full transition-colors duration-200 cursor-pointer border-none outline-none ${enabled ? "bg-[#4a3728]" : "bg-[rgba(74,55,40,0.12)]"
                    }`}
            >
                <motion.div
                    animate={{ x: enabled ? 24 : 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-[3px] left-0 w-[20px] h-[20px] bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    );
}

export function NotificationSettingsPage() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        promotions: true,
        outfitReminders: true,
        communityLikes: true,
        newFollowers: false,
        appUpdates: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

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
                        Thông báo
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-[40px]">
                <SlideUp className="px-[24px] py-[24px]">
                    <div className="w-[64px] h-[64px] bg-[#f0e6da] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                    <h2 className="font-['Manrope',sans-serif] font-[700] text-[18px] text-[#4a3728] text-center mb-[8px]">
                        Tùy chỉnh thông báo
                    </h2>
                    <p className="font-['Manrope',sans-serif] font-[400] text-[14px] text-[rgba(74,55,40,0.5)] text-center px-[10px]">
                        Lấy cảm hứng mỗi ngày và không bao giờ bỏ lỡ các xu hướng phối đồ mới nhất.
                    </p>
                </SlideUp>

                {/* Section: Hoạt động */}
                <div className="mt-[16px] px-[20px] mb-[12px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[12px] text-[rgba(74,55,40,0.4)] uppercase tracking-[1px]">
                        Hoạt động cộng đồng
                    </span>
                </div>
                <StaggerContainer className="flex flex-col mx-[16px] overflow-hidden rounded-[20px] border border-[rgba(74,55,40,0.08)] mb-[24px]">
                    <StaggerItem>
                        <NotificationSwitch
                            label="Lượt thích & Bình luận"
                            description="Nhận thông báo khi có người tương tác với bài phối đồ của bạn."
                            enabled={settings.communityLikes}
                            onToggle={() => toggleSetting("communityLikes")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <NotificationSwitch
                            label="Người theo dõi mới"
                            description="Nhận thông báo khi có ai đó bắt đầu theo dõi phong cách của bạn."
                            enabled={settings.newFollowers}
                            onToggle={() => toggleSetting("newFollowers")}
                        />
                    </StaggerItem>
                </StaggerContainer>

                {/* Section: Gợi ý & Nhắc nhở */}
                <div className="mt-[8px] px-[20px] mb-[12px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[12px] text-[rgba(74,55,40,0.4)] uppercase tracking-[1px]">
                        Gợi ý & Nhắc nhở
                    </span>
                </div>
                <StaggerContainer className="flex flex-col mx-[16px] overflow-hidden rounded-[20px] border border-[rgba(74,55,40,0.08)] mb-[24px]">
                    <StaggerItem>
                        <NotificationSwitch
                            label="Gợi ý phối đồ hàng ngày"
                            description="AI sẽ nhắc bạn chọn đồ phù hợp với thời tiết và lịch trình."
                            enabled={settings.outfitReminders}
                            onToggle={() => toggleSetting("outfitReminders")}
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <NotificationSwitch
                            label="Ưu đãi & Khuyến mãi"
                            description="Thông báo về các chương trình giảm giá từ đối tác Shopee."
                            enabled={settings.promotions}
                            onToggle={() => toggleSetting("promotions")}
                        />
                    </StaggerItem>
                </StaggerContainer>

                {/* Section: Hệ thống */}
                <div className="mt-[8px] px-[20px] mb-[12px]">
                    <span className="font-['Manrope',sans-serif] font-[800] text-[12px] text-[rgba(74,55,40,0.4)] uppercase tracking-[1px]">
                        Cập nhật hệ thống
                    </span>
                </div>
                <div className="mx-[16px] overflow-hidden rounded-[20px] border border-[rgba(74,55,40,0.08)]">
                    <NotificationSwitch
                        label="Cập nhật ứng dụng"
                        description="Tìm hiểu về các tính năng mới và cải tiến hiệu năng."
                        enabled={settings.appUpdates}
                        onToggle={() => toggleSetting("appUpdates")}
                    />
                </div>
            </div>
        </div>
    );
}
