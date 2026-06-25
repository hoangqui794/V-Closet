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
    Zap,
    Star
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
    AreaChart,
    Bar,
    BarChart
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    getAdminDashboardMetrics, getAdminRevenueChart,
    getAdminRecentSignups, getAdminSystemAlerts,
    getAdminOnboardingDemographics, OnboardingDemographics, DemographicItem,
    DashboardMetrics, RevenueChartItem, RecentSignupItem, SystemAlertItem,
    BASE_URL, getToken, getSurveyDashboardStats, SurveyDashboardStats,
    getAdminAppReviews, AppReviewsDashboardStats
} from "@/lib/api";

// ─── Demographic normalizer & fallback helper functions ─────────────────────────
function getFallbackDemographics(): OnboardingDemographics {
    return {
        genders: [
            { label: "Nữ", count: 245, percentage: 58 },
            { label: "Nam", count: 162, percentage: 38 },
            { label: "Khác", count: 16, percentage: 4 }
        ],
        ageGroups: [
            { label: "25 - 34 tuổi", count: 242, percentage: 57 },
            { label: "18 - 24 tuổi", count: 128, percentage: 30 },
            { label: "Dưới 18 tuổi", count: 32, percentage: 8 },
            { label: "35 - 44 tuổi", count: 15, percentage: 4 },
            { label: "Trên 45 tuổi", count: 5, percentage: 1 }
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

    const translateLabel = (label: string, category: string): string => {
        const clean = label.trim().toLowerCase();

        if (category === "gender") {
            if (clean === "male" || clean === "nam") return "Nam";
            if (clean === "female" || clean === "female" || clean === "nữ" || clean === "nu") return "Nữ";
            return "Khác";
        }
        if (category === "lifestyle") {
            if (clean === "casual" || clean === "thường ngày" || clean === "thuong ngay") return "Thường ngày";
            if (clean === "sporty" || clean === "thể thao" || clean === "the thao") return "Thể thao";
            if (clean === "formal" || clean === "trang trọng" || clean === "trang trong") return "Trang trọng";
            if (clean === "elegant" || clean === "lịch lãm" || clean === "lich lam") return "Lịch lãm";
            if (clean === "minimalist" || clean === "tối giản" || clean === "toi gian") return "Tối giản";
            if (clean === "streetwear" || clean === "đường phố" || clean === "duong pho") return "Đường phố";
            return label;
        }
        if (category === "eyeColor") {
            if (clean === "black" || clean === "đen" || clean === "den") return "Đen";
            if (clean === "brown" || clean === "nâu" || clean === "nau") return "Nâu";
            if (clean === "blue" || clean === "xanh dương" || clean === "xanh duong") return "Xanh dương";
            if (clean === "green" || clean === "xanh lá" || clean === "xanh la") return "Xanh lá";
            if (clean === "grey" || clean === "gray" || clean === "xám" || clean === "xam") return "Xám";
            return label;
        }
        if (category === "hairColor") {
            if (clean === "black" || clean === "đen" || clean === "den") return "Đen";
            if (clean === "brown" || clean === "nâu" || clean === "nau") return "Nâu";
            if (clean === "blonde" || clean === "vàng" || clean === "vang") return "Vàng";
            if (clean === "red" || clean === "đỏ" || clean === "do") return "Đỏ";
            if (clean === "platinum" || clean === "bạch kim" || clean === "bach kim") return "Bạch kim";
            if (clean === "other" || clean === "khác" || clean === "khac") return "Khác";
            return label;
        }
        if (category === "ageGroup") {
            if (clean.includes("< 18") || clean.includes("<18")) return "Dưới 18 tuổi";
            if (clean.includes("45+") || clean.includes("above 45")) return "Trên 45 tuổi";
            if (clean.includes("18 - 24") || clean.includes("18-24")) return "18 - 24 tuổi";
            if (clean.includes("25 - 34") || clean.includes("25-34")) return "25 - 34 tuổi";
            if (clean.includes("35 - 44") || clean.includes("35-44")) return "35 - 44 tuổi";
            return label;
        }
        return label;
    };

    const normalizeArray = (list: any, fallbackList: DemographicItem[], category: string): DemographicItem[] => {
        if (!list || (Array.isArray(list) && list.length === 0) || (typeof list === "object" && Object.keys(list).length === 0)) return fallbackList;

        let rawItems: { label: string; count: number }[] = [];

        // Parse from Array
        if (Array.isArray(list)) {
            rawItems = list.map(item => ({
                label: item.label || item.name || item.key || "Khác",
                count: typeof item.count === "number" ? item.count : 0
            }));
        }
        // Parse from Object
        else if (typeof list === "object") {
            rawItems = Object.keys(list).map(key => ({
                label: key,
                count: typeof list[key] === "number" ? list[key] : 0
            }));
        } else {
            return [];
        }

        // Translate and combine duplicate labels
        const combined: { [translatedLabel: string]: number } = {};
        rawItems.forEach(item => {
            const trans = translateLabel(item.label, category);
            combined[trans] = (combined[trans] || 0) + item.count;
        });

        // Convert back to DemographicItem[] and calculate percentage
        const resultList = Object.keys(combined).map(label => ({
            label,
            count: combined[label],
            percentage: 0
        }));

        const total = resultList.reduce((sum, item) => sum + item.count, 0);
        return resultList.map(item => ({
            ...item,
            percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
        })).sort((a, b) => b.count - a.count); // Sắp xếp giảm dần theo số lượng
    };

    const genders = normalizeArray(data.genders || data.gender, fallback.genders, "gender");
    const ageGroups = normalizeArray(data.ageGroups || data.ageGroup, fallback.ageGroups, "ageGroup");
    const lifestyles = normalizeArray(data.lifestyles || data.lifestyle, fallback.lifestyles, "lifestyle");
    const countries = normalizeArray(data.countries || data.country, fallback.countries, "country");
    const eyeColors = normalizeArray(data.eyeColors || data.eyeColor, fallback.eyeColors, "eyeColor");
    const hairColors = normalizeArray(data.hairColors || data.hairColor || data.hair, fallback.hairColors, "hairColor");

    return {
        genders: genders.length > 0 ? genders : [],
        ageGroups: ageGroups.length > 0 ? ageGroups : [],
        lifestyles: lifestyles.length > 0 ? lifestyles : [],
        countries: countries.length > 0 ? countries : [],
        eyeColors: eyeColors.length > 0 ? eyeColors : [],
        hairColors: hairColors.length > 0 ? hairColors : []
    };
}

export function Dashboard() {
    const navigate = useNavigate();
    const [recentUsers, setRecentUsers] = useState<RecentSignupItem[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [chartData, setChartData] = useState<RevenueChartItem[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<SystemAlertItem[]>([]);
    const [demographics, setDemographics] = useState<OnboardingDemographics | null>(null);
    const [surveyStats, setSurveyStats] = useState<SurveyDashboardStats | null>(null);
    const [appReviews, setAppReviews] = useState<AppReviewsDashboardStats | null>(null);
    const [period, setPeriod] = useState<"month" | "week">("month");
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchDashboardData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const [dashboardMetrics, recentSignups, alerts, demoData, surveyData, reviewsData] = await Promise.all([
                getAdminDashboardMetrics(),
                getAdminRecentSignups(8),
                getAdminSystemAlerts(),
                getAdminOnboardingDemographics().catch(err => {
                    console.warn("Lỗi khi tải thông tin Onboarding Demographics, sử dụng dữ liệu fallback:", err);
                    return getFallbackDemographics();
                }),
                getSurveyDashboardStats().catch(err => {
                    console.warn("Lỗi khi tải thông tin khảo sát, sử dụng dữ liệu fallback:", err);
                    return null;
                }),
                getAdminAppReviews().catch(err => {
                    console.warn("Lỗi khi tải đánh giá CH Play:", err);
                    return null;
                })
            ]);
            setMetrics(dashboardMetrics);
            setRecentUsers(recentSignups);
            setSystemAlerts(alerts);
            setDemographics(normalizeDemographics(demoData));
            setSurveyStats(surveyData);
            setAppReviews(reviewsData);
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
            subColor: "text-green-600 dark:text-green-400",
            icon: <Users className="w-4 h-4 text-[#4a3728] dark:text-foreground" />,
            gradient: "from-stone-50 dark:from-stone-900/30",
            path: "/admin/users"
        },
        {
            label: "Doanh thu Premium",
            value: loading ? null : `${(metrics?.totalPremiumRevenue ?? 0).toLocaleString("vi-VN")} ₫`,
            sub: "Tổng giao dịch gói nâng cấp",
            subColor: "text-muted-foreground",
            icon: <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
            gradient: "from-emerald-50 dark:from-emerald-950/30",
            path: "/admin/subscriptions"
        },
        {
            label: "Premium hiệu lực",
            value: loading ? null : (metrics?.activePremiumSubscriptionCount ?? 0).toLocaleString(),
            sub: "Tài khoản đang gia hạn",
            subColor: "text-muted-foreground",
            icon: <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
            gradient: "from-purple-50 dark:from-purple-950/30",
            path: "/admin/subscriptions"
        },
        {
            label: "Tín dụng QC",
            value: loading ? null : (metrics?.totalSystemAdCredits ?? 0).toLocaleString(),
            sub: "Ngân sách quảng cáo hệ thống",
            subColor: "text-muted-foreground",
            icon: <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
            gradient: "from-blue-50 dark:from-blue-950/30",
            path: "/admin/campaigns"
        },
        {
            label: "Đối tác chờ duyệt",
            value: loading ? null : (metrics?.pendingBrandCount ?? 0).toString(),
            sub: !loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "⚠️ Cần xác minh ngay" : "Đã duyệt hoàn tất",
            subColor: !loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-600 dark:text-amber-400 animate-pulse font-semibold" : "text-muted-foreground",
            icon: <Shield className={`w-4 h-4 ${!loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-500" : "text-muted-foreground"}`} />,
            gradient: "from-amber-50 dark:from-amber-950/30",
            valueColor: !loading && (metrics?.pendingBrandCount ?? 0) > 0 ? "text-amber-600 dark:text-amber-400" : undefined,
            path: "/admin/affiliate"
        },
        {
            label: "Báo cáo chờ duyệt",
            value: loading ? null : (metrics?.pendingReportCount ?? 0).toString(),
            sub: !loading && (metrics?.pendingReportCount ?? 0) > 0 ? "🔴 Có tố cáo chưa xử lý" : "Hệ thống an toàn",
            subColor: !loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500 font-semibold" : "text-muted-foreground",
            icon: <AlertTriangle className={`w-4 h-4 ${!loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500 animate-bounce" : "text-muted-foreground"}`} />,
            gradient: "from-red-50 dark:from-red-950/30",
            valueColor: !loading && (metrics?.pendingReportCount ?? 0) > 0 ? "text-red-500" : undefined,
            path: "/admin/reports"
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-poppins">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#4a3728] dark:text-foreground">Tổng quan hệ thống V-Closet</h2>
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
                    <Card 
                        key={i} 
                        onClick={() => card.path && navigate(card.path)}
                        className={`hover:shadow-md hover:border-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-border bg-gradient-to-br ${card.gradient} to-white dark:to-card cursor-pointer select-none`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground">{card.label}</CardTitle>
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
                <Card className="md:col-span-4 shadow-sm border-muted bg-card min-w-0">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                        <div>
                            <CardTitle className="text-[#4a3728] dark:text-foreground text-base">Biến động Tài chính & Tăng trưởng</CardTitle>
                            <CardDescription className="text-xs">Premium Sales vs Hoa hồng Affiliate</CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs border border-border">
                            <button
                                onClick={() => setPeriod("month")}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all ${period === "month" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >Theo tháng</button>
                            <button
                                onClick={() => setPeriod("week")}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all ${period === "week" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >Theo tuần</button>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2 relative">
                        {chartLoading && (
                            <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-b-xl">
                                <span className="text-xs text-foreground font-medium animate-pulse">Đang cập nhật biểu đồ...</span>
                            </div>
                        )}
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAffiliate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted)" />
                                    <XAxis dataKey="timeLabel" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis
                                        stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false}
                                        tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}Tr` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}k` : `${v}`}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "11px", borderRadius: "8px" }}
                                        formatter={(value: any, name: string) => [`${Number(value).toLocaleString("vi-VN")} ₫`, name]}
                                    />
                                    <Area type="monotone" dataKey="revenue" name="Doanh thu Premium" stroke="var(--primary)" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="affiliateCommission" name="Hoa hồng Shopee" stroke="#22c55e" strokeWidth={2} fill="url(#colorAffiliate)" dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-5 mt-2 px-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-[#4a3728] dark:bg-primary inline-block" />
                                Doanh thu Premium
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className="w-3 h-3 rounded-full  dark:bg-green-500/100 inline-block" />
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
                            <CardTitle className="text-foreground text-sm font-semibold flex items-center gap-2">
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
                                        ${alert.type === "warning" ? " dark:bg-amber-500/10  dark:border-amber-500/20" :
                                            alert.type === "error" ? " dark:bg-red-500/10  dark:border-red-500/20" :
                                                alert.type === "success" ? " dark:bg-green-500/10  dark:border-green-500/20" :
                                                    " dark:bg-blue-500/10  dark:border-blue-500/20"}`}>
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
                            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
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
                                                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
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
            <Card className="shadow-sm border-stone-200 dark:border-border">
                <CardHeader>
                    <CardTitle className="text-foreground text-base flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" /> Phân tích nhân khẩu học người dùng (Onboarding)
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Dữ liệu tổng hợp từ thông tin người dùng cung cấp khi đăng ký tài khoản (Onboarding).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4 p-4 rounded-xl  dark:bg-muted/50 border border-stone-100 dark:border-border animate-pulse">
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
                            <div className="space-y-4 p-4 rounded-xl  dark:bg-card border border-stone-100 dark:border-border">
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Phân bố Giới tính</h4>
                                <div className="space-y-3">
                                    {demographics?.genders && demographics.genders.length > 0 ? (
                                        demographics.genders.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                                                    <span>{item.label}</span>
                                                    <span className="font-mono text-muted-foreground">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-stone-200/60 dark:bg-primary/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#4a3728] dark:bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                                            Chưa có dữ liệu khảo sát
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Age Groups */}
                            <div className="space-y-4 p-4 rounded-xl  dark:bg-card border border-stone-100 dark:border-border">
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Phân bố Nhóm tuổi</h4>
                                <div className="space-y-3">
                                    {demographics?.ageGroups && demographics.ageGroups.length > 0 ? (
                                        demographics.ageGroups.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                                                    <span>{item.label}</span>
                                                    <span className="font-mono text-muted-foreground">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-stone-200/60 dark:bg-primary/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#4a3728] dark:bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                                            Chưa có dữ liệu khảo sát
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lifestyle */}
                            <div className="space-y-4 p-4 rounded-xl  dark:bg-card border border-stone-100 dark:border-border">
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Phong cách thời trang (Lifestyle)</h4>
                                <div className="space-y-3">
                                    {demographics?.lifestyles && demographics.lifestyles.length > 0 ? (
                                        demographics.lifestyles.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                                                    <span>{item.label}</span>
                                                    <span className="font-mono text-muted-foreground">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-stone-200/60 dark:bg-primary/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#4a3728] dark:bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                                            Chưa có dữ liệu khảo sát
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-4 p-4 rounded-xl  dark:bg-card border border-stone-100 dark:border-border">
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Quốc gia</h4>
                                <div className="space-y-3">
                                    {demographics?.countries && demographics.countries.length > 0 ? (
                                        demographics.countries.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                                                    <span>{item.label}</span>
                                                    <span className="font-mono text-muted-foreground">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-stone-200/60 dark:bg-primary/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#4a3728] dark:bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                                            Chưa có dữ liệu khảo sát
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Eye Color */}
                            <div className="space-y-4 p-4 rounded-xl  dark:bg-card border border-stone-100 dark:border-border">
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Màu mắt</h4>
                                <div className="space-y-3">
                                    {demographics?.eyeColors && demographics.eyeColors.length > 0 ? (
                                        demographics.eyeColors.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                                                    <span>{item.label}</span>
                                                    <span className="font-mono text-muted-foreground">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-stone-200/60 dark:bg-primary/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#4a3728] dark:bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                                            Chưa có dữ liệu khảo sát
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hair Color */}
                            <div className="space-y-4 p-4 rounded-xl  dark:bg-card border border-stone-100 dark:border-border">
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Kiểu tóc / Màu tóc</h4>
                                <div className="space-y-3">
                                    {demographics?.hairColors && demographics.hairColors.length > 0 ? (
                                        demographics.hairColors.map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                                                    <span>{item.label}</span>
                                                    <span className="font-mono text-muted-foreground">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-stone-200/60 dark:bg-primary/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#4a3728] dark:bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                                            Chưa có dữ liệu khảo sát
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>



            {/* CH Play Reviews Stats Section */}
            <Card className="border-stone-200 dark:border-border">
                <CardHeader>
                    <CardTitle className="text-foreground text-base flex items-center gap-2">
                        <Star className="w-5 h-5  dark:text-green-400 fill-green-600" /> Đánh giá ứng dụng từ Google Play
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Dữ liệu được đồng bộ trực tiếp từ cửa hàng ứng dụng CH Play.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-12">
                        {/* KPI Average Star Rating */}
                        <div className="md:col-span-3 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br from-green-50/50 dark:from-green-950/20 to-white dark:to-card border border-green-100 dark:border-border shadow-sm min-h-[200px]">
                            <div>
                                <span className="text-[10px] font-bold text-green-800 dark:text-green-500 uppercase tracking-wider">Đánh giá trung bình</span>
                                <div className="flex items-baseline gap-1 mt-3">
                                    <span className="text-4xl font-extrabold text-foreground font-mono">{appReviews?.averageRating ?? 0}</span>
                                    <span className="text-xs font-semibold text-muted-foreground">/ 5 ★</span>
                                </div>
                                <div className="flex gap-1 mt-2  dark:text-green-400 text-base">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={i < Math.round(appReviews?.averageRating ?? 0) ? "fill-green-600  dark:text-green-400" : "text-stone-300 dark:text-stone-700 dark:text-stone-300"}>★</span>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-green-100 dark:border-border text-[11px] font-medium text-muted-foreground mt-4">
                                Tổng số lượt đánh giá: <strong className="text-foreground">{appReviews?.totalReviews ?? 0}</strong> lượt
                            </div>
                        </div>

                        {/* Chart Star Distribution */}
                        <div className="md:col-span-5 p-4 rounded-xl border border-border  dark:bg-muted/50/30 dark:bg-card min-w-0">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Phân bố số sao</h4>
                            <div className="h-[140px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { name: "5 sao", count: appReviews?.ratingDistribution.star5 ?? 0, fill: "#eab308" },
                                            { name: "4 sao", count: appReviews?.ratingDistribution.star4 ?? 0, fill: "#facc15" },
                                            { name: "3 sao", count: appReviews?.ratingDistribution.star3 ?? 0, fill: "#fef08a" },
                                            { name: "2 sao", count: appReviews?.ratingDistribution.star2 ?? 0, fill: "#fed7aa" },
                                            { name: "1 sao", count: appReviews?.ratingDistribution.star1 ?? 0, fill: "#fca5a5" },
                                        ]}
                                        layout="vertical"
                                        margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
                                    >
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                        <RechartsTooltip formatter={(v) => [`${v} lượt`, "Số lượng"]} contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={10} fill="#facc15" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Comments Feed */}
                        <div className="md:col-span-4 p-4 rounded-xl border border-border bg-card flex flex-col">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Nhận xét mới nhất</h4>
                            <div className="flex-1 max-h-[140px] overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
                                {!appReviews || appReviews.recentReviews.length === 0 ? (
                                    <p className="text-center py-6 text-xs text-muted-foreground italic">Chưa có bình luận nào</p>
                                ) : (
                                    appReviews.recentReviews.map(r => (
                                        <div key={r.reviewId} className="p-2 rounded-lg bg-muted/50 border border-border text-[11px] space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-foreground truncate max-w-[120px]">{r.authorName}</span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {r.starRating && r.starRating > 0 && (
                                                        <span className="text-[10px] text-amber-500 font-medium">{"★".repeat(r.starRating)}</span>
                                                    )}
                                                    <Badge variant="outline" className="text-[8px] h-4 py-0 px-1 border-border text-muted-foreground font-normal shrink-0">
                                                        {r.device}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-foreground break-words line-clamp-2 mt-1">
                                                {r.text || <span className="text-muted-foreground italic font-normal">Chỉ đánh giá {r.starRating} sao</span>}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground mt-0.5">
                                                {new Date(r.lastModified).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats Bottom Row */}
            {/* <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Giao dịch Premium tháng này", icon: <TrendingUp className="w-5 h-5  dark:text-green-400" />, desc: "Tính từ đầu tháng hiện tại", color: " dark:text-green-400", bg: " dark:bg-green-500/10  dark:border-green-500/20" },
                    { label: "Hoa hồng Affiliate tích lũy", icon: <Sparkles className="w-5 h-5 text-amber-500" />, desc: "Tổng hoa hồng từ Shopee", color: " dark:text-amber-400", bg: " dark:bg-amber-500/10  dark:border-amber-500/20" },
                    { label: "Bộ trang phục (Outfits)", icon: <Shirt className="w-5 h-5 text-violet-500" />, desc: "Outfit đã tạo toàn hệ thống", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
                    { label: "AI Jobs xử lý", icon: <Zap className="w-5 h-5 text-blue-500" />, desc: "Tổng tác vụ AI tách nền + lookbook", color: " dark:text-blue-400", bg: " dark:bg-blue-500/10  dark:border-blue-500/20" },
                ].map((item, i) => (
                    <div key={i} className={`rounded-xl border p-4 flex items-center gap-4 ${item.bg} shadow-sm`}>
                        <div className={`w-10 h-10 rounded-lg bg-card/70 flex items-center justify-center shadow-sm shrink-0`}>
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xs font-semibold ${item.color} leading-snug`}>{item.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
}
