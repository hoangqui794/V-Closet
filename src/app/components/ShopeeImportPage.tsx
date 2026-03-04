import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import imgShopeeBlouse from "@/assets/shopee-blouse.png";
import imgShopeeCoat from "@/assets/shopee-coat.png";
import imgShopeePants from "@/assets/shopee-pants.png";

const mockOrders = [
    { id: 1, name: "Premium Silk Blouse", shop: "LAVRA Official", img: imgShopeeBlouse, status: "Delivered", price: "450.000đ" },
    { id: 2, name: "Classic Trench Coat", shop: "Minimalist Studio", img: imgShopeeCoat, status: "Delivered", price: "980.000đ" },
    { id: 3, name: "Wool Wide-Leg Slacks", shop: "Gentle Look", img: imgShopeePants, status: "Shipping", price: "520.000đ" },
];

export function ShopeeImportPage() {
    const navigate = useNavigate();
    const [connected, setConnected] = useState(false);
    const [importing, setImporting] = useState<number | null>(null);

    const handleConnect = () => {
        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: "Đang kết nối với Shopee...",
            success: () => {
                setConnected(true);
                return "Kết nối tài khoản Shopee thành công! 🛒";
            },
            error: "Không thể kết nối. Thử lại sau nhé!",
        });
    };

    const handleImport = (id: number) => {
        setImporting(id);
        setTimeout(() => {
            setImporting(null);
            toast.success("Đã thêm trang phục vào Tủ đồ của bạn! ✨");
        }, 1200);
    };

    return (
        <div className="bg-[#fdfaf7] w-full min-h-full flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="backdrop-blur-[8px] bg-[rgba(253,250,247,0.85)] flex items-center justify-between px-[16px] py-[16px] sticky top-0 z-10 border-b border-[rgba(214,204,194,0.3)]">
                <button onClick={() => navigate(-1)} className="rounded-full size-[40px] flex items-center justify-center cursor-pointer bg-transparent border-none active:bg-[rgba(74,55,40,0.06)] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#3b2d22] tracking-[-0.45px]">
                    Import Shopee
                </div>
                <div className="w-[40px]" />
            </div>

            <div className="flex-1 overflow-y-auto px-[16px] pt-[20px] pb-[40px]">
                {/* Connection Status */}
                <div className="bg-white rounded-[24px] p-[20px] shadow-[0px_8px_24px_rgba(74,55,40,0.06)] border border-[rgba(74,55,40,0.06)] mb-[24px]">
                    <div className="flex items-center gap-[16px] mb-[20px]">
                        <div className="size-[56px] bg-[#EE4D2D] rounded-[16px] flex items-center justify-center shadow-[0px_4px_12px_rgba(238,77,45,0.3)]">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 13H13V15.5C13 15.78 12.78 16 12.5 16H11.5C11.22 16 11 15.78 11 15.5V13H8.5C8.22 13 8 12.78 8 12.5V11.5C8 11.22 8.22 11 8.5 11H11V8.5C11 8.22 11.22 8 11.5 8H12.5C12.78 8 13 8.22 13 8.5V11H15.5C15.78 11 16 11.22 16 11.5V12.5C16 12.78 15.78 13 15.5 13Z" fill="white" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#3b2d22]">
                                {connected ? "Hi, Truong! 👋" : "Chưa kết nối"}
                            </div>
                            <div className="font-['Manrope',sans-serif] text-[13px] text-[rgba(59,45,34,0.6)]">
                                {connected ? "Cập nhật đơn hàng: Vừa xong" : "Đăng nhập Shopee để lấy kho đồ"}
                            </div>
                        </div>
                    </div>

                    {!connected && (
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={handleConnect}
                            className="w-full h-[52px] bg-[#EE4D2D] rounded-[14px] border-none text-white font-bold text-[15px] cursor-pointer shadow-[0px_4px_16px_rgba(238,77,45,0.25)]"
                        >
                            Kết nối ngay
                        </motion.button>
                    )}
                </div>

                {/* Link Import */}
                <div className="mb-[32px]">
                    <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#3b2d22] uppercase tracking-[1px] mb-[12px] pl-[4px]">
                        Nhập link sản phẩm
                    </div>
                    <div className="flex gap-[8px]">
                        <input
                            type="text"
                            placeholder="Dán link sản phẩm Shopee tại đây..."
                            className="flex-1 h-[48px] bg-white rounded-[14px] px-[16px] border border-[rgba(214,204,194,0.8)] focus:border-[#4a3728] focus:outline-none font-['Manrope',sans-serif] text-[14px]"
                        />
                        <button className="h-[48px] px-[20px] bg-[#4a3728] rounded-[14px] border-none text-white font-bold text-[14px] cursor-pointer active:scale-95 transition-transform">
                            Tìm
                        </button>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div>
                    <div className="flex items-center justify-between mb-[16px] px-[4px]">
                        <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#3b2d22] uppercase tracking-[1px]">
                            Đơn hàng gần đây
                        </div>
                        {connected && <span className="text-[12px] text-[#EE4D2D] font-bold">Xem tất cả</span>}
                    </div>

                    <AnimatePresence>
                        {!connected ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-[40px] flex flex-col items-center justify-center text-center px-[20px] bg-[rgba(255,255,255,0.4)] rounded-[24px] border border-dashed border-[rgba(59,45,34,0.2)]"
                            >
                                <div className="size-[64px] bg-[#f5f0e6] rounded-full flex items-center justify-center mb-[16px]">
                                    <span className="text-[24px]">📦</span>
                                </div>
                                <div className="font-['Manrope',sans-serif] font-bold text-[15px] text-[#3b2d22] mb-[4px]">
                                    Bạn chưa đăng nhập Shopee
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[13px] text-[rgba(59,45,34,0.5)]">
                                    Hãy kết nối tài khoản để tự động lấy các trang phục bạn đã mua nhé!
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col gap-[12px]">
                                {mockOrders.map((order, idx) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-[20px] p-[12px] flex items-center gap-[14px] border border-[rgba(74,55,40,0.05)] shadow-[0px_4px_12px_rgba(0,0,0,0.03)]"
                                    >
                                        <div className="size-[72px] bg-[#f5f0e6] rounded-[12px] overflow-hidden shrink-0 border border-[rgba(74,55,40,0.05)]">
                                            <img src={order.img} alt={order.name} className="size-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#3b2d22] truncate">
                                                {order.name}
                                            </div>
                                            <div className="font-['Manrope',sans-serif] text-[12px] text-[rgba(59,45,34,0.5)] mb-[4px]">
                                                {order.shop}
                                            </div>
                                            <div className="flex items-center gap-[8px]">
                                                <span className="font-['Manrope',sans-serif] font-bold text-[13px] text-[#EE4D2D]">
                                                    {order.price}
                                                </span>
                                                <div className="h-[10px] w-px bg-[rgba(59,45,34,0.1)]" />
                                                <span className="text-[10px] text-[rgba(59,45,34,0.5)] uppercase tracking-[0.5px]">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleImport(order.id)}
                                            disabled={importing !== null}
                                            className={`h-[40px] px-[16px] rounded-full font-bold text-[12px] border-none cursor-pointer transition-all ${importing === order.id ? "bg-[rgba(59,45,34,0.1)] text-[#3b2d22]" : "bg-[#f5f0e6] text-[#3b2d22] active:scale-95"
                                                }`}
                                        >
                                            {importing === order.id ? "..." : "Thêm"}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Trust Badge */}
            <div className="absolute bottom-[20px] left-0 right-0 flex justify-center pointer-events-none opacity-40">
                <div className="flex items-center gap-[6px]">
                    <span className="text-[12px]">🛡️</span>
                    <span className="font-['Manrope',sans-serif] text-[10px] text-[#3b2d22] uppercase tracking-[1px] font-bold">
                        V-Closet Secure Partnership
                    </span>
                </div>
            </div>
        </div>
    );
}
