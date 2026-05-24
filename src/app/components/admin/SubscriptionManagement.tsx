import { useState } from "react";
import {
    CreditCard,
    DollarSign,
    ArrowUpRight,
    Clock,
    MoreVertical,
    Download,
    Plus,
    ArrowDownRight,
    Tag,
    Trash2,
    Edit,
    Check,
    X,
    Lock,
    Settings,
    HelpCircle,
    UserCheck,
    Percent,
    Sliders
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";

// Mockup data giao dịch nâng cấp tài khoản
const initialSubscriptions = [
    { id: "1", user: "Nguyễn Văn A", plan: "Premium Monthly", amount: "$9.99", status: "Active", date: "2024-03-01", nextBilling: "2024-04-01" },
    { id: "2", user: "Trần Thị B", plan: "Premium Yearly", amount: "$89.99", status: "Active", date: "2024-01-10", nextBilling: "2025-01-10" },
    { id: "3", user: "Lê Văn C", plan: "Premium Monthly", amount: "$9.99", status: "Canceled", date: "2023-12-15", nextBilling: "-" },
    { id: "4", user: "Phạm Minh D", plan: "Premium Monthly", amount: "$9.99", status: "Past Due", date: "2024-02-28", nextBilling: "2024-03-28" },
];

// Mockup dữ liệu mã giảm giá (Coupons)
const initialCoupons = [
    { id: "cp-1", code: "WELCOMEVCLOSET", discount: 20, type: "Percentage", used: 145, maxUses: 300, status: "Active", expiry: "2026-12-31" },
    { id: "cp-2", code: "TRYONFIRST50", discount: 50, type: "Percentage", used: 50, maxUses: 50, status: "Expired", expiry: "2026-04-15" },
    { id: "cp-3", code: "SUMMERVIBE", discount: 15, type: "Percentage", used: 34, maxUses: 100, status: "Active", expiry: "2026-08-31" },
];

export function SubscriptionManagement() {
    const [activeTab, setActiveTab] = useState<"billing" | "coupons" | "limits">("billing");
    const [subscriptions] = useState(initialSubscriptions);
    const [coupons, setCoupons] = useState(initialCoupons);
    
    // States tạo Coupon mới
    const [showCreateCoupon, setShowCreateCoupon] = useState(false);
    const [newCode, setNewCode] = useState("");
    const [newDiscount, setNewDiscount] = useState(10);
    const [newMaxUses, setNewMaxUses] = useState(100);
    const [newExpiry, setNewExpiry] = useState("2026-12-31");

    // States cấu hình định giá & giới hạn tủ đồ
    const [freeItemLimit, setFreeItemLimit] = useState(50);
    const [monthlyPrice, setMonthlyPrice] = useState(9.99);
    const [yearlyPrice, setYearlyPrice] = useState(89.99);

    const handleCreateCoupon = () => {
        if (newCode.trim()) {
            const newCoupon = {
                id: `cp-${coupons.length + 1}`,
                code: newCode.trim().toUpperCase(),
                discount: newDiscount,
                type: "Percentage",
                used: 0,
                maxUses: newMaxUses,
                status: "Active",
                expiry: newExpiry
            };
            setCoupons([...coupons, newCoupon]);
            setNewCode("");
            setShowCreateCoupon(false);
        }
    };

    const handleDeleteCoupon = (id: string) => {
        setCoupons(coupons.filter(c => c.id !== id));
    };

    const handleToggleCouponStatus = (id: string, currentStatus: string) => {
        setCoupons(coupons.map(c => {
            if (c.id === id) {
                return { ...c, status: currentStatus === "Active" ? "Expired" : "Active" };
            }
            return c;
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Quản lý Tài chính & Gói dịch vụ</h2>
                    <p className="text-muted-foreground mt-1">
                        Thống kê doanh thu, quản lý mã coupon giảm giá và thiết lập hạn ngạch cho mô hình Freemium.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Báo cáo doanh thu</Button>
                </div>
            </div>

            {/* Điều hướng Tab bằng State */}
            <div className="flex border-b border-muted">
                <button
                    onClick={() => setActiveTab("billing")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "billing"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Doanh thu & Đăng ký nâng cấp
                </button>
                <button
                    onClick={() => setActiveTab("coupons")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "coupons"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Mã giảm giá (Coupons)
                </button>
                <button
                    onClick={() => setActiveTab("limits")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "limits"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Cấu hình Giới hạn Tủ đồ & Giá gói
                </button>
            </div>

            {/* TAB 1: DOANH THU & GIAO DỊCH */}
            {activeTab === "billing" && (
                <div className="space-y-6">
                    {/* Thống kê nhanh */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$4,231.80</div>
                                <div className="flex items-center mt-1 text-xs text-green-500">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +20.1% so với tháng trước
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Đăng ký mới (30 ngày)</CardTitle>
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">154</div>
                                <div className="flex items-center mt-1 text-xs text-green-500">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +12.5% so với tháng trước
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Tỷ lệ hủy (Churn rate)</CardTitle>
                                <Clock className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2.4%</div>
                                <div className="flex items-center mt-1 text-xs text-red-500">
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                    -0.5% so với tháng trước
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Danh sách giao dịch */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden border-muted">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Khách hàng</TableHead>
                                    <TableHead>Gói dịch vụ</TableHead>
                                    <TableHead>Tổng cộng</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Lần gia hạn tới</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.map((sub) => (
                                    <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.user}`} />
                                                    <AvatarFallback>{sub.user.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm text-foreground">{sub.user}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{sub.plan}</TableCell>
                                        <TableCell className="text-sm font-semibold">{sub.amount}</TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === "Active" ? "default" : (sub.status === "Canceled" ? "secondary" : "destructive")} className="font-normal text-[10px]">
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground font-mono">{sub.nextBilling}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* TAB 2: MÃ GIẢM GIÁ */}
            {activeTab === "coupons" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-muted shadow-sm">
                        <span className="text-sm text-muted-foreground">
                            Đang hoạt động: <strong>{coupons.filter(c => c.status === "Active").length} mã coupon</strong>
                        </span>
                        <Button
                            onClick={() => setShowCreateCoupon(!showCreateCoupon)}
                            className="bg-[#4a3728] hover:bg-[#3d2d21] text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Tạo mã giảm giá
                        </Button>
                    </div>

                    {showCreateCoupon && (
                        <Card className="shadow-sm border-muted animate-in slide-in-from-top duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg text-[#4a3728]">Tạo Coupon Mới</CardTitle>
                                <CardDescription>Nhập chi tiết thông số cho mã coupon giảm giá Premium.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Mã Code</label>
                                    <Input
                                        placeholder="Ví dụ: SPRING30"
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                        className="bg-background border-muted font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Phần trăm giảm (%)</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={newDiscount}
                                        onChange={(e) => setNewDiscount(Number(e.target.value))}
                                        className="bg-background border-muted"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Lượt dùng tối đa</label>
                                    <Input
                                        type="number"
                                        value={newMaxUses}
                                        onChange={(e) => setNewMaxUses(Number(e.target.value))}
                                        className="bg-background border-muted"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Hạn sử dụng</label>
                                    <Input
                                        type="date"
                                        value={newExpiry}
                                        onChange={(e) => setNewExpiry(e.target.value)}
                                        className="bg-background border-muted text-xs font-mono"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 bg-muted/10 p-4 border-t border-muted">
                                <Button variant="ghost" onClick={() => setShowCreateCoupon(false)} className="text-xs">
                                    Hủy
                                </Button>
                                <Button onClick={handleCreateCoupon} className="bg-[#4a3728] hover:bg-[#3d2d21] text-white text-xs">
                                    Tạo Coupon
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden border-muted">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Mã Giảm Giá</TableHead>
                                    <TableHead>Chiết Khấu</TableHead>
                                    <TableHead>Đã dùng / Giới hạn</TableHead>
                                    <TableHead>Hạn sử dụng</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.map((coupon) => (
                                    <TableRow key={coupon.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-mono font-bold text-sm text-[#4a3728]">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none font-semibold">
                                                Giảm {coupon.discount}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{coupon.used}</span>
                                                <span className="text-muted-foreground">/</span>
                                                <span className="text-muted-foreground">{coupon.maxUses} lượt</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground font-mono">
                                            {coupon.expiry}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={coupon.status === "Active" ? "outline" : "secondary"}
                                                className={`font-normal ${
                                                    coupon.status === "Active"
                                                        ? "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {coupon.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleToggleCouponStatus(coupon.id, coupon.status)}
                                                    title="Bật/Tắt trạng thái coupon"
                                                >
                                                    {coupon.status === "Active" ? <X className="w-4 h-4 text-red-500" /> : <Check className="w-4 h-4 text-green-600" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDeleteCoupon(coupon.id)}
                                                    title="Xóa coupon"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* TAB 3: GIỚI HẠN TỦ ĐỒ & ĐỊNH GIÁ */}
            {activeTab === "limits" && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Cấu hình giới hạn tủ đồ Free */}
                    <Card className="shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-[#4a3728] text-lg flex items-center gap-2">
                                <Sliders className="w-5 h-5" /> Giới hạn Tủ đồ Gói Free
                            </CardTitle>
                            <CardDescription>
                                Thiết lập số trang phục tối đa được tải lên cho tài khoản miễn phí để thúc đẩy chuyển đổi nâng cấp Premium.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Số vật phẩm tối đa (Free Items Limit)</label>
                                <div className="flex gap-3">
                                    <Input
                                        type="number"
                                        value={freeItemLimit}
                                        onChange={(e) => setFreeItemLimit(Number(e.target.value))}
                                        className="bg-background border-muted"
                                    />
                                    <Badge className="bg-orange-500 text-white border-none shrink-0 self-center py-2 px-3">
                                        Mặc định: 50
                                    </Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Khi người dùng đạt giới hạn này, ứng dụng di động sẽ tự động hiển thị popup gợi ý nâng cấp lên Premium.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-muted bg-muted/10 p-4 flex justify-end">
                            <Button className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">Lưu cấu hình</Button>
                        </CardFooter>
                    </Card>

                    {/* Thiết lập biểu giá gói Premium */}
                    <Card className="shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-[#4a3728] text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Cài đặt định giá gói dịch vụ
                            </CardTitle>
                            <CardDescription>
                                Thay đổi định mức giá bán cho gói Premium thời hạn Hàng tháng (Monthly) và Hàng năm (Yearly).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Gói Tháng (USD)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={monthlyPrice}
                                        onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                        className="bg-background border-muted"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Gói Năm (USD)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={yearlyPrice}
                                        onChange={(e) => setYearlyPrice(Number(e.target.value))}
                                        className="bg-background border-muted"
                                    />
                                </div>
                            </div>
                            <div className="p-3 bg-muted/30 border border-muted rounded-xl flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <span>
                                    Giá trị thay đổi sẽ được đồng bộ trực tiếp lên cổng thanh toán In-App Purchase (Google Play & App Store) thông qua Backend.
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-muted bg-muted/10 p-4 flex justify-end">
                            <Button className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">Lưu định giá</Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
