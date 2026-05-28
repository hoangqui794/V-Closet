import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
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
    Flag
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
import { setToken as apiSetToken, getToken as apiGetToken, clearToken as apiClearToken } from "@/lib/api";

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
        title: "Báo cáo vi phạm",
        url: "/admin/reports",
        icon: Flag,
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
        title: "Cấu hình AI & API",
        url: "/admin/ai-config",
        icon: Sparkles,
    },
];

export function AdminLayout() {
    const location = useLocation();
    const [tokenOpen, setTokenOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(() => apiGetToken() ?? "");

    const saveToken = () => {
        const trimmed = tokenInput.trim().replace(/^Bearer\s+/i, "");
        apiSetToken(trimmed);
        setTokenOpen(false);
    };

    return (
        <>
            {/* Token Dialog */}
            <Dialog open={tokenOpen} onOpenChange={setTokenOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728]">
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
                        <Button className="bg-[#4a3728] hover:bg-[#3d2d21] text-white" onClick={saveToken}>
                            Lưu Token
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <SidebarProvider>
                <div className="flex h-screen w-full bg-background overflow-hidden font-poppins">
                    <Sidebar variant="inset" collapsible="icon">
                        <SidebarHeader className="h-20 flex items-center px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                                    <img src={imgLogoVcloset} alt="V-Closet Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-[#4a3728] group-data-[collapsible=icon]:hidden">
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
                                    <SidebarMenuButton asChild tooltip="Đăng xuất">
                                        <Link to="/admin/login" onClick={() => apiClearToken()}>
                                            <LogOut />
                                            <span>Đăng xuất</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb>
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
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-green-600" title="Cài đặt Bearer Token" onClick={() => setTokenOpen(true)}>
                                    <KeyRound className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                                </Button>
                                <div className="flex items-center gap-3 pl-4 border-l">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium leading-none">Admin V-Closet</p>
                                        <p className="text-xs text-muted-foreground mt-1">Quản trị viên</p>
                                    </div>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </header>

                        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/20">
                            <Outlet />
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    );
}
