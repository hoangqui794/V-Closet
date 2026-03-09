import {
    Users,
    ShoppingBag,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Activity
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
    Bar,
    BarChart,
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
    { name: "Tháng 1", total: 1500, users: 120 },
    { name: "Tháng 2", total: 2300, users: 180 },
    { name: "Tháng 3", total: 1800, users: 150 },
    { name: "Tháng 4", total: 3200, users: 240 },
    { name: "Tháng 5", total: 4100, users: 310 },
    { name: "Tháng 6", total: 4800, users: 420 },
];

const recentUsers = [
    { name: "Nguyễn Văn A", email: "vana@gmail.com", status: "Active", time: "2 phút trước", avatar: "NP" },
    { name: "Trần Thị B", email: "thib@hotmail.com", status: "Premium", time: "15 phút trước", avatar: "TB" },
    { name: "Lê Văn C", email: "vanc@yahoo.com", status: "Active", time: "1 giờ trước", avatar: "LC" },
    { name: "Phạm Minh D", email: "minhd@gmail.com", status: "Standard", time: "3 giờ trước", avatar: "PD" },
];

export function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h2>
                    <p className="text-muted-foreground mt-1">
                        Theo dõi các chỉ số quan trọng của V-Closet trong thời gian thực.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Xuất báo cáo</Button>
                    <Button>Thêm dữ liệu</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,482</div>
                        <div className="flex items-center mt-1 text-xs text-green-500">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +12% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tổng vật phẩm</CardTitle>
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">54,231</div>
                        <div className="flex items-center mt-1 text-xs text-green-500">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +8% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Doanh thu (Premium)</CardTitle>
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,234</div>
                        <div className="flex items-center mt-1 text-xs text-green-500">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +15.3% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
                        <Activity className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,103</div>
                        <div className="flex items-center mt-1 text-xs text-red-500">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            -2% so với 24h qua
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 shadow-sm border-none bg-card">
                    <CardHeader>
                        <CardTitle>Tăng trưởng doanh thu & người dùng</CardTitle>
                        <CardDescription>
                            Số liệu thống kê chi tiết trong 6 tháng gần nhất.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            fontSize: "12px",
                                            borderRadius: "8px"
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="hsl(var(--chart-2))"
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 shadow-sm border-none bg-card">
                    <CardHeader>
                        <CardTitle>Người dùng mới đăng ký</CardTitle>
                        <CardDescription>
                            Có 24 người dùng mới trong hôm nay.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentUsers.map((user, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                        <AvatarFallback>{user.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={user.status === "Premium" ? "default" : "secondary"} className="font-normal text-[10px]">
                                            {user.status}
                                        </Badge>
                                        <p className="text-[10px] text-muted-foreground mt-1">{user.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" className="w-full text-sm text-muted-foreground">
                            Xem tất cả người dùng
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
