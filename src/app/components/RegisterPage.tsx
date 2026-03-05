import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-ta7we0nsx9";
import { useLanguage } from "./LanguageContext";
import imgImage1 from "@/assets/logoVcloset.png";
import imgLogo from "@/assets/92375b66cc5f6db228cbba4fabc2bd6032c970de.png";

export function RegisterPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        // In a real app, you would handle registration here
        navigate("/onboarding");
    };

    return (
        <div className="mobile-frame items-center">
            <div className="flex flex-col items-center justify-center w-full px-[16px] pt-[28px] pb-[40px] overflow-y-auto">
                {/* Spacer */}
                <div className="h-[6px] shrink-0 w-px" />

                {/* Logo Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-[120px] w-[120px] relative flex items-center justify-center shrink-0"
                >
                    {/* Subtle soft glow background */}
                    <div className="absolute inset-0 rounded-full bg-[rgba(74,55,40,0.03)] blur-[20px] scale-90" />

                    <img
                        alt="V-Closet Logo"
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
                        src={imgImage1}
                    />
                </motion.div>

                {/* App Name */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-2 mb-[16px]"
                >
                    <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] tracking-[-0.75px] leading-[30px]">
                        V-Closet
                    </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col gap-[4px] items-center w-full mb-[24px]"
                >
                    <div className="font-['Manrope',sans-serif] font-bold text-[22px] text-[#4a3728] text-center leading-[28px]">
                        {t("createAccount")}
                    </div>
                    <div className="font-['Manrope',sans-serif] font-normal text-[14px] text-[rgba(74,55,40,0.7)] text-center leading-[20px]">
                        {t("registerSub")}
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col gap-[16px] items-start w-full max-w-[350px]"
                >
                    {/* Full Name Field */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                        <div className="pl-[4px] w-full">
                            <div className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.8)] leading-[20px]">
                                {t("fullName")}
                            </div>
                        </div>
                        <div className="relative w-full">
                            <div className="bg-white h-[52px] relative rounded-[12px] w-full">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder={t("enterFullName")}
                                    className="w-full h-full rounded-[12px] border border-[#dccbb5] pl-[49px] pr-[17px] py-[15px] font-['Manrope',sans-serif] font-normal text-[16px] text-[#4a3728] placeholder-[#6b7280] bg-white outline-none focus:border-[#4a3728]"
                                />
                            </div>
                            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 opacity-50">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                        <div className="pl-[4px] w-full">
                            <div className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.8)] leading-[20px]">
                                {t("emailAddress")}
                            </div>
                        </div>
                        <div className="relative w-full">
                            <div className="bg-white h-[52px] relative rounded-[12px] w-full">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("enterEmail")}
                                    className="w-full h-full rounded-[12px] border border-[#dccbb5] pl-[49px] pr-[17px] py-[15px] font-['Manrope',sans-serif] font-normal text-[16px] text-[#4a3728] placeholder-[#6b7280] bg-white outline-none focus:border-[#4a3728]"
                                />
                            </div>
                            <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
                                <svg
                                    width="13.333"
                                    height="13.333"
                                    viewBox="0 0 13.3333 13.3333"
                                    fill="none"
                                >
                                    <path
                                        d={svgPaths.pfeb5cc0}
                                        fill="#4A3728"
                                        fillOpacity="0.5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                        <div className="pl-[4px] w-full">
                            <div className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.8)] leading-[20px]">
                                {t("password")}
                            </div>
                        </div>
                        <div className="relative w-full">
                            <div className="bg-white h-[52px] relative rounded-[12px] w-full">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("createPassword")}
                                    className="w-full h-full rounded-[12px] border border-[#dccbb5] pl-[49px] pr-[17px] py-[15px] font-['Manrope',sans-serif] font-normal text-[16px] text-[#4a3728] placeholder-[#6b7280] bg-white outline-none focus:border-[#4a3728]"
                                />
                            </div>
                            <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
                                <svg
                                    width="13.333"
                                    height="17.5"
                                    viewBox="0 0 13.3333 17.5"
                                    fill="none"
                                >
                                    <path
                                        d={svgPaths.p2eed4060}
                                        fill="#4A3728"
                                        fillOpacity="0.5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                        <div className="pl-[4px] w-full">
                            <div className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.8)] leading-[20px]">
                                {t("confirmPassword")}
                            </div>
                        </div>
                        <div className="relative w-full">
                            <div className="bg-white h-[52px] relative rounded-[12px] w-full">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t("confirmPassword")}
                                    className="w-full h-full rounded-[12px] border border-[#dccbb5] pl-[49px] pr-[17px] py-[15px] font-['Manrope',sans-serif] font-normal text-[16px] text-[#4a3728] placeholder-[#6b7280] bg-white outline-none focus:border-[#4a3728]"
                                />
                            </div>
                            <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
                                <svg
                                    width="13.333"
                                    height="17.5"
                                    viewBox="0 0 13.3333 17.5"
                                    fill="none"
                                >
                                    <path
                                        d={svgPaths.p2eed4060}
                                        fill="#4A3728"
                                        fillOpacity="0.5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Register Button */}
                    <motion.button
                        onClick={handleRegister}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="bg-[#4a3728] flex gap-[8px] h-[56px] items-center justify-center rounded-[12px] w-full cursor-pointer border-none shadow-[0px_10px_15px_-3px_rgba(74,55,40,0.2),0px_4px_6px_-4px_rgba(74,55,40,0.2)] mt-[4px]"
                    >
                        <span className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#fdfaf6] text-center leading-[24px]">
                            {t("createAccount")}
                        </span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <path d={svgPaths.p1acd9480} fill="#FDFAF6" />
                        </svg>
                    </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex gap-[16px] items-center w-full max-w-[254px] mt-[24px]"
                >
                    <div className="bg-[rgba(220,203,181,0.6)] flex-1 h-px" />
                    <div className="font-['Manrope',sans-serif] font-bold text-[12px] text-[rgba(74,55,40,0.4)] tracking-[0.6px] uppercase leading-[16px]">
                        {t("orContinueWith")}
                    </div>
                    <div className="bg-[rgba(220,203,181,0.6)] flex-1 h-px" />
                </motion.div>

                {/* Social Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-start justify-between w-full max-w-[316px] mt-[16px]"
                >
                    {/* Google */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-white flex gap-[8px] h-[48px] items-center justify-center rounded-[12px] w-[151px] border border-[#dccbb5] cursor-pointer"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g clipPath="url(#clip_google)">
                                <path d={svgPaths.p33b7ccc0} fill="#4285F4" />
                                <path d={svgPaths.p15123a40} fill="#34A853" />
                                <path d={svgPaths.p28bf8e80} fill="#FBBC05" />
                                <path d={svgPaths.p1e563600} fill="#EB4335" />
                            </g>
                            <defs>
                                <clipPath id="clip_google">
                                    <rect fill="white" height="20" width="20" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[#4a3728] text-center leading-[20px]">
                            Google
                        </span>
                    </motion.button>

                    {/* Apple */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-white flex gap-[8px] h-[48px] items-center justify-center rounded-[12px] w-[143px] border border-[#dccbb5] cursor-pointer"
                    >
                        <div className="relative shrink-0 size-[20px]">
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <img
                                    alt=""
                                    className="absolute left-[-28.84%] max-w-none size-[158.73%] top-[-29.1%]"
                                    src={imgLogo}
                                />
                            </div>
                        </div>
                        <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[#4a3728] text-center leading-[20px]">
                            Apple
                        </span>
                    </motion.button>
                </motion.div>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex gap-[4px] items-start mt-[24px]"
                >
                    <span className="font-['Manrope',sans-serif] font-normal text-[16px] text-[rgba(74,55,40,0.6)] text-center leading-[24px]">
                        {t("alreadyHaveAccount")}{" "}
                    </span>
                    <button
                        className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#4a3728] text-center leading-[24px] bg-transparent border-none cursor-pointer p-0"
                        onClick={() => navigate("/")}
                    >
                        {t("login")}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
