import { Search, MoreHorizontal, UserPlus, Filter, Download } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";

const users = [
    { id: "1", name: "Nguyễn Văn A", email: "vana@gmail.com", role: "User", status: "Active", joined: "2024-01-15" },
    { id: "2", name: "Trần Thị B", email: "thib@hotmail.com", role: "Premium", status: "Active", joined: "2024-02-10" },
    { id: "3", name: "Lê Văn C", email: "vanc@yahoo.com", role: "User", status: "Banned", joined: "2023-11-20" },
    { id: "4", name: "Phạm Minh D", email: "minhd@gmail.com", role: "Admin", status: "Active", joined: "2023-05-05" },
    { id: "5", name: "Hoàng Anh E", email: "anhe@gmail.com", role: "User", status: "Inactive", joined: "2024-03-01" },
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
                            <TableHead>Vai trò</TableHead>
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
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "Admin" ? "destructive" : (user.role === "Premium" ? "default" : "secondary")} className="font-normal">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-green-500" : (user.status === "Banned" ? "bg-red-500" : "bg-yellow-500")}`} />
                                        <span className="text-sm">{user.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground font-mono">{user.joined}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Khóa tài khoản</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
