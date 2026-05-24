import { Search, UserPlus, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../ui/table";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";

const users = [
    { id: "1", name: "Nguyễn Văn A", email: "vana@gmail.com", plan: "Free", itemCount: 12, status: "Active", joined: "2024-01-15" },
    { id: "2", name: "Trần Thị B", email: "thib@gmail.com", plan: "Premium", itemCount: 45, status: "Active", joined: "2024-02-10" },
    { id: "3", name: "Lê Văn C", email: "vanc@gmail.com", plan: "Free", itemCount: 3, status: "Banned", joined: "2023-11-20" },
    { id: "4", name: "Phạm Minh D", email: "minhd@gmail.com", plan: "Admin", itemCount: 0, status: "Active", joined: "2023-05-05" },
    { id: "5", name: "Hoàng Anh E", email: "anhe@gmail.com", plan: "Free", itemCount: 8, status: "Inactive", joined: "2024-03-01" },
];

export function UserManagement() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
                    <p className="text-muted-foreground mt-1">Danh sách tất cả người dùng trong hệ thống V-Closet.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Xuất CSV</Button>
                    <Button><UserPlus className="w-4 h-4 mr-2" /> Thêm người dùng</Button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex flex-1 items-center gap-2 max-w-md">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo tên hoặc email..."
                            className="pl-8 bg-card"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="border">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    Đang hiển thị <strong>5</strong> trên tổng số <strong>1,240</strong> người dùng
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-12"><Checkbox /></TableHead>
                            <TableHead>Người dùng</TableHead>
                            <TableHead>Gmail</TableHead>
                            <TableHead>Gói thành viên</TableHead>
                            <TableHead className="text-center">Số trang phục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tham gia</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.plan === "Premium" ? "default" : (user.plan === "Admin" ? "destructive" : "secondary")} className="bg-[#4a3728]/10 text-[#4a3728] hover:bg-[#4a3728]/20 border-none font-normal">
                                        {user.plan}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center font-semibold text-sm">
                                    {user.itemCount}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-green-500" : (user.status === "Banned" ? "bg-red-500" : "bg-yellow-500")}`} />
                                        <span className="text-sm">{user.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground font-mono">{user.joined}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600" title="Xem chi tiết">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#4a3728]" title="Chỉnh sửa">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Xóa tài khoản">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
