import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ShieldAlert, Mail, Lock, ArrowRight } from "lucide-react";
import { setToken, loginAdmin } from "@/lib/api";
import imgLogoVcloset from "@/assets/logoVcloset.png";

export function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Gọi API đăng nhập thật từ backend
            const res = await loginAdmin({ email, password });
            
            // Danh sách các vai trò quản trị được phép truy cập
            const allowedRoles = ["SuperAdmin", "Admin", "Moderator"];
            if (!allowedRoles.includes(res.role)) {
                setError("Tài khoản của bạn không có quyền truy cập vào cổng quản trị.");
                setLoading(false);
                return;
            }

            // Tự động lưu Token nhận về từ API vào localStorage
            setToken(res.accessToken);

            // Thành công chuyển hướng sang Dashboard quản trị
            navigate("/admin/dashboard");
        } catch (err: any) {
            console.error("Lỗi đăng nhập admin:", err);
            setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fcf8f2] relative overflow-hidden font-poppins px-4">
            {/* Background decorative blurry circles */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#4a3728]/5 blur-[80px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#dccbb5]/20 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[480px] bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-xl overflow-hidden relative z-10 p-8 md:p-10"
            >
                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-[#4a3728]/10 mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 mb-4 flex items-center justify-center"
                    >
                        <img
                            src={imgLogoVcloset}
                            alt="V-Closet Logo"
                            className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(74,55,40,0.1)]"
                        />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-[#4a3728] tracking-tight">Cổng Quản Trị V-Closet</h2>
                    <p className="text-sm text-[#4a3728]/70 mt-1.5 font-medium">Dành riêng cho Quản trị viên & Kiểm duyệt viên</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide flex items-center gap-1.5 pl-1">
                            <Mail className="w-3.5 h-3.5" /> Email Quản Trị
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="admin@vcloset.com"
                            className="w-full h-12 bg-white rounded-xl border border-[#dccbb5]/80 px-4 text-sm text-[#4a3728] placeholder-[#a68d73]/60 focus:border-[#4a3728] focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide flex items-center gap-1.5 pl-1">
                            <Lock className="w-3.5 h-3.5" /> Mật khẩu
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full h-12 bg-white rounded-xl border border-[#dccbb5]/80 px-4 text-sm text-[#4a3728] placeholder-[#a68d73]/60 focus:border-[#4a3728] focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5"
                        >
                            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-rose-700 font-medium leading-relaxed">{error}</span>
                        </motion.div>
                    )}

                    {/* Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-12 bg-[#4a3728] hover:bg-[#3d2d21] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/10 cursor-pointer border-none transition-all disabled:bg-[#4a3728]/50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 text-sm font-semibold">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang xác thực...
                            </span>
                        ) : (
                            <>
                                <span>Đăng nhập hệ thống</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
