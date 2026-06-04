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
    CartesianGrid,
    Line,
    LineChart
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect } from "react";
import {
    getAdminDashboardMetrics, getAdminRevenueChart,
    getAdminRecentSignups, getAdminSystemAlerts,
    DashboardMetrics, RevenueChartItem, RecentSignupItem, SystemAlertItem
} from "@/lib/api";


export function Dashboard() {
    const [recentUsers, setRecentUsers] = useState<RecentSignupItem[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [chartData, setChartData] = useState<RevenueChartItem[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<SystemAlertItem[]>([]);
    const [period, setPeriod] = useState<"month" | "week">("month");
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchDashboardData() {
            try {
                const [dashboardMetrics, recentSignups, alerts] = await Promise.all([
                    getAdminDashboardMetrics(),
                    getAdminRecentSignups(5),
                    getAdminSystemAlerts()
                ]);
                if (!isMounted) return;
                setMetrics(dashboardMetrics);
                setRecentUsers(recentSignups);
                setSystemAlerts(alerts);
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

    useEffect(() => {
        let isMounted = true;
        async function fetchChartData() {
            try {
                setChartLoading(true);
                const revenueChartData = await getAdminRevenueChart(period);
                if (!isMounted) return;
                setChartData(revenueChartData);
            } catch (err) {
                console.error(`Lỗi khi tải biểu đồ theo ${period}:`, err);
            } finally {
                if (isMounted) setChartLoading(false);
            }
        }

        fetchChartData();
        return () => {
            isMounted = false;
        };
    }, [period]);

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
                            (metrics?.totalUserCount ?? 0).toLocaleString()
                            )}
                        </div>
                        <div className="flex items-center mt-1 text-[10px] text-green-600 font-medium">
                            <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
                            {loading ? "Đang tải..." : `+${metrics?.newUsersTodayCount ?? 0} mới (24h)`}
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
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                        <div>
                            <CardTitle className="text-[#4a3728] text-lg">Biến động Tài chính & Tăng trưởng</CardTitle>
                            <CardDescription>
                                Biểu đồ thống kê Premium Sales vs Hoa hồng Affiliate.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs border border-stone-200">
                            <button
                                onClick={() => setPeriod("month")}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                                    period === "month"
                                        ? "bg-white text-stone-900 shadow-sm"
                                        : "text-stone-500 hover:text-stone-900"
                                }`}
                            >
                                Theo tháng
                            </button>
                            <button
                                onClick={() => setPeriod("week")}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                                    period === "week"
                                        ? "bg-white text-stone-900 shadow-sm"
                                        : "text-stone-500 hover:text-stone-900"
                                }`}
                            >
                                Theo tuần
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2 relative">
                        {chartLoading && (
                            <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <span className="text-xs text-[#4a3728] font-medium animate-pulse">Đang cập nhật biểu đồ...</span>
                            </div>
                        )}
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis
                                        dataKey="timeLabel"
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
                                        tickFormatter={(value) => {
                                            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Tr`;
                                            if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
                                            return `${value} ₫`;
                                        }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            fontSize: "11px",
                                            borderRadius: "8px"
                                        }}
                                        formatter={(value: any, name: string) => {
                                            if (name.includes("Xu hướng")) {
                                                return [`${Number(value).toLocaleString("vi-VN")} ₫ (Xu hướng)`, name];
                                            }
                                            return [`${Number(value).toLocaleString("vi-VN")} ₫`, name];
                                        }}
                                    />
                                    {/* Actual Lines */}
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Doanh thu Premium"
                                        stroke="#4a3728"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#4a3728", strokeWidth: 0 }}
                                        activeDot={{ r: 7, fill: "#4a3728" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="affiliateCommission"
                                        name="Hoa hồng Shopee"
                                        stroke="#22c55e"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                                        activeDot={{ r: 7, fill: "#22c55e" }}
                                    />

                                </LineChart>
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
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-muted/20 border border-muted animate-pulse">
                                        <div className="w-4 h-4 bg-muted rounded-full shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3 bg-muted rounded w-full" />
                                            <div className="h-2 bg-muted rounded w-1/3" />
                                        </div>
                                    </div>
                                ))
                            ) : systemAlerts.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-4">Không có cảnh báo nào</p>
                            ) : (
                                systemAlerts.map((alert, idx) => (
                                    <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-muted/20 border border-muted text-xs">
                                        {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                                        {alert.type === "success" && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                                        {alert.type === "info" && <Cpu className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                                        {alert.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground leading-relaxed">{alert.message}</p>
                                            <span className="text-[10px] text-muted-foreground mt-1 block">{formatTimeAgo(alert.createdAt)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
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
