import { useState, useEffect } from "react";
import {
    broadcastSystemNotification,
    sendTargetedNotification,
    getAdminNotifications,
    deleteNotificationByAdmin,
    bulkDeleteNotificationsByAdmin,
    getAdminUsers,
    AdminNotificationItem,
    AdminUser,
    AdminSurveyItem,
    SurveyResponseItem,
    getAdminSurveys,
    createAdminSurvey,
    toggleSurveyStatus,
    deleteAdminSurvey,
    getAdminSurveyResponses
} from "@/lib/api";
import {
    Bell,
    Send,
    History,
    Search,
    Trash2,
    CheckCircle,
    AlertCircle,
    X,
    User,
    Users,
    Smartphone,
    Info,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Star,
    MessageSquare,
    BarChart2,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "../ui/dialog";

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

export function NotificationManagement() {
    // Tabs state
    const [activeTab, setActiveTab] = useState("send");

    // Toasts state
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // Form states
    const [targetType, setTargetType] = useState<"broadcast" | "targeted">("broadcast");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [notifType, setNotifType] = useState("System");
    const [refType, setRefType] = useState("");
    const [refId, setRefId] = useState<number | "">("");

    // User Search states
    const [userSearch, setUserSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState<AdminUser[]>([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Confirmation dialog states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Logs states
    const [logs, setLogs] = useState<AdminNotificationItem[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [logsPage, setLogsPage] = useState(1);
    const [logsPageSize] = useState(10);
    const [filterType, setFilterType] = useState("");
    const [filterUserId, setFilterUserId] = useState<number | "">("");

    // Revocation / Delete dialog states
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Bulk delete states
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Surveys & Reviews states
    const [surveys, setSurveys] = useState<AdminSurveyItem[]>([]);
    const [isLoadingSurveys, setIsLoadingSurveys] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState("");
    const [surveyQuestion, setSurveyQuestion] = useState("");
    const [surveyType, setSurveyType] = useState("stars_and_comment");
    const [quizOptions, setQuizOptions] = useState<string[]>(["", ""]);
    const [surveyUrl, setSurveyUrl] = useState("");
    const [surveysPage, setSurveysPage] = useState(1);
    const [surveysPageSize] = useState(5);
    const [surveyTargetType, setSurveyTargetType] = useState<"broadcast" | "targeted">("broadcast");
    const [surveyUserSearch, setSurveyUserSearch] = useState("");
    const [surveySelectedUser, setSurveySelectedUser] = useState<AdminUser | null>(null);
    const [surveySearchedUsers, setSurveySearchedUsers] = useState<AdminUser[]>([]);
    const [isSearchingSurveyUsers, setIsSearchingSurveyUsers] = useState(false);
    const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);

    // Survey details modal states
    const [selectedSurveyForDetails, setSelectedSurveyForDetails] = useState<AdminSurveyItem | null>(null);
    const [surveyResponses, setSurveyResponses] = useState<SurveyResponseItem[]>([]);
    const [isLoadingResponses, setIsLoadingResponses] = useState(false);
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [deleteSurveyId, setDeleteSurveyId] = useState<string | null>(null);
    const [isDeletingSurvey, setIsDeletingSurvey] = useState(false);

    const fetchSurveysList = async () => {
        setIsLoadingSurveys(true);
        try {
            const data = await getAdminSurveys();
            setSurveys(data);
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Không thể tải danh sách khảo sát.");
        } finally {
            setIsLoadingSurveys(false);
        }
    };

    const fetchSurveyResponsesList = async (surveyId: string, rating = 0) => {
        setIsLoadingResponses(true);
        try {
            const data = await getAdminSurveyResponses(surveyId, rating);
            setSurveyResponses(data);
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Không thể tải danh sách phản hồi.");
        } finally {
            setIsLoadingResponses(false);
        }
    };

    useEffect(() => {
        if (activeTab === "surveys") {
            fetchSurveysList();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedSurveyForDetails) {
            fetchSurveyResponsesList(selectedSurveyForDetails.id, ratingFilter);
        }
    }, [selectedSurveyForDetails, ratingFilter]);

    useEffect(() => {
        if (!surveyUserSearch || surveyTargetType === "broadcast") {
            setSurveySearchedUsers([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setIsSearchingSurveyUsers(true);
            try {
                const res = await getAdminUsers({ search: surveyUserSearch, pageSize: 8 });
                setSurveySearchedUsers(res.items || []);
            } catch (err: any) {
                console.error("Lỗi khi tìm kiếm người dùng khảo sát:", err);
            } finally {
                setIsSearchingSurveyUsers(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [surveyUserSearch, surveyTargetType]);

    const handleCreateSurveySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!surveyTitle.trim()) {
            addToast("error", "Tiêu đề khảo sát không được trống.");
            return;
        }
        if (!surveyQuestion.trim()) {
            addToast("error", "Câu hỏi khảo sát không được trống.");
            return;
        }
        if (surveyTargetType === "targeted" && !surveySelectedUser) {
            addToast("error", "Vui lòng chọn người nhận khảo sát.");
            return;
        }

        let options: string[] | undefined = undefined;
        let urlVal: string | undefined = undefined;
        if (surveyType === "quiz") {
            const filledOptions = quizOptions.map(o => o.trim()).filter(o => o !== "");
            if (filledOptions.length < 2) {
                addToast("error", "Vui lòng nhập ít nhất 2 đáp án trắc nghiệm.");
                return;
            }
            options = filledOptions;
        } else if (surveyType === "survey_link") {
            if (!surveyUrl.trim()) {
                addToast("error", "Vui lòng nhập liên kết khảo sát.");
                return;
            }
            urlVal = surveyUrl.trim();
        }

        setIsCreatingSurvey(true);
        try {
            await createAdminSurvey({
                title: surveyTitle.trim(),
                question: surveyQuestion.trim(),
                type: surveyType,
                quizOptions: options,
                surveyUrl: urlVal
            });
            addToast("success", "Đã tạo và phát hành khảo sát ý kiến thành công!");
            setSurveyTitle("");
            setSurveyQuestion("");
            setSurveySelectedUser(null);
            setSurveyUserSearch("");
            setQuizOptions(["", ""]);
            setSurveyUrl("");
            setSurveysPage(1);
            fetchSurveysList();
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Tạo khảo sát thất bại.");
        } finally {
            setIsCreatingSurvey(false);
        }
    };

    const handleToggleSurveyStatus = async (id: string) => {
        try {
            await toggleSurveyStatus(id);
            addToast("success", "Đã thay đổi trạng thái khảo sát thành công!");
            fetchSurveysList();
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Không thể thay đổi trạng thái.");
        }
    };

    const handleDeleteSurvey = async () => {
        if (!deleteSurveyId) return;
        setIsDeletingSurvey(true);
        try {
            await deleteAdminSurvey(deleteSurveyId);
            addToast("success", "Đã xóa khảo sát khỏi hệ thống thành công!");
            setDeleteSurveyId(null);
            fetchSurveysList();
            if (selectedSurveyForDetails?.id === deleteSurveyId) {
                setSelectedSurveyForDetails(null);
            }
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Xóa khảo sát thất bại.");
        } finally {
            setIsDeletingSurvey(false);
        }
    };

    // User search debounce effect
    useEffect(() => {
        if (!userSearch || targetType === "broadcast") {
            setSearchedUsers([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setIsSearchingUsers(true);
            try {
                const res = await getAdminUsers({ search: userSearch, pageSize: 8 });
                setSearchedUsers(res.items || []);
            } catch (err: any) {
                console.error("Lỗi khi tìm kiếm người dùng:", err);
            } finally {
                setIsSearchingUsers(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [userSearch, targetType]);

    // Reset targeted user state when changing target type
    useEffect(() => {
        if (targetType === "broadcast") {
            setSelectedUser(null);
            setUserSearch("");
        }
    }, [targetType]);

    // Fetch Logs
    const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
            const params: any = {
                page: logsPage,
                pageSize: logsPageSize
            };
            if (filterType) params.type = filterType;
            if (filterUserId !== "") params.targetUserId = Number(filterUserId);

            const res = await getAdminNotifications(params);
            setLogs(res || []);
            setSelectedIds([]); // Clear selection when logs change
        } catch (err: any) {
            console.error("Lỗi tải lịch sử thông báo:", err);
            addToast("error", err.message || "Tải lịch sử thông báo thất bại.");
        } finally {
            setIsLoadingLogs(false);
        }
    };

    // Load logs on tab focus, page change or filter change
    useEffect(() => {
        if (activeTab === "logs") {
            fetchLogs();
        }
    }, [activeTab, logsPage, filterType, filterUserId]);

    // Handle send notification
    const handleSendSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            addToast("error", "Tiêu đề thông báo không được để trống.");
            return;
        }
        if (!body.trim()) {
            addToast("error", "Nội dung thông báo không được để trống.");
            return;
        }
        if (targetType === "targeted" && !selectedUser) {
            addToast("error", "Vui lòng chọn người nhận thông báo.");
            return;
        }
        setConfirmOpen(true);
    };

    const confirmSendNotification = async () => {
        setIsSending(true);
        try {
            const payload: any = {
                title: title.trim(),
                body: body.trim(),
                type: notifType,
                referenceType: refType.trim() || null,
                referenceId: refId !== "" ? Number(refId) : null
            };

            if (targetType === "broadcast") {
                await broadcastSystemNotification(payload);
                addToast("success", "Đã phát loa thông báo thành công tới toàn bộ người dùng!");
            } else {
                if (!selectedUser) return;
                // Use the returned internalId (integer) from the user record
                const userIdNum = selectedUser.internalId;
                await sendTargetedNotification({
                    ...payload,
                    userId: userIdNum
                });
                addToast("success", `Đã gửi thông báo cá nhân thành công tới ${selectedUser.displayName}!`);
            }

            // Reset form fields
            setTitle("");
            setBody("");
            setRefType("");
            setRefId("");
            setSelectedUser(null);
            setUserSearch("");
            setConfirmOpen(false);

            // Switch to logs to see newly sent item
            setActiveTab("logs");
            setLogsPage(1);
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Gửi thông báo thất bại.");
        } finally {
            setIsSending(false);
        }
    };

    // Handle delete/revoke notification
    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteNotificationByAdmin(deleteId);
            addToast("success", "Đã thu hồi thông báo thành công khỏi hộp thư của người dùng!");
            setDeleteId(null);
            fetchLogs();
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Thu hồi thông báo thất bại.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle bulk delete/revoke notification
    const handleBulkDeleteConfirm = async () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleting(true);
        try {
            await bulkDeleteNotificationsByAdmin(selectedIds);
            addToast("success", `Đã thu hồi thành công ${selectedIds.length} thông báo khỏi hệ thống!`);
            setSelectedIds([]);
            setBulkConfirmOpen(false);
            fetchLogs();
        } catch (err: any) {
            console.error(err);
            addToast("error", err.message || "Thu hồi hàng loạt thất bại.");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    // Get color badge based on notification type
    const getTypeBadgeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case "system":
                return "bg-slate-500/10 text-slate-500 border-slate-500/20";
            case "marketing":
                return "bg-pink-500/10 text-pink-500 border-pink-500/20";
            case "update":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "alert":
                return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default:
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Quản lý & Phát thông báo</h2>
                    <p className="text-muted-foreground mt-1">
                        Phát loa thông báo hệ thống hoặc gửi tin nhắn cá nhân đến từng người dùng.
                    </p>
                </div>
            </div>

            {/* Main Tabs Layout */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[#4a3728]/5 border border-[#4a3728]/10 p-1 rounded-xl">
                    <TabsTrigger value="send" className="data-[state=active]:bg-[#4a3728] data-[state=active]:text-white rounded-lg flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Gửi thông báo
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:bg-[#4a3728] data-[state=active]:text-white rounded-lg flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Nhật ký thông báo
                    </TabsTrigger>
                    <TabsTrigger value="surveys" className="data-[state=active]:bg-[#4a3728] data-[state=active]:text-white rounded-lg flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Đánh giá & Khảo sát
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: SEND NOTIFICATION */}
                <TabsContent value="send" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-12 items-start">
                        {/* LEFT: Form Input */}
                        <div className="md:col-span-7 space-y-6">
                            <Card className="border-[#4a3728]/10 shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
                                <CardHeader className="bg-gradient-to-r from-[#4a3728]/5 to-[#4a3728]/0 border-b border-[#4a3728]/10">
                                    <CardTitle className="text-[#4a3728] flex items-center gap-2">
                                        <Bell className="w-5 h-5" /> Soạn thông báo mới
                                    </CardTitle>
                                    <CardDescription>
                                        Vui lòng nhập đầy đủ thông tin trước khi phát đi thông báo.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <form onSubmit={handleSendSubmit} className="space-y-4">
                                        {/* Target Options */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Đối tượng nhận tin
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setTargetType("broadcast")}
                                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all duration-300
                                                        ${targetType === "broadcast"
                                                            ? "bg-[#4a3728] text-white border-transparent shadow-md"
                                                            : "bg-white hover:bg-muted border-border/80 text-muted-foreground"}`}
                                                >
                                                    <Users className="w-4 h-4" />
                                                    Tất cả người dùng
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTargetType("targeted")}
                                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all duration-300
                                                        ${targetType === "targeted"
                                                            ? "bg-[#4a3728] text-white border-transparent shadow-md"
                                                            : "bg-white hover:bg-muted border-border/80 text-muted-foreground"}`}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Người dùng cụ thể
                                                </button>
                                            </div>
                                        </div>

                                        {/* Targeted User Search & Selection */}
                                        {targetType === "targeted" && (
                                            <div className="space-y-2 p-4 bg-[#4a3728]/5 border border-[#4a3728]/10 rounded-xl relative">
                                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide flex items-center gap-1.5">
                                                    Tìm kiếm người dùng nhận tin <span className="text-destructive">*</span>
                                                </label>
                                                
                                                {selectedUser ? (
                                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-[#4a3728] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                                {selectedUser.displayName.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-sm font-semibold text-[#4a3728]">{selectedUser.displayName}</p>
                                                                <p className="text-xs text-muted-foreground">{selectedUser.email} (ID: {selectedUser.userId})</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSelectedUser(null)}
                                                            className="text-muted-foreground hover:text-red-500"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Nhập tên hiển thị hoặc email người dùng..."
                                                            value={userSearch}
                                                            onChange={e => setUserSearch(e.target.value)}
                                                            className="pl-9 bg-white border-border"
                                                        />
                                                        {isSearchingUsers && (
                                                            <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-[#4a3728]" />
                                                        )}

                                                        {/* Dropdown Results */}
                                                        {searchedUsers.length > 0 && (
                                                            <div className="absolute left-0 right-0 mt-1.5 bg-white border rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto divide-y divide-border/60">
                                                                {searchedUsers.map(user => (
                                                                    <button
                                                                        key={user.userId}
                                                                        type="button"
                                                                        onClick={() => setSelectedUser(user)}
                                                                        className="w-full flex items-center gap-2.5 p-3 text-left hover:bg-[#4a3728]/5 transition-colors duration-200"
                                                                    >
                                                                        <div className="w-7 h-7 rounded-full bg-[#4a3728]/10 text-[#4a3728] flex items-center justify-center font-bold text-xs shrink-0">
                                                                            {user.displayName.slice(0, 2).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-[#4a3728]">{user.displayName}</p>
                                                                            <p className="text-[10px] text-muted-foreground">{user.email}</p>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {userSearch.trim() && searchedUsers.length === 0 && !isSearchingUsers && (
                                                            <div className="absolute left-0 right-0 mt-1.5 bg-white border rounded-xl p-3 text-center text-xs text-muted-foreground shadow-xl z-20">
                                                                Không tìm thấy thành viên phù hợp
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Row: Notification Type & Details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                    Loại thông báo
                                                </label>
                                                <select
                                                    value={notifType}
                                                    onChange={e => setNotifType(e.target.value)}
                                                    className="w-full flex h-10 rounded-xl border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="System">Hệ thống (System)</option>
                                                    <option value="Marketing">Quảng cáo (Marketing)</option>
                                                    <option value="Update">Cập nhật (Update)</option>
                                                    <option value="Alert">Cảnh báo (Alert)</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide flex items-center gap-1.5">
                                                    Tham chiếu (Reference Type)
                                                    <span className="text-[10px] text-muted-foreground font-normal lowercase">(Tùy chọn)</span>
                                                </label>
                                                <select
                                                    value={refType}
                                                    onChange={e => setRefType(e.target.value)}
                                                    className="w-full flex h-10 rounded-xl border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Không liên kết</option>
                                                    <option value="Outfit">Tủ đồ / Trang phục (Outfit)</option>
                                                    <option value="Product">Sản phẩm Affiliate (Product)</option>
                                                    <option value="Campaign">Chiến dịch (Campaign)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Reference ID (displays only when ref type selected) */}
                                        {refType && (
                                            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                    Mã ID tham chiếu (Reference ID) <span className="text-destructive">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="Nhập số ID liên kết (ví dụ: 1234)"
                                                    value={refId}
                                                    onChange={e => setRefId(e.target.value === "" ? "" : Number(e.target.value))}
                                                    required
                                                    className="bg-white border-border"
                                                />
                                            </div>
                                        )}

                                        {/* Title Input */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Tiêu đề thông báo <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Nhập tiêu đề ngắn gọn thu hút..."
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                maxLength={100}
                                                required
                                                className="bg-white border-border font-medium text-foreground"
                                            />
                                        </div>

                                        {/* Body Textarea */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Nội dung chi tiết <span className="text-destructive">*</span>
                                            </label>
                                            <Textarea
                                                placeholder="Viết nội dung thông báo đầy đủ gửi đến người dùng..."
                                                value={body}
                                                onChange={e => setBody(e.target.value)}
                                                maxLength={500}
                                                required
                                                className="bg-white border-border min-h-[120px]"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                className="w-full bg-[#4a3728] hover:bg-[#3d2d21] text-white flex items-center justify-center gap-2 h-11 rounded-xl font-semibold shadow-md transition-all duration-300"
                                            >
                                                <Send className="w-4 h-4" />
                                                Gửi thông báo ngay
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: Live Preview on Smartphone Mockup */}
                        <div className="md:col-span-5 flex justify-center">
                            <div className="w-[300px] h-[580px] bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center">
                                {/* Speaker and Notch */}
                                <div className="absolute top-2.5 w-24 h-5 bg-black rounded-2xl z-30 flex justify-center items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800 ml-auto mr-3" />
                                </div>
                                <div className="absolute top-2 right-8 w-1.5 h-1.5 rounded-full bg-slate-800 z-30" />

                                {/* Screen Background Image (Warm Glassmorphic Nature Look) */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#6b5847] via-[#9c8470] to-[#bca693] z-0 flex flex-col justify-start items-center pt-16 px-4">
                                    {/* Mock Lock Screen Header */}
                                    <div className="text-center text-white/95 mt-4 z-10 select-none">
                                        <p className="text-4xl font-light font-mono">12:30</p>
                                        <p className="text-[11px] font-medium tracking-wide mt-1 uppercase opacity-80">
                                            Thứ Bảy, 6 Tháng 6
                                        </p>
                                    </div>

                                    {/* Live Notification Banner */}
                                    <div className="w-full mt-12 bg-white/10 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl shadow-xl z-10 flex flex-col gap-1 text-white animate-pulse">
                                        <div className="flex items-center justify-between text-[10px] font-medium opacity-85">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4.5 h-4.5 rounded bg-amber-800 flex items-center justify-center font-bold text-[8px] border border-amber-600/30">
                                                    VC
                                                </div>
                                                <span className="font-semibold text-white/90">V-CLOSET</span>
                                            </div>
                                            <span>Bây giờ</span>
                                        </div>
                                        
                                        <div className="text-left mt-0.5">
                                            <h4 className="text-xs font-bold text-white tracking-tight break-words line-clamp-1">
                                                {title.trim() || "Tiêu đề thông báo mẫu"}
                                            </h4>
                                            <p className="text-[11px] font-normal text-white/90 leading-tight break-words line-clamp-3 mt-0.5 whitespace-pre-wrap">
                                                {body.trim() || "Nội dung chi tiết của thông báo được đẩy xuống màn hình điện thoại của người dùng sẽ hiển thị trực quan tại đây..."}
                                            </p>
                                        </div>

                                        {/* Mock indicator for links */}
                                        {refType && (
                                            <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-semibold text-white/80">
                                                <span className="flex items-center gap-1">
                                                    <Info className="w-3 h-3 text-amber-300" />
                                                    Xem chi tiết {refType} #{refId || "?"}
                                                </span>
                                                <Smartphone className="w-3 h-3 opacity-60" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mock notification instruction */}
                                    <div className="absolute bottom-10 text-white/60 text-[10px] font-medium text-center z-10">
                                        Bản xem trước thông báo thời gian thực (FCM Push)
                                    </div>
                                </div>

                                {/* Home Bar */}
                                <div className="absolute bottom-2 w-32 h-1 bg-white/60 rounded-full z-30" />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: LOGS / HISTORY */}
                <TabsContent value="logs" className="space-y-6">
                    <Card className="border-[#4a3728]/10 shadow-sm bg-card/60 backdrop-blur-md">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#4a3728]/10 gap-4">
                            <div>
                                <CardTitle className="text-[#4a3728] flex items-center gap-2">
                                    <History className="w-5 h-5" /> Nhật ký thông báo hệ thống
                                </CardTitle>
                                <CardDescription>
                                    Xem và quản lý tất cả lịch sử thông báo đã phát ra trong toàn hệ thống.
                                </CardDescription>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Filter by Type */}
                                <select
                                    value={filterType}
                                    onChange={e => { setFilterType(e.target.value); setLogsPage(1); }}
                                    className="h-9 rounded-lg border border-input bg-white px-2.5 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed"
                                >
                                    <option value="">Lọc theo loại (Tất cả)</option>
                                    <option value="System">Hệ thống (System)</option>
                                    <option value="Marketing">Quảng cáo (Marketing)</option>
                                    <option value="Update">Cập nhật (Update)</option>
                                    <option value="Alert">Cảnh báo (Alert)</option>
                                </select>

                                {/* Filter by UserId */}
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="Tìm theo ID User..."
                                        value={filterUserId}
                                        onChange={e => { setFilterUserId(e.target.value === "" ? "" : Number(e.target.value)); setLogsPage(1); }}
                                        className="h-9 w-40 pl-8 text-xs bg-white"
                                    />
                                    {filterUserId !== "" && (
                                        <button
                                            onClick={() => { setFilterUserId(""); setLogsPage(1); }}
                                            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {/* Table */}
                            {isLoadingLogs ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#4a3728] mb-2" />
                                    <p className="text-sm">Đang tải danh sách nhật ký thông báo...</p>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground space-y-2">
                                    <Bell className="w-12 h-12 mx-auto text-muted-foreground/30" />
                                    <p className="text-sm font-semibold">Không tìm thấy thông báo nào</p>
                                    <p className="text-xs text-muted-foreground/80">
                                        Hãy thử thay đổi bộ lọc hoặc soạn một thông báo mới để phát đi.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto border border-border/80 rounded-xl bg-white/70">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead>
                                                <tr className="bg-[#4a3728]/5 border-b border-border/80 text-muted-foreground font-semibold text-xs tracking-wider uppercase">
                                                    <th className="p-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={logs.length > 0 && selectedIds.length === logs.length}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedIds(logs.map(item => item.id));
                                                                } else {
                                                                    setSelectedIds([]);
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-[#4a3728]/30 text-[#4a3728] focus:ring-[#4a3728]/20 cursor-pointer accent-[#4a3728]"
                                                        />
                                                    </th>
                                                    <th className="p-4 w-12 text-center">STT</th>
                                                    <th className="p-4 w-28">Phân loại</th>
                                                    <th className="p-4 w-44">Người nhận</th>
                                                    <th className="p-4">Nội dung thông báo</th>
                                                    <th className="p-4 w-36">Thời gian gửi</th>
                                                    <th className="p-4 w-28 text-center">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/60">
                                                {logs.map((item, index) => {
                                                    const formattedDate = new Date(item.createdAt).toLocaleString("vi-VN", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    });

                                                    const isChecked = selectedIds.includes(item.id);

                                                    return (
                                                        <tr key={item.id} className={`hover:bg-[#4a3728]/5 transition-colors duration-200 ${isChecked ? "bg-[#4a3728]/5" : ""}`}>
                                                            <td className="p-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedIds(prev => [...prev, item.id]);
                                                                        } else {
                                                                            setSelectedIds(prev => prev.filter(id => id !== item.id));
                                                                        }
                                                                    }}
                                                                    className="w-4 h-4 rounded border-[#4a3728]/30 text-[#4a3728] focus:ring-[#4a3728]/20 cursor-pointer accent-[#4a3728]"
                                                                />
                                                            </td>
                                                            <td className="p-4 text-center font-mono text-xs text-muted-foreground">
                                                                {(logsPage - 1) * logsPageSize + index + 1}
                                                            </td>
                                                            <td className="p-4">
                                                                <Badge className={`border px-2 py-0.5 rounded-full font-semibold text-[10px] ${getTypeBadgeColor(item.type)}`}>
                                                                    {item.type}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-1.5">
                                                                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                                    <span className="font-mono text-xs font-semibold text-slate-700">
                                                                        ID User: {item.userInternalId}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="space-y-0.5 text-left max-w-lg">
                                                                    <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                                                                    <p className="text-xs text-muted-foreground line-clamp-2">{item.body}</p>
                                                                    {item.referenceType && (
                                                                        <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-amber-800">
                                                                            <span>Liên kết: {item.referenceType} #{item.referenceId}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-xs font-medium text-muted-foreground font-mono">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3.5 h-3.5 opacity-65" />
                                                                    {formattedDate}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setDeleteId(item.id)}
                                                                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                                                                    title="Thu hồi thông báo khỏi thiết bị người dùng"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Hiển thị danh sách thông báo đã phát đi (Trang {logsPage})
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setLogsPage(prev => Math.max(prev - 1, 1))}
                                                disabled={logsPage === 1}
                                                className="h-8 rounded-lg flex items-center gap-1"
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5" /> Trước
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setLogsPage(prev => prev + 1)}
                                                disabled={logs.length < logsPageSize}
                                                className="h-8 rounded-lg flex items-center gap-1"
                                            >
                                                Sau <ChevronRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: APP REVIEWS & SURVEYS */}
                <TabsContent value="surveys" className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid gap-6 md:grid-cols-12 items-start">
                        {/* LEFT: Create Survey Form */}
                        <div className="md:col-span-7 space-y-6">
                            <Card className="border-[#4a3728]/10 shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
                                <CardHeader className="bg-gradient-to-r from-[#4a3728]/5 to-[#4a3728]/0 border-b border-[#4a3728]/10">
                                    <CardTitle className="text-[#4a3728] flex items-center gap-2">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Tạo đợt khảo sát mới
                                    </CardTitle>
                                    <CardDescription>
                                        Soạn khảo sát gửi đến người dùng để thu thập đánh giá mức độ hài lòng về ứng dụng.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <form onSubmit={handleCreateSurveySubmit} className="space-y-4">
                                        {/* Survey Target Selection */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Đối tượng khảo sát
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyTargetType("broadcast")}
                                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all duration-300
                                                        ${surveyTargetType === "broadcast"
                                                            ? "bg-[#4a3728] text-white border-transparent shadow-sm"
                                                            : "bg-white hover:bg-muted border-border/80 text-muted-foreground"}`}
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                    Tất cả người dùng
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyTargetType("targeted")}
                                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all duration-300
                                                        ${surveyTargetType === "targeted"
                                                            ? "bg-[#4a3728] text-white border-transparent shadow-sm"
                                                            : "bg-white hover:bg-muted border-border/80 text-muted-foreground"}`}
                                                >
                                                    <User className="w-3.5 h-3.5" />
                                                    User cụ thể
                                                </button>
                                            </div>
                                        </div>

                                        {/* Targeted User Search */}
                                        {surveyTargetType === "targeted" && (
                                            <div className="space-y-2 p-3 bg-[#4a3728]/5 border border-[#4a3728]/10 rounded-xl relative">
                                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide flex items-center gap-1.5">
                                                    Tìm kiếm người nhận <span className="text-destructive">*</span>
                                                </label>
                                                {surveySelectedUser ? (
                                                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-green-200 text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-[#4a3728] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                                                {surveySelectedUser.displayName.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-[#4a3728]">{surveySelectedUser.displayName}</p>
                                                                <p className="text-[10px] text-muted-foreground">{surveySelectedUser.email}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSurveySelectedUser(null)}
                                                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Nhập tên hoặc email..."
                                                            value={surveyUserSearch}
                                                            onChange={e => setSurveyUserSearch(e.target.value)}
                                                            className="pl-8 h-9 text-xs bg-white"
                                                        />
                                                        {isSearchingSurveyUsers && (
                                                            <Loader2 className="absolute right-2.5 top-2.5 w-3.5 h-3.5 animate-spin text-[#4a3728]" />
                                                        )}
                                                        {surveySearchedUsers.length > 0 && (
                                                            <div className="absolute left-0 right-0 mt-1.5 bg-white border rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto divide-y divide-border/60">
                                                                {surveySearchedUsers.map(u => (
                                                                    <button
                                                                        key={u.userId}
                                                                        type="button"
                                                                        onClick={() => setSurveySelectedUser(u)}
                                                                        className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-[#4a3728]/5 text-xs transition-colors duration-200"
                                                                    >
                                                                        <div className="w-6 h-6 rounded-full bg-[#4a3728]/10 text-[#4a3728] flex items-center justify-center font-bold text-[10px] shrink-0">
                                                                            {u.displayName.slice(0, 2).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-[#4a3728]">{u.displayName}</p>
                                                                            <p className="text-[9px] text-muted-foreground">{u.email}</p>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Survey Title */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Tiêu đề khảo sát <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Ví dụ: Đánh giá tính năng phối đồ AI..."
                                                value={surveyTitle}
                                                onChange={e => setSurveyTitle(e.target.value)}
                                                required
                                                className="bg-white border-border"
                                            />
                                        </div>

                                        {/* Survey Question */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Câu hỏi thu thập ý kiến <span className="text-destructive">*</span>
                                            </label>
                                            <Textarea
                                                placeholder="Ví dụ: Trải nghiệm tách nền và thử đồ bằng AI của bạn thế nào? Hãy chia sẻ phản hồi của bạn nhé!"
                                                value={surveyQuestion}
                                                onChange={e => setSurveyQuestion(e.target.value)}
                                                required
                                                className="bg-white border-border min-h-[90px]"
                                            />
                                        </div>

                                        {/* Survey Type */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                Phương thức đánh giá
                                            </label>
                                            <select
                                                value={surveyType}
                                                onChange={e => {
                                                    setSurveyType(e.target.value);
                                                    if (e.target.value === "quiz" && quizOptions.length < 2) {
                                                        setQuizOptions(["", ""]);
                                                    }
                                                }}
                                                className="w-full flex h-10 rounded-xl border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none"
                                            >
                                                <option value="stars_only">Theo số sao (Star Rating)</option>
                                                <option value="quiz">Theo trắc nghiệm (Multiple Choice)</option>
                                                <option value="comment_only">Viết bình luận (Comment Only)</option>
                                                <option value="stars_and_comment">Theo số sao & bình luận (Stars and Comments)</option>
                                                <option value="survey_link">Đường link khảo sát (Google Forms, Typeform...)</option>
                                            </select>
                                        </div>

                                        {/* Survey Link URL Input */}
                                        {surveyType === "survey_link" && (
                                            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                                <label className="text-xs font-semibold text-[#4a3728]/80 uppercase tracking-wide">
                                                    Đường dẫn liên kết khảo sát (URL) <span className="text-destructive">*</span>
                                                </label>
                                                <Input
                                                    type="url"
                                                    placeholder="Nhập link khảo sát ngoài (ví dụ: https://forms.gle/...)"
                                                    value={surveyUrl}
                                                    onChange={e => setSurveyUrl(e.target.value)}
                                                    required
                                                    className="bg-white border-border"
                                                />
                                            </div>
                                        )}

                                        {/* Dynamic Quiz Answers Builder */}
                                        {surveyType === "quiz" && (
                                            <div className="space-y-2.5 p-3.5 bg-[#4a3728]/5 border border-[#4a3728]/10 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-[#4a3728]/85 uppercase tracking-wide">
                                                        Danh sách đáp án trắc nghiệm
                                                    </label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setQuizOptions(prev => [...prev, ""])}
                                                        className="h-7 text-[10px] px-2.5 rounded-lg border-[#4a3728]/20 text-[#4a3728] hover:bg-[#4a3728]/5"
                                                    >
                                                        + Thêm đáp án
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                                    {quizOptions.map((option, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <span className="w-6 h-6 rounded-full bg-[#4a3728]/15 text-[#4a3728] font-bold text-xs flex items-center justify-center shrink-0">
                                                                {String.fromCharCode(65 + index)}
                                                            </span>
                                                            <Input
                                                                type="text"
                                                                placeholder={`Nhập đáp án ${index + 1}...`}
                                                                value={option}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setQuizOptions(prev => {
                                                                        const next = [...prev];
                                                                        next[index] = val;
                                                                        return next;
                                                                    });
                                                                }}
                                                                required
                                                                className="h-9 text-xs bg-white"
                                                            />
                                                            {quizOptions.length > 2 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setQuizOptions(prev => prev.filter((_, i) => i !== index))}
                                                                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground italic">Nhập tối thiểu 2 đáp án để người dùng chọn trên App.</p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isCreatingSurvey}
                                            className="w-full bg-[#4a3728] hover:bg-[#3d2d21] text-white flex items-center justify-center gap-2 h-10 rounded-xl font-semibold"
                                        >
                                            {isCreatingSurvey ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Đang tạo và phát hành...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Phát hành khảo sát ngay
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: Live Preview on Smartphone Mockup */}
                        <div className="md:col-span-5 flex justify-center">
                            <div className="w-[300px] h-[580px] bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center">
                                {/* Speaker and Notch */}
                                <div className="absolute top-2.5 w-24 h-5 bg-black rounded-2xl z-30 flex justify-center items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800 ml-auto mr-3" />
                                </div>
                                <div className="absolute top-2 right-8 w-1.5 h-1.5 rounded-full bg-slate-800 z-30" />

                                {/* Screen Background Image (Warm Glassmorphic Nature Look to match TAB 1) */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#6b5847] via-[#9c8470] to-[#bca693] z-0 flex flex-col justify-start items-center pt-14 px-4">
                                    {/* Status Bar Mock */}
                                    <div className="w-full flex justify-between items-center text-white/95 text-[9px] font-medium px-2.5 mb-8 z-10 select-none">
                                        <span>12:30</span>
                                        <div className="flex items-center gap-1">
                                            <span className="w-3 h-2 border border-white/80 rounded-sm relative flex items-center p-0.5"><span className="h-full bg-white w-2/3 rounded-xs" /></span>
                                        </div>
                                    </div>

                                    {/* App Interface Area */}
                                    <div className="w-full bg-[#f9f6f0] border border-white/20 rounded-2xl shadow-2xl flex-1 flex flex-col p-4 mb-14 relative z-10 select-none overflow-hidden max-h-[440px]">
                                        {/* App Header Mock */}
                                        <div className="w-full flex items-center justify-between text-[10px] font-bold text-[#4a3728] border-b pb-2 mb-3 opacity-75">
                                            <span>V-CLOSET TRY-ON</span>
                                            <X className="w-3 h-3 cursor-pointer text-[#4a3728]" />
                                        </div>

                                        {/* Survey Popup Modal content */}
                                        <div className="flex-1 flex flex-col justify-center items-center py-1.5 space-y-3.5">
                                            <div className="text-center space-y-1">
                                                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center mx-auto shadow-sm">
                                                    <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                                                </div>
                                                <h5 className="text-[10px] font-bold text-[#4a3728] leading-tight break-words max-h-[30px] overflow-hidden px-0.5">
                                                    {surveyTitle.trim() || "Tiêu đề khảo sát mẫu"}
                                                </h5>
                                                <p className="text-[9px] text-stone-600 font-medium break-words max-h-[45px] overflow-y-auto px-0.5 leading-normal">
                                                    {surveyQuestion.trim() || "Nội dung câu hỏi khảo sát ý kiến người dùng..."}
                                                </p>
                                            </div>

                                            {/* Rating Stars Mock */}
                                            {(surveyType === "stars_only" || surveyType === "stars_and_comment") && (
                                                <div className="flex justify-center gap-1.5 py-1.5 w-full border-y border-dashed border-stone-200">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className="w-5.5 h-5.5 text-amber-400 fill-amber-400 cursor-pointer hover:scale-110 transition-transform" />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Multiple Choice (Trắc nghiệm) Mock */}
                                            {surveyType === "quiz" && (
                                                <div className="w-full border-y border-dashed border-stone-200 py-1.5 max-h-[130px] overflow-y-auto space-y-1.5">
                                                    {quizOptions.map((opt, i) => (
                                                        <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg border border-stone-200 bg-white hover:border-[#4a3728] cursor-pointer transition-all text-[8px] text-[#4a3728] font-bold">
                                                            <span className="w-3.5 h-3.5 rounded-full bg-[#4a3728]/10 text-[#4a3728] flex items-center justify-center text-[7px] font-bold">
                                                                {String.fromCharCode(65 + i)}
                                                            </span>
                                                            <span className="truncate flex-1 text-left">{opt || `Đáp án ${i + 1}`}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Survey Link Mock */}
                                            {surveyType === "survey_link" && (
                                                <div className="w-full border-y border-dashed border-stone-200 py-3 flex flex-col items-center gap-2">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4a3728]/5 text-[#4a3728] shadow-inner shrink-0">
                                                        <Info className="w-4 h-4" />
                                                    </div>
                                                    <p className="text-[8px] text-stone-500 font-semibold text-center max-w-[180px] break-all leading-normal px-1">
                                                        Khảo sát ngoài: <span className="underline font-bold text-blue-600">{surveyUrl.trim() || "https://forms.gle/vcloset-survey"}</span>
                                                    </p>
                                                    <div className="w-full mt-1.5 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-[#4a3728]/10 bg-white hover:bg-[#4a3728]/5 text-[8px] text-[#4a3728] font-bold select-none cursor-pointer transition-all">
                                                        <span>Mở liên kết khảo sát</span>
                                                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Comment box */}
                                            {(surveyType === "comment_only" || surveyType === "stars_and_comment") && (
                                                <div className="w-full bg-white border border-stone-200 rounded-lg p-2 text-[8px] text-stone-400 text-left min-h-[50px] leading-relaxed shadow-inner">
                                                    Nhập ý kiến đóng góp của bạn...
                                                </div>
                                            )}

                                            <div className="w-full flex gap-2 pt-1.5 mt-auto">
                                                <button type="button" className="flex-1 text-[8px] py-1.5 bg-[#4a3728] hover:bg-[#3d2d21] text-white rounded-lg text-center font-bold shadow-sm transition-all">Gửi phản hồi</button>
                                                <button type="button" className="px-3 text-[8px] py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-600 rounded-lg text-center font-semibold transition-all">Đóng</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Home indicator */}
                                    <div className="absolute bottom-10 text-white/70 text-[9px] font-medium text-center z-10 select-none">
                                        Bản xem trước giao diện khảo sát trên App
                                    </div>
                                </div>

                                {/* Home Bar */}
                                <div className="absolute bottom-2 w-32 h-1 bg-white/60 rounded-full z-30" />
                            </div>
                        </div>
                    </div>

                    {/* Lower Area: Surveys List & History */}
                    <Card className="border-[#4a3728]/10 shadow-sm bg-card/60 backdrop-blur-md mt-6">
                        <CardHeader className="pb-3 border-b border-[#4a3728]/10 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-[#4a3728] text-base flex items-center gap-2">
                                    <History className="w-4 h-4" /> Các đợt khảo sát đã phát hành
                                </CardTitle>
                                <CardDescription className="text-xs">Danh sách toàn bộ các chiến dịch lấy đánh giá người dùng.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoadingSurveys ? (
                                <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#4a3728] mb-2" />
                                    <p className="text-xs">Đang tải lịch sử khảo sát...</p>
                                </div>
                            ) : surveys.length === 0 ? (
                                <div className="text-center py-12 text-stone-400">
                                    <History className="w-10 h-10 mx-auto opacity-30 mb-2" />
                                    <p className="text-xs font-semibold">Chưa phát hành cuộc khảo sát nào</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto border border-border/80 rounded-xl bg-white/70">
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead>
                                                <tr className="bg-[#4a3728]/5 border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                                                    <th className="p-3">Khảo sát</th>
                                                    <th className="p-3 w-32">Loại yêu cầu</th>
                                                    <th className="p-3 w-28 text-center">Trạng thái</th>
                                                    <th className="p-3 w-32 text-center">Phản hồi đã nhận</th>
                                                    <th className="p-3 w-36">Thời gian phát hành</th>
                                                    <th className="p-3 w-36 text-center">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/60">
                                                {surveys.slice((surveysPage - 1) * surveysPageSize, surveysPage * surveysPageSize).map(s => {
                                                    const formattedDate = new Date(s.createdAt).toLocaleDateString("vi-VN", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    });
                                                    return (
                                                        <tr key={s.id} className="hover:bg-[#4a3728]/5 transition-colors duration-200">
                                                            <td className="p-3">
                                                                <p className="font-bold text-[#4a3728]">{s.title}</p>
                                                                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{s.question}</p>
                                                            </td>
                                                            <td className="p-3">
                                                                <Badge variant="outline" className="text-[9px] py-0.5 capitalize border-[#4a3728]/10 text-[#4a3728] bg-[#4a3728]/5">
                                                                    {s.type === "stars_only" ? "Chỉ chấm sao" : s.type === "quiz" ? "Trắc nghiệm" : s.type === "comment_only" ? "Bình luận" : s.type === "survey_link" ? "Link khảo sát" : "Sao + Ý kiến"}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <Badge className={s.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-stone-500 hover:bg-stone-600 text-white"}>
                                                                    {s.status === "active" ? "Đang mở" : "Đã đóng"}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-3 text-center font-bold font-mono text-[#4a3728]">
                                                                {s.responseCount} lượt
                                                            </td>
                                                            <td className="p-3 text-muted-foreground font-mono">
                                                                {formattedDate}
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="flex items-center justify-center gap-1.5">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => setSelectedSurveyForDetails(s)}
                                                                        className="h-7 text-[10px] px-2.5 rounded-lg border-[#4a3728]/20 text-[#4a3728] hover:bg-[#4a3728]/5 flex items-center gap-1"
                                                                        title="Xem chi tiết các lượt đánh giá"
                                                                    >
                                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                                        Xem ý kiến
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleToggleSurveyStatus(s.id)}
                                                                        className="h-7 text-[10px] px-2.5 rounded-lg flex items-center gap-1"
                                                                    >
                                                                        {s.status === "active" ? "Đóng" : "Mở"}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => setDeleteSurveyId(s.id)}
                                                                        className="h-7 w-7 p-0 rounded-lg text-red-600 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {surveys.length > 0 && (
                                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Hiển thị danh sách khảo sát (Trang {surveysPage} / {Math.ceil(surveys.length / surveysPageSize) || 1})
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSurveysPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={surveysPage === 1}
                                                    className="h-8 rounded-lg flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="w-3.5 h-3.5" /> Trước
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSurveysPage(prev => Math.min(prev + 1, Math.ceil(surveys.length / surveysPageSize)))}
                                                    disabled={surveysPage >= Math.ceil(surveys.length / surveysPageSize)}
                                                    className="h-8 rounded-lg flex items-center gap-1"
                                                >
                                                    Sau <ChevronRight className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* DIALOG: CONFIRM SEND */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728]">
                            <Send className="w-5 h-5 text-amber-700" /> Xác nhận gửi thông báo?
                        </DialogTitle>
                        <DialogDescription>
                            Hành động này sẽ gửi trực tiếp thông báo thời gian thực đến người nhận. Bạn không thể hoàn tác hành động gửi trực tiếp (chỉ có thể xóa thu hồi trong lịch sử).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-[#4a3728]/5 p-4 rounded-xl border border-[#4a3728]/10 text-sm space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-[#4a3728] text-xs uppercase">Người nhận:</span>
                            <span className="col-span-2 font-medium text-slate-700">
                                {targetType === "broadcast" ? "Tất cả người dùng (Broadcast)" : `${selectedUser?.displayName} (${selectedUser?.email})`}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-[#4a3728] text-xs uppercase">Phân loại:</span>
                            <span className="col-span-2 font-semibold text-slate-700">
                                {notifType}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-[#4a3728] text-xs uppercase">Tiêu đề:</span>
                            <span className="col-span-2 font-semibold text-slate-800">
                                {title}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-[#4a3728] text-xs uppercase">Nội dung:</span>
                            <span className="col-span-2 text-xs text-slate-600 break-words whitespace-pre-wrap">
                                {body}
                            </span>
                        </div>
                        {refType && (
                            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#4a3728]/10">
                                <span className="font-semibold text-[#4a3728] text-xs uppercase">Liên kết:</span>
                                <span className="col-span-2 text-xs text-amber-800 font-bold">
                                    {refType} #{refId}
                                </span>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={isSending}>
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmSendNotification}
                            disabled={isSending}
                            className="bg-[#4a3728] hover:bg-[#3d2d21] text-white flex items-center gap-1.5"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    Xác nhận & Gửi
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DIALOG: CONFIRM DELETE/REVOKE */}
            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-700">
                            <Trash2 className="w-5 h-5 text-rose-600 animate-pulse" /> Xác nhận thu hồi thông báo?
                        </DialogTitle>
                        <DialogDescription>
                            Hành động này sẽ xóa cưỡng chế thông báo này khỏi cơ sở dữ liệu và hộp thư của người nhận. Họ sẽ không còn thấy thông báo này nữa.
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
                                    Đang thu hồi...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Đồng ý Thu hồi
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DIALOG: CONFIRM BULK DELETE/REVOKE */}
            <Dialog open={bulkConfirmOpen} onOpenChange={(open) => !open && setBulkConfirmOpen(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-700">
                            <Trash2 className="w-5 h-5 text-rose-600 animate-pulse" /> Xác nhận thu hồi hàng loạt?
                        </DialogTitle>
                        <DialogDescription>
                            Hành động này sẽ xóa cưỡng chế <strong className="text-rose-600">{selectedIds.length} thông báo</strong> đã chọn khỏi cơ sở dữ liệu và hộp thư của tất cả người nhận tương ứng. Họ sẽ không còn thấy các thông báo này nữa.
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
                                    Đang thu hồi...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Đồng ý Thu hồi
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Floating Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#4a3728]/20 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-6 z-40 animate-in slide-in-from-bottom-8 duration-300">
                    <span className="text-sm font-semibold text-slate-800">
                        Đã chọn <strong className="text-[#4a3728]">{selectedIds.length}</strong> thông báo
                    </span>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedIds([])}
                            className="rounded-xl border-[#4a3728]/20 text-slate-700 h-9"
                        >
                            Hủy chọn
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setBulkConfirmOpen(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center gap-1.5 h-9"
                        >
                            <Trash2 className="w-4 h-4" />
                            Thu hồi hàng loạt
                        </Button>
                    </div>
                </div>
            )}

            {/* DIALOG: SURVEY RESPONSES DETAILS */}
            <Dialog open={selectedSurveyForDetails !== null} onOpenChange={open => !open && setSelectedSurveyForDetails(null)}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728] font-bold">
                            <MessageSquare className="w-5 h-5 text-[#4a3728]" /> Chi tiết đánh giá từ người dùng
                        </DialogTitle>
                        <DialogDescription className="text-xs font-semibold text-stone-600">
                            Khảo sát: <strong className="text-[#4a3728]">{selectedSurveyForDetails?.title}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Rating filter inside details */}
                    <div className="flex items-center justify-between border-b pb-3.5 mt-2">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Danh sách câu trả lời</span>
                        {selectedSurveyForDetails?.type !== "quiz" && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="font-semibold text-stone-500">Lọc sao:</span>
                                <select
                                    value={ratingFilter}
                                    onChange={e => setRatingFilter(Number(e.target.value))}
                                    className="h-8 rounded-lg border border-input bg-white px-2 py-0.5"
                                >
                                    <option value={0}>Tất cả sao</option>
                                    <option value={5}>5 Sao (★★★★★)</option>
                                    <option value={4}>4 Sao (★★★★☆)</option>
                                    <option value={3}>3 Sao (★★★☆☆)</option>
                                    <option value={2}>2 Sao (★★☆☆☆)</option>
                                    <option value={1}>1 Sao (★☆☆☆☆)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Table of responses */}
                    <div className="space-y-4 pt-2">
                        {isLoadingResponses ? (
                            <div className="flex flex-col items-center justify-center py-10 text-stone-400">
                                <Loader2 className="w-8 h-8 animate-spin text-[#4a3728]" />
                            </div>
                        ) : surveyResponses.length === 0 ? (
                            <p className="text-center py-10 text-xs text-stone-400 italic">Chưa nhận được phản hồi nào phù hợp với bộ lọc.</p>
                        ) : (
                            <div className="max-h-[350px] overflow-y-auto border border-border/60 rounded-xl bg-slate-50/50">
                                <table className="w-full text-left border-collapse text-xs">
                                    {selectedSurveyForDetails?.type === "quiz" ? (
                                        <thead>
                                            <tr className="bg-stone-100 border-b border-border/80 text-muted-foreground font-semibold uppercase">
                                                <th className="p-3 w-40">Thành viên</th>
                                                <th className="p-3">Đáp án trắc nghiệm đã chọn</th>
                                                <th className="p-3 w-36">Thời gian gửi</th>
                                            </tr>
                                        </thead>
                                    ) : (
                                        <thead>
                                            <tr className="bg-stone-100 border-b border-border/80 text-muted-foreground font-semibold uppercase">
                                                <th className="p-3 w-40">Thành viên</th>
                                                <th className="p-3 w-28 text-center">Đánh giá</th>
                                                <th className="p-3">Ý kiến góp ý</th>
                                                <th className="p-3 w-36">Thời gian gửi</th>
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody className="divide-y divide-border/60 bg-white">
                                        {surveyResponses.map(r => {
                                            const rDate = new Date(r.createdAt).toLocaleString("vi-VN", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            });
                                            return (
                                                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-3 font-semibold text-slate-800">
                                                        <p>{r.userDisplayName}</p>
                                                        <span className="text-[10px] text-muted-foreground font-normal">{r.userEmail}</span>
                                                    </td>
                                                    {selectedSurveyForDetails?.type === "quiz" ? (
                                                        <td className="p-3 text-stone-700 font-medium">
                                                            <Badge variant="outline" className="bg-[#4a3728]/5 border-[#4a3728]/20 text-[#4a3728] text-xs font-semibold py-1 px-2.5">
                                                                {r.quizAnswer || "Không rõ"}
                                                            </Badge>
                                                        </td>
                                                    ) : (
                                                        <>
                                                            <td className="p-3 text-center text-amber-500 font-medium">
                                                                {r.rating && r.rating > 0 ? (
                                                                    Array.from({ length: 5 }).map((_, i) => (
                                                                        <span key={i} className={i < r.rating ? "text-amber-500" : "text-stone-300"}>★</span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-stone-400 italic">Không chấm sao</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-stone-700 break-words whitespace-pre-wrap max-w-[280px]">
                                                                {r.comment || <span className="text-stone-400 italic font-normal">Không có bình luận</span>}
                                                            </td>
                                                        </>
                                                    )}
                                                    <td className="p-3 text-muted-foreground font-mono">
                                                        {rDate}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={() => setSelectedSurveyForDetails(null)} className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                            Đóng cửa sổ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DIALOG: CONFIRM DELETE SURVEY */}
            <Dialog open={deleteSurveyId !== null} onOpenChange={open => !open && setDeleteSurveyId(null)}>
                <DialogContent className="sm:max-w-md font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-700 font-bold">
                            <Trash2 className="w-5 h-5 text-rose-600 animate-pulse" /> Xác nhận xóa khảo sát?
                        </DialogTitle>
                        <DialogDescription>
                            Chiến dịch khảo sát này và tất cả các phản hồi/đánh giá thu thập được của người dùng liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button type="button" variant="outline" onClick={() => setDeleteSurveyId(null)} disabled={isDeletingSurvey}>
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteSurvey}
                            disabled={isDeletingSurvey}
                            className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
                        >
                            {isDeletingSurvey ? (
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

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}
