import { CreditCard, DollarSign, ArrowUpRight, Clock, MoreVertical, Download, Plus, ArrowDownRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const subscriptions = [
    { id: "1", user: "Nguyễn Văn A", plan: "Premium Monthly", amount: "$9.99", status: "Active", date: "2024-03-01", nextBilling: "2024-04-01" },
    { id: "2", user: "Trần Thị B", plan: "Premium Yearly", amount: "$89.99", status: "Active", date: "2024-01-10", nextBilling: "2025-01-10" },
    { id: "3", user: "Lê Văn C", plan: "Premium Monthly", amount: "$9.99", status: "Canceled", date: "2023-12-15", nextBilling: "-" },
    { id: "4", user: "Phạm Minh D", plan: "Premium Monthly", amount: "$9.99", status: "Past Due", date: "2024-02-28", nextBilling: "2024-03-28" },
];

export function SubscriptionManagement() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý gói đăng ký</h2>
                    <p className="text-muted-foreground mt-1">Theo dõi doanh thu và trạng thái đăng ký của người dùng.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Báo cáo doanh thu</Button>
                    <Button><Plus className="w-4 h-4 mr-2" /> Tạo mã giảm giá</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$4,231.80</div>
                        <div className="flex items-center mt-1 text-xs text-green-500">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +20.1% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Đăng ký mới (30 ngày)</CardTitle>
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">154</div>
                        <div className="flex items-center mt-1 text-xs text-green-500">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +12.5% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tỷ lệ hủy (Churn rate)</CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.4%</div>
                        <div className="flex items-center mt-1 text-xs text-red-500">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            -0.5% so với tháng trước
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden mt-6">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Gói dịch vụ</TableHead>
                            <TableHead>Tổng cộng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Lần gia hạn tới</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map((sub) => (
                            <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.user}`} />
                                            <AvatarFallback>{sub.user.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm">{sub.user}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">{sub.plan}</TableCell>
                                <TableCell className="text-sm font-semibold">{sub.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={sub.status === "Active" ? "default" : (sub.status === "Canceled" ? "secondary" : "destructive")} className="font-normal text-[10px]">
                                        {sub.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{sub.nextBilling}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

