import { useState, useEffect } from "react";
import {
    Play,
    StopCircle,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    X,
    Loader2,
    Calendar,
    Coins,
    BarChart3,
    MousePointerClick,
    Eye,
    RefreshCw,
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Download,
    Plus
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
    searchAdminCampaigns,
    stopAdminCampaign,
    resumeAdminCampaign,
    adjustAdminCampaign,
    deleteAdminCampaign,
    exportAdminCampaigns,
    createAdminCampaign,
    SponsoredCampaign,
    getAdminCampaignMetrics,
    CampaignMetrics,
    CreateCampaignPayload
} from "@/lib/api";

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

export function CampaignManagement() {
    const [campaigns, setCampaigns] = useState<SponsoredCampaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // Metrics state
    const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
    const [metricsLoading, setMetricsLoading] = useState(false);

    // Search / Filter / Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 10;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    // Toast
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // States cho Confirm Stop Modal
    const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
    const [campaignToStop, setCampaignToStop] = useState<string | null>(null);

    // States cho Confirm Resume Modal
    const [resumeConfirmOpen, setResumeConfirmOpen] = useState(false);
    const [campaignToResume, setCampaignToResume] = useState<string | null>(null);

    // States cho Adjust Dialog
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
    const [adjustingCampaign, setAdjustingCampaign] = useState<SponsoredCampaign | null>(null);
    const [adjustBudget, setAdjustBudget] = useState("");
    const [adjustRank, setAdjustRank] = useState("");
    const [adjustLoading, setAdjustLoading] = useState(false);

    // States cho Delete
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<SponsoredCampaign | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // States cho Export
    const [exportLoading, setExportLoading] = useState(false);

    // States cho Create
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createForm, setCreateForm] = useState<{
        brandId: string;
        productId: string;
        displayRank: string;
        dailyBudget: string;
        startAt: string;
        endAt: string;
    }>({
        brandId: "",
        productId: "",
        displayRank: "1",
        dailyBudget: "",
        startAt: "",
        endAt: "",
    });

    // ── Fetch functions ──────────────────────────────────────────────────────

    const fetchCampaigns = async (page = currentPage, search = searchTerm, status = statusFilter) => {
        setLoading(true);
        try {
            const isActiveParam = status === "active" ? true : status === "stopped" ? false : undefined;
            const data = await searchAdminCampaigns({
                page,
                pageSize: PAGE_SIZE,
                search: search || undefined,
                isActive: isActiveParam,
            });
            setCampaigns(data.campaigns || []);
            setTotalCount(data.totalCount || 0);
            setCurrentPage(data.page || 1);
        } catch (err: any) {
            console.error("Lỗi khi tải chiến dịch quảng cáo:", err);
            addToast("error", `Không thể tải danh sách: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetrics = async () => {
        setMetricsLoading(true);
        try {
            const data = await getAdminCampaignMetrics();
            setMetrics(data);
        } catch (err: any) {
            console.error("Lỗi khi tải metrics chiến dịch:", err);
        } finally {
            setMetricsLoading(false);
        }
    };

    const refreshAll = (page = currentPage) => {
        fetchCampaigns(page, searchTerm, statusFilter);
        fetchMetrics();
    };

    useEffect(() => {
        fetchCampaigns(1, "", "all");
        fetchMetrics();
    }, []);

    // ── Stop ─────────────────────────────────────────────────────────────────

    const handleOpenStopConfirm = (campaignId: string) => {
        setCampaignToStop(campaignId);
        setStopConfirmOpen(true);
    };

    const handleConfirmStop = async () => {
        if (!campaignToStop) return;
        setActionLoadingId(campaignToStop);
        try {
            await stopAdminCampaign(campaignToStop);
            addToast("success", "Đã dừng khẩn cấp chiến dịch quảng cáo thành công!");
            setStopConfirmOpen(false);
            setCampaignToStop(null);
            refreshAll();
        } catch (err: any) {
            console.error("Lỗi khi dừng chiến dịch:", err);
            addToast("error", `Lỗi khi dừng chiến dịch: ${err.message || err}`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // ── Resume ───────────────────────────────────────────────────────────────

    const handleOpenResumeConfirm = (campaignId: string) => {
        setCampaignToResume(campaignId);
        setResumeConfirmOpen(true);
    };

    const handleConfirmResume = async () => {
        if (!campaignToResume) return;
        setActionLoadingId(campaignToResume);
        try {
            await resumeAdminCampaign(campaignToResume);
            addToast("success", "Đã khôi phục chiến dịch quảng cáo thành công!");
            setResumeConfirmOpen(false);
            setCampaignToResume(null);
            refreshAll();
        } catch (err: any) {
            console.error("Lỗi khi khôi phục chiến dịch:", err);
            addToast("error", `Lỗi khi khôi phục: ${err.message || err}`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // ── Adjust ───────────────────────────────────────────────────────────────

    const handleOpenAdjust = (campaign: SponsoredCampaign) => {
        setAdjustingCampaign(campaign);
        setAdjustBudget(String(campaign.dailyBudget));
        setAdjustRank(String(campaign.displayRank));
        setAdjustDialogOpen(true);
    };

    const handleConfirmAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustingCampaign) return;
        const budget = parseFloat(adjustBudget);
        const rank = parseInt(adjustRank, 10);
        if (isNaN(budget) || budget <= 0) {
            addToast("error", "Ngân sách hàng ngày phải lớn hơn 0.");
            return;
        }
        if (isNaN(rank) || rank < 1) {
            addToast("error", "Vị trí hiển thị phải là số nguyên >= 1.");
            return;
        }
        setAdjustLoading(true);
        try {
            await adjustAdminCampaign(adjustingCampaign.campaignId, {
                dailyBudget: budget,
                displayRank: rank,
            });
            addToast("success", "Đã điều chỉnh ngân sách & vị trí hiển thị thành công!");
            setAdjustDialogOpen(false);
            setAdjustingCampaign(null);
            refreshAll();
        } catch (err: any) {
            console.error("Lỗi khi điều chỉnh chiến dịch:", err);
            addToast("error", `Lỗi khi điều chỉnh: ${err.message || err}`);
        } finally {
            setAdjustLoading(false);
        }
    };

    // ── Search handler ───────────────────────────────────────────────────────

    // ── Delete ───────────────────────────────────────────────────────────────

    const handleOpenDeleteConfirm = (campaign: SponsoredCampaign) => {
        setCampaignToDelete(campaign);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!campaignToDelete) return;
        setDeleteLoading(true);
        try {
            await deleteAdminCampaign(campaignToDelete.campaignId);
            addToast("success", "Đã xóa chiến dịch quảng cáo thành công!");
            setDeleteConfirmOpen(false);
            setCampaignToDelete(null);
            refreshAll(1);
        } catch (err: any) {
            console.error("Lỗi khi xóa chiến dịch:", err);
            addToast("error", `Lỗi khi xóa: ${err.message || err}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    // ── Export CSV ───────────────────────────────────────────────────────────

    const handleExport = async () => {
        setExportLoading(true);
        try {
            await exportAdminCampaigns();
            addToast("success", "Xuất báo cáo CSV thành công!");
        } catch (err: any) {
            console.error("Lỗi khi xuất báo cáo:", err);
            addToast("error", `Lỗi khi xuất: ${err.message || err}`);
        } finally {
            setExportLoading(false);
        }
    };

    // ── Create ───────────────────────────────────────────────────────────────

    const handleOpenCreate = () => {
        setCreateForm({ brandId: "", productId: "", displayRank: "1", dailyBudget: "", startAt: "", endAt: "" });
        setCreateDialogOpen(true);
    };

    const handleConfirmCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const budget = parseFloat(createForm.dailyBudget);
        const rank = parseInt(createForm.displayRank, 10);
        if (!createForm.brandId.trim()) { addToast("error", "Brand ID không được để trống."); return; }
        if (!createForm.productId.trim()) { addToast("error", "Product ID không được để trống."); return; }
        if (isNaN(budget) || budget <= 0) { addToast("error", "Ngân sách hàng ngày phải lớn hơn 0."); return; }
        if (isNaN(rank) || rank < 1) { addToast("error", "Vị trí hiển thị phải >= 1."); return; }
        if (!createForm.startAt || !createForm.endAt) { addToast("error", "Vui lòng chọn ngày bắt đầu và kết thúc."); return; }
        if (new Date(createForm.endAt) <= new Date(createForm.startAt)) { addToast("error", "Ngày kết thúc phải sau ngày bắt đầu."); return; }

        setCreateLoading(true);
        try {
            const payload: CreateCampaignPayload = {
                brandId: createForm.brandId.trim(),
                productId: createForm.productId.trim(),
                displayRank: rank,
                dailyBudget: budget,
                startAt: new Date(createForm.startAt).toISOString(),
                endAt: new Date(createForm.endAt).toISOString(),
            };
            await createAdminCampaign(payload);
            addToast("success", "Tạo chiến dịch quảng cáo mới thành công!");
            setCreateDialogOpen(false);
            refreshAll(1);
        } catch (err: any) {
            console.error("Lỗi khi tạo chiến dịch:", err);
            addToast("error", `Lỗi khi tạo: ${err.message || err}`);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCampaigns(1, searchTerm, statusFilter);
    };

    const handleStatusChange = (val: string) => {
        setStatusFilter(val);
        fetchCampaigns(1, searchTerm, val);
    };

    // ── Metrics derived values ────────────────────────────────────────────────

    const activeCampaigns = metrics?.activeCampaignsCount ?? 0;
    const totalCampaignsCount = metrics?.totalCampaignsCount ?? 0;
    const totalDailyBudget = metrics?.totalDailyBudget ?? 0;
    const totalSpent = metrics?.totalSpent ?? 0;
    const totalImpressions = metrics?.totalImpressions ?? 0;
    const totalClicks = metrics?.totalClicks ?? 0;
    const overallCtr = metrics ? metrics.overallCtr.toFixed(2) : "0.00";

    const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " đ";

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" });
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />

            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#4a3728] dark:text-foreground">Chiến dịch tài trợ (Campaigns)</h1>
                <p className="text-sm text-muted-foreground">
                    Quản lý và giám sát các chiến dịch đẩy sản phẩm tài trợ của các đối tác thương hiệu trên hệ thống.
                </p>
            </div>

            {/* Thống kê nhanh */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Chiến dịch đang chạy
                        </CardTitle>
                        <Play className="h-4 w-4 text-[#4a3728] dark:text-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728] dark:text-foreground">
                            {metricsLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : activeCampaigns}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Trên tổng số {metricsLoading ? "..." : totalCampaignsCount} chiến dịch
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Ngân sách ngày hiện tại
                        </CardTitle>
                        <Coins className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728] dark:text-foreground">
                            {metricsLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : formatPrice(totalDailyBudget)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Tổng ngân sách chạy hàng ngày</p>
                    </CardContent>
                </Card>

                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Tổng chi tiêu quảng cáo
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728] dark:text-foreground">
                            {metricsLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : formatPrice(totalSpent)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Doanh thu quảng cáo lũy kế</p>
                    </CardContent>
                </Card>

                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Hiệu suất Click-Through
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728] dark:text-foreground">
                            {metricsLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : `${overallCtr}% CTR`}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                            <span>Clicks: {metricsLoading ? "..." : totalClicks}</span>
                            <span>•</span>
                            <span>Views: {metricsLoading ? "..." : totalImpressions}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bảng danh sách chiến dịch */}
            <Card className="border border-muted shadow-sm overflow-hidden">
                <CardHeader className="border-b pb-4 space-y-3">
                    {/* Row 1: Title + Actions */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle className="text-[#4a3728] dark:text-foreground font-bold text-base">Danh sách chiến dịch quảng cáo</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                Tổng cộng {totalCount} chiến dịch • Trang {currentPage}/{totalPages}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                size="sm"
                                className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground text-xs h-8 gap-1.5"
                                onClick={handleOpenCreate}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Tạo chiến dịch
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-muted hover:bg-muted/10 text-xs h-8 gap-1.5"
                                onClick={handleExport}
                                disabled={exportLoading || loading}
                            >
                                {exportLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Download className="w-3.5 h-3.5" />
                                )}
                                Xuất CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-muted hover:bg-muted/10 text-xs h-8 gap-1.5"
                                onClick={() => refreshAll(1)}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                                Làm mới
                            </Button>
                        </div>
                    </div>
                    {/* Row 2: Search & Filter */}
                    <form onSubmit={handleSearch} className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Tìm theo tên sản phẩm hoặc thương hiệu..."
                                className="pl-8 h-8 text-xs bg-background border-muted"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-36 h-8 text-xs bg-background border-muted shrink-0">
                                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-card">
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="active">Đang chạy</SelectItem>
                                <SelectItem value="stopped">Đã dừng</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" size="sm" className="h-8 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground text-xs px-4 shrink-0">
                            Tìm
                        </Button>
                    </form>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/20">
                                <TableRow>
                                    <TableHead className="font-semibold text-xs py-3 w-16">Ảnh</TableHead>
                                    <TableHead className="font-semibold text-xs py-3">Sản phẩm / Đối tác</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-20">Vị trí đẩy</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-right">Ngân sách/ngày</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-right">Đã chi tiêu</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center">Impression / Click</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-16">CTR</TableHead>
                                    <TableHead className="font-semibold text-xs py-3">Thời hạn chạy</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-24">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-36">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="w-8 h-8 text-[#4a3728] dark:text-foreground animate-spin" />
                                                <span className="text-sm text-muted-foreground">Đang tải danh sách chiến dịch...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : campaigns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground text-xs">
                                            Không tìm thấy chiến dịch quảng cáo nào.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    campaigns.map((campaign) => {
                                        const ctr = (campaign as any).ctr !== undefined
                                            ? Number((campaign as any).ctr).toFixed(2)
                                            : campaign.impressionCount > 0
                                                ? ((campaign.clickCount / campaign.impressionCount) * 100).toFixed(2)
                                                : "0.00";
                                        return (
                                            <TableRow key={campaign.campaignId} className="hover:bg-muted/10 transition-colors">
                                                <TableCell>
                                                    <div className="w-10 h-10 rounded overflow-hidden border bg-background relative flex items-center justify-center">
                                                        {campaign.productImageUrl ? (
                                                            <img
                                                                src={campaign.productImageUrl}
                                                                alt={campaign.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground font-bold">No Img</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm line-clamp-1 text-foreground">
                                                            {campaign.productName}
                                                        </span>
                                                        <span className="text-xs text-[#4a3728] dark:text-foreground font-medium mt-0.5">
                                                            Đối tác: {campaign.brandName}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-xs">
                                                    Hạng {campaign.displayRank}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-sm font-semibold text-[#4a3728] dark:text-foreground">
                                                    {formatPrice(Number(campaign.dailyBudget))}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-sm font-semibold  dark:text-green-400">
                                                    {formatPrice(Number(campaign.totalSpent))}
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-xs">
                                                    <div className="flex flex-col items-center">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3 text-muted-foreground" /> {campaign.impressionCount}
                                                        </span>
                                                        <span className="flex items-center gap-1 mt-0.5">
                                                            <MousePointerClick className="w-3 h-3 text-blue-500" /> {campaign.clickCount}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-mono font-semibold text-xs text-[#4a3728] dark:text-foreground">
                                                    {ctr}%
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <div className="flex flex-col text-muted-foreground gap-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5 shrink-0" /> Từ: {formatDate(campaign.startAt)}
                                                        </span>
                                                        <span>Đến: {formatDate(campaign.endAt)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={`font-normal ${campaign.isActive
                                                            ? "border-green-500  dark:text-green-400  dark:bg-green-500/10 hover: dark:bg-green-500/10"
                                                            : " dark:bg-muted text-gray-500 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {campaign.isActive ? "Đang chạy" : "Đã dừng"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {/* Adjust button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className=" dark:text-amber-500 hover: dark:bg-amber-500/10 h-7 px-2 font-medium text-xs"
                                                            onClick={() => handleOpenAdjust(campaign)}
                                                            disabled={actionLoadingId === campaign.campaignId}
                                                            title="Điều chỉnh ngân sách & vị trí"
                                                        >
                                                            <SlidersHorizontal className="h-3.5 w-3.5" />
                                                        </Button>

                                                        {/* Delete button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10 h-7 px-2 font-medium text-xs"
                                                            onClick={() => handleOpenDeleteConfirm(campaign)}
                                                            disabled={actionLoadingId === campaign.campaignId}
                                                            title="Xóa chiến dịch"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>

                                                        {campaign.isActive ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className=" dark:text-red-400 hover: dark:bg-red-500/10 h-7 px-2 font-medium text-xs flex items-center gap-1"
                                                                onClick={() => handleOpenStopConfirm(campaign.campaignId)}
                                                                disabled={actionLoadingId === campaign.campaignId}
                                                                title="Dừng khẩn cấp chiến dịch"
                                                            >
                                                                {actionLoadingId === campaign.campaignId ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <StopCircle className="h-3.5 w-3.5" />
                                                                        Dừng
                                                                    </>
                                                                )}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className=" dark:text-green-400 hover: dark:bg-green-500/10 h-7 px-2 font-medium text-xs flex items-center gap-1"
                                                                onClick={() => handleOpenResumeConfirm(campaign.campaignId)}
                                                                disabled={actionLoadingId === campaign.campaignId}
                                                                title="Khôi phục chiến dịch"
                                                            >
                                                                {actionLoadingId === campaign.campaignId ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <Play className="h-3.5 w-3.5" />
                                                                        Chạy lại
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-muted">
                            <span className="text-xs text-muted-foreground">
                                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} / {totalCount} chiến dịch
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 border-muted"
                                    disabled={currentPage <= 1 || loading}
                                    onClick={() => fetchCampaigns(currentPage - 1, searchTerm, statusFilter)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-xs px-2 text-muted-foreground">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 border-muted"
                                    disabled={currentPage >= totalPages || loading}
                                    onClick={() => fetchCampaigns(currentPage + 1, searchTerm, statusFilter)}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Modal Xác nhận xóa chiến dịch ── */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg text-destructive">
                            <Trash2 className="w-5 h-5 shrink-0" /> Xác nhận xóa chiến dịch
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Bạn có chắc chắn muốn xóa chiến dịch{" "}
                            <span className="font-semibold text-foreground">"{campaignToDelete?.productName}"</span>?{" "}
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => { setDeleteConfirmOpen(false); setCampaignToDelete(null); }}
                            disabled={deleteLoading}>
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleConfirmDelete}
                            className="bg-destructive hover:bg-destructive/90 text-white text-xs h-9"
                            disabled={deleteLoading}>
                            {deleteLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang xóa...</>
                            ) : "Xác nhận xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Modal Xác nhận dừng chiến dịch ── */}
            <Dialog open={stopConfirmOpen} onOpenChange={setStopConfirmOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg  dark:text-red-400">
                            <StopCircle className="w-5 h-5 shrink-0 text-red-500" /> Xác nhận dừng chiến dịch
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Bạn có chắc chắn muốn dừng khẩn cấp chiến dịch này? Quảng cáo sẽ không hiển thị trên hệ thống nữa.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => { setStopConfirmOpen(false); setCampaignToStop(null); }}
                            disabled={actionLoadingId !== null}>
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleConfirmStop}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                            disabled={actionLoadingId !== null}>
                            {actionLoadingId !== null ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang dừng...</>
                            ) : "Xác nhận dừng"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Modal Xác nhận khôi phục chiến dịch ── */}
            <Dialog open={resumeConfirmOpen} onOpenChange={setResumeConfirmOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg  dark:text-green-400">
                            <Play className="w-5 h-5 shrink-0 text-green-500" /> Xác nhận khôi phục chiến dịch
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Bạn có chắc chắn muốn kích hoạt lại chiến dịch này? Quảng cáo sẽ tiếp tục hiển thị trên hệ thống.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => { setResumeConfirmOpen(false); setCampaignToResume(null); }}
                            disabled={actionLoadingId !== null}>
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleConfirmResume}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs h-9"
                            disabled={actionLoadingId !== null}>
                            {actionLoadingId !== null ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang khôi phục...</>
                            ) : "Xác nhận khôi phục"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Dialog Điều chỉnh ngân sách & vị trí ── */}
            <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
                <DialogContent className="sm:max-w-sm bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-base  dark:text-amber-500">
                            <SlidersHorizontal className="w-5 h-5 shrink-0" /> Điều chỉnh chiến dịch
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground mt-1">
                            {adjustingCampaign?.productName} — {adjustingCampaign?.brandName}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleConfirmAdjust} className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Ngân sách ngày (VNĐ)</Label>
                            <Input
                                type="number"
                                min="1"
                                step="1000"
                                value={adjustBudget}
                                onChange={e => setAdjustBudget(e.target.value)}
                                className="h-9 text-sm bg-background border-muted"
                                placeholder="Nhập ngân sách ngày..."
                                required
                            />
                            <p className="text-[10px] text-muted-foreground">Ngân sách hàng ngày phải lớn hơn 0</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Vị trí hiển thị (Display Rank)</Label>
                            <Input
                                type="number"
                                min="1"
                                step="1"
                                value={adjustRank}
                                onChange={e => setAdjustRank(e.target.value)}
                                className="h-9 text-sm bg-background border-muted"
                                placeholder="Nhập vị trí hiển thị..."
                                required
                            />
                            <p className="text-[10px] text-muted-foreground">Vị trí 1 = ưu tiên cao nhất</p>
                        </div>
                        <DialogFooter className="border-t border-muted pt-4">
                            <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9"
                                onClick={() => { setAdjustDialogOpen(false); setAdjustingCampaign(null); }}
                                disabled={adjustLoading}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit"
                                className=" dark:bg-amber-500/100 hover:bg-amber-600 text-white text-xs h-9"
                                disabled={adjustLoading}>
                                {adjustLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang lưu...</>
                                ) : "Lưu điều chỉnh"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Dialog Tạo chiến dịch mới ── */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg text-[#4a3728] dark:text-foreground">
                            <Plus className="w-5 h-5 shrink-0" /> Tạo chiến dịch quảng cáo mới
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Điền đầy đủ thông tin để tạo chiến dịch tài trợ cho sản phẩm của đối tác thương hiệu.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleConfirmCreate} className="space-y-3 mt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Brand ID <span className="text-red-500">*</span></Label>
                            <Input
                                value={createForm.brandId}
                                onChange={e => setCreateForm(f => ({ ...f, brandId: e.target.value }))}
                                className="h-9 text-sm bg-background border-muted font-mono"
                                placeholder="UUID của thương hiệu..."
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Product ID <span className="text-red-500">*</span></Label>
                            <Input
                                value={createForm.productId}
                                onChange={e => setCreateForm(f => ({ ...f, productId: e.target.value }))}
                                className="h-9 text-sm bg-background border-muted font-mono"
                                placeholder="UUID của sản phẩm..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Ngân sách/ngày (đ) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    min="1"
                                    step="1000"
                                    value={createForm.dailyBudget}
                                    onChange={e => setCreateForm(f => ({ ...f, dailyBudget: e.target.value }))}
                                    className="h-9 text-sm bg-background border-muted"
                                    placeholder="Vd: 100000"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Vị trí hiển thị <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={createForm.displayRank}
                                    onChange={e => setCreateForm(f => ({ ...f, displayRank: e.target.value }))}
                                    className="h-9 text-sm bg-background border-muted"
                                    placeholder="1 = ưu tiên cao nhất"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Ngày bắt đầu <span className="text-red-500">*</span></Label>
                                <Input
                                    type="datetime-local"
                                    value={createForm.startAt}
                                    onChange={e => setCreateForm(f => ({ ...f, startAt: e.target.value }))}
                                    className="h-9 text-xs bg-background border-muted"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Ngày kết thúc <span className="text-red-500">*</span></Label>
                                <Input
                                    type="datetime-local"
                                    value={createForm.endAt}
                                    onChange={e => setCreateForm(f => ({ ...f, endAt: e.target.value }))}
                                    className="h-9 text-xs bg-background border-muted"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="border-t border-muted pt-4">
                            <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9"
                                onClick={() => setCreateDialogOpen(false)}
                                disabled={createLoading}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit"
                                className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground text-xs h-9"
                                disabled={createLoading}>
                                {createLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang tạo...</>
                                ) : "Tạo chiến dịch"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
