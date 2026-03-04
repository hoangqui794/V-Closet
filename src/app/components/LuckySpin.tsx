import React, { useState } from "react";
import { motion, useAnimation } from "motion/react";
import { toast } from "sonner";

const prizes = [
    { text: "Voucher 10k", color: "#f5ebe0" },
    { text: "Voucher 20k", color: "#d4a373" },
    { text: "Freeship", color: "#e3d5ca" },
    { text: "Voucher 50k", color: "#3b2d22", textColor: "#f5ebe0" },
    { text: "Outfit 0đ", color: "#f5ebe0" },
    { text: "Voucher 30k", color: "#d4a373" },
    { text: "Chút May Mắn", color: "#e3d5ca" },
    { text: "Code Giảm 15%", color: "#3b2d22", textColor: "#f5ebe0" },
];

export function LuckySpin({ onClose }: { onClose: () => void }) {
    const [spinning, setSpinning] = useState(false);
    const controls = useAnimation();

    const handleSpin = async () => {
        if (spinning) return;
        setSpinning(true);

        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const rotation = 360 * 5 + (360 - (prizeIndex * (360 / prizes.length)));

        await controls.start({
            rotate: rotation,
            transition: { duration: 4, ease: [0.45, 0.05, 0.55, 0.95] },
        });

        toast.success(`🎉 Chúc mừng! Bạn nhận được ${prizes[prizeIndex].text}!`);
        setTimeout(() => {
            setSpinning(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] px-[24px]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#fdfaf7] rounded-[32px] w-full max-w-[380px] p-[24px] flex flex-col items-center relative overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.3)]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-[20px] right-[20px] bg-[rgba(59,45,34,0.1)] rounded-full size-[32px] flex items-center justify-center border-none cursor-pointer"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M13 1L1 13M1 1L13 13" stroke="#3b2d22" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="font-['Manrope',sans-serif] font-[800] text-[22px] text-[#3b2d22] mb-[8px] mt-[12px] text-center">
                    Vòng Xoay May Mắn 🎰
                </div>
                <div className="font-['Manrope',sans-serif] text-[14px] text-[rgba(59,45,34,0.6)] mb-[32px] text-center">
                    Thử vận may của bạn hôm nay nhé!
                </div>

                {/* The Wheel */}
                <div className="relative size-[280px] mb-[40px]">
                    {/* Pointer */}
                    <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 z-10">
                        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                            <path d="M12 32L0 8H24L12 32Z" fill="#3b2d22" />
                        </svg>
                    </div>

                    <motion.div
                        animate={controls}
                        className="size-full rounded-full border-[6px] border-[#3b2d22] relative overflow-hidden shadow-[0px_8px_24px_rgba(59,45,34,0.2)]"
                        style={{
                            background: "conic-gradient(from 0deg, " + prizes.map((p, i) => `${p.color} ${i * (100 / prizes.length)}% ${(i + 1) * (100 / prizes.length)}%`).join(", ") + ")"
                        }}
                    >
                        {prizes.map((p, i) => (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                                style={{ transform: `translate(-50%, -50%) rotate(${i * (360 / prizes.length) + (360 / prizes.length / 2)}deg)` }}
                            >
                                <div
                                    className="font-['Manrope',sans-serif] font-bold text-[10px] absolute top-[20px] left-1/2 -translate-x-1/2"
                                    style={{ color: p.textColor || "#3b2d22" }}
                                >
                                    {p.text}
                                </div>
                            </div>
                        ))}
                        {/* Center cap */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[40px] bg-[#3b2d22] rounded-full border-[4px] border-[#f5ebe0] z-20 shadow-[0px_4px_8px_rgba(0,0,0,0.2)]" />
                    </motion.div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpin}
                    disabled={spinning}
                    className={`w-full h-[56px] rounded-[16px] border-none cursor-pointer shadow-[0px_8px_24px_rgba(59,45,34,0.25)] flex items-center justify-center transition-all ${spinning ? "bg-[rgba(59,45,34,0.5)]" : "bg-[#3b2d22]"}`}
                >
                    <span className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#f5ebe0] tracking-[1px] uppercase">
                        {spinning ? "Đang quay..." : "Quay ngay"}
                    </span>
                </motion.button>
            </motion.div>
        </div>
    );
}
