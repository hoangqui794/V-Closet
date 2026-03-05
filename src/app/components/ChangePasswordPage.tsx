import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SlideUp } from "./PageTransition";

export function ChangePasswordPage() {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdate = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải từ 6 ký tự trở lên");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        toast.success("Đổi mật khẩu thành công! 🔐");
        navigate(-1);
    };

    const PasswordInput = ({
        label,
        value,
        onChange,
        show,
        setShow
    }: {
        label: string,
        value: string,
        onChange: (v: string) => void,
        show: boolean,
        setShow: (v: boolean) => void
    }) => (
        <div>
            <label className="block font-['Manrope',sans-serif] font-[700] text-[13px] text-[rgba(74,55,40,0.5)] uppercase tracking-[0.5px] mb-[8px] ml-[4px]">
                {label}
            </label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white border border-[rgba(74,55,40,0.12)] rounded-[16px] px-[20px] py-[16px] font-['Manrope',sans-serif] font-[500] text-[15px] text-[#4a3728] outline-none focus:border-[#4a3728] transition-colors pr-[50px]"
                />
                <button
                    onClick={() => setShow(!show)}
                    className="absolute right-[16px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-[4px] flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                >
                    {show ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#fdfaf6] w-full min-h-full flex flex-col">
            {/* Header */}
            <div className="backdrop-blur-[6px] bg-[rgba(253,250,246,0.9)] flex items-center p-[16px] sticky top-0 z-10 transition-all">
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
                        Đổi mật khẩu
                    </span>
                </div>
            </div>

            <div className="flex-1 px-[20px] py-[32px]">
                <SlideUp className="mb-[32px] text-center">
                    <div className="w-[64px] h-[64px] bg-[#f0e6da] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <p className="font-['Manrope',sans-serif] font-[400] text-[14px] text-[rgba(74,55,40,0.6)] px-[20px] leading-[22px]">
                        Để đảm bảo an toàn, mật khẩu cần ít nhất 6 ký tự bao gồm chữ cái và số.
                    </p>
                </SlideUp>

                <div className="space-y-[24px]">
                    <PasswordInput
                        label="Mật khẩu cũ"
                        value={oldPassword}
                        onChange={setOldPassword}
                        show={showOld}
                        setShow={setShowOld}
                    />
                    <PasswordInput
                        label="Mật khẩu mới"
                        value={newPassword}
                        onChange={setNewPassword}
                        show={showNew}
                        setShow={setShowNew}
                    />
                    <PasswordInput
                        label="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        show={showConfirm}
                        setShow={setShowConfirm}
                    />
                </div>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUpdate}
                    className="w-full mt-[48px] bg-[#4a3728] rounded-[16px] py-[18px] cursor-pointer shadow-[0px_8px_20px_rgba(74,55,40,0.18)] border-none"
                >
                    <span className="font-['Manrope',sans-serif] font-bold text-[16px] text-white">
                        Cập nhật mật khẩu
                    </span>
                </motion.button>

                <button
                    onClick={() => toast("Hệ thống sẽ gửi mã qua email của bạn...")}
                    className="w-full mt-[20px] bg-transparent border-none cursor-pointer font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.45)] hover:text-[#4a3728] transition-colors"
                >
                    Bạn quên mật khẩu?
                </button>
            </div>
        </div>
    );
}
