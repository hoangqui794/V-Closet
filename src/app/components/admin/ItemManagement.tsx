import { Search, Filter, MoreVertical, LayoutGrid, List as ListIcon, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const items = [
    { id: "1", name: "Áo thun trắng", category: "Áo", user: "Nguyễn Văn A", status: "Public", views: 120, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80" },
    { id: "2", name: "Quần Jeans xanh", category: "Quần", user: "Trần Thị B", status: "Public", views: 85, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80" },
    { id: "3", name: "Váy hoa mùa hè", category: "Váy", user: "Lê Văn C", status: "Private", views: 42, image: "https://images.unsplash.com/photo-1515347648372-815d1694176a?auto=format&fit=crop&w=150&q=80" },
    { id: "4", name: "Giày Sneaker", category: "Giày", user: "Nguyễn Văn A", status: "Public", views: 230, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80" },
    { id: "5", name: "Túi xách da", category: "Phụ kiện", user: "Trần Thị B", status: "Public", views: 56, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80" },
];

export function ItemManagement() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý vật phẩm</h2>
                    <p className="text-muted-foreground mt-1">Danh sách tất cả trang phục và phụ kiện trong hệ thống.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted p-1 rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-card shadow-sm"><LayoutGrid className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ListIcon className="h-4 w-4" /></Button>
                    </div>
                    <Button><Plus className="h-4 w-4 mr-2" /> Thêm vật phẩm</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 items-center">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm vật phẩm..." className="pl-8 bg-card" />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        <SelectItem value="ao">Áo</SelectItem>
                        <SelectItem value="quan">Quần</SelectItem>
                        <SelectItem value="vay">Váy</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="all">
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="public">Công khai</SelectItem>
                        <SelectItem value="private">Riêng tư</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden bg-card border hover:shadow-lg transition-all group">
                        <div className="aspect-square relative overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 flex flex-col gap-2">
                                <Badge className={`${item.status === "Public" ? "bg-green-500/80" : "bg-gray-500/80"} backdrop-blur-md`}>
                                    {item.status}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm truncate">{item.name}</span>
                                <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{item.category}</span>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                                Bởi: <span className="text-foreground">{item.user}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                {item.views} lượt xem
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
