import { useState } from "react";
import {
    Search,
    Filter,
    Plus,
    Trash2,
    Edit,
    Pin,
    Eye,
    MousePointerClick,
    ArrowUpRight,
    Check,
    X,
    RefreshCw,
    Play,
    Database,
    Tag,
    AlertCircle,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Mockup dữ liệu sản phẩm Affiliate cào từ Shopee
const initialProducts = [
    {
        id: "aff-1",
        name: "Áo Khoác Nữ Tweed Sang Chảnh Khuy Đồng Dày Dặn",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
        price: 289000,
        commission: 8,
        clicks: 1420,
        canvasTries: 852,
        ctr: 11.2,
        status: "Pinned",
        shopName: "Tweed & More",
        link: "https://shopee.vn/product/123/456"
    },
    {
        id: "aff-2",
        name: "Đầm Dáng Dài Trễ Vai Sang Trọng Dự Tiệc Cưới",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80",
        price: 450000,
        commission: 7.5,
        clicks: 980,
        canvasTries: 540,
        ctr: 8.5,
        status: "Public",
        shopName: "Elise Store",
        link: "https://shopee.vn/product/123/789"
    },
    {
        id: "aff-3",
        name: "Quần Jeans Ống Rộng Cạp Cao Tôn Dáng Hack Chân",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=150&q=80",
        price: 199000,
        commission: 6,
        clicks: 2310,
        canvasTries: 1620,
        ctr: 9.8,
        status: "Public",
        shopName: "Denim World",
        link: "https://shopee.vn/product/123/101"
    },
    {
        id: "aff-4",
        name: "Áo Thun Baby Tee Tăm Tre Mát Mịn Thêu Chữ Ngọt Ngào",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80",
        price: 89000,
        commission: 5,
        clicks: 3420,
        canvasTries: 2450,
        ctr: 12.4,
        status: "Public",
        shopName: "Teens Closet",
        link: "https://shopee.vn/product/123/202"
    },
    {
        id: "aff-5",
        name: "Chân Váy Chữ A Dạ Tweed Cao Cấp Kèm Quần Trong",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=150&q=80",
        price: 185000,
        commission: 8,
        clicks: 450,
        canvasTries: 190,
        ctr: 4.2,
        status: "Hidden",
        shopName: "Mimi Boutique",
        link: "https://shopee.vn/product/123/303"
    }
];

export function AffiliateManagement() {
    const [activeTab, setActiveTab] = useState<"products" | "crawler">("products");
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    // States cho Crawler
    const [keywords, setKeywords] = useState(["váy dạ hội", "áo tweed nữ", "baby tee hè", "jeans cạp cao"]);
    const [newKeyword, setNewKeyword] = useState("");
    const [isCrawling, setIsCrawling] = useState(false);
    const [crawlLog, setCrawlLog] = useState<string[]>([
        "System: Khởi động crawler lúc 2026-05-23 03:00:12 AM.",
        "Crawler: Đang kết nối mạng Shopee Affiliate API...",
        "Crawler: Thành công. Bắt đầu quét từ khóa 'váy dạ hội'.",
        "Crawler: Tìm thấy 12 sản phẩm trending mới từ khóa 'váy dạ hội'.",
        "Crawler: Hoàn tất. Tự động tách nền sắc nét 12 hình ảnh qua Photoroom API.",
        "System: Lưu thành công 12 sản phẩm mới vào cơ sở dữ liệu."
    ]);

    // Thay đổi trạng thái ghim/ẩn sản phẩm
    const handleToggleStatus = (id: string, currentStatus: string) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                let nextStatus = "Public";
                if (currentStatus === "Public") nextStatus = "Pinned";
                else if (currentStatus === "Pinned") nextStatus = "Hidden";
                else nextStatus = "Public";
                return { ...p, status: nextStatus };
            }
            return p;
        }));
    };

    const handleAddKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const handleRemoveKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    // Kích hoạt cào thử thủ công
    const handleStartCrawl = () => {
        setIsCrawling(true);
        setCrawlLog(prev => [...prev, `System: Admin kích hoạt cào sản phẩm thủ công vào lúc ${new Date().toLocaleTimeString()}.`]);
        
        setTimeout(() => {
            setIsCrawling(false);
            setCrawlLog(prev => [
                ...prev,
                `Crawler: Quét ngẫu nhiên ${keywords.length} từ khóa...`,
                "Crawler: Đã cào thêm 8 sản phẩm trending mới từ Shopee.",
                "Photoroom API: Bóc tách nền thành công cho 8 sản phẩm.",
                "System: Cập nhật thành công 8 sản phẩm vào hệ thống V-Closet."
            ]);
            // Thêm ngẫu nhiên một sản phẩm mẫu
            const newMockProduct = {
                id: `aff-${products.length + 1}`,
                name: `Sản phẩm Trending Mới (${keywords[Math.floor(Math.random() * keywords.length)]})`,
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80",
                price: 159000 + Math.floor(Math.random() * 200000),
                commission: 7,
                clicks: 0,
                canvasTries: 0,
                ctr: 0.0,
                status: "Public",
                shopName: "Shopee Mall Store",
                link: "https://shopee.vn"
            };
            setProducts(prev => [newMockProduct, ...prev]);
        }, 3000);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.shopName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || 
                              (statusFilter === "pinned" && product.status === "Pinned") ||
                              (statusFilter === "public" && product.status === "Public") ||
                              (statusFilter === "hidden" && product.status === "Hidden");
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Quản lý Sản phẩm Affiliate</h2>
                    <p className="text-muted-foreground mt-1">
                        Quản lý luồng sản phẩm trending từ Shopee Affiliate hiển thị trên tab Khám Phá của người dùng.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none py-1.5 px-3 flex items-center gap-1.5 text-xs font-medium">
                        <Database className="w-3.5 h-3.5" /> Shopee Partner Active
                    </Badge>
                </div>
            </div>

            {/* Tabs Custom bằng State */}
            <div className="flex border-b border-muted">
                <button
                    onClick={() => setActiveTab("products")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "products"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Danh sách sản phẩm Shopee ({filteredProducts.length})
                </button>
                <button
                    onClick={() => setActiveTab("crawler")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "crawler"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Cấu hình Crawler tự động
                </button>
            </div>

            {/* TAB 1: DANH SÁCH SẢN PHẨM */}
            {activeTab === "products" && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4 items-center bg-card p-4 rounded-xl border border-muted shadow-sm">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm sản phẩm hoặc tên shop..."
                                className="pl-8 bg-background border-muted"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="bg-background border-muted">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-card">
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="pinned">Được ghim (Pinned)</SelectItem>
                                <SelectItem value="public">Công khai (Public)</SelectItem>
                                <SelectItem value="hidden">Đã ẩn (Hidden)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="w-full bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                            <Plus className="w-4 h-4 mr-2" /> Thêm sản phẩm thủ công
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden border-muted">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-24">Sản phẩm</TableHead>
                                    <TableHead>Tên sản phẩm / Shop</TableHead>
                                    <TableHead className="text-right">Giá gốc</TableHead>
                                    <TableHead className="text-center">Hoa hồng (%)</TableHead>
                                    <TableHead className="text-center">Số Click / Kéo thả</TableHead>
                                    <TableHead className="text-center">CTR %</TableHead>
                                    <TableHead className="text-center">Trạng thái</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            Không tìm thấy sản phẩm nào phù hợp.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-muted/10 transition-colors">
                                            <TableCell>
                                                <div className="w-14 h-14 rounded-lg overflow-hidden border bg-background relative flex items-center justify-center">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm line-clamp-1 text-foreground">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                        Shop: {product.shopName}
                                                        <a href={product.link} target="_blank" rel="noreferrer" className="text-[#4a3728] hover:underline">
                                                            <ExternalLink className="w-3 h-3 inline" />
                                                        </a>
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-semibold">
                                                {product.price.toLocaleString("vi-VN")} đ
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none font-medium">
                                                    +{product.commission}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-sm font-semibold flex items-center gap-1">
                                                        <MousePointerClick className="w-3.5 h-3.5 text-blue-500" /> {product.clicks}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground mt-0.5">
                                                        Kéo thả Canvas: {product.canvasTries}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-semibold text-sm text-[#4a3728]">
                                                {product.ctr}%
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        product.status === "Pinned"
                                                            ? "default"
                                                            : product.status === "Public"
                                                            ? "outline"
                                                            : "secondary"
                                                    }
                                                    className={`font-normal ${
                                                        product.status === "Pinned"
                                                            ? "bg-[#4a3728] text-white"
                                                            : product.status === "Public"
                                                            ? "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {product.status === "Pinned" && <Pin className="w-2.5 h-2.5 mr-1 inline" />}
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleToggleStatus(product.id, product.status)}
                                                        title="Đổi trạng thái Ghim/Công khai/Ẩn"
                                                    >
                                                        <Pin className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-[#4a3728]"
                                                        title="Sửa thông tin sản phẩm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        title="Xóa sản phẩm"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* TAB 2: CẤU HÌNH CRAWLER */}
            {activeTab === "crawler" && (
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Bảng cấu hình keywords */}
                    <Card className="md:col-span-1 shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-[#4a3728] flex items-center gap-2 text-lg">
                                <Tag className="w-5 h-5" /> Từ khóa cào sản phẩm
                            </CardTitle>
                            <CardDescription>
                                Hệ thống sẽ sử dụng các từ khóa này để tìm kiếm các sản phẩm hot nhất trên Shopee Affiliate.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Thêm từ khóa mới..."
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                                    className="bg-background border-muted"
                                />
                                <Button
                                    onClick={handleAddKeyword}
                                    className="bg-[#4a3728] hover:bg-[#3d2d21] text-white shrink-0"
                                >
                                    Thêm
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {keywords.map((kw, i) => (
                                    <Badge
                                        key={i}
                                        className="bg-[#4a3728]/10 hover:bg-[#4a3728]/20 text-[#4a3728] border-none py-1 px-2.5 flex items-center gap-1 font-medium text-xs"
                                    >
                                        {kw}
                                        <X
                                            className="w-3.5 h-3.5 cursor-pointer hover:bg-[#4a3728]/35 rounded-full"
                                            onClick={() => handleRemoveKeyword(kw)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cài đặt chu kỳ và chạy crawler */}
                    <Card className="md:col-span-2 shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-[#4a3728] flex items-center gap-2 text-lg">
                                <RefreshCw className="w-5 h-5" /> Cài đặt Chu kỳ & Chạy thử
                            </CardTitle>
                            <CardDescription>
                                Điều chỉnh tần suất chạy tác vụ nền (Background Jobs) và thực thi kiểm thử crawler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Tần suất đồng bộ nền
                                    </label>
                                    <Select defaultValue="daily">
                                        <SelectTrigger className="bg-background border-muted">
                                            <SelectValue placeholder="Chọn chu kỳ" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card">
                                            <SelectItem value="hourly">Mỗi 12 tiếng</SelectItem>
                                            <SelectItem value="daily">Hàng ngày (03:00 AM)</SelectItem>
                                            <SelectItem value="weekly">Hàng tuần (Thứ Hai)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Giới hạn cào mỗi lượt
                                    </label>
                                    <Select defaultValue="50">
                                        <SelectTrigger className="bg-background border-muted">
                                            <SelectValue placeholder="Số lượng sản phẩm" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card">
                                            <SelectItem value="20">Tối đa 20 sản phẩm</SelectItem>
                                            <SelectItem value="50">Tối đa 50 sản phẩm</SelectItem>
                                            <SelectItem value="100">Tối đa 100 sản phẩm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/20 border border-muted rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-foreground">
                                        Tự động đồng bộ & Tách nền qua API
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 leading-relaxed text-xs">
                                        Khi crawler chạy, hệ thống sẽ tự động gọi API Photoroom để bóc tách nền
                                        sắc nét của toàn bộ ảnh sản phẩm, sau đó chia danh mục khoa học (Top, Bottom, Shoes, Accessories) trước khi cập nhật vào Tab Khám Phá.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                                    Nhật ký hoạt động của máy chủ crawler (Server Log)
                                </span>
                                <div className="h-44 w-full bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-y-auto leading-relaxed border border-slate-800">
                                    {crawlLog.map((log, i) => (
                                        <div key={i} className="mb-1">
                                            <span className="text-slate-500">[{new Date().toLocaleDateString()}]</span> {log}
                                        </div>
                                    ))}
                                    {isCrawling && (
                                        <div className="flex items-center gap-2 mt-2 text-amber-400 animate-pulse">
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            System: Đang liên kết Shopee Affiliate, cào sản phẩm và gọi API Photoroom để tách nền...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-muted bg-muted/10 p-4 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                                Lần cào gần nhất: <strong>Hôm nay, 03:05 AM</strong>
                            </span>
                            <Button
                                disabled={isCrawling}
                                onClick={handleStartCrawl}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                <Play className="w-4 h-4 mr-2" /> {isCrawling ? "Đang đồng bộ..." : "Kích hoạt cào ngay"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
