import { useState, useEffect } from "react";
import {
    Play,
    StopCircle,
    TrendingUp,
    Database,
    Tag,
    AlertCircle,
    CheckCircle,
    X,
    Loader2,
    Calendar,
    Coins,
    BarChart3,
    MousePointerClick,
    Eye
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { getAdminCampaigns, stopAdminCampaign, SponsoredCampaign } from "@/lib/api";

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

export function CampaignManagement() {
    const [campaigns, setCampaigns] = useState<SponsoredCampaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // Toast
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (type: Toast["type"], message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // States cho Confirm Stop Campaign Modal
    const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
    const [campaignToStop, setCampaignToStop] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const data = await getAdminCampaigns();
            setCampaigns(data || []);
        } catch (err: any) {
            console.error("Lỗi khi tải chiến dịch quảng cáo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleOpenStopConfirm = (campaignId: string) => {
        setCampaignToStop(campaignId);
        setStopConfirmOpen(true);
    };

    const handleConfirmStop = async () => {
        if (!campaignToStop) return;
        setActionLoadingId(campaignToStop);
        try {
            await stopAdminCampaign(campaignToStop);
            addToast("success", "Đã dừng khẩn cấp chiến dịch quảng cáo thành công!");
            setStopConfirmOpen(false);
            setCampaignToStop(null);
            fetchCampaigns();
        } catch (err: any) {
            console.error("Lỗi khi dừng chiến dịch:", err);
            addToast("error", `Lỗi khi dừng chiến dịch: ${err.message || err}`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Tính toán số liệu thống kê
    const activeCampaigns = campaigns.filter(c => c.isActive).length;
    const totalDailyBudget = campaigns.reduce((acc, c) => acc + (c.isActive ? Number(c.dailyBudget) : 0), 0);
    const totalSpent = campaigns.reduce((acc, c) => acc + Number(c.totalSpent), 0);
    const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressionCount, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + c.clickCount, 0);
    const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

    const formatPrice = (price: number) => {
        return price.toLocaleString("vi-VN") + " đ";
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#4a3728]">Chiến dịch tài trợ (Campaigns)</h1>
                <p className="text-sm text-muted-foreground">
                    Quản lý và giám sát các chiến dịch đẩy sản phẩm tài trợ của các đối tác thương hiệu trên hệ thống.
                </p>
            </div>

            {/* Thống kê nhanh */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Chiến dịch đang chạy
                        </CardTitle>
                        <Play className="h-4.5 w-4.5 text-[#4a3728]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728]">{activeCampaigns}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Trên tổng số {campaigns.length} chiến dịch
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Ngân sách ngày hiện tại
                        </CardTitle>
                        <Coins className="h-4.5 w-4.5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728]">{formatPrice(totalDailyBudget)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Tổng ngân sách chạy hàng ngày
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Tổng chi tiêu quảng cáo
                        </CardTitle>
                        <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728]">{formatPrice(totalSpent)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Doanh thu quảng cáo lũy kế từ các chiến dịch
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Hiệu suất Click-Through
                        </CardTitle>
                        <BarChart3 className="h-4.5 w-4.5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#4a3728]">{overallCtr}% CTR</div>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                            <span>Clicks: {totalClicks}</span>
                            <span>•</span>
                            <span>Views: {totalImpressions}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bảng danh sách chiến dịch */}
            <Card className="border border-muted shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div>
                        <CardTitle className="text-[#4a3728] font-bold text-base">Danh sách chiến dịch quảng cáo</CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Danh sách hiển thị toàn bộ các chiến dịch và ngân sách quảng cáo của đối tác.
                        </CardDescription>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-muted hover:bg-muted/10 text-xs h-8 gap-1"
                        onClick={fetchCampaigns}
                        disabled={loading}
                    >
                        <Loader2 className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/20">
                                <TableRow>
                                    <TableHead className="font-semibold text-xs py-3 w-16">Ảnh</TableHead>
                                    <TableHead className="font-semibold text-xs py-3">Sản phẩm / Đối tác</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-24">Vị trí đẩy</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-right">Ngân sách/ngày</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-right">Đã chi tiêu</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center">Impression / Click</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-20">CTR</TableHead>
                                    <TableHead className="font-semibold text-xs py-3">Thời hạn chạy</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-24">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-xs py-3 text-center w-24">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="w-8 h-8 text-[#4a3728] animate-spin" />
                                                <span className="text-sm text-muted-foreground">Đang tải danh sách chiến dịch...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : campaigns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground text-xs">
                                            Chưa có chiến dịch quảng cáo tài trợ nào được kích hoạt.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    campaigns.map((campaign) => {
                                        const ctr = campaign.impressionCount > 0 
                                            ? ((campaign.clickCount / campaign.impressionCount) * 100).toFixed(2) 
                                            : "0.00";
                                        return (
                                            <TableRow key={campaign.campaignId} className="hover:bg-muted/10 transition-colors">
                                                <TableCell>
                                                    <div className="w-10 h-10 rounded overflow-hidden border bg-background relative flex items-center justify-center">
                                                        {campaign.productImageUrl ? (
                                                            <img
                                                                src={campaign.productImageUrl}
                                                                alt={campaign.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground font-bold">No Img</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm line-clamp-1 text-foreground">
                                                            {campaign.productName}
                                                        </span>
                                                        <span className="text-xs text-[#4a3728] font-medium mt-0.5">
                                                            Đối tác: {campaign.brandName}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-xs">
                                                    Hạng {campaign.displayRank}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-sm font-semibold text-[#4a3728]">
                                                    {formatPrice(Number(campaign.dailyBudget))}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-sm font-semibold text-emerald-600">
                                                    {formatPrice(Number(campaign.totalSpent))}
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-xs">
                                                    <div className="flex flex-col items-center">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3 text-muted-foreground" /> {campaign.impressionCount}
                                                        </span>
                                                        <span className="flex items-center gap-1 mt-0.5">
                                                            <MousePointerClick className="w-3 h-3 text-blue-500" /> {campaign.clickCount}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-mono font-semibold text-xs text-[#4a3728]">
                                                    {ctr}%
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <div className="flex flex-col text-muted-foreground gap-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5 shrink-0" /> Từ: {formatDate(campaign.startAt)}
                                                        </span>
                                                        <span>
                                                            Đến: {formatDate(campaign.endAt)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={`font-normal ${
                                                            campaign.isActive
                                                                ? "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
                                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {campaign.isActive ? "Đang chạy" : "Đã dừng"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {campaign.isActive ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-rose-600 hover:bg-rose-50 h-8 font-medium text-xs flex items-center justify-center gap-1.5"
                                                            onClick={() => handleOpenStopConfirm(campaign.campaignId)}
                                                            disabled={actionLoadingId === campaign.campaignId}
                                                        >
                                                            {actionLoadingId === campaign.campaignId ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <StopCircle className="h-3.5 w-3.5" />
                                                                    Dừng khẩn
                                                                </>
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {/* Modal Xác nhận dừng khẩn cấp chiến dịch */}
            <Dialog open={stopConfirmOpen} onOpenChange={setStopConfirmOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground font-poppins">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-bold text-lg text-red-600">
                            <StopCircle className="w-5 h-5 shrink-0 text-red-500" /> Xác nhận dừng chiến dịch
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Bạn có chắc chắn muốn dừng khẩn cấp chiến dịch quảng cáo này? Hành động này không thể hoàn tác và quảng cáo sẽ không hiển thị trên hệ thống nữa.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-muted hover:bg-muted/10 text-xs h-9"
                            onClick={() => {
                                setStopConfirmOpen(false);
                                setCampaignToStop(null);
                            }}
                            disabled={actionLoadingId !== null}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmStop}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                            disabled={actionLoadingId !== null}
                        >
                            {actionLoadingId !== null ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang dừng...
                                </>
                            ) : (
                                "Xác nhận dừng"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
