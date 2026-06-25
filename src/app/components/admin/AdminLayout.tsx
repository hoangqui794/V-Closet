import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    CreditCard,
    LogOut,
    Bell,
    Search,
    ChevronRight,
    Sparkles,
    KeyRound,
    Flag,
    Lock,
    Megaphone,
    Shirt,
    Palette,
    Ticket
} from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import imgLogoVcloset from "@/assets/logoVcloset.png";
import { setToken as apiSetToken, getToken as apiGetToken, clearToken as apiClearToken, logoutAdmin, changePassword, getCurrentUserProfile, updateCurrentUserProfile, updateCurrentUserAvatar } from "@/lib/api";
import { toast } from "sonner";
import { AdminNotifications } from "./AdminNotifications";
import { ModeToggle } from "../mode-toggle";

const menuItems = [
    {
        title: "Bảng điều khiển",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Người dùng",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Tủ đồ & Phối đồ",
        url: "/admin/closet",
        icon: Shirt,
    },
    {
        title: "Báo cáo vi phạm",
        url: "/admin/reports",
        icon: Flag,
    },
    {
        title: "Chiến dịch quảng cáo",
        url: "/admin/campaigns",
        icon: Megaphone,
    },
    {
        title: "Thông báo",
        url: "/admin/notifications",
        icon: Bell,
    },
    {
        title: "Sản phẩm Affiliate",
        url: "/admin/affiliate",
        icon: ShoppingBag,
    },
    {
        title: "Gói đăng ký",
        url: "/admin/subscriptions",
        icon: CreditCard,
    },
    {
        title: "Mã giảm giá",
        url: "/admin/coupons",
        icon: Ticket,
    },
    {
        title: "Cấu hình AI & API",
        url: "/admin/ai-config",
        icon: Sparkles,
    },
];

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tokenOpen, setTokenOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(() => apiGetToken() ?? "");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // States for Change Password Dialog
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState("");
    const [changePasswordSuccess, setChangePasswordSuccess] = useState("");

    // States for Edit Profile Dialog
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [profileDisplayName, setProfileDisplayName] = useState("");
    const [profilePhoneNumber, setProfilePhoneNumber] = useState("");
    const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
    const [editProfileLoading, setEditProfileLoading] = useState(false);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Read saved admin profile information
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const saved = localStorage.getItem("adminUser");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logoutAdmin();
            localStorage.removeItem("adminUser"); // Clear profile metadata on logout
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
            navigate("/");
        }
    };

    const saveToken = () => {
        const trimmed = tokenInput.trim().replace(/^Bearer\s+/i, "");
        apiSetToken(trimmed);
        setTokenOpen(false);
    };

    const handleChangePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangePasswordError("");
        setChangePasswordSuccess("");

        if (newPassword !== confirmPassword) {
            setChangePasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        setChangePasswordLoading(true);
        try {
            await changePassword({ oldPassword, newPassword });
            setChangePasswordSuccess("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // Auto close after 2 seconds
            setTimeout(() => {
                setChangePasswordOpen(false);
                setChangePasswordSuccess("");
            }, 1800);
        } catch (err: any) {
            console.error("Change password error:", err);
            setChangePasswordError(err.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
        } finally {
            setChangePasswordLoading(false);
        }
    };

    const handleOpenProfile = async () => {
        setEditProfileOpen(true);
        setEditProfileLoading(true);
        try {
            const data = await getCurrentUserProfile();
            setProfileDisplayName(data.displayName || "");
            setProfilePhoneNumber(data.profile?.phoneNumber || "");
            setProfileAvatarUrl(data.avatarUrl || null);
        } catch (error: any) {
            console.error("Lỗi tải thông tin:", error);
            toast.error("Không thể tải thông tin hồ sơ");
        } finally {
            setEditProfileLoading(false);
        }
    };

    const handleEditProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditProfileLoading(true);
        try {
            await updateCurrentUserProfile({
                displayName: profileDisplayName,
                phoneNumber: profilePhoneNumber,
            });
            
            // Cập nhật lại adminUser trong localStorage
            const updatedUser = { ...adminUser, displayName: profileDisplayName, avatarUrl: profileAvatarUrl };
            setAdminUser(updatedUser);
            localStorage.setItem("adminUser", JSON.stringify(updatedUser));
            
            toast.success("Đã cập nhật hồ sơ thành công!");
            setEditProfileOpen(false);
        } catch (error: any) {
            console.error("Lỗi lưu thông tin:", error);
            toast.error("Lỗi khi cập nhật hồ sơ");
        } finally {
            setEditProfileLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAvatarUploading(true);
        try {
            const res = await updateCurrentUserAvatar(file);
            setProfileAvatarUrl(res.avatarUrl);
            
            // Cập nhật ngay avatar vào thanh topbar
            const updatedUser = { ...adminUser, avatarUrl: res.avatarUrl };
            setAdminUser(updatedUser);
            localStorage.setItem("adminUser", JSON.stringify(updatedUser));
            toast.success("Đã cập nhật ảnh đại diện!");
        } catch (error: any) {
            console.error("Lỗi tải ảnh:", error);
            toast.error("Lỗi khi tải ảnh lên");
        } finally {
            setIsAvatarUploading(false);
        }
    };

    return (
        <>
            {/* Token Dialog */}
            <Dialog open={tokenOpen} onOpenChange={setTokenOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728] dark:text-foreground">
                            <KeyRound className="w-5 h-5" /> Cài đặt Bearer Token
                        </DialogTitle>
                        <DialogDescription>
                            Dán Access Token lấy từ Swagger (không cần thêm "Bearer "). Token sẽ được lưu vào localStorage.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        className="font-mono text-xs min-h-[120px]"
                        placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={tokenInput}
                        onChange={e => setTokenInput(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTokenOpen(false)}>Hủy</Button>
                        <Button className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground" onClick={saveToken}>
                            Lưu Token
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728] dark:text-foreground">
                            <Lock className="w-5 h-5" /> Đổi mật khẩu
                        </DialogTitle>
                        <DialogDescription>
                            Đổi mật khẩu tài khoản quản trị viên hiện tại của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Mật khẩu cũ
                            </label>
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Xác nhận mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {changePasswordError && (
                            <div className="p-3  dark:bg-red-500/10 border border-rose-100 rounded-xl text-xs  dark:text-red-400 font-medium whitespace-pre-line text-left">
                                {changePasswordError}
                            </div>
                        )}

                        {changePasswordSuccess && (
                            <div className="p-3  dark:bg-green-500/10 border border-emerald-100 rounded-xl text-xs  dark:text-green-400 font-medium">
                                {changePasswordSuccess}
                            </div>
                        )}

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={changePasswordLoading} className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground">
                                {changePasswordLoading ? "Đang đổi..." : "Cập nhật mật khẩu"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Profile Dialog */}
            <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728] dark:text-foreground">
                            <Users className="w-5 h-5" /> Hồ sơ cá nhân
                        </DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin hồ sơ và ảnh đại diện của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditProfileSubmit} className="space-y-4">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar className="w-20 h-20 cursor-pointer border-2 border-muted hover:opacity-80 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                                <AvatarImage src={profileAvatarUrl || ""} />
                                <AvatarFallback className="bg-[#4a3728] dark:bg-primary text-white dark:text-primary-foreground">
                                    {isAvatarUploading ? "..." : (profileDisplayName || adminUser?.displayName || "AD").slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">Nhấn vào ảnh để thay đổi</span>
                            <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Tên hiển thị
                            </label>
                            <Input
                                required
                                placeholder="Nhập tên hiển thị"
                                value={profileDisplayName}
                                onChange={e => setProfileDisplayName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4a3728]/80 dark:text-foreground uppercase tracking-wide">
                                Số điện thoại
                            </label>
                            <Input
                                placeholder="Nhập số điện thoại"
                                value={profilePhoneNumber}
                                onChange={e => setProfilePhoneNumber(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setEditProfileOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={editProfileLoading || isAvatarUploading} className="bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] dark:hover:bg-primary/90 text-white dark:text-primary-foreground">
                                {editProfileLoading ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <SidebarProvider>
                <div className="flex h-[100dvh] w-full bg-background overflow-hidden font-poppins">
                    <Sidebar variant="inset" collapsible="icon">
                        <SidebarHeader className="h-20 flex items-center px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                                    <img src={imgLogoVcloset} alt="V-Closet Logo" className="w-full h-full object-cover rounded-[22%]" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-[#4a3728] dark:text-foreground group-data-[collapsible=icon]:hidden">
                                    V-Closet Admin
                                </span>
                            </div>
                        </SidebarHeader>

                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {menuItems.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={location.pathname === item.url}
                                                    tooltip={item.title}
                                                >
                                                    <Link to={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>

                        <SidebarFooter className="p-4 border-t">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Đăng xuất" disabled={isLoggingOut}>
                                        <button onClick={handleLogout} className="flex w-full items-center gap-2 text-left bg-transparent border-none cursor-pointer">
                                            <LogOut className="h-4 w-4" />
                                            <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                        <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb className="hidden md:block">
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {menuItems.find(i => i.url === location.pathname)?.title || "Dashboard"}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Tìm kiếm..."
                                        className="pl-8 w-64 bg-background"
                                    />
                                </div>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover: dark:text-green-400" title="Cài đặt Bearer Token" onClick={() => setTokenOpen(true)}>
                                    <KeyRound className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-[#4a3728] dark:text-foreground" title="Đổi mật khẩu" onClick={() => setChangePasswordOpen(true)}>
                                    <Lock className="h-5 w-5" />
                                </Button>
                                <ModeToggle />
                                <AdminNotifications />
                                <div className="flex items-center gap-3 pl-4 border-l cursor-pointer hover:opacity-80 transition-opacity" onClick={handleOpenProfile} title="Xem hồ sơ">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium leading-none">
                                            {adminUser?.displayName || "Admin V-Closet"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 font-medium capitalize">
                                            {adminUser?.role === "superadmin" || adminUser?.role === "admin" 
                                                ? "Quản trị viên" 
                                                : adminUser?.role === "moderator" 
                                                    ? "Kiểm duyệt viên" 
                                                    : "Quản trị viên"}
                                        </p>
                                    </div>
                                    <Avatar>
                                        <AvatarImage src={adminUser?.avatarUrl || ""} />
                                        <AvatarFallback className="bg-[#4a3728] dark:bg-primary text-white dark:text-primary-foreground">
                                            {(adminUser?.displayName || "AD").slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </header>

                        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-muted/20">
                            <Outlet />
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    );
}
