import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Check, BellRing, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, AppNotification, getToken, BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

function formatTimeAgo(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
}

export function AdminNotifications() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await getUnreadNotificationCount();
            setUnreadCount(count);
        } catch (e) {
            console.error("Failed to fetch unread count", e);
        }
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications(undefined, 1, 20);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        } finally {
            setLoading(false);
        }
    };

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

            connection.on("ReceiveUnreadCount", (count: number) => {
                setUnreadCount(count);
            });

            connection.on("ReceiveNotification", (notification: AppNotification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                toast.success(`Thông báo mới: ${notification.title}`);
            });

            try {
                await connection.start();
            } catch (err) {
                console.error("[SignalR Notifications] Connection Error:", err);
            }
        };

        fetchUnreadCount();
        startSignalR();

        return () => {
            if (connection) connection.stop();
        };
    }, [fetchUnreadCount]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleBellClick = () => {
        const newState = !open;
        setOpen(newState);
        if (newState) {
            fetchNotifications();
            fetchUnreadCount();
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            fetchUnreadCount();
        } catch (e) {
            toast.error("Không thể đánh dấu đã đọc");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success("Đã đánh dấu tất cả là đã đọc");
        } catch (e) {
            toast.error("Không thể thao tác");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button 
                variant="ghost" 
                size="icon" 
                className={`relative text-muted-foreground hover:text-foreground ${open ? "bg-accent" : ""}`}
                onClick={handleBellClick}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background shadow-sm">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </Button>
            
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#f5efe6] z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#f5efe6] bg-[#fdfaf7]">
                        <div className="flex items-center gap-2">
                            <BellRing className="w-4 h-4 text-amber-600" />
                            <h4 className="font-semibold text-[#4a3728]">Thông báo</h4>
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] font-bold">
                                    {unreadCount} mới
                                </Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-600 hover:bg-transparent hover:text-blue-800" onClick={handleMarkAllAsRead}>
                                Đánh dấu tất cả đã đọc
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="h-[350px] bg-white">
                        {loading && notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                <p className="text-xs">Đang tải...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Bell className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">Chưa có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-[#f5efe6]">
                                {notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        className={`px-4 py-3 flex gap-3 transition-colors hover:bg-[#fcfaf8] ${!notification.isRead ? 'bg-[#fdfaf7]' : 'bg-white opacity-80'}`}
                                    >
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-[#4a3728]' : 'font-medium text-[#7f5539]'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 shrink-0 rounded-full bg-blue-500 mt-1 shadow-sm" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.body}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-mono">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="flex shrink-0 items-center justify-center">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-6 h-6 text-muted-foreground hover:text-green-600 rounded-full"
                                                    title="Đánh dấu đã đọc"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    
                    <div className="p-2 border-t border-[#f5efe6] bg-[#fdfaf7]">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-[#4a3728]">
                            Xem tất cả thông báo
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
