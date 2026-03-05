import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SlideUp, StaggerContainer, StaggerItem } from "./PageTransition";
import { useLanguage } from "./LanguageContext";

const LANGUAGES = [
    { id: "vi", label: "Tiếng Việt", flag: "https://flagsapi.com/VN/flat/64.png", native: "Tiếng Việt" },
    { id: "en", label: "English", flag: "https://flagsapi.com/US/flat/64.png", native: "English" },
    { id: "kr", label: "Korean", flag: "https://flagsapi.com/KR/flat/64.png", native: "한국어" },
    { id: "jp", label: "Japanese", flag: "https://flagsapi.com/JP/flat/64.png", native: "日本語" },
    { id: "th", label: "Thai", flag: "https://flagsapi.com/TH/flat/64.png", native: "ไทย" },
];

export function LanguageSettingsPage() {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();

    const handleSelect = (id: any) => {
        setLanguage(id);
        const langLabel = LANGUAGES.find(l => l.id === id)?.label;
        toast.success(`Language changed to ${langLabel}! 🌐`);
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
                        {t("language")}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-[40px] px-[20px] py-[24px]">
                <SlideUp className="text-center mb-[32px]">
                    <div className="w-[64px] h-[64px] bg-[#f0e6da] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </div>
                    <h2 className="font-['Manrope',sans-serif] font-[700] text-[18px] text-[#4a3728] mb-[8px]">
                        {language === "vi" ? "Chọn ngôn ngữ của bạn" : "Select your language"}
                    </h2>
                    <p className="font-['Manrope',sans-serif] font-[400] text-[14px] text-[rgba(74,55,40,0.5)] leading-[20px]">
                        {language === "vi" ? "Giao diện ứng dụng sẽ thay đổi theo ngôn ngữ bạn chọn." : "The app interface will change based on your selected language."}
                    </p>
                </SlideUp>

                <StaggerContainer className="flex flex-col overflow-hidden rounded-[24px] border border-[rgba(74,55,40,0.08)] bg-white">
                    {LANGUAGES.map((lang) => {
                        const isSelected = language === lang.id;
                        return (
                            <StaggerItem key={lang.id}>
                                <motion.button
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handleSelect(lang.id)}
                                    className={`w-full flex items-center justify-between px-[20px] py-[18px] border-b border-[rgba(74,55,40,0.05)] last:border-none bg-transparent cursor-pointer transition-colors ${isSelected ? "bg-[rgba(74,55,40,0.02)]" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-[16px]">
                                        <div className="w-[32px] h-[22px] rounded-[4px] overflow-hidden border border-[rgba(0,0,0,0.05)] shrink-0">
                                            <img src={lang.flag} className="w-full h-full object-cover" alt={lang.label} />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className={`font-['Manrope',sans-serif] font-[600] text-[16px] ${isSelected ? "text-[#4a3728]" : "text-[rgba(74,55,40,0.7)]"}`}>
                                                {lang.label}
                                            </span>
                                            <span className="font-['Manrope',sans-serif] font-[400] text-[12px] text-[rgba(74,55,40,0.4)]">
                                                {lang.native}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#4a3728] border-[#4a3728]" : "bg-transparent border-[rgba(74,55,40,0.15)]"
                                        }`}>
                                        {isSelected && (
                                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </motion.button>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            </div>
        </div>
    );
}
