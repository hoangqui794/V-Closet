import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { SlideUp, StaggerContainer, StaggerItem } from "./PageTransition";

interface PlanFeature {
    name: string;
    free: string | boolean;
    monthly: string | boolean;
    yearly: string | boolean;
}

export function SubscriptionPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const features: PlanFeature[] = [
        { name: "Giá niêm yết", free: "0 VNĐ", monthly: "49.000 VNĐ / tháng", yearly: "499.000 VNĐ / năm" },
        { name: "Giá trị quy đổi", free: "Trải nghiệm cơ bản", monthly: "~1 ly trà sữa/tháng", yearly: "Chỉ ~41.500 VNĐ/tháng" },
        { name: "Không gian đồ", free: "Tối đa 100 món", monthly: "Không giới hạn", yearly: "Không giới hạn" },
        { name: "Lượt phối đồ AI", free: "5 lượt/ngày", monthly: "Không giới hạn", yearly: "Không giới hạn" },
        { name: "Thư viện Avatar", free: "Full Body-Type", monthly: "Full Body-Type", yearly: "Full Body-Type" },
        { name: "AI Stylist", free: false, monthly: true, yearly: true },
        { name: "Quảng cáo", free: "Có quảng cáo", monthly: "Gỡ bỏ hoàn toàn", yearly: "Gỡ bỏ hoàn toàn" },
        { name: "Tiết kiệm", free: "-", monthly: "-", yearly: "Tiết kiệm 15%" },
    ];

    const handleSelectPlan = (plan: string) => {
        if (plan === "FREE") {
            navigate("/app/profile");
            return;
        }
        navigate("/app/payment", { state: { plan } });
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
                        {t("subscription")}
                    </span>
                </div>
            </div>

            <div className="px-[16px] mt-[24px]">
                <SlideUp>
                    <div className="text-center mb-[32px]">
                        <h1 className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[32px]">
                            Nâng cấp trải nghiệm <br /> cùng V-Closet Premium
                        </h1>
                        <p className="font-['Manrope',sans-serif] font-normal text-[14px] text-[rgba(74,55,40,0.6)] mt-[8px]">
                            Chọn gói phù hợp để tận hưởng trọn bộ tính năng AI
                        </p>
                    </div>
                </SlideUp>

                {/* Plan Cards */}
                <div className="flex flex-col gap-[32px] mb-[40px]">
                    <StaggerContainer>
                        <StaggerItem>
                            <PlanCard
                                title="FREE"
                                price="0 VNĐ"
                                description="Trải nghiệm cơ bản"
                                features={["Tối đa 100 món", "5 lượt phối đồ AI/ngày"]}
                                onSelect={() => handleSelectPlan("FREE")}
                                color="#f0e6da"
                                textColor="#4a3728"
                            />
                        </StaggerItem>
                        <StaggerItem>
                            <PlanCard
                                title="MONTHLY"
                                price="49.000 VNĐ"
                                period="/ tháng"
                                description="Thoải mái sáng tạo"
                                features={["Tủ đồ không giới hạn", "Phối đồ AI không giới hạn", "Gỡ bỏ quảng cáo", "AI Stylist tư vấn"]}
                                onSelect={() => handleSelectPlan("MONTHLY")}
                                color="#4a3728"
                                textColor="#fdfaf6"
                                isPremium
                            />
                        </StaggerItem>
                        <StaggerItem>
                            <PlanCard
                                title="YEARLY"
                                price="499.000 VNĐ"
                                period="/ năm"
                                description="Tiết kiệm nhất (15%)"
                                features={["Tủ đồ không giới hạn", "Phối đồ AI không giới hạn", "Gỡ bỏ quảng cáo", "AI Stylist tư vấn"]}
                                onSelect={() => handleSelectPlan("YEARLY")}
                                color="#dccbb5"
                                textColor="#4a3728"
                                isBestValue
                            />
                        </StaggerItem>
                    </StaggerContainer>
                </div>

                {/* Comparison Table */}
                <SlideUp delay={0.4}>
                    <div className="bg-white rounded-[24px] border border-[rgba(74,55,40,0.1)] overflow-hidden shadow-sm">
                        <div className="p-[20px] bg-[rgba(74,55,40,0.03)] border-b border-[rgba(74,55,40,0.05)]">
                            <span className="font-['Manrope',sans-serif] font-[800] text-[14px] text-[#4a3728] uppercase tracking-[1px]">
                                So sánh các gói
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[rgba(74,55,40,0.01)]">
                                        <th className="p-[12px] font-['Manrope',sans-serif] font-[700] text-[12px] text-[rgba(74,55,40,0.5)] uppercase tracking-[0.5px]">Tính năng</th>
                                        <th className="p-[12px] font-['Manrope',sans-serif] font-[700] text-[12px] text-[#4a3728] text-center">FREE</th>
                                        <th className="p-[12px] font-['Manrope',sans-serif] font-[700] text-[12px] text-[#4a3728] text-center">MONTHLY</th>
                                        <th className="p-[12px] font-['Manrope',sans-serif] font-[700] text-[12px] text-[#4a3728] text-center">YEARLY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((f, i) => (
                                        <tr key={i} className="border-t border-[rgba(74,55,40,0.05)]">
                                            <td className="p-[12px] font-['Manrope',sans-serif] font-medium text-[13px] text-[#4a3728]">{f.name}</td>
                                            <td className="p-[12px] font-['Manrope',sans-serif] text-[12px] text-center text-[rgba(74,55,40,0.7)]">
                                                {typeof f.free === "boolean" ? (f.free ? "✓" : "-") : f.free}
                                            </td>
                                            <td className="p-[12px] font-['Manrope',sans-serif] text-[12px] text-center text-[#4a3728] font-bold">
                                                {typeof f.monthly === "boolean" ? (f.monthly ? "✓" : "-") : f.monthly}
                                            </td>
                                            <td className="p-[12px] font-['Manrope',sans-serif] text-[12px] text-center text-[#4a3728] font-bold">
                                                {typeof f.yearly === "boolean" ? (f.yearly ? "✓" : "-") : f.yearly}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </SlideUp>
            </div>
        </div>
    );
}

function PlanCard({
    title,
    price,
    period,
    description,
    features,
    onSelect,
    color,
    textColor,
    isPremium,
    isBestValue,
}: {
    title: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    onSelect: () => void;
    color: string;
    textColor: string;
    isPremium?: boolean;
    isBestValue?: boolean;
}) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="relative rounded-[24px] p-[24px] border border-[rgba(74,55,40,0.1)] shadow-sm flex flex-col"
            style={{ backgroundColor: color, color: textColor }}
        >
            {isBestValue && (
                <div className="absolute -top-[12px] right-[24px] bg-[#e74c3c] px-[12px] py-[4px] rounded-full shadow-md">
                    <span className="font-['Manrope',sans-serif] font-bold text-[10px] text-white uppercase tracking-[0.5px]">
                        Best Value
                    </span>
                </div>
            )}
            <div className="flex justify-between items-start mb-[8px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[14px] uppercase tracking-[1.5px] opacity-70">
                    {title}
                </div>
            </div>
            <div className="flex items-baseline gap-[4px] mb-[4px]">
                <span className="font-['Manrope',sans-serif] font-[800] text-[28px] tracking-[-1px]">{price}</span>
                {period && <span className="font-['Manrope',sans-serif] font-medium text-[14px] opacity-60">{period}</span>}
            </div>
            <div className="font-['Manrope',sans-serif] font-medium text-[14px] opacity-80 mb-[20px]">
                {description}
            </div>
            <div className="flex flex-col gap-[10px] mb-[24px] flex-1">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-[8px]">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                            <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-['Manrope',sans-serif] font-medium text-[13px]">{f}</span>
                    </div>
                ))}
            </div>
            <button
                onClick={onSelect}
                className={`w-full h-[52px] rounded-[16px] font-['Manrope',sans-serif] font-[800] text-[15px] cursor-pointer transition-all border-none ${isPremium ? "bg-[#fdfaf6] text-[#4a3728]" : "bg-[#4a3728] text-[#fdfaf6]"
                    }`}
            >
                Chọn {title}
            </button>
        </motion.div>
    );
}
