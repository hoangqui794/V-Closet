import { useState, useEffect } from "react";
import {
    getAdminOutfits,
    deleteOutfitByAdmin,
    bulkDeleteOutfitsByAdmin,
    AdminOutfitItem
} from "@/lib/api";
import {
    Sparkles,
    Search,
    Trash2,
    CheckCircle,
    AlertCircle,
    X,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Heart,
    Eye,
    Globe,
    Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";

// ─── Toast System ────────────────────────────────────────────────────────────
interface Toast {
    id: number;
    type: "success" | "error";
    message: string;
}
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

export function OutfitManagement({ showHeader = true }: { showHeader?: boolean }) {
    // Toasts state
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // State parameters
    const [outfits, setOutfits] = useState<AdminOutfitItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);

    // Filters
    const [search, setSearch] = useState("");
    const [isPublicFilter, setIsPublicFilter] = useState<string>("");
    const [userIdFilter, setUserIdFilter] = useState<number | "">("");

    // Modal states
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Bulk delete states
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Fetch outfits
    const fetchOutfits = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page,
                pageSize
            };
            if (search.trim()) params.search = search.trim();
            if (isPublicFilter !== "") params.isPublic = isPublicFilter === "true";
            if (userIdFilter !== "") params.userInternalId = Number(userIdFilter);

            const res = await getAdminOutfits(params);
            setOutfits(res.items || []);
            setTotalCount(res.totalCount || 0);
            setSelectedIds([]); // Clear selection when outfits reload
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Tải danh sách bộ phối đồ thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOutfits();
    }, [page, isPublicFilter, userIdFilter]);

    // Handle search form submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOutfits();
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearch("");
        setIsPublicFilter("");
        setUserIdFilter("");
        setPage(1);
    };

    // Handle delete outfit
    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteOutfitByAdmin(deleteId);
            addToast("success", "Đã xóa bộ phối đồ của người dùng thành công!");
            setDeleteId(null);
            
            // Adjust page if necessary
            if (outfits.length === 1 && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchOutfits();
            }
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Xóa bộ phối đồ thất bại.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle bulk delete outfits
    const handleBulkDeleteConfirm = async () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleting(true);
        try {
            await bulkDeleteOutfitsByAdmin(selectedIds);
            addToast("success", `Đã xóa thành công ${selectedIds.length} bộ phối đồ khỏi hệ thống!`);
            setSelectedIds([]);
            setBulkConfirmOpen(false);
            
            // Adjust page if necessary
            if (outfits.length === selectedIds.length && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchOutfits();
            }
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Xóa hàng loạt thất bại.");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins text-foreground">
            {/* Header */}
            {showHeader ? (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#4a3728] dark:text-foreground flex items-center gap-2">
                            <Sparkles className="w-8 h-8" /> Quản lý Bộ phối đồ (Outfit)
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Quản lý các bộ trang phục tự thiết kế của người dùng ghép từ Canvas 2D.
                        </p>
                    </div>
                    <Badge className="bg-[#4a3728]/10 dark:bg-primary/10 text-[#4a3728] dark:text-foreground hover:bg-[#4a3728]/15 dark:bg-primary/15 border-[#4a3728]/20 dark:border-primary/20 px-3 py-1 text-sm font-semibold">
                        Tổng số lượng: {totalCount} bộ đồ
                    </Badge>
                </div>
            ) : (
                <div className="flex justify-end mb-2">
                    <Badge className="bg-[#4a3728]/10 dark:bg-primary/10 text-[#4a3728] dark:text-foreground hover:bg-[#4a3728]/15 dark:bg-primary/15 border-[#4a3728]/20 dark:border-primary/20 px-3 py-1 text-sm font-semibold">
                        Tổng số lượng: {totalCount} bộ đồ
                    </Badge>
                </div>
            )}

            {/* Filters */}
            <Card className="border-[#4a3728]/10 dark:border-primary/10 shadow-sm bg-card/60 backdrop-blur-md">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-12 items-end">
                        {/* Search Input */}
                        <div className="md:col-span-4 space-y-1.5">
                            <label className="text-xs font-bold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Tìm theo tiêu đề bộ đồ
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Nhập tiêu đề bộ trang phục..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9 bg-card border-border"
                                />
                            </div>
                        </div>

                        {/* Visibility Select */}
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-bold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Trạng thái hiển thị
                            </label>
                            <select
                                value={isPublicFilter}
                                onChange={e => { setIsPublicFilter(e.target.value); setPage(1); }}
                                className="w-full flex h-10 rounded-xl border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="true">Công khai (Public)</option>
                                <option value="false">Riêng tư (Private)</option>
                            </select>
                        </div>

                        {/* User ID Filter */}
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-bold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                ID Thành viên
                            </label>
                            <Input
                                type="number"
                                placeholder="Nhập ID User thiết kế..."
                                value={userIdFilter}
                                onChange={e => { setUserIdFilter(e.target.value === "" ? "" : Number(e.target.value)); setPage(1); }}
                                className="bg-card border-border"
                            />
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-2 flex gap-2 w-full">
                            <Button type="submit" className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground flex-1 rounded-xl">
                                Tìm kiếm
                            </Button>
                            <Button type="button" variant="outline" onClick={handleResetFilters} className="rounded-xl px-2.5">
                                Xóa lọc
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Grid list */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-card/40 border border-border/50 rounded-2xl">
                    <Loader2 className="w-10 h-10 animate-spin text-[#4a3728] dark:text-foreground mb-2" />
                    <p className="text-sm font-semibold">Đang tải danh sách bộ phối đồ...</p>
                </div>
            ) : outfits.length === 0 ? (
                <div className="text-center py-24 bg-card/40 border border-border/50 rounded-2xl text-muted-foreground space-y-3">
                    <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/30 animate-pulse" />
                    <p className="text-base font-semibold">Không tìm thấy bộ phối đồ nào</p>
                    <p className="text-xs max-w-md mx-auto">
                        Người dùng chưa tự thiết kế bộ trang phục nào khớp với bộ lọc tìm kiếm này.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-card/60 backdrop-blur-md p-3.5 border border-[#4a3728]/10 dark:border-primary/10 rounded-xl">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="selectAllOutfits"
                                checked={outfits.length > 0 && selectedIds.length === outfits.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedIds(outfits.map(item => item.id));
                                    } else {
                                        setSelectedIds([]);
                                    }
                                }}
                                className="w-4 h-4 rounded border-[#4a3728]/30 dark:border-primary text-[#4a3728] dark:text-foreground focus:ring-[#4a3728]/20 cursor-pointer accent-[#4a3728]"
                            />
                            <label htmlFor="selectAllOutfits" className="text-xs font-semibold  dark:text-muted-foreground cursor-pointer select-none">
                                Chọn tất cả trên trang này
                            </label>
                        </div>
                        {selectedIds.length > 0 && (
                            <span className="text-xs font-semibold text-[#4a3728] dark:text-foreground">
                                Đang chọn {selectedIds.length} bộ phối đồ
                            </span>
                        )}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {outfits.map(outfit => {
                            const formattedDate = new Date(outfit.createdAt).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            });

                            const isSelected = selectedIds.includes(outfit.id);

                            return (
                                <Card key={outfit.id} className={`overflow-hidden border/60 shadow-sm hover:shadow-md transition-all duration-300 bg-card/80 group
                                    ${isSelected ? "ring-2 ring-[#4a3728] border-transparent bg-[#4a3728]/5 dark:bg-primary/5" : ""}`}>
                                    {/* Snapshot Image Container */}
                                    <div className="relative aspect-square  dark:bg-muted flex items-center justify-center overflow-hidden border-b">
                                        {/* Checkbox Overlay */}
                                        <div className="absolute top-2.5 left-2 z-20">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds(prev => [...prev, outfit.id]);
                                                    } else {
                                                        setSelectedIds(prev => prev.filter(id => id !== outfit.id));
                                                    }
                                                }}
                                                className="w-5 h-5 rounded border-[#4a3728]/30 dark:border-primary text-[#4a3728] dark:text-foreground focus:ring-[#4a3728]/20 cursor-pointer accent-[#4a3728] bg-card/80"
                                            />
                                        </div>

                                        {outfit.canvasSnapshotUrl ? (
                                            <img
                                                src={outfit.canvasSnapshotUrl}
                                                alt={outfit.title || "Outfit Snapshot"}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="text-xs text-muted-foreground font-semibold flex flex-col items-center gap-1.5">
                                                <Sparkles className="w-8 h-8 opacity-25" />
                                                Không có ảnh chụp
                                            </div>
                                        )}

                                        {/* Status badge */}
                                        <div className="absolute top-2.5 left-9 flex flex-col gap-1 z-10">
                                            {outfit.isPublic ? (
                                                <Badge className=" dark:bg-green-500/100/10  dark:text-green-400  dark:border-green-500/20 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                                    <Globe className="w-2.5 h-2.5" /> Công khai
                                                </Badge>
                                            ) : (
                                                <Badge className=" dark:bg-muted/500/10  dark:text-muted-foreground border-slate-200 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                                    <Lock className="w-2.5 h-2.5" /> Riêng tư
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="absolute top-2 right-2 z-10">
                                            <Badge className=" dark:bg-red-500/100/10  dark:text-red-400  dark:border-red-500/20 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" /> {outfit.likeCount} thích
                                            </Badge>
                                        </div>

                                        {/* Zoom Action */}
                                        {outfit.canvasSnapshotUrl && (
                                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    onClick={() => setPreviewUrl(outfit.canvasSnapshotUrl)}
                                                    className="w-8 h-8 rounded-full bg-card/95 backdrop-blur shadow hover:bg-card text-[#4a3728] dark:text-foreground"
                                                    title="Phóng to ảnh phối đồ"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Info Details */}
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold  dark:text-foreground text-sm truncate" title={outfit.title || "Bộ đồ không tiêu đề"}>
                                                {outfit.title || "Bộ đồ tự thiết kế"}
                                            </h4>
                                        </div>

                                        <div className="text-[11px]  dark:bg-muted/50 border p-2 rounded-lg space-y-1  dark:text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Người thiết kế:</span>
                                                <span className="font-bold text-[#4a3728] dark:text-foreground truncate max-w-[120px]" title={`${outfit.userDisplayName} (ID: ${outfit.userInternalId})`}>
                                                    {outfit.userDisplayName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Mã ID User:</span>
                                                <span className="font-bold font-mono  dark:text-muted-foreground">{outfit.userInternalId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Ngày tạo:</span>
                                                <span className="font-mono">{formattedDate}</span>
                                            </div>
                                        </div>

                                        {/* Actions block */}
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                onClick={() => setDeleteId(outfit.id)}
                                                variant="ghost"
                                                className="w-full rounded-xl h-8 text-xs font-semibold flex items-center justify-center gap-1.5  dark:text-red-400 hover: dark:bg-red-500/10 hover: dark:text-red-400 border  dark:border-red-500/20"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Xóa bộ đồ vi phạm
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                        <p className="text-xs text-muted-foreground font-semibold">
                            Hiển thị từ {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, totalCount)} bộ phối đồ (Trang {page}/{totalPages})
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="h-8 rounded-lg"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="h-8 rounded-lg"
                            >
                                Sau <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* DIALOG: CONFIRM DELETE */}
            <Dialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2  dark:text-red-400 font-bold">
                            <Trash2 className="w-5 h-5  dark:text-red-400 animate-pulse" /> Xác nhận xóa bộ phối đồ?
                        </DialogTitle>
                        <DialogDescription>
                            Bộ phối đồ này sẽ bị xóa vĩnh viễn khỏi tài khoản của người dùng và cơ sở dữ liệu. Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Đồng ý Xóa vĩnh viễn
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DIALOG: FULLIMAGE PREVIEW */}
            <Dialog open={previewUrl !== null} onOpenChange={open => !open && setPreviewUrl(null)}>
                <DialogContent className="sm:max-w-md p-4 flex flex-col items-center">
                    <DialogHeader className="w-full text-left">
                        <DialogTitle className="text-[#4a3728] dark:text-foreground font-bold">Hình ảnh thiết kế bộ trang phục</DialogTitle>
                    </DialogHeader>
                    {previewUrl && (
                        <div className="border rounded-xl bg-card flex items-center justify-center p-2 max-w-full max-h-[70vh] aspect-square overflow-hidden shadow-inner mt-2">
                            <img src={previewUrl} alt="Outfit Canvas Full" className="max-w-full max-h-full object-contain" />
                        </div>
                    )}
                    <DialogFooter className="w-full mt-4">
                        <Button type="button" onClick={() => setPreviewUrl(null)} className="w-full bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground">
                            Đóng cửa sổ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DIALOG: CONFIRM BULK DELETE */}
            <Dialog open={bulkConfirmOpen} onOpenChange={open => !open && setBulkConfirmOpen(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2  dark:text-red-400 font-bold">
                            <Trash2 className="w-5 h-5  dark:text-red-400 animate-pulse" /> Xác nhận xóa hàng loạt?
                        </DialogTitle>
                        <DialogDescription>
                            Bạn sắp xóa vĩnh viễn <strong className=" dark:text-red-400">{selectedIds.length} bộ phối đồ</strong> khỏi hệ thống. Hành động này sẽ loại bỏ hoàn toàn các bộ phối đồ này khỏi tài khoản của tất cả người dùng tương ứng và cơ sở dữ liệu, không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setBulkConfirmOpen(false)} disabled={isBulkDeleting}>
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleBulkDeleteConfirm}
                            disabled={isBulkDeleting}
                            className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
                        >
                            {isBulkDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Đồng ý Xóa vĩnh viễn
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Floating Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#4a3728]/20 dark:border-primary/20 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-6 z-40 animate-in slide-in-from-bottom-8 duration-300">
                    <span className="text-sm font-semibold  dark:text-foreground">
                        Đã chọn <strong className="text-[#4a3728] dark:text-foreground">{selectedIds.length}</strong> bộ phối đồ
                    </span>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedIds([])}
                            className="rounded-xl border-[#4a3728]/20 dark:border-primary/20  dark:text-muted-foreground h-9"
                        >
                            Hủy chọn
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setBulkConfirmOpen(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center gap-1.5 h-9"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa hàng loạt
                        </Button>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}
