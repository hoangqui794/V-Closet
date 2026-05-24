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
    DollarSign
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

const data = [
    { name: "Tháng 1", total: 1500, users: 120, affiliate: 450 },
    { name: "Tháng 2", total: 2300, users: 180, affiliate: 620 },
    { name: "Tháng 3", total: 1800, users: 150, affiliate: 500 },
    { name: "Tháng 4", total: 3200, users: 240, affiliate: 890 },
    { name: "Tháng 5", total: 4100, users: 310, affiliate: 1200 },
    { name: "Tháng 6", total: 4800, users: 420, affiliate: 1540 },
];

const recentUsers = [
    { name: "Nguyễn Văn A", email: "vana@gmail.com", status: "Active", time: "2 phút trước", avatar: "NP" },
    { name: "Trần Thị B", email: "thib@hotmail.com", status: "Premium", time: "15 phút trước", avatar: "TB" },
    { name: "Lê Văn C", email: "vanc@yahoo.com", status: "Active", time: "1 giờ trước", avatar: "LC" },
    { name: "Phạm Minh D", email: "minhd@gmail.com", status: "Standard", time: "3 giờ trước", avatar: "PD" },
];

const systemAlerts = [
    { id: 1, type: "warning", message: "Số dư tài khoản FASHN AI API còn dưới $15. Vui lòng nạp thêm tiền.", time: "10 phút trước" },
    { id: 2, type: "success", message: "Crawler tự động cào 12 sản phẩm trending Shopee hoàn tất.", time: "2 giờ trước" },
    { id: 3, type: "info", message: "User Nguyễn Văn A (Free) vừa đạt giới hạn 5 lượt tách nền trong tháng.", time: "4 giờ trước" },
    { id: 4, type: "success", message: "Giao dịch thành công gói Premium Yearly từ user Trần Thị B ($89.99).", time: "5 giờ trước" },
];

export function Dashboard() {
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

            {/* Hàng chỉ số KPI chính (4 Cards) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. Tổng người dùng */}
                <Card className="hover:shadow-md transition-shadow border-muted">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12,482</div>
                        <div className="flex items-center mt-1 text-xs text-green-500 font-medium">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +12% so với tháng trước
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Doanh thu Premium */}
                <Card className="hover:shadow-md transition-shadow border-muted">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Doanh thu Premium</CardTitle>
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$12,234</div>
                        <div className="flex items-center mt-1 text-xs text-green-500 font-medium">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +15.3% so với tháng trước
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Hoa hồng Affiliate Shopee */}
                <Card className="hover:shadow-md transition-shadow border-muted">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Hoa hồng Shopee (Affiliate)</CardTitle>
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 font-mono">+ $4,850</div>
                        <div className="flex items-center mt-1 text-xs text-green-500 font-medium">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +24.1% lượt nhấn Canvas
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Chi phí dịch vụ API AI */}
                <Card className="hover:shadow-md transition-shadow border-muted">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Chi phí API AI (Photoroom/FASHN)</CardTitle>
                        <Cpu className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500 font-mono">- $312.80</div>
                        <div className="flex items-center mt-1 text-xs text-red-500 font-medium">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            Tách nền & AI Lookbook tăng 18%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 2: Biểu đồ và Cảnh báo máy chủ */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* 1. Biểu đồ doanh thu & tăng trưởng */}
                <Card className="lg:col-span-4 shadow-sm border-muted bg-card">
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
                <div className="lg:col-span-3 flex flex-col gap-6">
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
                            <CardTitle className="text-sm font-semibold text-[#4a3728]">Đăng ký mới hôm nay</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.map((user, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                            <AvatarFallback>{user.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={user.status === "Premium" ? "default" : "secondary"} className="font-normal text-[9px] py-0.5">
                                                {user.status}
                                            </Badge>
                                            <p className="text-[9px] text-muted-foreground mt-0.5">{user.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
