import { useState, useEffect } from "react";
import {
    getAdminWardrobeItems,
    toggleDeactivateWardrobeItem,
    deleteWardrobeItemByAdmin,
    AdminWardrobeItem
} from "@/lib/api";
import {
    Shirt,
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
    Eye,
    Tag,
    Lock,
    Unlock,
    Info,
    HelpCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
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

export function WardrobeManagement() {
    // Toasts state
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // State parameters
    const [items, setItems] = useState<AdminWardrobeItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);

    // Filter states
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [userIdFilter, setUserIdFilter] = useState<number | "">("");

    // Modal states
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [previewItem, setPreviewItem] = useState<AdminWardrobeItem | null>(null);

    // Fetch wardrobe items
    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page,
                pageSize
            };
            if (search.trim()) params.search = search.trim();
            if (category) params.category = category;
            if (userIdFilter !== "") params.userInternalId = Number(userIdFilter);

            const res = await getAdminWardrobeItems(params);
            setItems(res.items || []);
            setTotalCount(res.totalCount || 0);
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Tải dữ liệu tủ đồ thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [page, category, userIdFilter]);

    // Handle search form submission
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchItems();
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearch("");
        setCategory("");
        setUserIdFilter("");
        setPage(1);
    };

    // Toggle wardrobe item status (Active/Deactivated)
    const handleToggleStatus = async (item: AdminWardrobeItem) => {
        try {
            const newStatus = !item.isActive;
            await toggleDeactivateWardrobeItem(item.id, newStatus);
            addToast("success", `Đã ${newStatus ? "kích hoạt" : "khóa"} hình ảnh món đồ thành công!`);
            
            // Local state update for immediate feedback
            setItems(prev => prev.map(x => x.id === item.id ? { ...x, isActive: newStatus } : x));
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Thay đổi trạng thái thất bại.");
        }
    };

    // Handle delete wardrobe item
    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteWardrobeItemByAdmin(deleteId);
            addToast("success", "Đã xóa món đồ khỏi hệ thống thành công!");
            setDeleteId(null);
            
            // Adjust page if necessary
            if (items.length === 1 && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchItems();
            }
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Xóa món đồ thất bại.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Get category vietnamese name
    const getCategoryName = (cat: string) => {
        switch (cat?.toLowerCase()) {
            case "top": return "Áo (Top)";
            case "bottom": return "Quần/Váy (Bottom)";
            case "dress": return "Đầm (Dress)";
            case "outerwear": return "Áo khoác (Outerwear)";
            case "shoes": return "Giày dép (Shoes)";
            case "bag": return "Túi xách (Bag)";
            case "accessory": return "Phụ kiện (Accessory)";
            default: return cat || "Khác";
        }
    };

    // Get AI Status badge class
    const getAiBadgeStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-500/10 text-green-600 border-green-200";
            case "failed":
                return "bg-red-500/10 text-red-600 border-red-200";
            case "processing":
                return "bg-blue-500/10 text-blue-600 border-blue-200 animate-pulse";
            default:
                return "bg-slate-500/10 text-slate-600 border-slate-200";
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728] flex items-center gap-2">
                        <Shirt className="w-8 h-8" /> Quản lý Tủ đồ thành viên
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Quản lý toàn bộ hình ảnh quần áo người dùng tải lên tủ đồ cá nhân.
                    </p>
                </div>
                <Badge className="bg-[#4a3728]/10 text-[#4a3728] hover:bg-[#4a3728]/15 border-[#4a3728]/20 px-3 py-1 text-sm font-semibold">
                    Tổng cộng: {totalCount} món đồ
                </Badge>
            </div>

            {/* Filter Section */}
            <Card className="border-[#4a3728]/10 shadow-sm bg-card/60 backdrop-blur-md">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-12 items-end">
                        {/* Search Input */}
                        <div className="md:col-span-4 space-y-1.5">
                            <label className="text-xs font-bold text-[#4a3728]/80 uppercase tracking-wide">
                                Tìm theo tên/nhãn hiệu
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Tìm tên quần áo, nhãn hiệu..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9 bg-white border-border"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-bold text-[#4a3728]/80 uppercase tracking-wide">
                                Danh mục
                            </label>
                            <select
                                value={category}
                                onChange={e => { setCategory(e.target.value); setPage(1); }}
                                className="w-full flex h-10 rounded-xl border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="">Tất cả danh mục</option>
                                <option value="Top">Áo (Top)</option>
                                <option value="Bottom">Quần/Váy (Bottom)</option>
                                <option value="Dress">Đầm (Dress)</option>
                                <option value="Outerwear">Áo khoác (Outerwear)</option>
                                <option value="Shoes">Giày dép (Shoes)</option>
                                <option value="Bag">Túi xách (Bag)</option>
                                <option value="Accessory">Phụ kiện (Accessory)</option>
                                <option value="Other">Khác (Other)</option>
                            </select>
                        </div>

                        {/* User ID Filter */}
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-bold text-[#4a3728]/80 uppercase tracking-wide">
                                ID Thành viên
                            </label>
                            <Input
                                type="number"
                                placeholder="Nhập ID User..."
                                value={userIdFilter}
                                onChange={e => { setUserIdFilter(e.target.value === "" ? "" : Number(e.target.value)); setPage(1); }}
                                className="bg-white border-border"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="md:col-span-2 flex gap-2 w-full">
                            <Button type="submit" className="bg-[#4a3728] hover:bg-[#3d2d21] text-white flex-1 rounded-xl">
                                Tìm kiếm
                            </Button>
                            <Button type="button" variant="outline" onClick={handleResetFilters} className="rounded-xl px-2.5">
                                Xóa lọc
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Grid display */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-white/40 border border-border/50 rounded-2xl">
                    <Loader2 className="w-10 h-10 animate-spin text-[#4a3728] mb-2" />
                    <p className="text-sm font-semibold">Đang tải dữ liệu hình ảnh tủ đồ...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-24 bg-white/40 border border-border/50 rounded-2xl text-muted-foreground space-y-3">
                    <Shirt className="w-16 h-16 mx-auto text-muted-foreground/30 animate-pulse" />
                    <p className="text-base font-semibold">Không tìm thấy món đồ nào trong tủ đồ</p>
                    <p className="text-xs max-w-md mx-auto">
                        Hãy thử điều chỉnh bộ lọc tìm kiếm hoặc kiểm tra xem ID người dùng nhập vào có tồn tại hay không.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {items.map(item => {
                            const formattedDate = new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            });

                            return (
                                <Card key={item.id} className={`overflow-hidden border/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 group
                                    ${!item.isActive ? "opacity-75 border-red-200 bg-rose-50/10" : ""}`}>
                                    {/* Image Container with background removal hover preview */}
                                    <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden border-b">
                                        <img
                                            src={item.originalImageUrl}
                                            alt={item.name || "Original Wardrobe Item"}
                                            className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-20"
                                        />
                                        {item.removedBgUrl ? (
                                            <img
                                                src={item.removedBgUrl}
                                                alt={item.name || "Removed Background"}
                                                className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 text-xs text-muted-foreground font-semibold">
                                                Chưa tách nền AI
                                            </div>
                                        )}

                                        {/* Status Overlays */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                            <Badge className={`border text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${getAiBadgeStyle(item.bgRemovalStatus)}`}>
                                                AI: {item.bgRemovalStatus}
                                            </Badge>
                                            {!item.isActive && (
                                                <Badge className="bg-red-600 text-white border-none text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                                    <Lock className="w-2.5 h-2.5" /> Bị Khóa
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="icon"
                                                onClick={() => setPreviewItem(item)}
                                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow hover:bg-white text-[#4a3728]"
                                                title="Xem phóng to nguyên ảnh"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-slate-800 text-sm truncate" title={item.name || "Không tên"}>
                                                {item.name || "Món đồ chưa đặt tên"}
                                            </h4>
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                                                <Tag className="w-3.5 h-3.5" />
                                                <span>{getCategoryName(item.category)}</span>
                                            </div>
                                        </div>

                                        <div className="text-[11px] bg-slate-50 border p-2 rounded-lg space-y-1 text-slate-600">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Thành viên:</span>
                                                <span className="font-bold text-[#4a3728] truncate max-w-[120px]" title={`${item.userDisplayName} (ID: ${item.userInternalId})`}>
                                                    {item.userDisplayName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Nhãn hiệu:</span>
                                                <span className="font-bold truncate max-w-[120px]">{item.brand || "Không rõ"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Ngày tải lên:</span>
                                                <span className="font-mono">{formattedDate}</span>
                                            </div>
                                        </div>

                                        {/* Actions block */}
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                onClick={() => handleToggleStatus(item)}
                                                variant={item.isActive ? "outline" : "secondary"}
                                                size="sm"
                                                className={`flex-1 rounded-xl h-8 text-xs font-semibold flex items-center gap-1.5 transition-colors
                                                    ${item.isActive 
                                                        ? "text-amber-800 hover:bg-amber-50 hover:text-amber-900 border-amber-800/20" 
                                                        : "bg-green-600 hover:bg-green-700 text-white"}`}
                                            >
                                                {item.isActive ? (
                                                    <>
                                                        <Lock className="w-3.5 h-3.5 shrink-0" />
                                                        Khóa ảnh
                                                    </>
                                                ) : (
                                                    <>
                                                        <Unlock className="w-3.5 h-3.5 shrink-0" />
                                                        Kích hoạt
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => setDeleteId(item.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 shrink-0"
                                                title="Xóa món đồ vĩnh viễn"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                            Hiển thị từ {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, totalCount)} trong số {totalCount} hình ảnh (Trang {page}/{totalPages})
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
                        <DialogTitle className="flex items-center gap-2 text-rose-700 font-bold">
                            <Trash2 className="w-5 h-5 text-rose-600 animate-pulse" /> Xác nhận xóa vĩnh viễn?
                        </DialogTitle>
                        <DialogDescription>
                            Món đồ này sẽ bị xóa hoàn toàn khỏi tủ đồ của người dùng và cơ sở dữ liệu. Hành động này không thể khôi phục.
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

            {/* DIALOG: IMAGE PREVIEW */}
            <Dialog open={previewItem !== null} onOpenChange={open => !open && setPreviewItem(null)}>
                <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto p-4">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-[#4a3728] font-bold">
                            {previewItem?.name || "Chi tiết hình ảnh"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium">
                            Đăng bởi: <span className="font-bold">{previewItem?.userDisplayName}</span> ({previewItem?.userEmail})
                        </DialogDescription>
                    </DialogHeader>
                    {previewItem && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Ảnh gốc do user gửi</span>
                                    <div className="border rounded-xl bg-slate-50 flex items-center justify-center p-2 aspect-square">
                                        <img src={previewItem.originalImageUrl} alt="Original" className="max-w-full max-h-64 object-contain" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Ảnh sau tách nền AI</span>
                                    <div className="border rounded-xl bg-slate-50 flex items-center justify-center p-2 aspect-square relative">
                                        {previewItem.removedBgUrl ? (
                                            <img src={previewItem.removedBgUrl} alt="Bg Removed" className="max-w-full max-h-64 object-contain" />
                                        ) : (
                                            <div className="text-xs text-muted-foreground text-center px-4">
                                                <HelpCircle className="w-8 h-8 mx-auto text-muted-foreground/30 mb-1" />
                                                Chưa có ảnh đã tách nền
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 border p-3.5 rounded-xl text-xs space-y-2.5">
                                <div className="grid grid-cols-3">
                                    <span className="font-bold text-slate-500">Mã ID Tủ đồ:</span>
                                    <span className="col-span-2 font-mono">{previewItem.id}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-bold text-slate-500">Thành viên đăng:</span>
                                    <span className="col-span-2 font-semibold text-slate-700">
                                        {previewItem.userDisplayName} (ID: {previewItem.userInternalId})
                                    </span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-bold text-slate-500">Loại trang phục:</span>
                                    <span className="col-span-2 font-semibold">{getCategoryName(previewItem.category)}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-bold text-slate-500">Thương hiệu:</span>
                                    <span className="col-span-2 font-semibold text-slate-700">{previewItem.brand || "Không rõ"}</span>
                                </div>
                                {previewItem.notes && (
                                    <div className="grid grid-cols-3">
                                        <span className="font-bold text-slate-500">Ghi chú của user:</span>
                                        <span className="col-span-2 text-slate-600 break-words whitespace-pre-wrap">{previewItem.notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" onClick={() => setPreviewItem(null)} className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}
