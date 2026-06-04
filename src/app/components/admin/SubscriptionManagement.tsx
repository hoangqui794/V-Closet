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
    CheckCircle,
    Eye
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
    SubscriptionPlanResponse,
    getAdminPendingManualPayments,
    approveAdminManualPayment,
    rejectAdminManualPayment,
    ManualPaymentListItem,
    getAdminPremiumSubscriptions,
    revokeAdminPremiumSubscription,
    PremiumSubscriptionListItem,
    BASE_URL,
    getToken
} from "../../../lib/api";
import { HubConnectionBuilder, HubConnection, HubConnectionState } from "@microsoft/signalr";

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

// Mockup dữ liệu mã giảm giá (Coupons)
const initialCoupons = [
    { id: "cp-1", code: "WELCOMEVCLOSET", discount: 20, type: "Percentage", used: 145, maxUses: 300, status: "Active", expiry: "2026-12-31" },
    { id: "cp-2", code: "TRYONFIRST50", discount: 50, type: "Percentage", used: 50, maxUses: 50, status: "Expired", expiry: "2026-04-15" },
    { id: "cp-3", code: "SUMMERVIBE", discount: 15, type: "Percentage", used: 34, maxUses: 100, status: "Active", expiry: "2026-08-31" },
];

export function SubscriptionManagement() {
    const [activeTab, setActiveTab] = useState<"limits" | "billing" | "coupons" | "manual-payments">("limits");
    const [coupons, setCoupons] = useState(initialCoupons);

    // States cho Duyệt chuyển khoản thủ công
    const [pendingPayments, setPendingPayments] = useState<ManualPaymentListItem[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [errorPayments, setErrorPayments] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<ManualPaymentListItem | null>(null);
    const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    // States quản lý gói Premium thực tế của người dùng (billing tab)
    const [premiumSubscriptions, setPremiumSubscriptions] = useState<PremiumSubscriptionListItem[]>([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
    const [totalSubscriptions, setTotalSubscriptions] = useState(0);
    const [subPage, setSubPage] = useState(1);
    const [subPageSize] = useState(10);
    const [subSearch, setSubSearch] = useState("");
    const [subStatusFilter, setSubStatusFilter] = useState<string>("all");
    const [subPlanTypeFilter, setSubPlanTypeFilter] = useState<string>("all");

    // States cho hủy/thu hồi gói Premium
    const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
    const [subToRevoke, setSubToRevoke] = useState<PremiumSubscriptionListItem | null>(null);
    const [revokeNote, setRevokeNote] = useState("");
    const [revokeLoading, setRevokeLoading] = useState(false);
    
    // Toast
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = useCallback((type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

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

    const loadPendingPayments = useCallback(async () => {
        setLoadingPayments(true);
        setErrorPayments("");
        try {
            const data = await getAdminPendingManualPayments();
            setPendingPayments(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Failed to load pending manual payments:", err);
            setErrorPayments(err.message || "Không thể tải danh sách chuyển khoản chờ duyệt");
        } finally {
            setLoadingPayments(false);
        }
    }, []);

    const loadPremiumSubscriptions = useCallback(async () => {
        setLoadingSubscriptions(true);
        try {
            const isActive = subStatusFilter === "all" ? undefined : (subStatusFilter === "active");
            const planType = subPlanTypeFilter === "all" ? undefined : subPlanTypeFilter;

            const response = await getAdminPremiumSubscriptions({
                page: subPage,
                pageSize: subPageSize,
                search: subSearch || undefined,
                isActive,
                planType
            });

            setPremiumSubscriptions(response.subscriptions || []);
            setTotalSubscriptions(response.totalCount || 0);
        } catch (err: any) {
            console.error("Failed to load premium subscriptions:", err);
            addToast("error", err.message || "Không thể tải danh sách tài khoản đăng ký gói");
        } finally {
            setLoadingSubscriptions(false);
        }
    }, [subPage, subPageSize, subSearch, subStatusFilter, subPlanTypeFilter, addToast]);

    // ─── SignalR Real-time Notifications ───────────────────────────────────────
    useEffect(() => {
        let connection: HubConnection | null = null;

        const startSignalR = async () => {
            const token = getToken();
            if (!token) return;

            let userId = 0;
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userId = parseInt(payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "0");
            } catch (e) {
                console.error("Failed to parse JWT token", e);
            }

            connection = new HubConnectionBuilder()
                .withUrl(`${BASE_URL}/notificationHub?userId=${userId}`, {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .build();

            connection.on("ReceivePendingPayment", (pendingPayment: ManualPaymentListItem) => {
                console.log("[SignalR] Received pending payment:", pendingPayment);
                addToast("success", `Có giao dịch chuyển khoản thủ công mới chờ duyệt từ khách hàng ${pendingPayment.userName}!`);
                loadPendingPayments();
            });

            try {
                await connection.start();
                console.log("[SignalR] Connected successfully.");
                await connection.invoke("JoinAdminGroup");
                console.log("[SignalR] Joined AdminGroup.");
            } catch (err) {
                console.error("[SignalR] Connection Error:", err);
            }
        };

        startSignalR();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [loadPendingPayments, addToast]);

    useEffect(() => {
        if (activeTab === "limits") {
            loadPlans();
        } else if (activeTab === "manual-payments") {
            loadPendingPayments();
        } else if (activeTab === "billing") {
            loadPremiumSubscriptions();
        }
    }, [activeTab, loadPlans, loadPendingPayments, loadPremiumSubscriptions]);

    useEffect(() => {
        if (activeTab === "billing") {
            loadPremiumSubscriptions();
        }
    }, [activeTab, subPage, subPageSize, subSearch, subStatusFilter, subPlanTypeFilter, loadPremiumSubscriptions]);

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
            addToast("success", "Tạo gói dịch vụ mới thành công!");
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
            addToast("success", "Cập nhật gói dịch vụ thành công!");
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
            addToast("success", "Tạo mã giảm giá thành công!");
        }
    };

    const handleDeleteCoupon = (id: string) => {
        setCoupons(coupons.filter(c => c.id !== id));
        addToast("success", "Đã xóa mã giảm giá!");
    };

    const handleToggleCouponStatus = (id: string, currentStatus: string) => {
        setCoupons(coupons.map(c => {
            if (c.id === id) {
                return { ...c, status: currentStatus === "Active" ? "Expired" : "Active" };
            }
            return c;
        }));
        addToast("success", `Đã cập nhật trạng thái coupon thành ${currentStatus === "Active" ? "Hết hạn" : "Hoạt động"}!`);
    };

    const handleReviewManualPayment = async () => {
        if (!selectedPayment || !reviewAction) return;
        setSubmittingReview(true);
        try {
            if (reviewAction === "approve") {
                await approveAdminManualPayment(selectedPayment.transactionId, { adminNote: adminNote || null });
                addToast("success", `Đã duyệt thành công giao dịch của ${selectedPayment.userName}!`);
            } else {
                await rejectAdminManualPayment(selectedPayment.transactionId, { adminNote: adminNote || null });
                addToast("success", `Đã từ chối giao dịch chuyển khoản của ${selectedPayment.userName}!`);
            }
            setSelectedPayment(null);
            setReviewAction(null);
            setAdminNote("");
            loadPendingPayments();
        } catch (err: any) {
            console.error("Lỗi duyệt chuyển khoản:", err);
            addToast("error", err.message || "Xử lý duyệt giao dịch thất bại");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleRevokePremium = async () => {
        if (!subToRevoke) return;
        setRevokeLoading(true);
        try {
            const response = await revokeAdminPremiumSubscription(subToRevoke.subscriptionId, {
                adminNote: revokeNote || null
            });
            if (response.success) {
                addToast("success", `Đã thu hồi gói Premium của tài khoản ${subToRevoke.email} thành công!`);
                setRevokeConfirmOpen(false);
                setSubToRevoke(null);
                setRevokeNote("");
                loadPremiumSubscriptions();
            } else {
                addToast("error", response.message || "Thu hồi gói Premium thất bại");
            }
        } catch (err: any) {
            console.error("Lỗi thu hồi gói Premium:", err);
            addToast("error", err.message || "Không thể thu hồi gói Premium");
        } finally {
            setRevokeLoading(false);
        }
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
                    Tài khoản Premium đăng ký
                </button>
                <button
                    onClick={() => setActiveTab("manual-payments")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 relative ${
                        activeTab === "manual-payments"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Duyệt chuyển khoản thủ công
                    {pendingPayments.length > 0 && (
                        <span className="absolute top-1.5 right-1 bg-red-500 text-white rounded-full text-[9px] font-bold h-4 w-4 flex items-center justify-center animate-pulse">
                            {pendingPayments.length}
                        </span>
                    )}
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

            {/* TAB: DOANH THU & GIAO DỊCH */}
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
                                <div className="text-2xl font-bold">4.231.800 đ</div>
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

                    {/* Filter and Search Bar for Subscriptions */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-muted shadow-sm">
                        <div className="flex gap-2 w-full md:w-auto">
                            <Input
                                placeholder="Tìm kiếm theo email, tên..."
                                value={subSearch}
                                onChange={(e) => {
                                    setSubSearch(e.target.value);
                                    setSubPage(1);
                                }}
                                className="w-full md:w-64 bg-background"
                            />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Trạng thái:</span>
                                <Select value={subStatusFilter} onValueChange={(val) => { setSubStatusFilter(val); setSubPage(1); }}>
                                    <SelectTrigger className="w-32 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="active">Đang hoạt động</SelectItem>
                                        <SelectItem value="expired">Hết hạn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Thời hạn:</span>
                                <Select value={subPlanTypeFilter} onValueChange={(val) => { setSubPlanTypeFilter(val); setSubPage(1); }}>
                                    <SelectTrigger className="w-32 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="monthly">Theo tháng</SelectItem>
                                        <SelectItem value="yearly">Theo năm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách người dùng Premium thực tế */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-x-auto border-muted">
                        {loadingSubscriptions ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" />
                                <span className="text-sm">Đang tải danh sách tài khoản Premium...</span>
                            </div>
                        ) : !Array.isArray(premiumSubscriptions) || premiumSubscriptions.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                Không tìm thấy tài khoản Premium nào.
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Khách hàng</TableHead>
                                            <TableHead>Gói & Loại</TableHead>
                                            <TableHead>Đã thanh toán</TableHead>
                                            <TableHead>Cổng / Mã GD</TableHead>
                                            <TableHead>Thời hạn sử dụng</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {premiumSubscriptions.map((sub) => (
                                            <TableRow key={sub.subscriptionId} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.displayName}`} />
                                                            <AvatarFallback>{sub.displayName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <span className="font-medium text-sm text-foreground block">{sub.displayName}</span>
                                                            <span className="text-xs text-muted-foreground font-mono">{sub.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-semibold text-[#4a3728]">{sub.planName}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{sub.planType}</div>
                                                </TableCell>
                                                <TableCell className="text-sm font-semibold">
                                                    {sub.pricePaid.toLocaleString("vi-VN")} {sub.currency}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs font-semibold">{sub.paymentMethod.toUpperCase()}</div>
                                                    <div className="text-[10px] font-mono text-muted-foreground max-w-[120px] truncate" title={sub.paymentRef}>{sub.paymentRef}</div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground font-mono">
                                                    <div>BĐ: {new Date(sub.startedAt).toLocaleDateString("vi-VN")}</div>
                                                    <div>KT: {new Date(sub.expiresAt).toLocaleDateString("vi-VN")}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={sub.isActive ? "default" : "secondary"}
                                                        className={sub.isActive 
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200 border-none font-normal" 
                                                            : "bg-gray-100 text-gray-500 font-normal"
                                                        }
                                                    >
                                                        {sub.isActive ? "Active" : "Expired"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {sub.isActive && (
                                                        <Button
                                                            variant="ghost"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2.5 h-8 font-semibold"
                                                            onClick={() => {
                                                                setSubToRevoke(sub);
                                                                setRevokeConfirmOpen(true);
                                                            }}
                                                        >
                                                            Thu hồi
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Phân trang */}
                                <div className="flex justify-between items-center p-4 border-t">
                                    <span className="text-xs text-muted-foreground">
                                        Hiển thị {premiumSubscriptions.length} / {totalSubscriptions} tài khoản Premium
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSubPage(p => Math.max(p - 1, 1))}
                                            disabled={subPage === 1}
                                            className="h-8 text-xs border-muted"
                                        >
                                            Trước
                                        </Button>
                                        <span className="self-center text-xs font-semibold px-2">Trang {subPage}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSubPage(p => p + 1)}
                                            disabled={subPage * subPageSize >= totalSubscriptions}
                                            className="h-8 text-xs border-muted"
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: MÃ GIẢM GIÁ */}
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

            {/* TAB: QUẢN LÝ GÓI DỊCH VỤ PREMIUM */}
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

            {/* TAB: DUYỆT CHUYỂN KHOẢN THỦ CÔNG */}
            {activeTab === "manual-payments" && (
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card shadow-sm overflow-x-auto border-muted">
                        {loadingPayments ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" />
                                <span className="text-sm">Đang tải danh sách chờ duyệt...</span>
                            </div>
                        ) : errorPayments ? (
                            <div className="p-6 text-center text-sm text-red-600 bg-red-50 border-t">
                                {errorPayments}
                            </div>
                        ) : !Array.isArray(pendingPayments) || pendingPayments.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                Hiện tại không có giao dịch chuyển khoản thủ công nào đang chờ duyệt.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead>Gói mua</TableHead>
                                        <TableHead>Số tiền</TableHead>
                                        <TableHead>Ảnh minh chứng</TableHead>
                                        <TableHead>Ghi chú khách hàng</TableHead>
                                        <TableHead>Ngày gửi</TableHead>
                                        <TableHead className="text-right font-semibold">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingPayments.map((payment) => (
                                        <TableRow key={payment.transactionId} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div>
                                                    <span className="font-semibold text-sm text-foreground block">{payment.userName}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">{payment.userEmail}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{payment.planName}</TableCell>
                                            <TableCell className="text-sm font-semibold text-[#4a3728]">
                                                {payment.amount.toLocaleString("vi-VN")} {payment.currency}
                                            </TableCell>
                                            <TableCell>
                                                {payment.proofImageUrl ? (
                                                    <div className="relative group w-12 h-16 rounded border border-muted overflow-hidden bg-muted flex items-center justify-center cursor-pointer shadow-sm hover:shadow"
                                                        onClick={() => setZoomImage(payment.proofImageUrl || null)}>
                                                        <img src={payment.proofImageUrl} alt="Proof Bill" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <Eye className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Không có ảnh</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm max-w-[200px] truncate" title={payment.userNote || ""}>
                                                {payment.userNote || <span className="text-muted-foreground text-xs italic">Trống</span>}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {new Date(payment.createdAt).toLocaleString("vi-VN")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 font-semibold text-xs h-8 px-2.5"
                                                        onClick={() => {
                                                            setSelectedPayment(payment);
                                                            setReviewAction("approve");
                                                        }}
                                                    >
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 font-semibold text-xs h-8 px-2.5"
                                                        onClick={() => {
                                                            setSelectedPayment(payment);
                                                            setReviewAction("reject");
                                                        }}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
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

            {/* Modal Xem ảnh hóa đơn lớn (Zoom) */}
            <Dialog 
                open={zoomImage !== null} 
                onOpenChange={(open) => {
                    if (!open) setZoomImage(null);
                }}
            >
                <DialogContent className="max-w-2xl bg-black/95 border-none p-0 overflow-hidden flex items-center justify-center">
                    {zoomImage && (
                        <div className="relative w-full h-[80vh] p-4 flex items-center justify-center">
                            <img 
                                src={zoomImage} 
                                alt="Hóa đơn phóng to" 
                                className="max-w-full max-h-full object-contain"
                            />
                            <button 
                                onClick={() => setZoomImage(null)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Xác nhận Duyệt / Từ chối Chuyển khoản */}
            <Dialog 
                open={selectedPayment !== null && reviewAction !== null} 
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPayment(null);
                        setReviewAction(null);
                        setAdminNote("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className={`flex items-center gap-2 font-bold text-lg ${reviewAction === "approve" ? "text-green-600" : "text-red-500"}`}>
                            {reviewAction === "approve" ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                            {reviewAction === "approve" ? "Duyệt giao dịch chuyển khoản" : "Từ chối giao dịch chuyển khoản"}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            {reviewAction === "approve" 
                                ? `Bạn đang chuẩn bị PHÊ DUYỆT giao dịch của khách hàng ${selectedPayment?.userName}. Hệ thống sẽ ngay lập tức kích hoạt/nâng cấp gói Premium tương ứng.` 
                                : `Bạn đang chuẩn bị TỪ CHỐI giao dịch của khách hàng ${selectedPayment?.userName}. Giao dịch sẽ chuyển sang trạng thái thất bại.`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                            <div><strong>Khách hàng:</strong> {selectedPayment?.userName} ({selectedPayment?.userEmail})</div>
                            <div><strong>Gói cước:</strong> {selectedPayment?.planName}</div>
                            <div><strong>Số tiền chuyển:</strong> {selectedPayment?.amount.toLocaleString("vi-VN")} {selectedPayment?.currency}</div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Ghi chú phản hồi (Không bắt buộc)</Label>
                            <Textarea 
                                placeholder={reviewAction === "approve" ? "Nhập lời chúc hoặc lưu ý..." : "Nhập lý do từ chối (ví dụ: Thiếu số tiền, sai thông tin...)"}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                className="min-h-[80px] bg-background text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => {
                                setSelectedPayment(null);
                                setReviewAction(null);
                                setAdminNote("");
                            }}
                            disabled={submittingReview}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleReviewManualPayment}
                            className={`text-white text-xs h-9 ${reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                            disabled={submittingReview}
                        >
                            {submittingReview ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                reviewAction === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Xác nhận Thu hồi Premium */}
            <Dialog 
                open={revokeConfirmOpen} 
                onOpenChange={(open) => {
                    if (!open) {
                        setRevokeConfirmOpen(false);
                        setSubToRevoke(null);
                        setRevokeNote("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg text-red-600">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Xác nhận thu hồi Premium
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Hành động này sẽ thu hồi (hủy kích hoạt sớm) gói Premium của tài khoản <strong>{subToRevoke?.email}</strong>. Giao dịch mua sẽ chuyển sang trạng thái đã hết hạn hoặc bị hủy.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                            <div><strong>Tài khoản:</strong> {subToRevoke?.displayName} ({subToRevoke?.email})</div>
                            <div><strong>Gói hiện tại:</strong> {subToRevoke?.planName} ({subToRevoke?.planType})</div>
                            <div><strong>Ngày hết hạn gốc:</strong> {subToRevoke && new Date(subToRevoke.expiresAt).toLocaleDateString("vi-VN")}</div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Lý do thu hồi (Không bắt buộc)</Label>
                            <Textarea 
                                placeholder="Nhập ghi chú lý do thu hồi (ví dụ: Khách hàng yêu cầu hoàn tiền, phát hiện gian lận...)"
                                value={revokeNote}
                                onChange={(e) => setRevokeNote(e.target.value)}
                                className="min-h-[80px] bg-background text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => {
                                setRevokeConfirmOpen(false);
                                setSubToRevoke(null);
                                setRevokeNote("");
                            }}
                            disabled={revokeLoading}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleRevokePremium}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                            disabled={revokeLoading}
                        >
                            {revokeLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang thu hồi...
                                </>
                            ) : (
                                "Xác nhận thu hồi"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
