import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageContext";
import { SlideUp, StaggerContainer, StaggerItem } from "./PageTransition";
import imgMomo from "@/assets/logo/momo_icon_square_pinkbg_RGB.png";
import imgVnpay from "@/assets/logo/VN pay.png";

export function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const selectedPlan = location.state?.plan || "MONTHLY";

    const planDetails: Record<string, { price: string; period: string }> = {
        MONTHLY: { price: "49.000 VNĐ", period: "/ tháng" },
        YEARLY: { price: "499.000 VNĐ", period: "/ năm" },
    };

    const currentPlan = planDetails[selectedPlan] || planDetails.MONTHLY;

    const handlePayment = (method: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Đang kết nối với ${method}...`,
                success: "Thanh toán thành công! Chào mừng bạn đến với Premium. ✨",
                error: "Có lỗi xảy ra, vui lòng thử lại.",
            }
        );
        setTimeout(() => navigate("/app/profile"), 2500);
    };

    return (
        <div className="bg-[#fdfaf6] w-full min-h-full flex flex-col pb-[40px]">
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
                        {t("payment")}
                    </span>
                </div>
            </div>

            <div className="px-[16px] mt-[24px]">
                {/* Order Summary */}
                <SlideUp>
                    <div className="bg-white rounded-[24px] p-[24px] border border-[rgba(74,55,40,0.1)] shadow-sm mb-[32px]">
                        <div className="font-['Manrope',sans-serif] font-[700] text-[14px] text-[rgba(74,55,40,0.5)] uppercase tracking-[1px] mb-[16px]">
                            Tóm tắt đơn hàng
                        </div>
                        <div className="flex justify-between items-center mb-[12px]">
                            <div className="flex flex-col">
                                <span className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#4a3728]">
                                    Gói {selectedPlan}
                                </span>
                                <span className="font-['Manrope',sans-serif] font-medium text-[13px] text-[rgba(74,55,40,0.6)]">
                                    Thời hạn 1 {selectedPlan === "YEARLY" ? "năm" : "tháng"}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#4a3728]">
                                    {currentPlan.price}
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-[rgba(74,55,40,0.06)] my-[16px]" />
                        <div className="flex justify-between items-center">
                            <span className="font-['Manrope',sans-serif] font-[800] text-[16px] text-[#4a3728]">Tổng cộng</span>
                            <span className="font-['Manrope',sans-serif] font-[800] text-[20px] text-[#4a3728]">{currentPlan.price}</span>
                        </div>
                    </div>
                </SlideUp>

                {/* Payment Methods */}
                <div className="font-['Manrope',sans-serif] font-[700] text-[14px] text-[rgba(74,55,40,0.5)] uppercase tracking-[1px] mb-[16px] px-[8px]">
                    Phương thức thanh toán
                </div>

                <StaggerContainer className="flex flex-col gap-[12px]">
                    <StaggerItem>
                        <PaymentMethodItem
                            name={t("momo")}
                            image={imgMomo}
                            onClick={() => handlePayment("MoMo")}
                            badge="Phổ biến"
                            bgColor="#a50064"
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <PaymentMethodItem
                            name={t("vnpay")}
                            image={imgVnpay}
                            onClick={() => handlePayment("VNPay")}
                            bgColor="#ffffff"
                        />
                    </StaggerItem>
                    <StaggerItem>
                        <PaymentMethodItem
                            name={t("bankTransfer")}
                            icon="🏦"
                            onClick={() => handlePayment("Ngân hàng")}
                            bgColor="#4a3728"
                        />
                    </StaggerItem>
                </StaggerContainer>

                <SlideUp delay={0.4}>
                    <div className="mt-[40px] flex items-start gap-[12px] p-[20px] bg-white rounded-[20px] border border-[rgba(74,55,40,0.08)]">
                        <div className="text-[20px]">🔒</div>
                        <div className="flex flex-col gap-[4px]">
                            <span className="font-['Manrope',sans-serif] font-[700] text-[14px] text-[#4a3728]">Thanh toán an toàn</span>
                            <p className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(74,55,40,0.6)] leading-[18px]">
                                Thông tin của bạn được bảo mật tuyệt đối bởi các hệ thống thanh toán hàng đầu Việt Nam.
                            </p>
                        </div>
                    </div>
                </SlideUp>
            </div>
        </div>
    );
}

function PaymentMethodItem({
    name,
    icon,
    image,
    onClick,
    badge,
    bgColor,
}: {
    name: string;
    icon?: string;
    image?: string;
    onClick: () => void;
    badge?: string;
    bgColor: string;
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full bg-white rounded-[20px] p-[20px] border border-[rgba(74,55,40,0.1)] shadow-sm flex items-center justify-between cursor-pointer active:bg-[rgba(74,55,40,0.02)] transition-colors"
        >
            <div className="flex items-center gap-[16px]">
                <div
                    className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[24px] shadow-inner overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                >
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        icon
                    )}
                </div>
                <div className="flex flex-col items-start gap-[2px]">
                    <span className="font-['Manrope',sans-serif] font-[700] text-[16px] text-[#4a3728]">{name}</span>
                    {badge && (
                        <span className="bg-[rgba(74,55,40,0.05)] text-[rgba(74,55,40,0.6)] font-['Manrope',sans-serif] font-bold text-[10px] px-[8px] py-[2px] rounded-full uppercase tracking-[0.5px]">
                            {badge}
                        </span>
                    )}
                </div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
        </motion.button>
    );
}
