import { useState, useEffect, useCallback } from "react";
import {
    Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight, X,
    CheckCircle, AlertCircle, Loader2, Flag, Calendar, User, FileText, AlertOctagon
} from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription
} from "../ui/dialog";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "../ui/select";
import {
    getAdminReports,
    AdminReport,
    GetReportsParams,
    getReportedPostDetail,
    ReportedPostDetail
} from "../../../lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function getReasonBadge(reason: string) {
    const r = reason.toLowerCase();
    if (r.includes("inappropriate") || r.includes("phản cảm") || r.includes("nude")) {
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (r.includes("spam") || r.includes("quảng cáo")) {
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (r.includes("hate") || r.includes("công kích") || r.includes("bạo lực")) {
        return "bg-red-50 text-red-700 border-red-200";
    }
    return "bg-stone-50 text-stone-700 border-stone-200";
}

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

// ─── Report Detail Modal ──────────────────────────────────────────────────────

interface ReportDetailModalProps {
    report: AdminReport | null;
    open: boolean;
    onClose: () => void;
}

function ReportDetailModal({ report, open, onClose }: ReportDetailModalProps) {
    if (!report) return null;

    const [postDetail, setPostDetail] = useState<ReportedPostDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        if (!report || !open) {
            setPostDetail(null);
            return;
        }
        setLoadingDetail(true);
        getReportedPostDetail(report.postId)
            .then(setPostDetail)
            .catch(err => {
                console.warn("Failed to load reported post detail:", err);
                setPostDetail(null);
            })
            .finally(() => setLoadingDetail(false));
    }, [report, open]);

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#4a3728] font-bold text-lg">
                        <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" /> Chi tiết báo cáo vi phạm
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Mã báo cáo: <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{report.reportId}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2 mt-2">
                    {/* Post Context */}
                    <div className="bg-[#fdfaf7] border border-[#f5efe6] rounded-xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#4a3728] shrink-0" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Bài viết bị báo cáo</span>
                        </div>
                        <div className="text-sm font-semibold text-[#4a3728] leading-relaxed">
                            "{report.postCaption || "Không có chú thích bài đăng"}"
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                            <span className="font-medium text-stone-700">Tác giả bài đăng:</span>
                            <span className="font-semibold bg-[#e8dfd5] text-[#4a3728] px-2 py-0.5 rounded">
                                {report.postCreatorDisplayName}
                            </span>
                            <span className="text-[10px] text-stone-400">|</span>
                            <span className="font-mono text-[10px]">ID: {report.postId.slice(0, 8)}...</span>
                        </div>
                    </div>

                    {/* Post Canvas Preview */}
                    {loadingDetail ? (
                        <div className="flex flex-col items-center justify-center py-6 bg-stone-50/30 border border-dashed border-[#dccbb5] rounded-xl gap-2 text-stone-500 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin text-[#4a3728]" />
                            <span className="text-xs font-medium">Đang tải thiết kế Canvas vi phạm...</span>
                        </div>
                    ) : postDetail?.canvasImage ? (
                        <div className="flex flex-col gap-2 bg-[#fdfaf7] border border-[#f5efe6] rounded-xl p-3 items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide self-start flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                Thiết kế Canvas bị báo cáo
                            </span>
                            <div className="relative w-full max-h-[220px] rounded-lg overflow-hidden border border-[#f5efe6] bg-white flex items-center justify-center p-2">
                                <img
                                    src={postDetail.canvasImage}
                                    alt="Thiết kế Canvas"
                                    className="max-h-[200px] object-contain rounded-md shadow-sm transition-transform hover:scale-105 duration-300"
                                />
                            </div>
                        </div>
                    ) : null}

                    {/* Report Reason and description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-muted/20 border border-muted rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Lý do chính</p>
                            <Badge className={`text-xs border font-medium ${getReasonBadge(report.reason)}`}>
                                {report.reason}
                            </Badge>
                        </div>
                        <div className="bg-muted/20 border border-muted rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Thời gian báo cáo</p>
                            <div className="flex items-center gap-1.5 font-medium text-stone-700 text-xs mt-1">
                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                <span>{formatDate(report.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description details */}
                    <div className="bg-muted/10 border border-muted rounded-xl p-4 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-stone-500 shrink-0" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                                Người báo cáo: <strong className="text-stone-700">{report.reporterDisplayName}</strong>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Nội dung chi tiết & Ghi chú xử lý:</p>
                        <div className="text-sm text-stone-600 bg-card border border-stone-200 rounded-lg p-3 whitespace-pre-line leading-relaxed font-sans min-h-[60px]">
                            {report.description || "Không có mô tả chi tiết."}
                        </div>
                    </div>

                    {/* Resolution Status Indicator */}
                    <div className="flex items-center gap-3 py-1 px-2">
                        <span className="text-xs font-medium text-stone-500">Trạng thái hiện tại:</span>
                        {report.isResolved ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2.5 py-1 font-medium gap-1">
                                <CheckCircle className="w-3 h-3 shrink-0" /> Đã xử lý / Đã ẩn vi phạm
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-2.5 py-1 font-medium gap-1 animate-pulse">
                                <AlertCircle className="w-3 h-3 shrink-0" /> Đang chờ duyệt xử lý
                            </Badge>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>Đóng cửa sổ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function ReportManagement() {
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Filters
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [reasonSearch, setReasonSearch] = useState("");
    const [reasonSearchInput, setReasonSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // "all" | "resolved" | "pending"

    // Modals & Details
    const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);

    // Toast
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params: GetReportsParams = { page, pageSize };
            if (reasonSearch) params.reason = reasonSearch;
            if (statusFilter === "resolved") params.isResolved = true;
            if (statusFilter === "pending") params.isResolved = false;

            console.log("[FETCH_REPORTS] Request params:", params);
            const data = await getAdminReports(params);
            console.log("[FETCH_REPORTS] API Response raw data:", data);

            // Defensive parsing
            const list = data.reports || [];
            setReports(list);

            const tc = data.totalCount ?? list.length;
            setTotal(tc);

            const tp = Math.ceil(tc / pageSize);
            setTotalPages(tp || 1);
        } catch (e: unknown) {
            console.error("[FETCH_REPORTS] Failed to load moderation reports:", e);
            const msg = e instanceof Error ? e.message : "Không thể tải danh sách báo cáo từ máy chủ.";
            setError(msg);
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, reasonSearch, statusFilter]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleSearch = () => {
        setReasonSearch(reasonSearchInput);
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728] flex items-center gap-2">
                        <Flag className="w-8 h-8 text-rose-600 shrink-0" /> Quản lý báo cáo vi phạm
                    </h2>
                    <p className="text-muted-foreground mt-1">Danh sách báo cáo vi phạm bài viết từ cộng đồng V-Closet.</p>
                </div>
                <Button variant="outline" size="icon" onClick={fetchReports} title="Làm mới dữ liệu">
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm lý do vi phạm (Spam, Inappropriate...)"
                            className="pl-8 bg-card"
                            value={reasonSearchInput}
                            onChange={e => setReasonSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <Button variant="outline" onClick={handleSearch}>
                        <Filter className="h-4 w-4 mr-1.5" /> Lọc
                    </Button>
                </div>

                {/* Status filter */}
                <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Trạng thái xử lý" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="pending">Đang chờ xử lý</SelectItem>
                        <SelectItem value="resolved">Đã xử lý xong</SelectItem>
                    </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground ml-auto">
                    {loading ? "Đang tải dữ liệu..." : (
                        <>Hiển thị <strong>{reports.length}</strong> / <strong>{total}</strong> báo cáo</>
                    )}
                </div>
            </div>

            {/* Error handling alert */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-red-600 hover:text-red-700 h-7"
                        onClick={fetchReports}>Thử lại</Button>
                </div>
            )}

            {/* Responsive Reports Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Bài viết bị báo cáo</TableHead>
                            <TableHead>Tác giả bài đăng</TableHead>
                            <TableHead>Người báo cáo</TableHead>
                            <TableHead>Lý do vi phạm</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead className="text-right">Xem chi tiết</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" />
                                        <span>Đang đồng bộ dữ liệu báo cáo...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-20 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Flag className="w-10 h-10 opacity-20 text-stone-400" />
                                        <p className="font-medium">Không tìm thấy báo cáo nào phù hợp.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map(report => (
                                <TableRow key={report.reportId} className="hover:bg-muted/30 transition-colors">
                                    {/* Post Caption */}
                                    <TableCell className="max-w-[200px]">
                                        <div className="truncate font-semibold text-stone-800" title={report.postCaption}>
                                            "{report.postCaption || "Không có chú thích"}"
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                            ID: {report.postId.slice(0, 8)}...
                                        </div>
                                    </TableCell>

                                    {/* Author */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7 border border-[#dccbb5]">
                                                <AvatarFallback className="bg-[#e8dfd5] text-[#4a3728] text-[10px] font-bold">
                                                    {report.postCreatorDisplayName?.charAt(0) ?? "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-stone-700">{report.postCreatorDisplayName}</span>
                                        </div>
                                    </TableCell>

                                    {/* Reporter */}
                                    <TableCell>
                                        <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                                            {report.reporterDisplayName}
                                        </span>
                                    </TableCell>

                                    {/* Reason & description snippet */}
                                    <TableCell className="max-w-[180px]">
                                        <Badge className={`text-xs border font-medium ${getReasonBadge(report.reason)}`}>
                                            {report.reason}
                                        </Badge>
                                        {report.description && (
                                            <div className="text-xs text-muted-foreground truncate mt-1 max-w-[160px]" title={report.description}>
                                                {report.description}
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Resolution Status */}
                                    <TableCell>
                                        {report.isResolved ? (
                                            <Badge className="bg-green-50 text-green-700 border-green-200 text-[11px] font-normal gap-1">
                                                <CheckCircle className="w-3 h-3 shrink-0" /> Đã ẩn/xử lý
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-normal gap-1">
                                                <AlertCircle className="w-3 h-3 shrink-0" /> Chờ xử lý
                                            </Badge>
                                        )}
                                    </TableCell>

                                    {/* Created Time */}
                                    <TableCell className="text-xs text-stone-500 font-mono">
                                        {formatDate(report.createdAt)}
                                    </TableCell>

                                    {/* Action button */}
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                            title="Xem chi tiết báo cáo"
                                            onClick={() => setSelectedReport(report)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8"
                        disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                            return (
                                <Button key={p} variant={p === page ? "default" : "outline"}
                                    size="icon" className={`h-8 w-8 text-xs ${p === page ? "bg-[#4a3728] hover:bg-[#3d2d21]" : ""}`}
                                    onClick={() => setPage(p)}>
                                    {p}
                                </Button>
                            );
                        })}
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8"
                        disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                        Trang {page} / {totalPages}
                    </span>
                </div>
            )}

            {/* Report Details Modal */}
            <ReportDetailModal
                report={selectedReport}
                open={!!selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </div>
    );
}
