import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useUserProfile } from "./UserProfileContext";
import { SlideUp } from "./PageTransition";
import { getCurrentUserProfile, updateCurrentUserProfile, updateCurrentUserAvatar } from "../../lib/api";

export function EditProfilePage() {
    const navigate = useNavigate();
    const { updateProfile } = useUserProfile();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState("");
    const [country, setCountry] = useState("Việt Nam");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getCurrentUserProfile();
                setNickname(data.displayName || "");
                setGender(data.profile?.gender || "");
                setCountry(data.profile?.country || "Việt Nam");
                setAvatarUrl(data.avatarUrl || null);
            } catch (err: any) {
                toast.error("Không thể tải thông tin hồ sơ: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (nickname.length < 2) {
            toast.error("Biệt danh phải có ít nhất 2 ký tự");
            return;
        }
        setIsSaving(true);
        try {
            await updateCurrentUserProfile({
                displayName: nickname,
                gender: gender,
                country: country
            });
            // Update local state fallback just in case
            updateProfile({ nickname, gender, country });
            toast.success("Đã cập nhật thông tin cá nhân! ✨");
            navigate(-1);
        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra khi lưu thông tin");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await updateCurrentUserAvatar(file);
            setAvatarUrl(res.avatarUrl);
            toast.success("Đã cập nhật ảnh đại diện!");
        } catch (err: any) {
            toast.error(err.message || "Lỗi khi tải ảnh lên");
        } finally {
            setIsUploading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

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
                    <span className="font-manrope font-[800] text-[18px] text-[#4a3728] tracking-[-0.45px] uppercase">
                        Thông tin cá nhân
                    </span>
                </div>
            </div>

            <div className="flex-1 px-[20px] py-[24px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-[200px]">
                        <span className="text-[#4a3728] font-medium">Đang tải...</span>
                    </div>
                ) : (
                    <>
                        <SlideUp className="flex flex-col items-center mb-[32px]">
                            <div className="relative">
                                <div 
                                    className="w-[100px] h-[100px] rounded-full bg-[#e3d5ca] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden cursor-pointer"
                                    onClick={handleAvatarClick}
                                >
                                    {isUploading ? (
                                        <span className="text-xs text-[#4a3728]">Đang tải...</span>
                                    ) : avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    )}
                                </div>
                                <button 
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-[#4a3728] rounded-full flex items-center justify-center border-2 border-white cursor-pointer shadow-sm"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                            <span className="mt-[12px] font-manrope font-[600] text-[14px] text-[#4a3728]">
                                Thay đổi ảnh đại diện
                            </span>
                        </SlideUp>

                        <div className="space-y-[20px]">
                            <div>
                                <label className="block font-manrope font-[700] text-[13px] text-[rgba(74,55,40,0.5)] uppercase tracking-[0.5px] mb-[8px] ml-[4px]">
                                    Biệt danh (ID)
                                </label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Nhập biệt danh của bạn"
                                    className="w-full bg-white border border-[rgba(74,55,40,0.12)] rounded-[16px] px-[20px] py-[16px] font-manrope font-[500] text-[15px] text-[#4a3728] outline-none focus:border-[#4a3728] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block font-manrope font-[700] text-[13px] text-[rgba(74,55,40,0.5)] uppercase tracking-[0.5px] mb-[8px] ml-[4px]">
                                    Giới tính
                                </label>
                                <div className="grid grid-cols-2 gap-[12px]">
                                    {["Male", "Female"].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setGender(g)}
                                            className={`py-[14px] rounded-[16px] font-manrope font-[600] text-[14px] border-2 transition-all cursor-pointer ${
                                                gender?.toLowerCase() === g.toLowerCase()
                                                    ? "bg-[#4a3728] border-[#4a3728] text-white"
                                                    : "bg-white border-[rgba(74,55,40,0.08)] text-[#4a3728]"
                                            }`}
                                        >
                                            {g === "Male" ? "Nam" : "Nữ"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block font-manrope font-[700] text-[13px] text-[rgba(74,55,40,0.5)] uppercase tracking-[0.5px] mb-[8px] ml-[4px]">
                                    Quốc gia
                                </label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-white border border-[rgba(74,55,40,0.12)] rounded-[16px] px-[20px] py-[16px] font-manrope font-[500] text-[15px] text-[#4a3728] outline-none focus:border-[#4a3728] transition-colors"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSave}
                            disabled={isSaving || isUploading}
                            className="w-full mt-[40px] bg-[#4a3728] disabled:opacity-70 rounded-[16px] py-[18px] cursor-pointer shadow-[0px_8px_20px_rgba(74,55,40,0.18)] border-none"
                        >
                            <span className="font-manrope font-bold text-[16px] text-white">
                                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                            </span>
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
}
