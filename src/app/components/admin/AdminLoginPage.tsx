import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ShieldAlert, Mail, Lock, ArrowRight, X, KeyRound, CheckCircle2 } from "lucide-react";
import { setToken, setRefreshToken, loginAdmin, forgotPassword, resetPassword, requestReactivation } from "@/lib/api";
import imgLogoVcloset from "@/assets/logoVcloset.png";

export function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Forgot password modal states
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [forgotStep, setForgotStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password, 3: Success
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState("");
    const [forgotSuccessMessage, setForgotSuccessMessage] = useState("");

    // Reactivation modal states
    const [showReactivationModal, setShowReactivationModal] = useState(false);
    const [reactivationEmail, setReactivationEmail] = useState("");
    const [reactivationLoading, setReactivationLoading] = useState(false);
    const [reactivationError, setReactivationError] = useState("");
    const [reactivationSuccess, setReactivationSuccess] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("expired") === "true") {
            setError("Tài khoản của bạn đã bị vô hiệu hoá hoặc phiên đăng nhập đã hết hạn!");
            // Xóa query param trên URL để khi reload không bị báo lại
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Gọi API đăng nhập thật từ backend
            const res = await loginAdmin({ email, password });
            
            // Danh sách các vai trò quản trị được phép truy cập (hỗ trợ cả chữ hoa và chữ thường)
            const allowedRoles = ["superadmin", "admin", "moderator"];
            const userRole = res.role ? res.role.toLowerCase() : "";
            if (!allowedRoles.includes(userRole)) {
                setError("Tài khoản của bạn không có quyền truy cập vào cổng quản trị.");
                setLoading(false);
                return;
            }

            // Tự động lưu Token nhận về từ API vào localStorage
            setToken(res.accessToken);
            setRefreshToken(res.refreshToken);

            // Lưu thông tin người dùng đăng nhập để hiển thị động trên UI
            localStorage.setItem("adminUser", JSON.stringify({
                displayName: res.displayName,
                email: res.email,
                role: res.role,
                avatarUrl: res.avatarUrl
            }));

            // Thành công chuyển hướng sang Dashboard quản trị
            navigate("/admin/dashboard");
        } catch (err: any) {
            console.error("Lỗi đăng nhập admin:", err);
            setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError("");
        setForgotLoading(true);
        try {
            const resText = await forgotPassword({ email: forgotEmail });
            setForgotSuccessMessage(resText || "Mã xác thực OTP đã được gửi đến email của bạn.");
            setForgotStep(2);
        } catch (err: any) {
            console.error("Lỗi gửi OTP quên mật khẩu:", err);
            setForgotError(err.message || "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng kiểm tra lại email.");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError("");
        if (newPassword !== confirmPassword) {
            setForgotError("Mật khẩu xác nhận không khớp.");
            return;
        }
        setForgotLoading(true);
        try {
            await resetPassword({
                email: forgotEmail,
                otpCode: otp,
                newPassword: newPassword
            });
            setForgotStep(3);
        } catch (err: any) {
            console.error("Lỗi đặt lại mật khẩu:", err);
            setForgotError(err.message || "Xác thực OTP thất bại hoặc mã OTP đã hết hạn.");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleRequestReactivation = async (e: React.FormEvent) => {
        e.preventDefault();
        setReactivationError("");
        setReactivationSuccess("");
        setReactivationLoading(true);
        try {
            const res = await requestReactivation({ email: reactivationEmail });
            setReactivationSuccess(res?.message || "Đã gửi yêu cầu mở lại tài khoản thành công.");
            setTimeout(() => {
                setShowReactivationModal(false);
            }, 3000);
        } catch (err: any) {
            console.error("Lỗi yêu cầu mở khóa:", err);
            setReactivationError(err.message || "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
        } finally {
            setReactivationLoading(false);
        }
    };


    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fcf8f2] dark:bg-background relative overflow-hidden font-poppins">
            {/* Fullscreen Animated Showcase Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif" 
                    alt="V-Closet Showcase"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
            </div>

            {/* Login Form Container */}
            <div className="w-full max-w-[480px] relative z-10 px-4">
                {/* Background decorative blurry circles with animations */}
                <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-[#4a3728]/20 dark:bg-amber-500/20 blur-[80px] animate-blob mix-blend-multiply dark:mix-blend-screen -z-10" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] rounded-full bg-[#dccbb5]/40 dark:bg-orange-500/20 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen -z-10" />
                <div className="absolute top-[30%] left-[10%] w-[250px] h-[250px] rounded-full bg-rose-500/20 dark:bg-rose-500/20 blur-[80px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/50 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10"
                >
                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-[#4a3728]/10 dark:border-primary/10 mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 mb-4 flex items-center justify-center"
                    >
                        <img
                            src={imgLogoVcloset}
                            alt="V-Closet Logo"
                            className="w-full h-full object-cover rounded-[22%] drop-shadow-[0_8px_16px_rgba(74,55,40,0.1)]"
                        />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-[#4a3728] dark:text-foreground tracking-tight">Cổng Quản Trị V-Closet</h2>
                    <p className="text-sm text-[#4a3728]/70 dark:text-foreground mt-1.5 font-medium">Dành riêng cho Quản trị viên & Kiểm duyệt viên</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide flex items-center gap-1.5 pl-1">
                            <Mail className="w-3.5 h-3.5" /> Email Quản Trị
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="admin@vcloset.com"
                            className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between pl-1">
                            <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5" /> Mật khẩu
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setForgotStep(1);
                                    setForgotEmail("");
                                    setOtp("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setForgotError("");
                                    setForgotSuccessMessage("");
                                    setShowForgotModal(true);
                                }}
                                className="text-xs font-semibold text-[#4a3728]/60 dark:text-foreground hover:text-[#4a3728] dark:text-foreground transition-colors cursor-pointer border-none bg-transparent hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5  dark:bg-red-500/10 border border-rose-100 rounded-xl flex flex-col gap-2.5"
                        >
                            <div className="flex items-start gap-2.5">
                                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <span className="text-xs  dark:text-red-400 font-medium leading-relaxed">{error}</span>
                            </div>
                            {(error.toLowerCase().includes("vô hiệu hoá") || error.toLowerCase().includes("bị khoá") || error.toLowerCase().includes("ngưng") || error.toLowerCase().includes("inactive")) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReactivationEmail(email);
                                        setReactivationError("");
                                        setReactivationSuccess("");
                                        setShowReactivationModal(true);
                                    }}
                                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline self-start ml-6 cursor-pointer bg-transparent border-none"
                                >
                                    Khôi phục tài khoản
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-12 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#4a3728]/10 cursor-pointer border-none transition-all disabled:bg-[#4a3728]/50 dark:bg-primary"
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

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3728]/45 dark:bg-primary backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-[480px] bg-card rounded-3xl shadow-2xl border border-[#dccbb5]/30 overflow-hidden p-8 relative z-50"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowForgotModal(false)}
                            className="absolute top-5 right-5 text-[#4a3728]/50 dark:text-foreground hover:text-[#4a3728] dark:text-foreground hover:bg-[#4a3728]/5 dark:bg-primary/5 p-1.5 rounded-full transition-all cursor-pointer border-none bg-transparent"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-[#4a3728]/10 dark:border-primary/10 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#4a3728]/5 dark:bg-primary/5 flex items-center justify-center text-[#4a3728] dark:text-foreground mb-3">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#4a3728] dark:text-foreground tracking-tight">Khôi phục mật khẩu</h3>
                            <p className="text-xs text-[#4a3728]/60 dark:text-foreground mt-1 font-medium">Dành cho tài khoản quản trị viên V-Closet</p>
                        </div>

                        {/* Step 1: Request OTP */}
                        {forgotStep === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide flex items-center gap-1.5 pl-1">
                                        <Mail className="w-3.5 h-3.5" /> Nhập Email Quản Trị
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="admin@vcloset.vn"
                                        className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                    />
                                </div>

                                {forgotError && (
                                    <div className="p-3.5  dark:bg-red-500/10 border border-rose-100 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                        <span className="text-xs  dark:text-red-400 font-medium leading-relaxed whitespace-pre-line text-left">{forgotError}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full h-12 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none transition-all disabled:bg-[#4a3728]/50 dark:bg-primary"
                                >
                                    {forgotLoading ? (
                                        <span className="flex items-center gap-2 text-sm font-semibold">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Đang gửi mã...
                                        </span>
                                    ) : (
                                        <>
                                            <span>Gửi mã OTP xác thực</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 2: Reset Password with OTP */}
                        {forgotStep === 2 && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="p-3  dark:bg-green-500/10 border border-emerald-100  dark:text-green-400 text-xs rounded-xl font-medium mb-2 leading-relaxed">
                                    {forgotSuccessMessage}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide pl-1">
                                        Mã OTP (Đã gửi qua Email)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nhập mã OTP 6 ký tự"
                                        className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground tracking-widest text-center font-bold placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide pl-1">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide pl-1">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                {forgotError && (
                                    <div className="p-3.5  dark:bg-red-500/10 border border-rose-100 rounded-xl flex items-start gap-2.5">
                                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                        <span className="text-xs  dark:text-red-400 font-medium leading-relaxed whitespace-pre-line text-left">{forgotError}</span>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep(1)}
                                        className="w-1/3 h-12 border border-[#dccbb5] dark:border-border hover:bg-[#4a3728]/5 dark:bg-primary/5 text-[#4a3728] dark:text-foreground font-bold rounded-xl text-xs transition-all cursor-pointer bg-transparent"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="flex-1 h-12 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none transition-all disabled:bg-[#4a3728]/50 dark:bg-primary text-sm"
                                    >
                                        {forgotLoading ? (
                                            <span className="flex items-center gap-2 text-sm font-semibold">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Đang thiết lập...
                                            </span>
                                        ) : (
                                            <span>Đặt lại mật khẩu</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Success Screen */}
                        {forgotStep === 3 && (
                            <div className="flex flex-col items-center justify-center text-center py-4 space-y-6">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    className="w-16 h-16 rounded-full  dark:bg-green-500/10 flex items-center justify-center  dark:text-green-400"
                                >
                                    <CheckCircle2 className="w-10 h-10" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-[#4a3728] dark:text-foreground">Đặt lại mật khẩu thành công!</h4>
                                    <p className="text-xs text-[#4a3728]/70 dark:text-foreground px-4 leading-relaxed font-medium">
                                        Mật khẩu quản trị của bạn đã được thay đổi thành công. Bạn hiện có thể đăng nhập bằng mật khẩu mới.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowForgotModal(false);
                                        setEmail(forgotEmail);
                                        setPassword("");
                                    }}
                                    className="w-full h-12 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold rounded-xl cursor-pointer border-none transition-all text-sm"
                                >
                                    Quay lại màn hình Đăng nhập
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Reactivation Modal */}
            {showReactivationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3728]/45 dark:bg-primary backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-[480px] bg-card rounded-3xl shadow-2xl border border-[#dccbb5]/30 overflow-hidden p-8 relative z-50"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowReactivationModal(false)}
                            className="absolute top-5 right-5 text-[#4a3728]/50 dark:text-foreground hover:text-[#4a3728] dark:text-foreground hover:bg-[#4a3728]/5 dark:bg-primary/5 p-1.5 rounded-full transition-all cursor-pointer border-none bg-transparent"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-[#4a3728]/10 dark:border-primary/10 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#4a3728]/5 dark:bg-primary/5 flex items-center justify-center text-[#4a3728] dark:text-foreground mb-3">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#4a3728] dark:text-foreground tracking-tight">Mở lại tài khoản</h3>
                            <p className="text-xs text-[#4a3728]/60 dark:text-foreground mt-1 font-medium">Gửi yêu cầu khôi phục tài khoản bị vô hiệu hoá</p>
                        </div>

                        <form onSubmit={handleRequestReactivation} className="space-y-5">
                            {reactivationSuccess ? (
                                <div className="p-4 bg-green-500/10 border border-green-200 text-green-700 text-sm rounded-xl font-medium text-center flex flex-col items-center justify-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    <span>{reactivationSuccess}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide flex items-center gap-1.5 pl-1">
                                            <Mail className="w-3.5 h-3.5" /> Nhập Email của bạn
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="admin@vcloset.vn"
                                            className="w-full h-12 bg-card rounded-xl border border-[#dccbb5]/80 dark:border-border px-4 text-sm text-[#4a3728] dark:text-foreground placeholder-[#a68d73]/60 dark:placeholder-muted-foreground focus:border-[#4a3728] dark:border-primary focus:ring-1 focus:ring-[#4a3728] outline-none transition-all"
                                            value={reactivationEmail}
                                            onChange={(e) => setReactivationEmail(e.target.value)}
                                        />
                                    </div>

                                    {reactivationError && (
                                        <div className="p-3.5 dark:bg-red-500/10 border border-rose-100 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                                            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <span className="text-xs dark:text-red-400 font-medium leading-relaxed whitespace-pre-line text-left">{reactivationError}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={reactivationLoading}
                                        className="w-full h-12 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none transition-all disabled:bg-[#4a3728]/50 dark:bg-primary"
                                    >
                                        {reactivationLoading ? (
                                            <span className="flex items-center gap-2 text-sm font-semibold">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Đang gửi yêu cầu...
                                            </span>
                                        ) : (
                                            <>
                                                <span>Gửi yêu cầu</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

