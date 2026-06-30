import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import {
    CreditCard,
    DollarSign,
    BarChart2,
    TrendingUp,
    Loader2,
    HelpCircle,
    Search,
    RefreshCw,
    Eye,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import {
    getAdminPaymentTransactions,
    AdminPaymentTransaction,
    getAdminRevenueStats,
    RevenueStats,
} from "../../../lib/api";

// --- Toast ---
interface Toast { id: number; type: "success" | "error"; message: string; }
let toastId = 0;

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in slide-in-from-right-4 duration-300 ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
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

export function FinanceManagement() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<"transactions" | "revenue">("transactions");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "revenue") setActiveTab("revenue");
        else setActiveTab("transactions");
    }, [searchParams]);

    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = useCallback((type: "success" | "error", message: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    // --- Transactions ---
    const [transactions, setTransactions] = useState<AdminPaymentTransaction[]>([]);
    const [loadingTx, setLoadingTx] = useState(false);
    const [txPage, setTxPage] = useState(1);
    const [txPageSize] = useState(10);
    const [txTotalCount, setTxTotalCount] = useState(0);
    const [txGatewayFilter, setTxGatewayFilter] = useState("");
    const [txStatusFilter, setTxStatusFilter] = useState("");
    const [txSearchTerm, setTxSearchTerm] = useState("");
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoadingTx(true);
        try {
            const params: any = { page: txPage, pageSize: txPageSize };
            if (txGatewayFilter) params.gateway = txGatewayFilter;
            if (txStatusFilter) params.status = txStatusFilter;
            if (txSearchTerm.trim()) params.searchTerm = txSearchTerm.trim();
            const res = await getAdminPaymentTransactions(params);
            setTransactions(res.items || []);
            setTxTotalCount(res.totalCount || 0);
        } catch (err: any) {
            addToast("error", err.message || "Khong the tai danh sach giao dich.");
        } finally {
            setLoadingTx(false);
        }
    }, [txPage, txPageSize, txGatewayFilter, txStatusFilter, txSearchTerm, addToast]);

    useEffect(() => {
        if (activeTab === "transactions") fetchTransactions();
    }, [activeTab, txPage, txGatewayFilter, txStatusFilter, txSearchTerm, fetchTransactions]);

    // --- Revenue ---
    const [revenue, setRevenue] = useState<RevenueStats | null>(null);
    const [loadingRevenue, setLoadingRevenue] = useState(false);
    const [revenueGateway, setRevenueGateway] = useState("");
    const [revenueFrom, setRevenueFrom] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() - 29);
        return d.toISOString().split("T")[0];
    });
    const [revenueTo, setRevenueTo] = useState(() => new Date().toISOString().split("T")[0]);

    const fetchRevenue = useCallback(async () => {
        setLoadingRevenue(true);
        try {
            const params: any = {};
            if (revenueFrom) params.fromDate = revenueFrom;
            if (revenueTo) params.toDate = revenueTo;
            if (revenueGateway) params.gateway = revenueGateway;
            const res = await getAdminRevenueStats(params);
            setRevenue(res);
        } catch (err: any) {
            addToast("error", err.message || "Khong the tai thong ke doanh thu.");
        } finally {
            setLoadingRevenue(false);
        }
    }, [revenueFrom, revenueTo, revenueGateway, addToast]);

    useEffect(() => {
        if (activeTab === "revenue") fetchRevenue();
    }, [activeTab, fetchRevenue]);

    const getTxStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid": case "success": return " dark:bg-green-500/10 dark:text-green-400 border-none";
            case "pending": return " dark:bg-amber-500/10 dark:text-amber-400 border-none animate-pulse";
            case "failed": return " dark:bg-red-500/10 dark:text-red-400 border-none";
            default: return " dark:bg-muted dark:text-foreground border-none";
        }
    };

    const tabClass = (tab: string) =>
        `py-2.5 px-5 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${activeTab === tab
            ? "border-[#4a3728] dark:border-primary text-[#4a3728] dark:text-foreground"
            : "border-transparent text-muted-foreground hover:text-[#4a3728] dark:hover:text-foreground"
        }`;

    return (
        <div className="p-6 space-y-6">
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />

            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#4a3728] dark:text-foreground flex items-center gap-2">
                    <DollarSign className="w-7 h-7" /> Quản Lý Tài Chính
                </h2>
                <p className="text-muted-foreground mt-1">
                    Doi soat giao dich thanh toan truc tuyen va thong ke doanh thu.
                </p>
            </div>

            {/* Tab bar */}
            <div className="border-b border-muted">
                <div className="flex items-center gap-0">
                    <button onClick={() => setActiveTab("transactions")} className={tabClass("transactions")}>
                        <CreditCard className="w-3.5 h-3.5" /> Doi soat Giao dich Momo/PayOS
                    </button>
                    <button onClick={() => setActiveTab("revenue")} className={tabClass("revenue")}>
                        <TrendingUp className="w-3.5 h-3.5" /> Thong ke Doanh thu
                    </button>
                </div>
            </div>

            {/* TAB: TRANSACTIONS */}
            {activeTab === "transactions" && (
                <div className="space-y-6">
                    <Card className="shadow-sm border-muted">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-muted gap-4">
                            <div>
                                <CardTitle className="text-[#4a3728] dark:text-foreground text-lg flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" /> Nhat ky giao dich truc tuyen
                                </CardTitle>
                                <CardDescription>
                                    Xem va doi soat toan bo dong tien thanh toan truc tuyen qua cong Momo hoac PayOS.
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                    <Input type="text" placeholder="Tim theo ten hoac email..." value={txSearchTerm}
                                        onChange={e => { setTxSearchTerm(e.target.value); setTxPage(1); }}
                                        className="h-9 pl-8 w-52 text-xs bg-background" />
                                </div>
                                <select value={txGatewayFilter} onChange={e => { setTxGatewayFilter(e.target.value); setTxPage(1); }}
                                    className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none">
                                    <option value="">Tat ca Cong</option>
                                    <option value="Momo">Vi Momo</option>
                                    <option value="PayOS">Cong PayOS</option>
                                </select>
                                <select value={txStatusFilter} onChange={e => { setTxStatusFilter(e.target.value); setTxPage(1); }}
                                    className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none">
                                    <option value="">Tat ca TT</option>
                                    <option value="Paid">Da thanh toan</option>
                                    <option value="Pending">Cho thanh toan</option>
                                    <option value="Failed">That bai</option>
                                </select>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {loadingTx ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#4a3728] dark:text-foreground" />
                                    <span className="text-sm">Dang tai lich su giao dich...</span>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground space-y-2">
                                    <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/30" />
                                    <p className="text-sm font-semibold">Chua phat sinh giao dich nao</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto rounded-xl border border-muted">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="w-12 text-center">STT</TableHead>
                                                    <TableHead>Ma giao dich cong</TableHead>
                                                    <TableHead>Khach hang</TableHead>
                                                    <TableHead>Goi Premium</TableHead>
                                                    <TableHead>So tien</TableHead>
                                                    <TableHead>Cong ket noi</TableHead>
                                                    <TableHead>Trang thai</TableHead>
                                                    <TableHead>Thoi gian</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transactions.map((tx, idx) => {
                                                    const formattedDate = new Date(tx.createdAt).toLocaleString("vi-VN", {
                                                        year: "numeric", month: "2-digit", day: "2-digit",
                                                        hour: "2-digit", minute: "2-digit"
                                                    });
                                                    return (
                                                        <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                                                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                                                {(txPage - 1) * txPageSize + idx + 1}
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs font-semibold text-[#4a3728] dark:text-foreground">
                                                                {tx.gatewayTransactionId && (tx.gatewayTransactionId.startsWith("http://") || tx.gatewayTransactionId.startsWith("https://")) ? (
                                                                    <button onClick={() => setZoomImage(tx.gatewayTransactionId)}
                                                                        className="flex items-center gap-1.5 dark:text-amber-400 hover:underline bg-[#4a3728]/5 px-2.5 py-1 rounded-lg transition-colors border border-amber-800/10 cursor-pointer font-semibold text-[11px]">
                                                                        <Eye className="w-3.5 h-3.5 shrink-0" /> Xem minh chung
                                                                    </button>
                                                                ) : (tx.gatewayTransactionId || "N/A")}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-xs font-semibold dark:text-foreground">{tx.userDisplayName}</div>
                                                                <div className="text-[10px] text-muted-foreground font-mono">ID: <span title={tx.userId}>{tx.userId ? tx.userId.substring(0, 8) + '...' : ''}</span></div>
                                                            </TableCell>
                                                            <TableCell className="text-xs font-medium dark:text-muted-foreground">{tx.subscriptionPlanName}</TableCell>
                                                            <TableCell className="font-mono font-bold text-xs">{tx.amount.toLocaleString("vi-VN")} {tx.currency}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="border-muted bg-[#4a3728]/5 dark:bg-primary/5 text-[#4a3728] dark:text-foreground text-[10px]">
                                                                    {tx.paymentGateway}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge className={`font-semibold text-[10px] px-2 py-0.5 rounded ${getTxStatusBadgeColor(tx.status)}`}>
                                                                    {tx.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-xs font-mono text-muted-foreground">{formattedDate}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-muted-foreground font-semibold">Tong giao dich: {txTotalCount} (Trang {txPage})</p>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setTxPage(p => Math.max(p - 1, 1))} disabled={txPage === 1} className="h-8 rounded-lg">Truoc</Button>
                                            <Button variant="outline" size="sm" onClick={() => setTxPage(p => p + 1)} disabled={transactions.length < txPageSize} className="h-8 rounded-lg">Sau</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* TAB: REVENUE */}
            {activeTab === "revenue" && (
                <div className="space-y-6">
                    <Card className="shadow-sm border-muted">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-muted gap-4">
                            <div>
                                <CardTitle className="text-[#4a3728] dark:text-foreground text-lg flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5" /> Thong ke Doanh thu
                                </CardTitle>
                                <CardDescription>Tong hop doanh thu tu cac giao dich thanh toan truc tuyen thanh cong.</CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <span>Tu</span>
                                    <input type="date" value={revenueFrom} onChange={e => setRevenueFrom(e.target.value)}
                                        className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none" />
                                    <span>den</span>
                                    <input type="date" value={revenueTo} onChange={e => setRevenueTo(e.target.value)}
                                        className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none" />
                                </div>
                                <select value={revenueGateway} onChange={e => setRevenueGateway(e.target.value)}
                                    className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none">
                                    <option value="">Tat ca cong</option>
                                    <option value="Momo">Momo</option>
                                    <option value="PayOS">PayOS</option>
                                </select>
                                <Button size="sm" className="h-9 bg-[#4a3728] dark:bg-primary hover:bg-[#3d2d21] text-white gap-1.5" onClick={fetchRevenue} disabled={loadingRevenue}>
                                    {loadingRevenue ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                    Lam moi
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {loadingRevenue ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#4a3728] dark:text-foreground" />
                                    <span className="text-sm">Dang tai du lieu doanh thu...</span>
                                </div>
                            ) : !revenue ? (
                                <div className="text-center py-16 text-muted-foreground space-y-2">
                                    <BarChart2 className="w-12 h-12 mx-auto text-muted-foreground/30" />
                                    <p className="text-sm font-semibold">Chua co du lieu</p>
                                    <p className="text-xs">Nhan "Lam moi" de tai thong ke doanh thu.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="rounded-xl border border-muted bg-gradient-to-br from-emerald-50 to-white p-4 flex flex-col gap-1 shadow-sm">
                                            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Tong doanh thu</span>
                                            <span className="text-2xl font-bold dark:text-green-400">{revenue.totalRevenue.toLocaleString("vi-VN")}d</span>
                                            <span className="text-[11px] text-muted-foreground">Don vi: {revenue.currency || "VND"}</span>
                                        </div>
                                        <div className="rounded-xl border border-muted bg-gradient-to-br from-blue-50 to-white p-4 flex flex-col gap-1 shadow-sm">
                                            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Tong giao dich</span>
                                            <span className="text-2xl font-bold dark:text-blue-400">{revenue.totalTransactions}</span>
                                            <span className="text-[11px] text-muted-foreground">Tat ca trang thai</span>
                                        </div>
                                        <div className="rounded-xl border border-muted bg-gradient-to-br from-green-50 to-white p-4 flex flex-col gap-1 shadow-sm">
                                            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Da thanh toan</span>
                                            <span className="text-2xl font-bold dark:text-green-400">{revenue.paidCount}</span>
                                            <span className="text-[11px] text-muted-foreground">Giao dich Paid/Success</span>
                                        </div>
                                        <div className="rounded-xl border border-muted bg-gradient-to-br from-amber-50 to-white p-4 flex flex-col gap-1 shadow-sm">
                                            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Cho / That bai</span>
                                            <span className="text-2xl font-bold dark:text-amber-400">{revenue.pendingCount + revenue.failedCount}</span>
                                            <span className="text-[11px] text-muted-foreground">{revenue.pendingCount} cho · {revenue.failedCount} that bai</span>
                                        </div>
                                    </div>
                                    {revenue.byGateway && revenue.byGateway.length > 0 && (
                                        <div className="rounded-xl border border-muted p-5 shadow-sm">
                                            <h3 className="text-sm font-semibold text-[#4a3728] dark:text-foreground mb-4 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> Phan tich theo cong thanh toan
                                            </h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {revenue.byGateway.map(g => {
                                                    const pct = revenue.totalRevenue > 0 ? Math.round((g.totalAmount / revenue.totalRevenue) * 100) : 0;
                                                    return (
                                                        <div key={g.gateway} className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30 border border-muted">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-bold text-[#4a3728] dark:text-foreground">{g.gateway}</span>
                                                                <Badge variant="outline" className="text-[11px] border-[#4a3728]/20 bg-[#4a3728]/5 text-[#4a3728] dark:text-foreground">{g.count} giao dich</Badge>
                                                            </div>
                                                            <span className="text-xl font-bold dark:text-foreground">{g.totalAmount.toLocaleString("vi-VN")}d</span>
                                                            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                                                <div className="h-full rounded-full bg-gradient-to-r from-[#4a3728] to-amber-600 transition-all duration-500" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{pct}% tong doanh thu</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {revenue.dailyRevenue && revenue.dailyRevenue.length > 0 && (() => {
                                        const data = revenue.dailyRevenue.slice(-30);
                                        const maxAmt = Math.max(...data.map(d => d.totalAmount), 1);
                                        return (
                                            <div className="rounded-xl border border-muted p-5 shadow-sm">
                                                <h3 className="text-sm font-semibold text-[#4a3728] dark:text-foreground mb-4 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" /> Doanh thu theo ngay (30 ngay gan nhat)
                                                </h3>
                                                <div className="relative w-full overflow-x-auto">
                                                    <svg viewBox={`0 0 ${Math.max(data.length * 24, 300)} 140`} className="w-full min-w-[300px]" preserveAspectRatio="none">
                                                        {[0, 25, 50, 75, 100].map(pct => (
                                                            <line key={pct} x1="0" y1={120 - pct * 1.1} x2={Math.max(data.length * 24, 300)} y2={120 - pct * 1.1} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" />
                                                        ))}
                                                        {data.map((d, i) => {
                                                            const bw = Math.max(data.length * 24, 300) / data.length;
                                                            const h = (d.totalAmount / maxAmt) * 110;
                                                            const x = i * bw + bw * 0.15;
                                                            const bwFill = bw * 0.7;
                                                            return (
                                                                <g key={d.date}>
                                                                    <rect x={x} y={120 - h} width={bwFill} height={h} rx="3" fill="url(#barGrad)" opacity="0.9" />
                                                                    {data.length <= 15 && (
                                                                        <text x={x + bwFill / 2} y="135" textAnchor="middle" fontSize="7" fill="#9ca3af">{d.date.slice(5)}</text>
                                                                    )}
                                                                </g>
                                                            );
                                                        })}
                                                        <defs>
                                                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#92400e" />
                                                                <stop offset="100%" stopColor="#d97706" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-3">
                                                    {data.slice(-7).map(d => (
                                                        <div key={d.date} className="text-[10px] text-muted-foreground">
                                                            <span className="font-semibold">{d.date.slice(5)}</span>: {d.totalAmount.toLocaleString("vi-VN")}d
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {zoomImage && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setZoomImage(null)}>
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setZoomImage(null)} className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                        <img src={zoomImage} alt="Minh chung chuyen khoan" className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]" />
                    </div>
                </div>
            )}
        </div>
    );
}
