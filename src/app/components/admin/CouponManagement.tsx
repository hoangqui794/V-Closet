import { useState, useEffect } from "react";
import { 
    getAdminCoupons, 
    createAdminCoupon, 
    updateAdminCoupon,
    toggleAdminCoupon, 
    deleteAdminCoupon, 
    Coupon 
} from "@/lib/api";
import { 
    Ticket, 
    Plus, 
    Trash2, 
    Edit,
    RefreshCw, 
    Search,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function CouponManagement() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Create/Edit Coupon States
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCode, setNewCode] = useState("");
    const [newDiscountType, setNewDiscountType] = useState("1"); // 1 = percentage, 2 = fixed
    const [newDiscountValue, setNewDiscountValue] = useState("");
    const [newMaxUses, setNewMaxUses] = useState("");
    const [newExpiresAt, setNewExpiresAt] = useState("");

    // Delete Modal
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchCoupons = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await getAdminCoupons();
            setCoupons(data);
        } catch (error: any) {
            toast.error(error.message || "Lỗi khi tải danh sách mã giảm giá");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDialogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDialogLoading(true);
        try {
            const payload = {
                code: newCode.trim().toUpperCase(),
                discountType: parseInt(newDiscountType, 10),
                discountValue: parseFloat(newDiscountValue),
                maxUses: newMaxUses ? parseInt(newMaxUses, 10) : null,
                expiresAt: newExpiresAt ? new Date(newExpiresAt).toISOString() : null,
            };

            if (editingId) {
                await updateAdminCoupon(editingId, payload);
                toast.success("Cập nhật mã giảm giá thành công");
            } else {
                await createAdminCoupon(payload);
                toast.success("Tạo mã giảm giá thành công");
            }
            
            setDialogOpen(false);
            
            // Reset form
            setEditingId(null);
            setNewCode("");
            setNewDiscountType("1");
            setNewDiscountValue("");
            setNewMaxUses("");
            setNewExpiresAt("");
            
            fetchCoupons(true);
        } catch (error: any) {
            toast.error(error.message || (editingId ? "Cập nhật mã thất bại" : "Tạo mã thất bại"));
        } finally {
            setDialogLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setNewCode("");
        setNewDiscountType("1");
        setNewDiscountValue("");
        setNewMaxUses("");
        setNewExpiresAt("");
        setDialogOpen(true);
    };

    const openEditDialog = (coupon: Coupon) => {
        setEditingId(coupon.id);
        setNewCode(coupon.code);
        setNewDiscountType(coupon.discountType === "percentage" ? "1" : "2");
        setNewDiscountValue(coupon.discountValue.toString());
        setNewMaxUses(coupon.maxUses ? coupon.maxUses.toString() : "");
        
        if (coupon.expiresAt) {
            // Định dạng chuỗi "YYYY-MM-DDTHH:mm" cho thẻ input type="datetime-local"
            const date = new Date(coupon.expiresAt);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const hh = String(date.getHours()).padStart(2, "0");
            const min = String(date.getMinutes()).padStart(2, "0");
            setNewExpiresAt(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
        } else {
            setNewExpiresAt("");
        }
        
        setDialogOpen(true);
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
            await toggleAdminCoupon(id);
            toast.success(`Đã ${currentStatus ? 'tắt' : 'bật'} mã giảm giá`);
        } catch (error: any) {
            // Revert
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: currentStatus } : c));
            toast.error(error.message || "Lỗi khi thay đổi trạng thái");
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteAdminCoupon(deletingId);
            toast.success("Đã xoá mã giảm giá");
            setCoupons(prev => prev.filter(c => c.id !== deletingId));
            setDeleteOpen(false);
            setDeletingId(null);
        } catch (error: any) {
            toast.error(error.message || "Lỗi khi xoá mã");
        }
    };

    const openDeleteModal = (id: string) => {
        setDeletingId(id);
        setDeleteOpen(true);
    };

    const filteredCoupons = coupons.filter(c => 
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-poppins">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#4a3728] flex items-center gap-2">
                        <Ticket className="w-6 h-6" /> Quản lý Mã giảm giá
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tạo và quản lý các coupon khuyến mãi cho người dùng.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => fetchCoupons(true)}
                        className="gap-2 text-xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                    <Button 
                        onClick={openCreateDialog}
                        className="gap-2 text-xs bg-[#4a3728] hover:bg-[#3d2d21] text-white"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo mã mới
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border-stone-200">
                <CardHeader className="pb-3 border-b">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo mã (Code)..."
                                className="pl-9 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-stone-50/50">
                                <TableRow>
                                    <TableHead className="w-[150px]">Mã giảm giá</TableHead>
                                    <TableHead>Chiết khấu</TableHead>
                                    <TableHead>Đã dùng / Giới hạn</TableHead>
                                    <TableHead>Hạn sử dụng</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 7 }).map((_, j) => (
                                                <TableCell key={j}>
                                                    <div className="h-4 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : filteredCoupons.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            Không tìm thấy mã giảm giá nào.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCoupons.map((coupon) => (
                                        <TableRow key={coupon.id} className="hover:bg-stone-50/50">
                                            <TableCell className="font-medium text-stone-800">
                                                <Badge variant="outline" className="font-mono bg-white uppercase">
                                                    {coupon.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {coupon.discountType === "percentage" ? (
                                                    <span className="font-bold text-green-600">{coupon.discountValue}%</span>
                                                ) : (
                                                    <span className="font-bold text-amber-600">{coupon.discountValue.toLocaleString()}đ</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <span className="font-medium">{coupon.currentUses}</span>
                                                    <span className="text-muted-foreground">/</span>
                                                    <span className="text-muted-foreground">{coupon.maxUses || '∞'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {coupon.expiresAt 
                                                    ? format(new Date(coupon.expiresAt), "dd/MM/yyyy HH:mm", { locale: vi })
                                                    : "Vô thời hạn"
                                                }
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {format(new Date(coupon.createdAt), "dd/MM/yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                <Switch 
                                                    checked={coupon.isActive} 
                                                    onCheckedChange={() => handleToggle(coupon.id, coupon.isActive)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(coupon)}
                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 mr-1"
                                                    title="Chỉnh sửa mã"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteModal(coupon.id)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    title="Xoá mã"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728]">
                            <Ticket className="w-5 h-5" /> {editingId ? "Cập Nhật Mã Giảm Giá" : "Tạo Mã Giảm Giá"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingId ? "Chỉnh sửa thông tin mã giảm giá hiện tại." : "Tạo mã giảm giá mới để người dùng có thể áp dụng khi thanh toán."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleDialogSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase">Mã Code *</label>
                            <Input 
                                required
                                placeholder="VD: WELCOME20"
                                value={newCode}
                                onChange={e => setNewCode(e.target.value.toUpperCase())}
                                className="font-mono uppercase"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase">Loại giảm *</label>
                                <Select value={newDiscountType} onValueChange={setNewDiscountType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Phần trăm (%)</SelectItem>
                                        <SelectItem value="2">Tiền mặt (đ)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase">Giá trị *</label>
                                <Input 
                                    required
                                    type="number"
                                    min="0"
                                    placeholder={newDiscountType === "1" ? "VD: 20" : "VD: 50000"}
                                    value={newDiscountValue}
                                    onChange={e => setNewDiscountValue(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase">Giới hạn lượt dùng</label>
                                <Input 
                                    type="number"
                                    min="1"
                                    placeholder="Bỏ trống = Không giới hạn"
                                    value={newMaxUses}
                                    onChange={e => setNewMaxUses(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase">Hạn sử dụng</label>
                                <Input 
                                    type="datetime-local"
                                    value={newExpiresAt}
                                    onChange={e => setNewExpiresAt(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={dialogLoading} className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                                {dialogLoading ? "Đang xử lý..." : (editingId ? "Lưu thay đổi" : "Tạo Mã")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" /> Xoá Mã Giảm Giá
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xoá vĩnh viễn mã giảm giá này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Xoá vĩnh viễn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
