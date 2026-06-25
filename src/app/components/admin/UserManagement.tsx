import { useState, useEffect, useCallback } from "react";
import {
    Search, UserPlus, Filter, Eye, Ban, ShieldOff, UserX,
    RefreshCw, ChevronLeft, ChevronRight, X, CheckCircle,
    AlertCircle, Loader2, Shield, UserCog, UserCheck,
    Phone, MapPin, Calendar, Ruler, Shirt, Activity, Info, Mail, User, Globe
} from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription
} from "../ui/dialog";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "../ui/select";
import { Label } from "../ui/label";
import {
    getAdminUsers, createAdminUser, getAdminUserDetail,
    deactivateAdminUser, banAdminUser, unbanAdminUser,
    updateUserRole, reactivateAdminUser,
    grantAdminUserPermissions, revokeAdminUserPermissions, resetAdminUserPermissions,
    getAdminPermissionsAll, getAdminUserPermissions, updateAdminInternalInfo,
    AdminUser, GetUsersParams, PermissionResponse,
    BASE_URL, getToken
} from "../../../lib/api";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
}

function getRoleBadge(role: string) {
    const map: Record<string, string> = {
        Admin: "bg-purple-100 text-purple-700 border-purple-200",
        SuperAdmin: " dark:bg-red-500/10  dark:text-red-400  dark:border-red-500/20",
        Moderator: " dark:bg-blue-500/10  dark:text-blue-400  dark:border-blue-500/20",
        Customer: "bg-muted text-stone-600 dark:text-stone-400 border-stone-200 dark:border-border",
        BrandPartner: " dark:bg-amber-500/10  dark:text-amber-400  dark:border-amber-500/20",
    };
    return map[role] ?? " dark:bg-muted  dark:text-muted-foreground border-gray-200";
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

// ─── Create User Modal ────────────────────────────────────────────────────────

function CreateUserModal({
    open, onClose, onSuccess
}: { open: boolean; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({ email: "", displayName: "", role: "Customer" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!form.email || !form.displayName) {
            setError("Vui lòng điền đầy đủ thông tin."); return;
        }
        setLoading(true); setError("");
        try {
            await createAdminUser(form);
            onSuccess();
            onClose();
            setForm({ email: "", displayName: "", role: "Customer" });
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Tạo tài khoản thất bại");
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[#4a3728] dark:text-foreground">Tạo tài khoản mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin để tạo tài khoản. Mật khẩu sẽ được hệ thống <strong>tự sinh ngẫu nhiên và gửi về email</strong> của người dùng.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    {error && (
                        <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4 shrink-0" />{error}
                        </div>
                    )}
                    {[
                        { label: "Email", key: "email", type: "email", placeholder: "user@example.com" },
                        { label: "Tên hiển thị", key: "displayName", type: "text", placeholder: "Nguyễn Văn A" },
                    ].map(f => (
                        <div key={f.key} className="flex flex-col gap-1.5">
                            <Label>{f.label}</Label>
                            <Input type={f.type} placeholder={f.placeholder}
                                value={(form as Record<string, string>)[f.key]}
                                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                        </div>
                    ))}
                    <div className="flex flex-col gap-1.5">
                        <Label>Vai trò</Label>
                        <Select value={form.role} onValueChange={v => setForm(prev => ({ ...prev, role: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Customer">Customer</SelectItem>
                                <SelectItem value="Moderator">Moderator</SelectItem>
                                <SelectItem value="BrandPartner">BrandPartner</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading}
                        className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Tạo tài khoản
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── User Detail Modal ────────────────────────────────────────────────────────

function UserDetailModal({
    userId, open, onClose, isSuperAdmin, onEditInternalInfo
}: { userId: string | null; open: boolean; onClose: () => void; isSuperAdmin?: boolean; onEditInternalInfo?: () => void }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId || !open) return;
        setLoading(true);
        getAdminUserDetail(userId)
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [userId, open]);

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto pr-2 font-poppins">
                <DialogHeader>
                    <DialogTitle className="text-[#4a3728] dark:text-foreground font-bold text-xl flex items-center gap-2">
                        <Info className="w-5.5 h-5.5  dark:text-amber-500" /> Chi tiết người dùng
                    </DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#4a3728] dark:text-foreground" /></div>
                ) : user ? (
                    <div className="flex flex-col gap-6 py-2">
                        {/* Header Profile Info */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-stone-200 dark:border-border/60">
                            <Avatar className="h-20 w-20 border-2 border-[#dccbb5]">
                                <AvatarImage src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <AvatarFallback className="text-2xl bg-[#f5efe6] dark:bg-muted text-[#4a3728] dark:text-foreground">
                                    {user.displayName?.charAt(0) ?? "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left flex-1 space-y-1">
                                <h3 className="font-bold text-xl text-[#4a3728] dark:text-foreground leading-tight">{user.displayName}</h3>
                                <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 font-mono">
                                    <Mail className="w-3.5 h-3.5 text-stone-400" /> {user.email}
                                </p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                                    <Badge className={`text-xs border ${getRoleBadge(user.role)}`}>{user.role}</Badge>
                                    {user.isBanned && <Badge variant="destructive" className="text-xs">Banned</Badge>}
                                    {!user.isActive && <Badge variant="outline" className="text-xs  dark:text-amber-500  dark:border-amber-500/20">Inactive</Badge>}
                                    {user.isEmailVerified ? (
                                        <Badge className=" dark:bg-green-500/10  dark:text-green-400  dark:border-green-500/20 border text-xs">Email Verified</Badge>
                                    ) : (
                                        <Badge className=" dark:bg-red-500/10  dark:text-red-400  dark:border-red-500/20 border text-xs">Unverified Email</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detail sections in grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Personal & Contact Details */}
                            <div className="border border-[#f5efe6] dark:border-border bg-[#fdfaf7] dark:bg-card rounded-2xl p-4 space-y-3.5 shadow-sm">
                                <h3 className="text-xs font-bold  dark:text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-[#f5efe6] dark:border-border pb-2">
                                    <User className="w-4 h-4 text-[#4a3728] dark:text-foreground" /> Thông tin liên hệ
                                </h3>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">User ID:</span>
                                        <span className="font-mono bg-muted/65 px-1.5 py-0.5 rounded text-[10px] select-all">{user.userId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-400" /> Số điện thoại:</span>
                                        <span className="font-semibold text-[#4a3728] dark:text-foreground">{user.profile?.phoneNumber ?? "—"}</span>
                                    </div>
                                    {user.role === 'Customer' && (
                                        <>
                                            <div className="flex justify-between items-start gap-4">
                                                <span className="text-muted-foreground flex items-center gap-1 shrink-0"><MapPin className="w-3.5 h-3.5 text-stone-400" /> Địa chỉ:</span>
                                                <span className="font-semibold text-[#4a3728] dark:text-foreground text-right break-words max-w-[180px]">{user.profile?.address ?? "—"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-stone-400" /> Ngày sinh:</span>
                                                <span className="font-semibold text-[#4a3728] dark:text-foreground">{user.profile?.dateOfBirth ? formatDate(user.profile?.dateOfBirth) : "—"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Giới tính:</span>
                                                <span className="font-semibold text-[#4a3728] dark:text-foreground bg-muted/50 px-2 py-0.5 rounded-full">{user.profile?.gender ?? "—"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-stone-400" /> Quốc gia:</span>
                                                <span className="font-semibold text-[#4a3728] dark:text-foreground">{user.profile?.country ?? "—"}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Body Profile & Wardrobe (for Customers) / Admin Info (for Admins) */}
                            {(user.role === 'Admin' || user.role === 'Moderator' || user.role === 'SuperAdmin') ? (
                                <div className="border border-[#f5efe6] dark:border-border bg-[#fdfaf7] dark:bg-card rounded-2xl p-4 space-y-3.5 shadow-sm relative">
                                    <h3 className="text-xs font-bold  dark:text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b border-[#f5efe6] dark:border-border pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Activity className="w-4 h-4 text-purple-600" /> Thông tin Nội bộ
                                        </div>
                                        {isSuperAdmin && (
                                            <Button variant="ghost" size="sm" className="h-6 px-2  dark:text-muted-foreground hover:bg-[#f5efe6] dark:bg-muted" onClick={onEditInternalInfo}>
                                                Sửa
                                            </Button>
                                        )}
                                    </h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground flex items-center gap-1">Chức danh:</span>
                                            <span className="font-bold text-[#4a3728] dark:text-foreground">{user.profile?.jobTitle ?? "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Phòng ban:</span>
                                            <span className="font-bold text-[#4a3728] dark:text-foreground">{user.profile?.department ?? "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Mã NV:</span>
                                            <span className="font-bold text-[#4a3728] dark:text-foreground  dark:bg-amber-500/10  dark:text-amber-400 px-2 py-0.5 rounded-full border border-orange-100 font-mono">
                                                {user.profile?.employeeCode ?? "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Trạng thái HĐ:</span>
                                            <span className={`font-semibold ${user.isActive ? " dark:text-green-400" : " dark:text-amber-500"}`}>
                                                {user.isActive ? "🟢 Hoạt động" : "🟡 Inactive"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Ngày đăng ký:</span>
                                            <span className="font-medium text-[#4a3728] dark:text-foreground">{formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-[#f5efe6] dark:border-border bg-[#fdfaf7] dark:bg-card rounded-2xl p-4 space-y-3.5 shadow-sm">
                                    <h3 className="text-xs font-bold  dark:text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-[#f5efe6] dark:border-border pb-2">
                                        <Activity className="w-4 h-4 text-purple-600" /> Chỉ số & Tủ đồ
                                    </h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground flex items-center gap-1"><Ruler className="w-3.5 h-3.5 text-stone-400" /> Chiều cao:</span>
                                            <span className="font-bold text-[#4a3728] dark:text-foreground">{user.profile?.heightCm ? `${user.profile?.heightCm} cm` : "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Cân nặng:</span>
                                            <span className="font-bold text-[#4a3728] dark:text-foreground">{user.profile?.weightKg ? `${user.profile?.weightKg} kg` : "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground flex items-center gap-1"><Shirt className="w-3.5 h-3.5 text-stone-400" /> Số đồ trong tủ:</span>
                                            <span className="font-bold text-[#4a3728] dark:text-foreground  dark:bg-amber-500/10  dark:text-amber-400 px-2 py-0.5 rounded-full border border-orange-100 font-mono">
                                                {user.profile?.wardrobeItemCount ?? 0} món đồ
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Trạng thái HĐ:</span>
                                            <span className={`font-semibold ${user.isActive ? " dark:text-green-400" : " dark:text-amber-500"}`}>
                                                {user.isActive ? "🟢 Hoạt động" : "🟡 Inactive"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Ngày đăng ký:</span>
                                            <span className="font-medium text-[#4a3728] dark:text-foreground">{formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ban / Violation History List */}
                        <div className="border border-[#f5efe6] dark:border-border bg-[#fdfaf7] dark:bg-card rounded-2xl p-4 space-y-3.5 shadow-sm">
                            <h3 className="text-xs font-bold  dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#f5efe6] dark:border-border pb-2">
                                <Ban className="w-4 h-4 text-red-500" /> Lịch sử cấm quyền ({user.banHistory?.length ?? 0})
                            </h3>
                            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                {!user.banHistory || user.banHistory.length === 0 ? (
                                    <p className="text-center text-xs text-muted-foreground py-6">Thành viên này có lý lịch sạch, chưa từng bị cấm.</p>
                                ) : (
                                    user.banHistory.map((ban, index) => (
                                        <div key={ban.id || index} className="p-3 bg-card border border-stone-200 dark:border-border rounded-xl space-y-2.5 text-xs shadow-2xs">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-[10px] text-muted-foreground font-mono">#{index + 1}</span>
                                                    <Badge className=" dark:bg-red-500/10  dark:text-red-400  dark:border-red-500/20 border text-[10px] font-normal uppercase">
                                                        Ban: {ban.banType}
                                                    </Badge>
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    Tạo lúc: {ban.createdAt ? formatDate(ban.createdAt) : "—"}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2.5 text-[11px]  dark:bg-muted/50/50 dark:bg-muted/50 p-2.5 rounded-lg border border-stone-100 dark:border-border">
                                                <div>
                                                    <p className="text-muted-foreground text-[10px]">Lý do cấm:</p>
                                                    <p className="font-semibold text-stone-850">{ban.reason || "Không ghi rõ"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-[10px]">Thời hạn cấm:</p>
                                                    <p className="font-semibold text-stone-850">
                                                        {ban.bannedUntil ? formatDate(ban.bannedUntil) : "Vĩnh viễn"}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground text-[10px]">Người cấm:</p>
                                                    <p className="font-semibold text-[#4a3728] dark:text-foreground">{ban.bannedByDisplayName || "Hệ thống"}</p>
                                                </div>
                                            </div>
                                            {ban.isLifted ? (
                                                <div className="p-2.5  dark:bg-green-500/10/60 border border-emerald-100 rounded-lg text-[10px]  dark:text-green-400">
                                                    <div className="flex justify-between font-bold">
                                                        <span>✅ ĐÃ GỠ CẤM</span>
                                                        <span>Lúc: {ban.liftedAt ? formatDate(ban.liftedAt) : "—"}</span>
                                                    </div>
                                                    <p className="mt-1 leading-relaxed"><span className="font-semibold text-emerald-950">Lý do gỡ:</span> {ban.liftReason || "Không có ghi chú"}</p>
                                                </div>
                                            ) : (
                                                <div className="p-2  dark:bg-red-500/10 border border-rose-100 rounded-lg text-[10px]  dark:text-red-400 flex justify-between font-bold">
                                                    <span>⚠️ ĐANG HIỆU LỰC KHÓA</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">Không tải được thông tin người dùng.</p>
                )}
                <DialogFooter className="border-t pt-3 mt-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Ban User Modal ───────────────────────────────────────────────────────────

function BanUserModal({
    user, open, onClose, onSuccess
}: { user: AdminUser | null; open: boolean; onClose: () => void; onSuccess: () => void }) {
    const [banType, setBanType] = useState("chat");
    const [duration, setDuration] = useState("7d");
    const [customDate, setCustomDate] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setBanType("chat");
            setDuration("7d");
            setCustomDate("");
            setReason("");
            setError("");
        }
    }, [open]);

    const handleBan = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            let bannedUntilStr: string | undefined = undefined;
            if (duration === "30m") {
                bannedUntilStr = new Date(Date.now() + 30 * 60 * 1000).toISOString();
            } else if (duration === "2h") {
                bannedUntilStr = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
            } else if (duration === "1d") {
                bannedUntilStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            } else if (duration === "7d") {
                bannedUntilStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            } else if (duration === "30d") {
                bannedUntilStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            } else if (duration === "permanent") {
                bannedUntilStr = new Date(Date.now() + 100 * 365.25 * 24 * 60 * 60 * 1000).toISOString();
            } else if (duration === "custom") {
                if (!customDate) {
                    setError("Vui lòng chọn thời gian mở khóa.");
                    setLoading(false);
                    return;
                }
                const customMs = new Date(customDate).getTime();
                if (isNaN(customMs) || customMs <= Date.now()) {
                    setError("Thời gian mở khóa phải ở tương lai.");
                    setLoading(false);
                    return;
                }
                bannedUntilStr = new Date(customDate).toISOString();
            }

            await banAdminUser(user.userId, {
                banType,
                bannedUntil: bannedUntilStr,
                reason: reason || undefined,
            });
            onSuccess();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Khóa người dùng thất bại");
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className=" dark:text-red-400 flex items-center gap-2">
                        <Ban className="w-5 h-5" /> Khóa quyền người dùng
                    </DialogTitle>
                    <DialogDescription>
                        Khóa quyền của <strong>{user?.displayName}</strong> ({user?.email}).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    {error && (
                        <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-3 py-2 rounded-lg animate-in fade-in duration-200">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <Label>Loại khóa</Label>
                        <Select value={banType} onValueChange={setBanType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="chat">Khóa chat (Không thể chat)</SelectItem>
                                <SelectItem value="post">Khóa đăng bài (Không thể đăng bài)</SelectItem>
                                <SelectItem value="all">Khóa toàn bộ (Khóa mọi quyền)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Thời hạn khóa</Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30m">30 phút</SelectItem>
                                <SelectItem value="2h">2 giờ</SelectItem>
                                <SelectItem value="1d">1 ngày</SelectItem>
                                <SelectItem value="7d">7 ngày</SelectItem>
                                <SelectItem value="30d">30 ngày</SelectItem>
                                <SelectItem value="permanent">Vĩnh viễn</SelectItem>
                                <SelectItem value="custom">Tự chọn thời gian...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {duration === "custom" && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Label>Mở khóa vào lúc</Label>
                            <Input type="datetime-local" value={customDate}
                                onChange={e => setCustomDate(e.target.value)}
                                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <Label>Lý do (tùy chọn)</Label>
                        <Input placeholder="Vi phạm nội quy..." value={reason}
                            onChange={e => setReason(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button variant="destructive" onClick={handleBan} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Xác nhận khóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Confirm Deactivate Modal ─────────────────────────────────────────────────

function ConfirmDeactivateModal({
    user, open, onClose, onSuccess
}: { user: AdminUser | null; open: boolean; onClose: () => void; onSuccess: () => void }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setError("");
        }
    }, [open]);

    const handleDeactivate = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            await deactivateAdminUser(user.userId);
            onSuccess();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Vô hiệu hóa tài khoản thất bại");
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2  dark:text-red-400 font-semibold">
                        <UserX className="w-5 h-5 shrink-0" /> Vô hiệu hóa tài khoản
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Bạn có chắc chắn muốn vô hiệu hóa tài khoản của <strong>{user?.displayName}</strong> ({user?.email})?
                        <br />
                        <span className="text-red-500 font-medium">Lưu ý:</span> Trạng thái tài khoản sẽ chuyển thành <span className="font-semibold  dark:text-amber-500">Inactive</span> (isActive = false). Chỉ có SuperAdmin mới được vô hiệu hóa tài khoản của các Admin khác.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-3 py-2 rounded-lg my-2 animate-in fade-in duration-200">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" onClick={handleDeactivate} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Xác nhận vô hiệu hóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Grant Permission Modal ───────────────────────────────────────────────────

function GrantPermissionModal({
    user, open, onClose, onSuccess
}: { user: AdminUser | null; open: boolean; onClose: () => void; onSuccess: (msg: string) => void }) {
    const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
    const [originalCheckedIds, setOriginalCheckedIds] = useState<Set<number>>(new Set());
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    const loadPermissionsData = useCallback(async () => {
        if (!user) return;
        setLoadingData(true);
        setError("");
        try {
            const [allPerms, userPermsResponse] = await Promise.all([
                getAdminPermissionsAll(),
                getAdminUserPermissions(user.userId)
            ]);
            setAllPermissions(Array.isArray(allPerms) ? allPerms : []);
            
            const initialIds = new Set(
                (userPermsResponse.grantedPermissions || []).map(p => p.id)
            );
            setOriginalCheckedIds(new Set(initialIds));
            setCheckedIds(new Set(initialIds));
        } catch (err: any) {
            console.error("Failed to load permissions:", err);
            setError(err.message || "Không thể tải danh sách quyền hạn");
        } finally {
            setLoadingData(false);
        }
    }, [user]);

    useEffect(() => {
        if (open && user) {
            setAllPermissions([]);
            setOriginalCheckedIds(new Set());
            setCheckedIds(new Set());
            setError("");
            loadPermissionsData();
        }
    }, [open, user, loadPermissionsData]);

    const handleTogglePermission = (id: number) => {
        setCheckedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleResetToDefault = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            await resetAdminUserPermissions(user.userId);
            onSuccess(`Đã khôi phục quyền mặc định cho ${user.displayName} thành công!`);
            onClose();
        } catch (e: any) {
            setError(e.message || "Khôi phục quyền mặc định thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!user) return;
        setLoading(true);
        setError("");

        const addedIds = Array.from(checkedIds).filter(id => !originalCheckedIds.has(id));
        const removedIds = Array.from(originalCheckedIds).filter(id => !checkedIds.has(id));

        if (addedIds.length === 0 && removedIds.length === 0) {
            onClose();
            return;
        }

        try {
            if (addedIds.length > 0) {
                await grantAdminUserPermissions(user.userId, { permissionIds: addedIds });
            }
            if (removedIds.length > 0) {
                await revokeAdminUserPermissions(user.userId, { permissionIds: removedIds });
            }
            onSuccess(`Đã cập nhật quyền hạn cho ${user.displayName} thành công!`);
            onClose();
        } catch (e: any) {
            setError(e.message || "Cập nhật quyền hạn thất bại");
        } finally {
            setLoading(false);
        }
    };

    // Group permissions by 'grp'
    const grouped = (allPermissions || []).reduce((acc, p) => {
        const group = p.grp || "Quyền hạn khác";
        if (!acc[group]) acc[group] = [];
        acc[group].push(p);
        return acc;
    }, {} as Record<string, PermissionResponse[]>);

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-semibold text-[#4a3728] dark:text-foreground">
                        <Shield className="w-5 h-5 shrink-0 text-purple-600" /> Quản lý quyền hạn
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Thay đổi các quyền cụ thể của <strong>{user?.displayName}</strong> ({user?.email}).
                        <br />
                        <span className="text-purple-600 font-medium">Yêu cầu:</span> Chỉ SuperAdmin mới có thể thực hiện.
                    </DialogDescription>
                </DialogHeader>

                {loadingData ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="text-xs">Đang tải thông tin quyền hạn...</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 py-2">
                        {error && (
                            <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-3 py-2 rounded-lg animate-in fade-in duration-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="max-h-[380px] overflow-y-auto pr-1 flex flex-col gap-4">
                            {Object.entries(grouped).map(([groupName, permissions]) => (
                                <div key={groupName} className="flex flex-col">
                                    <h5 className="font-semibold text-xs text-purple-800 uppercase tracking-wider mb-2 border-b pb-1 border-purple-100">
                                        {groupName}
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {permissions.map((p) => {
                                            const isChecked = checkedIds.has(p.id);
                                            return (
                                                <label
                                                    key={p.id}
                                                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none
                                                        ${isChecked 
                                                            ? "border-purple-200 bg-purple-50/20 hover:bg-purple-50/30" 
                                                            : "border-[#f5efe6] dark:border-border bg-[#fdfaf7] dark:bg-card hover:bg-muted/50"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleTogglePermission(p.id)}
                                                        className="mt-1 h-4 w-4 rounded border-stone-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-[#4a3728] dark:text-foreground">
                                                            {p.name}
                                                        </span>
                                                        <span className="text-xs font-mono text-purple-600 font-semibold mt-0.5">
                                                            {p.code}
                                                        </span>
                                                        {p.description && (
                                                            <span className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                                {p.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full  dark:text-amber-400 hover: dark:text-amber-400  dark:border-amber-500/20 hover: dark:bg-amber-500/10 gap-1.5 mt-2"
                            onClick={handleResetToDefault}
                            disabled={loading || loadingData}
                        >
                            <AlertCircle className="w-4 h-4" />
                            Khôi phục quyền mặc định theo vai trò ({user?.role})
                        </Button>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading || loadingData}>Hủy</Button>
                    <Button
                        onClick={handleAction}
                        disabled={loading || loadingData}
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Xác nhận lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Update Role Modal ────────────────────────────────────────────────────────

function UpdateRoleModal({
    user, open, onClose, onSuccess
}: { user: AdminUser | null; open: boolean; onClose: () => void; onSuccess: (newRole: string) => void }) {
    const [role, setRole] = useState("Customer");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && user) {
            setRole(user.role);
            setError("");
        }
    }, [open, user]);

    const handleUpdate = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        const rolePayload = role.toLowerCase();

        try {
            await updateUserRole(user.userId, { newRole: rolePayload });
            onSuccess(role);
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Cập nhật vai trò thất bại");
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2  dark:text-amber-500 font-semibold">
                        <UserCog className="w-5 h-5 shrink-0" /> Cập nhật vai trò người dùng
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Thay đổi vai trò của <strong>{user?.displayName}</strong> ({user?.email}).
                        <br />
                        Hệ thống sẽ tự động cập nhật cấu hình profile và áp dụng các quyền hạn tương ứng của vai trò mới.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-3">
                    {error && (
                        <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-3 py-2 rounded-lg animate-in fade-in duration-200">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Label>Chọn vai trò mới</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Customer">Customer</SelectItem>
                                <SelectItem value="Moderator">Moderator</SelectItem>
                                <SelectItem value="BrandPartner">BrandPartner</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button onClick={handleUpdate} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Xác nhận thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Edit Admin Internal Info Modal ─────────────────────────────────────────────

function EditAdminInternalModal({
    user, open, onClose, onSuccess
}: { user: AdminUser | null; open: boolean; onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        department: "",
        jobTitle: "",
        employeeCode: "",
        notes: ""
    });

    useEffect(() => {
        if (open && user) {
            setForm({
                department: user.profile?.department || "",
                jobTitle: user.profile?.jobTitle || "",
                employeeCode: user.profile?.employeeCode || "",
                notes: user.profile?.notes || ""
            });
            setError("");
        }
    }, [open, user]);

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            await updateAdminInternalInfo(user.userId, form);
            onSuccess();
            onClose();
        } catch (e: any) {
            setError(e.message || "Cập nhật thông tin nội bộ thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-700 font-semibold">
                        <UserCog className="w-5 h-5 shrink-0" /> Sửa thông tin Nội bộ
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Cập nhật chức danh, phòng ban cho <strong>{user?.displayName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-3">
                    {error && (
                        <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-3 py-2 rounded-lg animate-in fade-in duration-200">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Label>Chức danh</Label>
                        <Input value={form.jobTitle} onChange={e => setForm(f => ({...f, jobTitle: e.target.value}))} placeholder="Vd: System Administrator" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Phòng ban</Label>
                        <Input value={form.department} onChange={e => setForm(f => ({...f, department: e.target.value}))} placeholder="Vd: IT" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Mã NV</Label>
                        <Input value={form.employeeCode} onChange={e => setForm(f => ({...f, employeeCode: e.target.value}))} placeholder="Vd: NV001" />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Lưu thông tin
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function UserManagement() {
    const [adminUser] = useState(() => {
        try {
            const saved = localStorage.getItem("adminUser");
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    const isSuperAdmin = adminUser?.role?.toLowerCase() === "superadmin";

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Params
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "banned"

    // Modals
    const [createOpen, setCreateOpen] = useState(false);
    const [detailUserId, setDetailUserId] = useState<string | null>(null);
    const [banUser, setBanUser] = useState<AdminUser | null>(null);
    const [deactivateUser, setDeactivateUser] = useState<AdminUser | null>(null);
    const [permissionUser, setPermissionUser] = useState<AdminUser | null>(null);
    const [roleUser, setRoleUser] = useState<AdminUser | null>(null);
    const [editInternalInfoUser, setEditInternalInfoUser] = useState<AdminUser | null>(null);

    // Toast
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const params: GetUsersParams = { page, pageSize };
            if (search) params.search = search;
            if (roleFilter !== "all") params.role = roleFilter;
            if (statusFilter === "active") params.isActive = true;
            if (statusFilter === "inactive") params.isActive = false;
            if (statusFilter === "banned") params.isBanned = true;

            const data = await getAdminUsers(params);
            // Defensive: API may use 'users' or 'items'
            const list = data.items ?? data.users ?? [];
            setUsers(list);
            // Defensive: read totalCount or total
            const tc = data.totalCount ?? data.total ?? list.length;
            setTotal(tc);
            // Defensive: read totalPages or pageCount
            const tp = data.totalPages ?? data.pageCount ?? Math.ceil(tc / pageSize);
            setTotalPages(tp || 1);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Lỗi tải danh sách người dùng";
            setError(msg);
            setUsers([]);
        } finally { setLoading(false); }
    }, [page, pageSize, search, roleFilter, statusFilter]);


    useEffect(() => { fetchUsers(); }, [fetchUsers]);

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

            connection.on("ReceiveAdminUserUpdate", (data: { action: string, userId: string, displayName: string }) => {
                console.log("[SignalR] Received AdminUserUpdate:", data);
                if (data.action === "Deactivate" || data.action === "Reactivate") {
                    setUsers(prevUsers => prevUsers.map(u => 
                        u.userId === data.userId 
                            ? { ...u, isActive: data.action === "Reactivate" } 
                            : u
                    ));
                    addToast("success", `Tài khoản ${data.displayName} vừa bị đổi trạng thái bởi Admin khác.`);
                } else if (data.action === "Create") {
                    // Cập nhật nhẹ hoặc fetch lại tuỳ ý (vì Create có thể thiếu nhiều trường)
                    // Tốt nhất là thêm toast và gọi fetchUsers nhẹ ngầm
                    addToast("success", `Admin khác vừa tạo mới người dùng: ${data.displayName}`);
                    // fetchUsers(); // Tuỳ chọn
                } else if (data.action === "Delete") {
                    setUsers(prevUsers => prevUsers.filter(u => u.userId !== data.userId));
                    addToast("success", `Admin khác vừa xóa người dùng: ${data.displayName}`);
                }
            });

            try {
                await connection.start();
                console.log("[SignalR Admin User Update] Connected successfully.");
                await connection.invoke("JoinAdminGroup");
            } catch (err) {
                console.error("[SignalR Admin User Update] Connection Error:", err);
            }
        };

        startSignalR();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []); // Empty dependency array as it registers events once

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleUnban = async (user: AdminUser) => {
        try {
            await unbanAdminUser(user.userId);
            addToast("success", `Đã gỡ khóa ${user.displayName}`);
            setUsers(prev => prev.map(u => u.userId === user.userId ? { ...u, isBanned: false } : u));
        } catch (e: unknown) {
            addToast("error", e instanceof Error ? e.message : "Gỡ khóa thất bại");
        }
    };

    const handleReactivate = async (user: AdminUser) => {
        try {
            await reactivateAdminUser(user.userId);
            addToast("success", `Đã kích hoạt lại tài khoản ${user.displayName}`);
            setUsers(prev => prev.map(u => u.userId === user.userId ? { ...u, isActive: true } : u));
        } catch (e: unknown) {
            addToast("error", e instanceof Error ? e.message : "Kích hoạt lại thất bại");
        }
    };

    const getStatusInfo = (user: AdminUser) => {
        if (user.isBanned) return { label: "Banned", color: " dark:bg-red-500/100", text: " dark:text-red-400  dark:bg-red-500/10  dark:border-red-500/20" };
        if (!user.isActive) return { label: "Inactive", color: "bg-yellow-400", text: " dark:text-amber-500  dark:bg-amber-500/10  dark:border-amber-500/20" };
        return { label: "Active", color: " dark:bg-green-500/100", text: " dark:text-green-400  dark:bg-green-500/10  dark:border-green-500/20" };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728] dark:text-foreground">Quản lý người dùng</h2>
                    <p className="text-muted-foreground mt-1">Danh sách người dùng Admin/Moderator trong hệ thống.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={fetchUsers} title="Làm mới">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground"
                        onClick={() => setCreateOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" /> Tạo tài khoản
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo tên hoặc email..."
                            className="pl-8 bg-card"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <Button variant="outline" onClick={handleSearch}>
                        <Filter className="h-4 w-4 mr-1.5" /> Lọc
                    </Button>
                </div>

                {/* Role filter */}
                <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="BrandPartner">BrandPartner</SelectItem>
                    </SelectContent>
                </Select>

                {/* Status filter */}
                <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground ml-auto">
                    {loading ? "Đang tải..." : (
                        <>Hiển thị <strong>{users.length}</strong> / <strong>{total}</strong> người dùng</>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm  dark:text-red-400  dark:bg-red-500/10 border  dark:border-red-500/20 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" className="ml-auto  dark:text-red-400 hover: dark:text-red-400 h-7"
                        onClick={fetchUsers}>Thử lại</Button>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Người dùng</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#4a3728] dark:text-foreground" />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Shield className="w-10 h-10 opacity-20" />
                                        <p>Không tìm thấy người dùng nào.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map(user => {
                                const status = getStatusInfo(user);
                                return (
                                    <TableRow key={user.userId} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-[#dccbb5]">
                                                    <AvatarImage src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                                    <AvatarFallback className="bg-[#f5efe6] dark:bg-muted text-[#4a3728] dark:text-foreground text-xs font-bold">
                                                        {user.displayName?.charAt(0) ?? "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm leading-tight">{user.displayName}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{user.userId.slice(0, 8)}…</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge className={`text-xs border font-normal ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                                <Badge className={`text-xs border font-normal ${status.text}`}>
                                                    {status.label}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground font-mono">
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                {/* View detail */}
                                                <Button variant="ghost" size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover: dark:text-blue-400"
                                                    title="Xem chi tiết"
                                                    onClick={() => setDetailUserId(user.userId)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                {/* Reactivate */}
                                                {!user.isActive && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover: dark:text-green-400"
                                                        title="Kích hoạt lại tài khoản"
                                                        onClick={() => handleReactivate(user)}>
                                                        <UserCheck className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* Deactivate */}
                                                {user.isActive && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover: dark:text-amber-500"
                                                        title="Vô hiệu hóa tài khoản"
                                                        onClick={() => setDeactivateUser(user)}>
                                                        <UserX className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* Update Role (For active users) */}
                                                {user.isActive && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover: dark:text-amber-500"
                                                        title="Cập nhật vai trò"
                                                        onClick={() => setRoleUser(user)}>
                                                        <UserCog className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* Grant Permissions (For active Admin or Moderator) */}
                                                {user.isActive && (user.role === "Admin" || user.role === "Moderator") && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-purple-600"
                                                        title="Cấp quyền truy cập"
                                                        onClick={() => setPermissionUser(user)}>
                                                        <Shield className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* Ban / Unban */}
                                                {user.isBanned ? (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover: dark:text-green-400"
                                                        title="Gỡ khóa"
                                                        onClick={() => handleUnban(user)}>
                                                        <ShieldOff className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover: dark:text-red-400"
                                                        title="Khóa quyền"
                                                        onClick={() => setBanUser(user)}>
                                                        <Ban className="h-4 w-4" />
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
                                    size="icon" className={`h-8 w-8 text-xs ${p === page ? "bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90" : ""}`}
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

            {/* Modals */}
            <CreateUserModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={() => { addToast("success", "Tạo tài khoản thành công!"); fetchUsers(); }}
            />
            <UserDetailModal
                userId={detailUserId}
                open={!!detailUserId}
                onClose={() => setDetailUserId(null)}
                isSuperAdmin={isSuperAdmin}
                onEditInternalInfo={() => {
                    const targetUser = users.find(u => u.userId === detailUserId);
                    if (targetUser) {
                        setDetailUserId(null); // close detail modal
                        setEditInternalInfoUser(targetUser); // open edit internal info modal
                    }
                }}
            />
            <EditAdminInternalModal
                user={editInternalInfoUser}
                open={!!editInternalInfoUser}
                onClose={() => setEditInternalInfoUser(null)}
                onSuccess={() => { addToast("success", "Cập nhật thông tin nội bộ thành công"); }}
            />
            <BanUserModal
                user={banUser}
                open={!!banUser}
                onClose={() => setBanUser(null)}
                onSuccess={() => { 
                    addToast("success", `Đã khóa ${banUser?.displayName}`);
                    setUsers(prev => prev.map(u => u.userId === banUser?.userId ? { ...u, isBanned: true } : u));
                }}
            />
            <ConfirmDeactivateModal
                user={deactivateUser}
                open={!!deactivateUser}
                onClose={() => setDeactivateUser(null)}
                onSuccess={() => { 
                    addToast("success", `Đã vô hiệu hóa ${deactivateUser?.displayName}`);
                    setUsers(prev => prev.map(u => u.userId === deactivateUser?.userId ? { ...u, isActive: false } : u));
                }}
            />
            <GrantPermissionModal
                user={permissionUser}
                open={!!permissionUser}
                onClose={() => setPermissionUser(null)}
                onSuccess={(msg: string) => { addToast("success", msg); }} // Permissions don't show in table, no need to refetch
            />
            <UpdateRoleModal
                user={roleUser}
                open={!!roleUser}
                onClose={() => setRoleUser(null)}
                onSuccess={(newRole) => {
                    addToast("success", `Cập nhật vai trò cho ${roleUser?.displayName} thành công!`);
                    setUsers(prev => prev.map(u => u.userId === roleUser?.userId ? { ...u, role: newRole } : u));
                }}
            />
        </div>
    );
}
