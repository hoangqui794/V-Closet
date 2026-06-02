import { useState, useEffect, useCallback } from "react";
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
    Sliders,
    Loader2,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription
} from "../ui/dialog";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "../ui/select";
import {
    getAdminSubscriptionPlans,
    createAdminSubscriptionPlan,
    updateAdminSubscriptionPlan,
    deleteAdminSubscriptionPlan,
    SubscriptionPlanResponse
} from "../../../lib/api";

// ─── Toast ────────────────────────────────────────────────────────────────────
interface Toast { id: number; type: "success" | "error"; message: string; }
let toastId = 0;

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in slide-in-from-right-4 duration-300
                        ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
                    {t.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{t.message}</span>
                    <button onClick={() => onRemove(t.id)} className="ml-2 opacity-70 hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}

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
    const [activeTab, setActiveTab] = useState<"limits" | "billing" | "coupons">("limits");
    const [subscriptions] = useState(initialSubscriptions);
    const [coupons, setCoupons] = useState(initialCoupons);
    
    // Toast
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // States cho Confirm Delete Plan Modal
    const [deletePlanConfirmOpen, setDeletePlanConfirmOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // States tạo Coupon mới
    const [showCreateCoupon, setShowCreateCoupon] = useState(false);
    const [newCode, setNewCode] = useState("");
    const [newDiscount, setNewDiscount] = useState(10);
    const [newMaxUses, setNewMaxUses] = useState(100);
    const [newExpiry, setNewExpiry] = useState("2026-12-31");

    // States cấu hình giới hạn tủ đồ
    const [freeItemLimit, setFreeItemLimit] = useState(50);

    // States quản lý gói Premium thực tế từ Backend
    const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [errorPlans, setErrorPlans] = useState("");
    const [showCreatePlan, setShowCreatePlan] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlanResponse | null>(null);

    // Form state cho gói Premium
    const [planForm, setPlanForm] = useState({
        name: "",
        description: "",
        price: 0,
        currency: "VND",
        durationDays: 30,
        isActive: true
    });

    const loadPlans = useCallback(async () => {
        setLoadingPlans(true);
        setErrorPlans("");
        try {
            const data = await getAdminSubscriptionPlans();
            setPlans(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Failed to load subscription plans:", err);
            setErrorPlans(err.message || "Không thể tải danh sách gói dịch vụ");
        } finally {
            setLoadingPlans(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "limits") {
            loadPlans();
        }
    }, [activeTab, loadPlans]);

    const handleOpenCreatePlan = () => {
        setPlanForm({
            name: "",
            description: "",
            price: 0,
            currency: "VND",
            durationDays: 30,
            isActive: true
        });
        setErrorPlans("");
        setShowCreatePlan(true);
    };

    const handleOpenEditPlan = (plan: SubscriptionPlanResponse) => {
        setEditingPlan(plan);
        setPlanForm({
            name: plan.name,
            description: plan.description || "",
            price: plan.price,
            currency: plan.currency,
            durationDays: plan.durationDays,
            isActive: plan.isActive
        });
        setErrorPlans("");
    };

    const handleCreatePlan = async () => {
        if (!planForm.name) {
            setErrorPlans("Tên gói là bắt buộc");
            return;
        }
        if (planForm.price < 0) {
            setErrorPlans("Giá tiền phải lớn hơn hoặc bằng 0");
            return;
        }
        if (planForm.durationDays < 1) {
            setErrorPlans("Số ngày hiệu lực phải lớn hơn 0");
            return;
        }

        try {
            await createAdminSubscriptionPlan(planForm);
            setShowCreatePlan(false);
            loadPlans();
        } catch (err: any) {
            setErrorPlans(err.message || "Tạo gói Premium thất bại");
        }
    };

    const handleUpdatePlan = async () => {
        if (!editingPlan) return;
        if (!planForm.name) {
            setErrorPlans("Tên gói là bắt buộc");
            return;
        }
        if (planForm.price < 0) {
            setErrorPlans("Giá tiền phải lớn hơn hoặc bằng 0");
            return;
        }
        if (planForm.durationDays < 1) {
            setErrorPlans("Số ngày hiệu lực phải lớn hơn 0");
            return;
        }

        try {
            await updateAdminSubscriptionPlan(editingPlan.id, planForm);
            setEditingPlan(null);
            loadPlans();
        } catch (err: any) {
            setErrorPlans(err.message || "Cập nhật gói Premium thất bại");
        }
    };

    const handleOpenDeletePlanConfirm = (id: string) => {
        setPlanToDelete(id);
        setDeletePlanConfirmOpen(true);
    };

    const handleConfirmDeletePlan = async () => {
        if (!planToDelete) return;
        setDeleteLoading(true);
        try {
            await deleteAdminSubscriptionPlan(planToDelete);
            addToast("success", "Đã ẩn/xóa gói Premium thành công!");
            setDeletePlanConfirmOpen(false);
            setPlanToDelete(null);
            loadPlans();
        } catch (err: any) {
            console.error("Lỗi khi xóa gói Premium:", err);
            addToast("error", err.message || "Không thể ẩn/xóa gói Premium");
        } finally {
            setDeleteLoading(false);
        }
    };

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
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Quản lý Tài chính & Gói dịch vụ</h2>
                    <p className="text-muted-foreground mt-1">
                        Thống kê doanh thu, quản lý mã coupon giảm giá và thiết lập các gói dịch vụ Premium.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Báo cáo doanh thu</Button>
                </div>
            </div>

            {/* Điều hướng Tab bằng State */}
            <div className="flex border-b border-muted">
                <button
                    onClick={() => setActiveTab("limits")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "limits"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Gói dịch vụ Premium
                </button>
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
                    <div className="rounded-xl border bg-card shadow-sm overflow-x-auto border-muted">
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

                    <div className="rounded-xl border bg-card shadow-sm overflow-x-auto border-muted">
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

            {/* TAB 3: QUẢN LÝ GÓI DỊCH VỤ PREMIUM */}
            {activeTab === "limits" && (
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Cấu hình giới hạn tủ đồ Free */}
                    <div className="md:col-span-1">
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
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Số vật phẩm tối đa</label>
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
                                        Khi người dùng đạt giới hạn này, ứng dụng di động sẽ tự động gợi ý nâng cấp lên Premium.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-muted bg-muted/10 p-4 flex justify-end">
                                <Button className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">Lưu cấu hình</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Danh sách các gói Premium thực tế */}
                    <div className="md:col-span-2">
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="text-[#4a3728] text-lg flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" /> Danh sách gói dịch vụ Premium
                                    </CardTitle>
                                    <CardDescription>
                                        Danh sách các gói Premium được đồng bộ từ cơ sở dữ liệu hệ thống.
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleOpenCreatePlan}
                                    className="bg-[#4a3728] hover:bg-[#3d2d21] text-white size-sm"
                                >
                                    <Plus className="w-4 h-4 mr-1.5" /> Tạo gói mới
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loadingPlans ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" />
                                        <span className="text-sm">Đang tải các gói Premium từ máy chủ...</span>
                                    </div>
                                ) : errorPlans ? (
                                    <div className="p-6 text-center text-sm text-red-600 bg-red-50 border-t">
                                        {errorPlans}
                                    </div>
                                ) : !Array.isArray(plans) || plans.length === 0 ? (
                                    <div className="p-12 text-center text-sm text-muted-foreground">
                                        Chưa có gói Premium nào trên hệ thống. Hãy bấm nút "Tạo gói mới".
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-muted/50 border-t">
                                                <TableRow>
                                                    <TableHead>Tên gói & Mô tả</TableHead>
                                                    <TableHead>Giá bán</TableHead>
                                                    <TableHead>Hiệu lực</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                    <TableHead className="text-right">Thao tác</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(plans || []).map((plan) => (
                                                    <TableRow key={plan.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell className="max-w-[200px]">
                                                            <p className="font-semibold text-sm text-[#4a3728]">{plan.name || "Chưa có tên"}</p>
                                                            {plan.description && (
                                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                                                    {plan.description}
                                                                </p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm font-semibold">
                                                            {(plan.price ?? 0).toLocaleString("vi-VN")} {plan.currency || "VND"}
                                                        </TableCell>
                                                        <TableCell className="text-sm font-medium">
                                                            {plan.durationDays ?? 0} ngày
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={plan.isActive ? "default" : "secondary"}
                                                                className={plan.isActive 
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-200 border-none"
                                                                    : "bg-gray-100 text-gray-500"
                                                                }
                                                            >
                                                                {plan.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-[#4a3728] hover:bg-stone-100"
                                                                    onClick={() => handleOpenEditPlan(plan)}
                                                                    title="Chỉnh sửa thông tin gói"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                    onClick={() => handleOpenDeletePlanConfirm(plan.id)}
                                                                    title="Ẩn/Xóa (soft-delete)"
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
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Modal Tạo/Sửa gói Premium */}
            <Dialog 
                open={showCreatePlan || editingPlan !== null} 
                onOpenChange={(open) => {
                    if (!open) {
                        setShowCreatePlan(false);
                        setEditingPlan(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md font-poppins">
                    <DialogHeader>
                        <DialogTitle className="text-[#4a3728] font-bold">
                            {editingPlan ? "Cập nhật gói Premium" : "Tạo gói Premium mới"}
                        </DialogTitle>
                        <DialogDescription>
                            Điền đầy đủ thông tin để lưu cấu hình gói cước Premium lên hệ thống.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-2">
                        {errorPlans && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                                <X className="w-4 h-4 shrink-0" />
                                <span>{errorPlans}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <Label>Tên gói dịch vụ</Label>
                            <Input
                                placeholder="Ví dụ: Premium Monthly"
                                value={planForm.name}
                                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Mô tả gói</Label>
                            <Textarea
                                placeholder="Mô tả các đặc quyền khi nâng cấp gói..."
                                value={planForm.description}
                                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>Giá tiền</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={planForm.price}
                                    onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Đơn vị tiền tệ</Label>
                                <Select 
                                    value={planForm.currency} 
                                    onValueChange={(val) => setPlanForm({ ...planForm, currency: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VND">VND</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>Thời gian hiệu lực (ngày)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={planForm.durationDays}
                                    onChange={(e) => setPlanForm({ ...planForm, durationDays: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Trạng thái kích hoạt</Label>
                                <Select 
                                    value={planForm.isActive ? "true" : "false"} 
                                    onValueChange={(val) => setPlanForm({ ...planForm, isActive: val === "true" })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Active (Đang chạy)</SelectItem>
                                        <SelectItem value="false">Inactive (Tạm ẩn)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowCreatePlan(false);
                                setEditingPlan(null);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                            className="bg-[#4a3728] hover:bg-[#3d2d21] text-white"
                        >
                            {editingPlan ? "Cập nhật gói" : "Tạo gói"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Modal Xác nhận xóa mềm gói Premium */}
            <Dialog open={deletePlanConfirmOpen} onOpenChange={setDeletePlanConfirmOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg text-red-600">
                            <Trash2 className="w-5 h-5 shrink-0 text-red-500" /> Xác nhận xóa gói Premium
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Bạn có chắc chắn muốn ẩn/xóa (soft delete) gói Premium này? Gói cước sẽ ngừng hoạt động và không hiển thị cho người dùng nữa.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => {
                                setDeletePlanConfirmOpen(false);
                                setPlanToDelete(null);
                            }}
                            disabled={deleteLoading}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDeletePlan}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xác nhận xóa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
