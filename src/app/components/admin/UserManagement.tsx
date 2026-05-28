import { useState, useEffect, useCallback } from "react";
import {
    Search, UserPlus, Filter, Eye, Ban, ShieldOff, UserX,
    RefreshCw, ChevronLeft, ChevronRight, X, CheckCircle,
    AlertCircle, Loader2, Shield, UserCog, UserCheck
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
    grantAdminPermission, revokeAdminPermission, updateUserRole,
    reactivateAdminUser, resetAdminPermissions,
    AdminUser, GetUsersParams
} from "../../../lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
}

function getRoleBadge(role: string) {
    const map: Record<string, string> = {
        Admin: "bg-purple-100 text-purple-700 border-purple-200",
        SuperAdmin: "bg-red-100 text-red-700 border-red-200",
        Moderator: "bg-blue-100 text-blue-700 border-blue-200",
        Customer: "bg-stone-100 text-stone-600 border-stone-200",
        BrandPartner: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return map[role] ?? "bg-gray-100 text-gray-600 border-gray-200";
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
                    <DialogTitle className="text-[#4a3728]">Tạo tài khoản mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin để tạo tài khoản. Mật khẩu sẽ được hệ thống <strong>tự sinh ngẫu nhiên và gửi về email</strong> của người dùng.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
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
                        className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">
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
    userId, open, onClose
}: { userId: string | null; open: boolean; onClose: () => void }) {
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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[#4a3728]">Chi tiết người dùng</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" /></div>
                ) : user ? (
                    <div className="flex flex-col gap-5 py-2">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-[#dccbb5]">
                                <AvatarImage src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <AvatarFallback className="text-lg bg-[#f5efe6] text-[#4a3728]">
                                    {user.displayName?.charAt(0) ?? "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-lg text-[#4a3728]">{user.displayName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge className={`text-xs border ${getRoleBadge(user.role)}`}>{user.role}</Badge>
                                    {user.isBanned && <Badge variant="destructive" className="text-xs">Banned</Badge>}
                                    {!user.isActive && <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">Inactive</Badge>}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { label: "User ID", value: user.userId.slice(0, 8) + "..." },
                                { label: "Ngày tạo", value: formatDate(user.createdAt) },
                                { label: "Email đã xác thực", value: user.isEmailVerified ? "✅ Có" : "❌ Chưa" },
                                { label: "Loại ban", value: user.activeBanType ?? "—" },
                                { label: "Ban hết hạn", value: user.bannedUntil ? formatDate(user.bannedUntil) : "—" },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-muted/30 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                                    <p className="font-medium text-foreground">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">Không tải được thông tin người dùng.</p>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Đóng</Button>
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
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                        <Ban className="w-5 h-5" /> Khóa quyền người dùng
                    </DialogTitle>
                    <DialogDescription>
                        Khóa quyền của <strong>{user?.displayName}</strong> ({user?.email}).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg animate-in fade-in duration-200">
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
                    <DialogTitle className="flex items-center gap-2 text-red-600 font-semibold">
                        <UserX className="w-5 h-5 shrink-0" /> Vô hiệu hóa tài khoản
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Bạn có chắc chắn muốn vô hiệu hóa tài khoản của <strong>{user?.displayName}</strong> ({user?.email})?
                        <br />
                        <span className="text-red-500 font-medium">Lưu ý:</span> Trạng thái tài khoản sẽ chuyển thành <span className="font-semibold text-yellow-600">Inactive</span> (isActive = false). Chỉ có SuperAdmin mới được vô hiệu hóa tài khoản của các Admin khác.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg my-2 animate-in fade-in duration-200">
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
    const [activeTab, setActiveTab] = useState<"grant" | "revoke" | "reset">("grant");
    const [permissionCode, setPermissionCode] = useState("admin.create");
    const [customCode, setCustomCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    // User details with actual permissions
    const [detailedUser, setDetailedUser] = useState<AdminUser | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const loadUserDetails = useCallback(async () => {
        if (!user) return;
        setLoadingDetails(true);
        try {
            const details = await getAdminUserDetail(user.userId);
            setDetailedUser(details);
            console.log("LOADED USER DETAILS:", details); // Let the developer view full user details json in F12
        } catch (err) {
            console.error("Failed to load user details for permissions", err);
        } finally {
            setLoadingDetails(false);
        }
    }, [user]);

    useEffect(() => {
        if (open && user) {
            setActiveTab("grant");
            setPermissionCode("admin.create");
            setCustomCode("");
            setError("");
            setDetailedUser(null);
            loadUserDetails();
        }
    }, [open, user, loadUserDetails]);

    const getExistingPermissions = useCallback((): string[] => {
        if (!detailedUser) return [];
        const list = detailedUser.permissions || (detailedUser as any).permissionCodes || (detailedUser as any).userPermissions || [];
        if (Array.isArray(list)) {
            return list.map((item: any) => {
                if (typeof item === "string") return item;
                if (item && typeof item === "object") {
                    return item.permissionCode || item.code || item.name || JSON.stringify(item);
                }
                return String(item);
            });
        }
        return [];
    }, [detailedUser]);

    const existingPermissions = getExistingPermissions();

    useEffect(() => {
        if (open && detailedUser) {
            if (activeTab === "revoke") {
                const list = getExistingPermissions();
                if (list.length > 0) {
                    setPermissionCode(list[0]);
                } else {
                    setPermissionCode("custom");
                }
            } else {
                setPermissionCode("admin.create");
            }
        }
    }, [open, detailedUser, activeTab, getExistingPermissions]);

    const handleAction = async () => {
        if (!user) return;
        setLoading(true);
        setError("");

        try {
            if (activeTab === "grant") {
                const finalCode = permissionCode === "custom" ? customCode.trim() : permissionCode;
                if (!finalCode) {
                    setError("Vui lòng chọn hoặc nhập mã quyền.");
                    setLoading(false);
                    return;
                }
                await grantAdminPermission(user.userId, { permissionCode: finalCode });
                onSuccess(`Đã cấp quyền '${finalCode}' cho ${user.displayName} thành công!`);
            } else if (activeTab === "revoke") {
                const finalCode = permissionCode === "custom" ? customCode.trim() : permissionCode;
                if (!finalCode) {
                    setError("Vui lòng chọn hoặc nhập mã quyền.");
                    setLoading(false);
                    return;
                }
                await revokeAdminPermission(user.userId, finalCode);
                onSuccess(`Đã thu hồi quyền '${finalCode}' của ${user.displayName} thành công!`);
            } else if (activeTab === "reset") {
                await resetAdminPermissions(user.userId);
                onSuccess(`Đã khôi phục quyền về mặc định cho ${user.displayName} thành công!`);
            }
            onClose();
        } catch (e: unknown) {
            const actionText = activeTab === "grant" ? "Cấp quyền" : activeTab === "revoke" ? "Thu hồi quyền" : "Khôi phục";
            setError(e instanceof Error ? e.message : `${actionText} thất bại`);
        } finally { setLoading(false); }
    };

    const handleDirectRevoke = async (code: string) => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            await revokeAdminPermission(user.userId, code);
            onSuccess(`Đã thu hồi quyền '${code}' của ${user.displayName} thành công!`);
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Thu hồi quyền thất bại");
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-semibold text-[#4a3728]">
                        <Shield className="w-5 h-5 shrink-0 text-purple-600" /> Quản lý quyền hạn
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Thay đổi các quyền cụ thể của <strong>{user?.displayName}</strong> ({user?.email}).
                        <br />
                        <span className="text-purple-600 font-medium">Yêu cầu:</span> Chỉ SuperAdmin mới có thể thực hiện.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex border-b border-muted mt-2 mb-4 bg-muted/20 rounded-t-lg">
                    <button
                        onClick={() => { setActiveTab("grant"); setError(""); }}
                        className={`flex-1 py-2 text-center text-sm font-medium border-b-2 transition-all duration-200 ${
                            activeTab === "grant"
                                ? "border-purple-600 text-purple-600 bg-purple-50/50"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Cấp quyền
                    </button>
                    <button
                        onClick={() => { setActiveTab("revoke"); setError(""); }}
                        className={`flex-1 py-2 text-center text-sm font-medium border-b-2 transition-all duration-200 ${
                            activeTab === "revoke"
                                ? "border-red-600 text-red-600 bg-red-50/50"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Thu hồi quyền
                    </button>
                    <button
                        onClick={() => { setActiveTab("reset"); setError(""); }}
                        className={`flex-1 py-2 text-center text-sm font-medium border-b-2 transition-all duration-200 ${
                            activeTab === "reset"
                                ? "border-amber-600 text-amber-600 bg-amber-50/50"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Khôi phục
                    </button>
                </div>

                {loadingDetails ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="text-xs">Đang tải thông tin quyền hạn hiện có...</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 py-2">
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg animate-in fade-in duration-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {activeTab === "grant" && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <Label>Chọn mã quyền</Label>
                                    <Select value={permissionCode} onValueChange={setPermissionCode}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user.view">Xem danh sách user (user.view)</SelectItem>
                                            <SelectItem value="user.ban">Khoá chat/post của user (user.ban)</SelectItem>
                                            <SelectItem value="user.deactivate">Vô hiệu hoá tài khoản (user.deactivate)</SelectItem>
                                            <SelectItem value="brand.create">Tạo tài khoản brand partner (brand.create)</SelectItem>
                                            <SelectItem value="brand.verify">Duyệt brand partner (brand.verify)</SelectItem>
                                            <SelectItem value="brand.suspend">Đình chỉ brand partner (brand.suspend)</SelectItem>
                                            <SelectItem value="content.moderate">Kiểm duyệt nội dung (content.moderate)</SelectItem>
                                            <SelectItem value="content.report">Xử lý report vi phạm (content.report)</SelectItem>
                                            <SelectItem value="analytics.view">Xem báo cáo doanh thu (analytics.view)</SelectItem>
                                            <SelectItem value="analytics.export">Xuất báo cáo (analytics.export)</SelectItem>
                                            <SelectItem value="admin.create">Tạo tài khoản admin/moderator (admin.create)</SelectItem>
                                            <SelectItem value="permission.grant">Cấp/thu hồi quyền (permission.grant)</SelectItem>
                                            <SelectItem value="product.manage">Quản lý sản phẩm Shopee (product.manage)</SelectItem>
                                            <SelectItem value="custom">Tự nhập mã quyền khác...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {permissionCode === "custom" && (
                                    <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Label>Nhập mã quyền</Label>
                                        <Input
                                            placeholder="Ví dụ: order.manage"
                                            value={customCode}
                                            onChange={e => setCustomCode(e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "revoke" && (
                            <>
                                <div className="flex flex-col gap-3">
                                    {existingPermissions.length > 0 ? (
                                        <>
                                            <div className="flex flex-col gap-1.5">
                                                <Label className="text-xs font-semibold text-muted-foreground uppercase">Các quyền hiện có ({existingPermissions.length})</Label>
                                                <div className="flex flex-wrap gap-1.5 p-3 bg-[#fdfaf7] border border-[#f5efe6] rounded-xl min-h-[50px]">
                                                    {existingPermissions.map((code) => (
                                                        <Badge key={code} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                                                            <span>{code}</span>
                                                            <button
                                                                onClick={() => handleDirectRevoke(code)}
                                                                disabled={loading}
                                                                className="text-purple-400 hover:text-red-600 transition-colors ml-1 p-0.5 rounded-full hover:bg-red-50"
                                                                title={`Thu hồi quyền ${code}`}
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <Label>Chọn mã quyền cần thu hồi</Label>
                                                <Select value={permissionCode} onValueChange={setPermissionCode}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {existingPermissions.map(code => (
                                                            <SelectItem key={code} value={code}>{code}</SelectItem>
                                                        ))}
                                                        <SelectItem value="custom">Tự nhập mã quyền khác...</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 p-5 bg-stone-50 border border-stone-200 rounded-xl text-center">
                                            <Shield className="w-8 h-8 opacity-25 text-stone-400" />
                                            <p className="text-sm font-medium text-stone-600">Người dùng này chưa có quyền hạn đặc thù nào.</p>
                                            <p className="text-xs text-muted-foreground">Tài khoản này chỉ có các quyền mặc định dựa theo vai trò {user?.role}.</p>
                                        </div>
                                    )}

                                    {(existingPermissions.length === 0 || permissionCode === "custom") && (
                                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Label>Nhập mã quyền cần thu hồi thủ công</Label>
                                            <Input
                                                placeholder="Ví dụ: admin.create"
                                                value={customCode}
                                                onChange={e => setCustomCode(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === "reset" && (
                            <div className="flex flex-col items-center gap-3 p-5 bg-amber-50/50 border border-amber-200 rounded-xl text-center animate-in fade-in duration-200">
                                <AlertCircle className="w-8 h-8 text-amber-600 animate-bounce mt-2" />
                                <p className="text-sm font-semibold text-amber-900">Xác nhận khôi phục quyền mặc định</p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    Hành động này sẽ **thu hồi toàn bộ các quyền hạn đặc thù** đã cấp riêng lẻ trước đó, đưa danh sách quyền của <strong>{user?.displayName}</strong> về các giá trị **mặc định theo vai trò {user?.role}**.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading || loadingDetails}>Hủy</Button>
                    <Button
                        onClick={handleAction}
                        disabled={loading || loadingDetails || (activeTab === "revoke" && existingPermissions.length === 0 && !customCode)}
                        className={`gap-2 text-white transition-all ${activeTab === "grant"
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {activeTab === "grant" ? "Xác nhận cấp quyền" : "Xác nhận thu hồi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Update Role Modal ────────────────────────────────────────────────────────

function UpdateRoleModal({
    user, open, onClose, onSuccess
}: { user: AdminUser | null; open: boolean; onClose: () => void; onSuccess: () => void }) {
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
            onSuccess();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Cập nhật vai trò thất bại");
        } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-600 font-semibold">
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
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg animate-in fade-in duration-200">
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

// ─── Main Component ────────────────────────────────────────────────────────────

export function UserManagement() {
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
            fetchUsers();
        } catch (e: unknown) {
            addToast("error", e instanceof Error ? e.message : "Gỡ khóa thất bại");
        }
    };

    const handleReactivate = async (user: AdminUser) => {
        try {
            await reactivateAdminUser(user.userId);
            addToast("success", `Đã kích hoạt lại tài khoản ${user.displayName}`);
            fetchUsers();
        } catch (e: unknown) {
            addToast("error", e instanceof Error ? e.message : "Kích hoạt lại thất bại");
        }
    };

    const getStatusInfo = (user: AdminUser) => {
        if (user.isBanned) return { label: "Banned", color: "bg-red-500", text: "text-red-600 bg-red-50 border-red-200" };
        if (!user.isActive) return { label: "Inactive", color: "bg-yellow-400", text: "text-yellow-600 bg-yellow-50 border-yellow-200" };
        return { label: "Active", color: "bg-green-500", text: "text-green-600 bg-green-50 border-green-200" };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Quản lý người dùng</h2>
                    <p className="text-muted-foreground mt-1">Danh sách người dùng Admin/Moderator trong hệ thống.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={fetchUsers} title="Làm mới">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button className="bg-[#4a3728] hover:bg-[#3d2d21] text-white"
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
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-red-600 hover:text-red-700 h-7"
                        onClick={fetchUsers}>Thử lại</Button>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
                                        <Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" />
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
                                                    <AvatarFallback className="bg-[#f5efe6] text-[#4a3728] text-xs font-bold">
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
                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                                    title="Xem chi tiết"
                                                    onClick={() => setDetailUserId(user.userId)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                {/* Reactivate */}
                                                {!user.isActive && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-green-600"
                                                        title="Kích hoạt lại tài khoản"
                                                        onClick={() => handleReactivate(user)}>
                                                        <UserCheck className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* Deactivate */}
                                                {user.isActive && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                                                        title="Vô hiệu hóa tài khoản"
                                                        onClick={() => setDeactivateUser(user)}>
                                                        <UserX className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* Update Role (For active users) */}
                                                {user.isActive && (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-amber-600"
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
                                                        className="h-8 w-8 text-muted-foreground hover:text-green-600"
                                                        title="Gỡ khóa"
                                                        onClick={() => handleUnban(user)}>
                                                        <ShieldOff className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
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
            />
            <BanUserModal
                user={banUser}
                open={!!banUser}
                onClose={() => setBanUser(null)}
                onSuccess={() => { addToast("success", `Đã khóa ${banUser?.displayName}`); fetchUsers(); }}
            />
            <ConfirmDeactivateModal
                user={deactivateUser}
                open={!!deactivateUser}
                onClose={() => setDeactivateUser(null)}
                onSuccess={() => { addToast("success", `Đã vô hiệu hóa ${deactivateUser?.displayName}`); fetchUsers(); }}
            />
            <GrantPermissionModal
                user={permissionUser}
                open={!!permissionUser}
                onClose={() => setPermissionUser(null)}
                onSuccess={(msg: string) => { addToast("success", msg); fetchUsers(); }}
            />
            <UpdateRoleModal
                user={roleUser}
                open={!!roleUser}
                onClose={() => setRoleUser(null)}
                onSuccess={() => { addToast("success", `Cập nhật vai trò cho ${roleUser?.displayName} thành công!`); fetchUsers(); }}
            />
        </div>
    );
}
