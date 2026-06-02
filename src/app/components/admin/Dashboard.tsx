import {
    Users,
    ShoppingBag,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Cpu,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    Bell,
    DollarSign,
    Shield
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "../ui/card";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Area,
    AreaChart,
    CartesianGrid
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect } from "react";
import { getAdminUsers, getAdminDashboardMetrics, AdminUser, DashboardMetrics } from "@/lib/api";

const data = [
    { name: "Tháng 1", total: 1500, users: 120, affiliate: 450 },
    { name: "Tháng 2", total: 2300, users: 180, affiliate: 620 },
    { name: "Tháng 3", total: 1800, users: 150, affiliate: 500 },
    { name: "Tháng 4", total: 3200, users: 240, affiliate: 890 },
    { name: "Tháng 5", total: 4100, users: 310, affiliate: 1200 },
    { name: "Tháng 6", total: 4800, users: 420, affiliate: 1540 },
];

const systemAlerts = [
    { id: 1, type: "warning", message: "Số dư tài khoản FASHN AI API còn dưới $15. Vui lòng nạp thêm tiền.", time: "10 phút trước" },
    { id: 2, type: "success", message: "Crawler tự động cào 12 sản phẩm trending Shopee hoàn tất.", time: "2 giờ trước" },
    { id: 3, type: "info", message: "User Nguyễn Văn A (Free) vừa đạt giới hạn 5 lượt tách nền trong tháng.", time: "4 giờ trước" },
    { id: 4, type: "success", message: "Giao dịch thành công gói Premium Yearly từ user Trần Thị B ($89.99).", time: "5 giờ trước" },
];

export function Dashboard() {
    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
    const [newUsersTodayCount, setNewUsersTodayCount] = useState<number>(0);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchDashboardData() {
            try {
                // Fetch the latest 50 users from the API and dashboard metrics in parallel
                const [usersData, dashboardMetrics] = await Promise.all([
                    getAdminUsers({ page: 1, pageSize: 50 }),
                    getAdminDashboardMetrics()
                ]);
                if (!isMounted) return;

                const usersList = usersData.items || usersData.users || [];
                setTotalUsers(usersData.totalCount || usersList.length);
                setRecentUsers(usersList.slice(0, 5)); // Show top 5 recent users in widget

                // Count users registered in the last 24 hours
                const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
                const todaySignups = usersList.filter(user => {
                    if (!user.createdAt) return false;
                    return new Date(user.createdAt).getTime() > oneDayAgo;
                });
                setNewUsersTodayCount(todaySignups.length);
                setMetrics(dashboardMetrics);
            } catch (err) {
                console.error("Lỗi khi tải thông tin Dashboard:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDashboardData();
        return () => {
            isMounted = false;
        };
    }, []);

    // Time ago formatter helper
    const formatTimeAgo = (dateStr: string) => {
        try {
            const diffMs = new Date().getTime() - new Date(dateStr).getTime();
            const diffMins = Math.floor(diffMs / (60 * 1000));
            if (diffMins < 1) return "Vừa xong";
            if (diffMins < 60) return `${diffMins} phút trước`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours} giờ trước`;
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} ngày trước`;
        } catch {
            return "Gần đây";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-poppins">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Tổng quan hệ thống V-Closet</h2>
                    <p className="text-muted-foreground mt-1">
                        Theo dõi doanh thu Premium, hoa hồng Shopee, chi phí API AI và cảnh báo bảo mật thời gian thực.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Xuất báo cáo</Button>
                    <Button className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">Cập nhật chỉ số</Button>
                </div>
            </div>

            {/* Hàng chỉ số KPI chính (6 Cards) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {/* 1. Tổng người dùng */}
                <Card className="hover:shadow-md transition-shadow border-stone-200 bg-[#fdfaf7]/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-stone-600">Tổng người dùng</CardTitle>
                        <Users className="w-4 h-4 text-[#4a3728]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-foreground font-mono">
                            {loading ? (
                                <span className="inline-block w-16 h-6 bg-muted animate-pulse rounded" />
                            ) : (
                                (metrics?.totalUserCount ?? totalUsers ?? 0).toLocaleString()
                            )}
                        </div>
                        <div className="flex items-center mt-1 text-[10px] text-green-600 font-medium">
                            <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
                            {loading ? "Đang tải..." : `+${newUsersTodayCount} mới (24h)`}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Doanh thu Premium */}
                <Card className="hover:shadow-md transition-shadow border-stone-200 bg-[#fdfaf7]/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-stone-600">Doanh thu Premium</CardTitle>
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-foreground font-mono truncate">
                            {loading ? (
                                <span className="inline-block w-20 h-6 bg-muted animate-pulse rounded" />
                            ) : (
                                `${(metrics?.totalPremiumRevenue ?? 0).toLocaleString("vi-VN")} ₫`
                            )}
                        </div>
                        <div className="flex items-center mt-1 text-[10px] text-stone-500 font-medium truncate">
                            Giao dịch gói nâng cấp
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Gói Premium hoạt động */}
                <Card className="hover:shadow-md transition-shadow border-stone-200 bg-[#fdfaf7]/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-stone-600">Premium hiệu lực</CardTitle>
                        <CreditCard className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-foreground font-mono">
                            {loading ? (
                                <span className="inline-block w-12 h-6 bg-muted animate-pulse rounded" />
                            ) : (
                                metrics?.activePremiumSubscriptionCount ?? 0
                            )}
                        </div>
                        <div className="flex items-center mt-1 text-[10px] text-stone-500 font-medium">
                            Tài khoản đang gia hạn
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Tín dụng quảng cáo */}
                <Card className="hover:shadow-md transition-shadow border-stone-200 bg-[#fdfaf7]/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-stone-600">Tín dụng Quảng cáo</CardTitle>
                        <Activity className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-foreground font-mono truncate">
                            {loading ? (
                                <span className="inline-block w-24 h-6 bg-muted animate-pulse rounded" />
                            ) : (
                                `${(metrics?.totalSystemAdCredits ?? 0).toLocaleString()}`
                            )}
                        </div>
                        <div className="flex items-center mt-1 text-[10px] text-stone-500 font-medium truncate">
                            Ngân sách QC hệ thống
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Thương hiệu chờ duyệt */}
                <Card className="hover:shadow-md transition-shadow border-stone-200 bg-[#fdfaf7]/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-stone-600">Đối tác chờ duyệt</CardTitle>
                        <Shield className="w-4 h-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl font-bold font-mono ${!loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-600" : "text-foreground"}`}>
                            {loading ? (
                                <span className="inline-block w-12 h-6 bg-muted animate-pulse rounded" />
                            ) : (
                                metrics?.pendingBrandCount ?? 0
                            )}
                        </div>
                        <div className={`flex items-center mt-1 text-[10px] font-medium ${!loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-600 animate-pulse" : "text-stone-500"}`}>
                            {!loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "⚠️ Cần xác minh ngay" : "Đã duyệt hoàn tất"}
                        </div>
                    </CardContent>
                </Card>

                {/* 6. Báo cáo chờ xử lý */}
                <Card className="hover:shadow-md transition-shadow border-stone-200 bg-[#fdfaf7]/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold text-stone-600">Báo cáo chờ duyệt</CardTitle>
                        <AlertTriangle className={`w-4 h-4 ${!loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500 animate-bounce" : "text-stone-400"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl font-bold font-mono ${!loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500" : "text-foreground"}`}>
                            {loading ? (
                                <span className="inline-block w-12 h-6 bg-muted animate-pulse rounded" />
                            ) : (
                                metrics?.pendingReportCount ?? 0
                            )}
                        </div>
                        <div className={`flex items-center mt-1 text-[10px] font-medium ${!loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500" : "text-stone-500"}`}>
                            {!loading && (metrics?.pendingReportCount ?? 0) > 0 ? "🔴 Có tố cáo chưa duyệt" : "Hệ thống an toàn"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 2: Biểu đồ và Cảnh báo máy chủ */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* 1. Biểu đồ doanh thu & tăng trưởng */}
                <Card className="md:col-span-4 lg:col-span-4 shadow-sm border-muted bg-card">
                    <CardHeader>
                        <CardTitle className="text-[#4a3728] text-lg">Biến động Tài chính & Tăng trưởng</CardTitle>
                        <CardDescription>
                            Biểu đồ thống kê Premium Sales vs Hoa hồng Affiliate trong 6 tháng gần nhất.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAffiliate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            fontSize: "11px",
                                            borderRadius: "8px"
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        name="Doanh thu Premium"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="affiliate"
                                        name="Hoa hồng Shopee"
                                        stroke="#22c55e"
                                        fillOpacity={1}
                                        fill="url(#colorAffiliate)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Cảnh báo hệ thống & Người dùng mới */}
                <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-6">
                    {/* Hộp cảnh báo AI và Hệ thống */}
                    <Card className="shadow-sm border-muted">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[#4a3728] text-sm font-semibold flex items-center gap-2">
                                <Bell className="w-4 h-4 text-orange-500" /> Bảng tin hệ thống & Cảnh báo API
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {systemAlerts.map((alert) => (
                                <div key={alert.id} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-muted/20 border border-muted text-xs">
                                    {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                                    {alert.type === "success" && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                                    {alert.type === "info" && <Cpu className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                                    
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground leading-relaxed">{alert.message}</p>
                                        <span className="text-[10px] text-muted-foreground mt-1 block">{alert.time}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Danh sách người dùng mới */}
                    <Card className="shadow-sm border-muted bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-[#4a3728]">Đăng ký mới gần đây</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    // Hiệu ứng xương (Skeleton) khi đang tải dữ liệu
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                            <div className="h-8 w-8 bg-muted rounded-full" />
                                            <div className="flex-1 space-y-1">
                                                <div className="h-3 bg-muted rounded w-1/3" />
                                                <div className="h-2 bg-muted rounded w-1/2" />
                                            </div>
                                            <div className="h-4 bg-muted rounded w-10" />
                                        </div>
                                    ))
                                ) : recentUsers.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">Chưa có người dùng đăng ký gần đây</p>
                                ) : (
                                    recentUsers.map((user, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName || user.email}`} />
                                                <AvatarFallback className="bg-[#4a3728] text-white text-[10px]">
                                                    {(user.displayName || "US").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate">
                                                    {user.displayName || user.email.split('@')[0]}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={user.role === "admin" || user.role === "superadmin" ? "default" : "secondary"} className="font-normal text-[9px] py-0.5 capitalize">
                                                    {user.role === "admin" || user.role === "superadmin" ? "Admin" : user.role === "moderator" ? "Moderator" : "Customer"}
                                                </Badge>
                                                <p className="text-[9px] text-muted-foreground mt-0.5">
                                                    {user.createdAt ? formatTimeAgo(user.createdAt) : "Gần đây"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
