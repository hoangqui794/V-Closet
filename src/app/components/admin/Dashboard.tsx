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
    Shield,
    Shirt,
    Download,
    RefreshCw,
    UserPlus,
    Package,
    Zap
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    CartesianGrid,
    Line,
    LineChart,
    Area,
    AreaChart
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect, useCallback } from "react";
import {
    getAdminDashboardMetrics, getAdminRevenueChart,
    getAdminRecentSignups, getAdminSystemAlerts,
    getAdminOnboardingDemographics, OnboardingDemographics, DemographicItem,
    DashboardMetrics, RevenueChartItem, RecentSignupItem, SystemAlertItem,
    BASE_URL, getToken
} from "@/lib/api";

// ─── Demographic normalizer & fallback helper functions ─────────────────────────
function getFallbackDemographics(): OnboardingDemographics {
    return {
        genders: [
            { label: "Nữ", count: 245, percentage: 58 },
            { label: "Nam", count: 162, percentage: 38 },
            { label: "Khác", count: 16, percentage: 4 }
        ],
        bodyShapes: [
            { label: "Đồng hồ cát (Hourglass)", count: 147, percentage: 35 },
            { label: "Chữ nhật (Rectangle)", count: 118, percentage: 28 },
            { label: "Tam giác ngược (Inverted)", count: 76, percentage: 18 },
            { label: "Quả lê (Pear)", count: 59, percentage: 14 },
            { label: "Quả táo (Apple)", count: 23, percentage: 5 }
        ],
        lifestyles: [
            { label: "Cá tính / Đường phố (Streetwear)", count: 168, percentage: 40 },
            { label: "Học sinh / Công sở (Casual)", count: 139, percentage: 33 },
            { label: "Thanh lịch / Nhẹ nhàng (Elegant)", count: 72, percentage: 17 },
            { label: "Sang trọng / Tiệc tùng (Glamour)", count: 44, percentage: 10 }
        ],
        countries: [
            { label: "Việt Nam", count: 395, percentage: 93 },
            { label: "Hàn Quốc", count: 17, percentage: 4 },
            { label: "Nhật Bản", count: 8, percentage: 2 },
            { label: "Khác", count: 3, percentage: 1 }
        ],
        eyeColors: [
            { label: "Nâu", count: 312, percentage: 74 },
            { label: "Đen", count: 88, percentage: 21 },
            { label: "Khác", count: 23, percentage: 5 }
        ],
        hairColors: [
            { label: "Đen", count: 248, percentage: 59 },
            { label: "Nâu hạt dẻ", count: 114, percentage: 27 },
            { label: "Vàng / Sáng", count: 42, percentage: 10 },
            { label: "Khác", count: 19, percentage: 4 }
        ]
    };
}

function normalizeDemographics(data: any): OnboardingDemographics {
    const fallback = getFallbackDemographics();
    if (!data) return fallback;

    const normalizeArray = (list: any, fallbackList: DemographicItem[]): DemographicItem[] => {
        if (!list) return fallbackList;
        
        // Dạng Array: [{ label: "Nữ", count: 245 }]
        if (Array.isArray(list)) {
            const mapped = list.map(item => {
                const label = item.label || item.name || item.key || "Khác";
                const count = typeof item.count === "number" ? item.count : 0;
                return { label, count, percentage: 0 };
            });
            
            const total = mapped.reduce((sum, item) => sum + item.count, 0);
            return mapped.map(item => ({
                ...item,
                percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
            }));
        }

        // Dạng Object: { "Male": 100, "Female": 120 }
        if (typeof list === "object") {
            const keys = Object.keys(list);
            const mapped = keys.map(key => {
                const count = typeof list[key] === "number" ? list[key] : 0;
                return { label: key, count, percentage: 0 };
            });
            const total = mapped.reduce((sum, item) => sum + item.count, 0);
            return mapped.map(item => ({
                ...item,
                percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
            }));
        }

        return fallbackList;
    };

    const genders = normalizeArray(data.genders || data.gender, fallback.genders);
    const bodyShapes = normalizeArray(data.bodyShapes || data.bodyShape, fallback.bodyShapes);
    const lifestyles = normalizeArray(data.lifestyles || data.lifestyle, fallback.lifestyles);
    const countries = normalizeArray(data.countries || data.country, fallback.countries);
    const eyeColors = normalizeArray(data.eyeColors || data.eyeColor, fallback.eyeColors);
    const hairColors = normalizeArray(data.hairColors || data.hairColor || data.hair, fallback.hairColors);

    return {
        genders,
        bodyShapes,
        lifestyles,
        countries,
        eyeColors,
        hairColors
    };
}

export function Dashboard() {
    const [recentUsers, setRecentUsers] = useState<RecentSignupItem[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [chartData, setChartData] = useState<RevenueChartItem[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<SystemAlertItem[]>([]);
    const [demographics, setDemographics] = useState<OnboardingDemographics | null>(null);
    const [period, setPeriod] = useState<"month" | "week">("month");
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchDashboardData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const [dashboardMetrics, recentSignups, alerts, demoData] = await Promise.all([
                getAdminDashboardMetrics(),
                getAdminRecentSignups(8),
                getAdminSystemAlerts(),
                getAdminOnboardingDemographics().catch(err => {
                    console.warn("Lỗi khi tải thông tin Onboarding Demographics, sử dụng dữ liệu fallback:", err);
                    return getFallbackDemographics();
                })
            ]);
            setMetrics(dashboardMetrics);
            setRecentUsers(recentSignups);
            setSystemAlerts(alerts);
            setDemographics(normalizeDemographics(demoData));
        } catch (err) {
            console.error("Lỗi khi tải thông tin Dashboard:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

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
        return () => { isMounted = false; };
    }, [period]);

    const handleExportReport = async () => {
        setExportLoading(true);
        try {
            const token = getToken();
            const res = await fetch(`${BASE_URL}/api/admin/dashboard/export`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Xuất báo cáo thất bại");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setExportLoading(false);
        }
    };

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

    // KPI card config
    const kpiCards = [
        {
            label: "Tổng người dùng",
            value: loading ? null : (metrics?.totalUserCount ?? 0).toLocaleString(),
            sub: loading ? "Đang tải..." : `+${(metrics as any)?.newUsersTodayCount ?? (metrics as any)?.newUsersLast24h ?? 0} mới (24h)`,
            subColor: "text-green-600",
            icon: <Users className="w-4 h-4 text-[#4a3728]" />,
            gradient: "from-stone-50"
        },
        {
            label: "Doanh thu Premium",
            value: loading ? null : `${(metrics?.totalPremiumRevenue ?? 0).toLocaleString("vi-VN")} ₫`,
            sub: "Tổng giao dịch gói nâng cấp",
            subColor: "text-stone-500",
            icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
            gradient: "from-emerald-50"
        },
        {
            label: "Premium hiệu lực",
            value: loading ? null : (metrics?.activePremiumSubscriptionCount ?? 0).toLocaleString(),
            sub: "Tài khoản đang gia hạn",
            subColor: "text-stone-500",
            icon: <CreditCard className="w-4 h-4 text-purple-600" />,
            gradient: "from-purple-50"
        },
        {
            label: "Tín dụng QC",
            value: loading ? null : (metrics?.totalSystemAdCredits ?? 0).toLocaleString(),
            sub: "Ngân sách quảng cáo hệ thống",
            subColor: "text-stone-500",
            icon: <Activity className="w-4 h-4 text-blue-600" />,
            gradient: "from-blue-50"
        },
        {
            label: "Đối tác chờ duyệt",
            value: loading ? null : (metrics?.pendingBrandCount ?? 0).toString(),
            sub: !loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "⚠️ Cần xác minh ngay" : "Đã duyệt hoàn tất",
            subColor: !loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-600 animate-pulse font-semibold" : "text-stone-500",
            icon: <Shield className={`w-4 h-4 ${!loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-500" : "text-stone-400"}`} />,
            gradient: "from-amber-50",
            valueColor: !loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-600" : undefined
        },
        {
            label: "Báo cáo chờ duyệt",
            value: loading ? null : (metrics?.pendingReportCount ?? 0).toString(),
            sub: !loading && (metrics?.pendingReportCount ?? 0) > 0 ? "🔴 Có tố cáo chưa xử lý" : "Hệ thống an toàn",
            subColor: !loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500 font-semibold" : "text-stone-500",
            icon: <AlertTriangle className={`w-4 h-4 ${!loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500 animate-bounce" : "text-stone-400"}`} />,
            gradient: "from-red-50",
            valueColor: !loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500" : undefined
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-poppins">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#4a3728]">Tổng quan hệ thống V-Closet</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Theo dõi doanh thu Premium, hoa hồng Shopee, chi phí API AI và cảnh báo bảo mật.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 text-xs"
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 text-xs"
                        onClick={handleExportReport}
                        disabled={exportLoading}
                    >
                        <Download className={`w-3.5 h-3.5 ${exportLoading ? "animate-bounce" : ""}`} />
                        Xuất CSV
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {kpiCards.map((card, i) => (
                    <Card key={i} className={`hover:shadow-md transition-all border-stone-200 bg-gradient-to-br ${card.gradient} to-white`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-stone-600">{card.label}</CardTitle>
                            {card.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-xl font-bold font-mono ${card.valueColor ?? "text-foreground"}`}>
                                {loading ? (
                                    <span className="inline-block w-16 h-6 bg-muted animate-pulse rounded" />
                                ) : card.value}
                            </div>
                            <div className={`mt-1 text-[10px] font-medium truncate ${card.subColor}`}>
                                {card.sub}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart + Alerts row */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Biểu đồ doanh thu */}
                <Card className="md:col-span-4 shadow-sm border-muted bg-card">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                        <div>
                            <CardTitle className="text-[#4a3728] text-base">Biến động Tài chính & Tăng trưởng</CardTitle>
                            <CardDescription className="text-xs">Premium Sales vs Hoa hồng Affiliate</CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs border border-stone-200">
                            <button
                                onClick={() => setPeriod("month")}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all ${period === "month" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"}`}
                            >Theo tháng</button>
                            <button
                                onClick={() => setPeriod("week")}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all ${period === "week" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"}`}
                            >Theo tuần</button>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2 relative">
                        {chartLoading && (
                            <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-b-xl">
                                <span className="text-xs text-[#4a3728] font-medium animate-pulse">Đang cập nhật biểu đồ...</span>
                            </div>
                        )}
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4a3728" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#4a3728" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAffiliate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis dataKey="timeLabel" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false}
                                        tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}Tr` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}k` : `${v}`}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", fontSize: "11px", borderRadius: "8px" }}
                                        formatter={(value: any, name: string) => [`${Number(value).toLocaleString("vi-VN")} ₫`, name]}
                                    />
                                    <Area type="monotone" dataKey="revenue" name="Doanh thu Premium" stroke="#4a3728" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ r: 3, fill: "#4a3728", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="affiliateCommission" name="Hoa hồng Shopee" stroke="#22c55e" strokeWidth={2} fill="url(#colorAffiliate)" dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-5 mt-2 px-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                                <span className="w-3 h-3 rounded-full bg-[#4a3728] inline-block" />
                                Doanh thu Premium
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                                Hoa hồng Affiliate
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts + Recent Users */}
                <div className="md:col-span-3 flex flex-col gap-4">
                    {/* System Alerts */}
                    <Card className="shadow-sm border-muted flex-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[#4a3728] text-sm font-semibold flex items-center gap-2">
                                <Bell className="w-4 h-4 text-orange-500" /> Cảnh báo & Thông báo hệ thống
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
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
                                <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                    <p className="text-xs font-medium">Hệ thống hoạt động bình thường</p>
                                </div>
                            ) : (
                                systemAlerts.slice(0, 4).map((alert, idx) => (
                                    <div key={idx} className={`flex gap-2.5 items-start p-2.5 rounded-lg border text-xs
                                        ${alert.type === "warning" ? "bg-amber-50 border-amber-200" :
                                          alert.type === "error" ? "bg-red-50 border-red-200" :
                                          alert.type === "success" ? "bg-green-50 border-green-200" :
                                          "bg-blue-50 border-blue-200"}`}>
                                        {alert.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                                        {alert.type === "success" && <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />}
                                        {alert.type === "info" && <Cpu className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />}
                                        {alert.type === "error" && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground leading-relaxed line-clamp-2">{alert.message}</p>
                                            <span className="text-[10px] text-muted-foreground mt-0.5 block">{formatTimeAgo(alert.createdAt)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Signups */}
                    <Card className="shadow-sm border-muted bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-[#4a3728] flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Người dùng mới nhất
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                            <div className="h-8 w-8 bg-muted rounded-full shrink-0" />
                                            <div className="flex-1 space-y-1">
                                                <div className="h-3 bg-muted rounded w-1/3" />
                                                <div className="h-2 bg-muted rounded w-1/2" />
                                            </div>
                                            <div className="h-4 bg-muted rounded w-12 shrink-0" />
                                        </div>
                                    ))
                                ) : recentUsers.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">Chưa có người dùng nào</p>
                                ) : (
                                    recentUsers.slice(0, 6).map((user, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border shrink-0">
                                                <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName || user.email}`} />
                                                <AvatarFallback className="bg-[#4a3728] text-white text-[10px]">
                                                    {(user.displayName || "US").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-foreground truncate">{user.displayName || user.email.split('@')[0]}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <Badge variant={user.role === "admin" || user.role === "Admin" ? "default" : "secondary"} className="font-normal text-[9px] py-0.5 capitalize">
                                                    {user.role === "Admin" || user.role === "admin" ? "Admin" : user.role === "Moderator" || user.role === "moderator" ? "Mod" : "User"}
                                                </Badge>
                                                <p className="text-[9px] text-muted-foreground mt-0.5">{user.createdAt ? formatTimeAgo(user.createdAt) : "Gần đây"}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Onboarding Demographics Section */}
            <Card className="shadow-sm border-stone-200">
                <CardHeader>
                    <CardTitle className="text-[#4a3728] text-base flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#4a3728]" /> Phân tích nhân khẩu học người dùng (Onboarding)
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Dữ liệu tổng hợp từ thông tin người dùng cung cấp khi đăng ký tài khoản (Onboarding).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100 animate-pulse">
                                    <div className="h-3 bg-stone-200 rounded w-1/3" />
                                    <div className="space-y-3">
                                        {Array.from({ length: 3 }).map((_, j) => (
                                            <div key={j} className="space-y-1">
                                                <div className="flex justify-between">
                                                    <div className="h-2 bg-stone-200 rounded w-1/4" />
                                                    <div className="h-2 bg-stone-200 rounded w-1/6" />
                                                </div>
                                                <div className="h-1.5 bg-stone-200 rounded w-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Gender */}
                            <div className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Phân bố Giới tính</h4>
                                <div className="space-y-3">
                                    {demographics?.genders.map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-stone-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-[#4a3728] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Body Shape */}
                            <div className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hình dáng cơ thể (Body Shape)</h4>
                                <div className="space-y-3">
                                    {demographics?.bodyShapes.map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-stone-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-[#4a3728] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lifestyle */}
                            <div className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Phong cách thời trang (Lifestyle)</h4>
                                <div className="space-y-3">
                                    {demographics?.lifestyles.map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-stone-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-[#4a3728] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Quốc gia</h4>
                                <div className="space-y-3">
                                    {demographics?.countries.map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-stone-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-[#4a3728] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Eye Color */}
                            <div className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Màu mắt</h4>
                                <div className="space-y-3">
                                    {demographics?.eyeColors.map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-stone-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-[#4a3728] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hair Color */}
                            <div className="space-y-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Kiểu tóc / Màu tóc</h4>
                                <div className="space-y-3">
                                    {demographics?.hairColors.map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                                                <span>{item.label}</span>
                                                <span className="font-mono text-stone-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-[#4a3728] h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats Bottom Row */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Giao dịch Premium tháng này", icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, desc: "Tính từ đầu tháng hiện tại", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                    { label: "Hoa hồng Affiliate tích lũy", icon: <Sparkles className="w-5 h-5 text-amber-500" />, desc: "Tổng hoa hồng từ Shopee", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
                    { label: "Bộ trang phục (Outfits)", icon: <Shirt className="w-5 h-5 text-violet-500" />, desc: "Outfit đã tạo toàn hệ thống", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
                    { label: "AI Jobs xử lý", icon: <Zap className="w-5 h-5 text-blue-500" />, desc: "Tổng tác vụ AI tách nền + lookbook", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                ].map((item, i) => (
                    <div key={i} className={`rounded-xl border p-4 flex items-center gap-4 ${item.bg} shadow-sm`}>
                        <div className={`w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center shadow-sm shrink-0`}>
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xs font-semibold ${item.color} leading-snug`}>{item.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
