import { useState, useEffect } from "react";
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
    ExternalLink,
    Globe,
    Phone,
    Mail,
    Building2,
    Calendar,
    Loader2,
    Coins
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { 
    getAdminBrands, 
    BrandPartner, 
    updateBrandStatus, 
    depositBrandCredit,
    getAdminProducts,
    createAdminProduct,
    getAdminProductDetail,
    updateAdminProduct,
    deleteAdminProduct,
    importAffiliateConversions,
    removeBgAndUploadProductImage,
    AffiliateProduct
} from "@/lib/api";

export function AffiliateManagement() {
    const [activeTab, setActiveTab] = useState<"products" | "crawler" | "brands">("products");
    
    // States cho Affiliate Products (API real)
    const [products, setProducts] = useState<AffiliateProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // States cho Product Add/Edit dialog
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<AffiliateProduct | null>(null);
    const [formName, setFormName] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formCategory, setFormCategory] = useState("Top");
    const [formPrice, setFormPrice] = useState("");
    const [formOriginalPrice, setFormOriginalPrice] = useState("");
    const [formImageUrl, setFormImageUrl] = useState("");
    const [formAffiliateLink, setFormAffiliateLink] = useState("");
    const [formShopeeProductId, setFormShopeeProductId] = useState("");
    const [formShopeeShopId, setFormShopeeShopId] = useState("");
    const [formIsTrending, setFormIsTrending] = useState(false);
    const [formIsActive, setFormIsActive] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [bgRemovalLoading, setBgRemovalLoading] = useState(false);
    const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);

    // CSV Import states
    const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
    const [csvUploading, setCsvUploading] = useState(false);
    
    // States cho Brand Partner
    const [brands, setBrands] = useState<BrandPartner[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [brandsError, setBrandsError] = useState<string | null>(null);
    const [brandSearch, setBrandSearch] = useState("");
    const [brandStatusFilter, setBrandStatusFilter] = useState("all");

    // States cho Nạp tiền quảng cáo
    const [creditModalOpen, setCreditModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandPartner | null>(null);
    const [depositAmount, setDepositAmount] = useState("");
    const [depositDesc, setDepositDesc] = useState("");
    const [depositLoading, setDepositLoading] = useState(false);
    const [depositError, setDepositError] = useState<string | null>(null);

    const fetchProducts = async (page = 1) => {
        setLoadingProducts(true);
        try {
            const apiCategory = categoryFilter === "all" ? undefined : categoryFilter;
            const data = await getAdminProducts({
                page,
                pageSize: 10,
                search: searchTerm || undefined,
                category: apiCategory,
            });
            setProducts(data.items || []);
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.page || 1);
        } catch (err: any) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleOpenAddDialog = () => {
        setEditingProduct(null);
        setFormName("");
        setFormDescription("");
        setFormCategory("Top");
        setFormPrice("");
        setFormOriginalPrice("");
        setFormImageUrl("");
        setFormAffiliateLink("");
        setFormShopeeProductId("");
        setFormShopeeShopId("");
        setFormIsTrending(false);
        setFormIsActive(true);
        setProductDialogOpen(true);
    };

    const handleOpenEditDialog = async (product: AffiliateProduct) => {
        setActionLoading(true);
        try {
            const detail = await getAdminProductDetail(product.id);
            setEditingProduct(detail);
            setFormName(detail.name || "");
            setFormDescription(detail.description || "");
            setFormCategory(detail.category || "Top");
            setFormPrice(String(detail.price));
            setFormOriginalPrice(detail.originalPrice ? String(detail.originalPrice) : "");
            setFormImageUrl(detail.imageUrl || "");
            setFormAffiliateLink(detail.affiliateLink || "");
            setFormShopeeProductId(detail.shopeeProductId || "");
            setFormShopeeShopId(detail.shopeeShopId || "");
            setFormIsTrending(detail.isTrending);
            setFormIsActive(detail.isActive);
            setProductDialogOpen(true);
        } catch (err: any) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", err);
            alert(`Lỗi khi tải thông tin chi tiết: ${err.message || err}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setBgRemovalLoading(true);
        setBgRemovalError(null);
        try {
            const res = await removeBgAndUploadProductImage(file);
            setFormImageUrl(res.imageUrl);
            alert("Tách nền và tải lên Cloud thành công!");
        } catch (err: any) {
            console.error("Lỗi tách nền/tải ảnh:", err);
            setBgRemovalError(err.message || err.toString());
            alert(`Lỗi tách nền: ${err.message || err}`);
        } finally {
            setBgRemovalLoading(false);
            e.target.value = "";
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(formPrice);
        const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : null;
        if (isNaN(priceNum) || priceNum < 0) {
            alert("Vui lòng nhập giá bán hợp lệ.");
            return;
        }

        setActionLoading(true);
        try {
            if (editingProduct) {
                await updateAdminProduct(editingProduct.id, {
                    name: formName,
                    description: formDescription || null,
                    category: formCategory,
                    price: priceNum,
                    originalPrice: origPriceNum,
                    imageUrl: formImageUrl,
                    affiliateLink: formAffiliateLink,
                    isTrending: formIsTrending,
                    isActive: formIsActive
                });
                alert("Đã cập nhật sản phẩm thành công!");
            } else {
                await createAdminProduct({
                    name: formName,
                    description: formDescription || null,
                    category: formCategory,
                    price: priceNum,
                    originalPrice: origPriceNum,
                    imageUrl: formImageUrl,
                    affiliateLink: formAffiliateLink,
                    shopeeProductId: formShopeeProductId || null,
                    shopeeShopId: formShopeeShopId || null,
                    isTrending: formIsTrending,
                    isActive: formIsActive
                });
                alert("Đã thêm sản phẩm mới thành công!");
            }
            setProductDialogOpen(false);
            fetchProducts(currentPage);
        } catch (err: any) {
            console.error("Lỗi khi lưu sản phẩm:", err);
            alert(`Lỗi khi lưu sản phẩm: ${err.message || err}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa mềm sản phẩm này không (chuyển sang trạng thái ẩn)?")) {
            return;
        }
        try {
            await deleteAdminProduct(id);
            alert("Đã xóa sản phẩm thành công!");
            fetchProducts(currentPage);
        } catch (err: any) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            alert(`Lỗi khi xóa: ${err.message || err}`);
        }
    };

    const handleImportCsv = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCsvFile) {
            alert("Vui lòng chọn một tệp CSV.");
            return;
        }
        setCsvUploading(true);
        try {
            await importAffiliateConversions(selectedCsvFile);
            alert("Đã tải lên và nhập dữ liệu đối soát Shopee Affiliate thành công!");
            setSelectedCsvFile(null);
        } catch (err: any) {
            console.error("Lỗi khi import CSV đối soát:", err);
            alert(`Lỗi khi tải tệp CSV: ${err.message || err}`);
        } finally {
            setCsvUploading(false);
        }
    };

    const fetchBrands = async (status?: string, search?: string) => {
        setBrandsLoading(true);
        setBrandsError(null);
        try {
            const apiStatus = status === "all" ? undefined : status;
            const data = await getAdminBrands({
                status: apiStatus,
                search: search || undefined
            });
            setBrands(data || []);
        } catch (err: any) {
            console.error("Lỗi khi tải danh sách đối tác thương hiệu:", err);
            setBrandsError(err.message || "Không thể tải danh sách đối tác thương hiệu.");
        } finally {
            setBrandsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "brands") {
            fetchBrands(brandStatusFilter, brandSearch);
        } else if (activeTab === "products") {
            fetchProducts(1);
        }
    }, [activeTab, statusFilter, categoryFilter, brandStatusFilter]);

    const handleSearchBrands = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBrands(brandStatusFilter, brandSearch);
    };

    const handleUpdateBrandStatus = async (brandId: string, newStatus: string) => {
        try {
            await updateBrandStatus(brandId, {
                status: newStatus,
                notes: `Cập nhật trạng thái đối tác sang ${newStatus} bởi Admin.`
            });
            setBrands(prev => prev.map(b => b.brandId === brandId ? { ...b, status: newStatus } : b));
        } catch (err: any) {
            console.error("Lỗi khi cập nhật trạng thái đối tác thương hiệu:", err);
            alert(`Lỗi khi cập nhật trạng thái đối tác thương hiệu: ${err.message || err}`);
        }
    };

    const handleDepositCredit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBrand) return;
        const amt = parseFloat(depositAmount.replace(/,/g, ""));
        if (isNaN(amt) || amt <= 0) {
            setDepositError("Vui lòng nhập số tiền nạp hợp lệ lớn hơn 0.");
            return;
        }
        setDepositLoading(true);
        setDepositError(null);
        try {
            await depositBrandCredit(selectedBrand.brandId, {
                amount: amt,
                description: depositDesc || undefined
            });
            
            setBrands(prev => prev.map(b => 
                b.brandId === selectedBrand.brandId 
                    ? { ...b, creditBalance: b.creditBalance + amt } 
                    : b
            ));
            
            alert(`Đã nạp ${amt.toLocaleString("vi-VN")} đ vào tài khoản quảng cáo thành công!`);
            setCreditModalOpen(false);
            setSelectedBrand(null);
            setDepositAmount("");
            setDepositDesc("");
        } catch (err: any) {
            console.error("Lỗi khi nạp tiền quảng cáo:", err);
            setDepositError(err.message || "Không thể nạp tiền quảng cáo.");
        } finally {
            setDepositLoading(false);
        }
    };
    
    // States cho Crawler (Mock)
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

    const handleToggleStatus = async (id: string, currentIsTrending: boolean, currentIsActive: boolean) => {
        try {
            let nextIsTrending = currentIsTrending;
            let nextIsActive = currentIsActive;

            // Cycle: Public -> Pinned -> Hidden -> Public
            if (currentIsActive && !currentIsTrending) {
                nextIsTrending = true; // Pin it
            } else if (currentIsActive && currentIsTrending) {
                nextIsTrending = false;
                nextIsActive = false; // Hide it
            } else {
                nextIsActive = true; // Make it public
            }

            await updateAdminProduct(id, {
                isTrending: nextIsTrending,
                isActive: nextIsActive
            });
            fetchProducts(currentPage);
        } catch (err: any) {
            console.error("Lỗi khi đổi trạng thái sản phẩm:", err);
            alert(`Lỗi khi đổi trạng thái: ${err.message || err}`);
        }
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
            fetchProducts(1);
        }, 3000);
    };

    const filteredProducts = products.filter(product => {
        const matchesStatus = statusFilter === "all" || 
                              (statusFilter === "pinned" && product.isTrending) ||
                              (statusFilter === "public" && product.isActive && !product.isTrending) ||
                              (statusFilter === "hidden" && !product.isActive);
        return matchesStatus;
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
                    Danh sách sản phẩm Shopee ({totalCount})
                </button>
                <button
                    onClick={() => setActiveTab("crawler")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "crawler"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Cấu hình Crawler & Đối soát
                </button>
                <button
                    onClick={() => setActiveTab("brands")}
                    className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === "brands"
                            ? "border-[#4a3728] text-[#4a3728]"
                            : "border-transparent text-muted-foreground hover:text-[#4a3728]"
                    }`}
                >
                    Đối tác Brand Partner
                </button>
            </div>

            {/* TAB 1: DANH SÁCH SẢN PHẨM */}
            {activeTab === "products" && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4 items-center bg-card p-4 rounded-xl border border-muted shadow-sm">
                        <div className="md:col-span-2 relative flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="pl-8 bg-background border-muted"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            fetchProducts(1);
                                        }
                                    }}
                                />
                            </div>
                            <Button onClick={() => fetchProducts(1)} className="bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                                Tìm
                            </Button>
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
                        <Button onClick={handleOpenAddDialog} className="w-full bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                            <Plus className="w-4 h-4 mr-2" /> Thêm sản phẩm thủ công
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-card shadow-sm overflow-x-auto border-muted">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-24">Sản phẩm</TableHead>
                                    <TableHead>Tên sản phẩm / Shop</TableHead>
                                    <TableHead className="text-right">Giá gốc</TableHead>
                                    <TableHead className="text-center">Thể loại</TableHead>
                                    <TableHead className="text-center">Số Click / Kéo thả</TableHead>
                                    <TableHead className="text-center">CTR %</TableHead>
                                    <TableHead className="text-center">Trạng thái</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingProducts ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="w-8 h-8 text-[#4a3728] animate-spin" />
                                                <span className="text-sm text-muted-foreground">Đang tải danh sách sản phẩm...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredProducts.length === 0 ? (
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
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.name || ""}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground font-bold">No Image</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm line-clamp-1 text-foreground">
                                                        {product.name}
                                                    </span>
                                                    {product.description && (
                                                        <span className="text-xs text-muted-foreground line-clamp-1 italic mt-0.5" title={product.description}>
                                                            {product.description}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                        Shop: {product.shopeeShopId || "Shopee Partner"}
                                                        {product.affiliateLink && (
                                                            <a href={product.affiliateLink} target="_blank" rel="noreferrer" className="text-[#4a3728] hover:underline">
                                                                <ExternalLink className="w-3 h-3 inline" />
                                                            </a>
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-semibold">
                                                {product.price.toLocaleString("vi-VN")} đ
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-orange-50 text-orange-800 hover:bg-orange-100 border-none font-medium text-xs">
                                                    {product.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-sm font-semibold flex items-center gap-1">
                                                        <MousePointerClick className="w-3.5 h-3.5 text-blue-500" /> {product.clicks ?? 0}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground mt-0.5">
                                                        Kéo thả Canvas: {product.canvasTries ?? 0}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-semibold text-sm text-[#4a3728]">
                                                {product.ctr ?? 0}%
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={`font-normal ${
                                                        product.isTrending
                                                            ? "bg-[#4a3728] text-white hover:bg-[#3d2d21]"
                                                            : product.isActive
                                                            ? "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
                                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {product.isTrending && <Pin className="w-2.5 h-2.5 mr-1 inline" />}
                                                    {product.isTrending ? "Pinned" : product.isActive ? "Public" : "Hidden"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleToggleStatus(product.id, product.isTrending, product.isActive)}
                                                        title="Đổi trạng thái Ghim/Công khai/Ẩn"
                                                    >
                                                        <Pin className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-[#4a3728]"
                                                        onClick={() => handleOpenEditDialog(product)}
                                                        title="Sửa thông tin sản phẩm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDeleteProduct(product.id)}
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

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1 || loadingProducts}
                                onClick={() => fetchProducts(currentPage - 1)}
                                className="border-muted hover:bg-muted/10 text-xs"
                            >
                                Trang trước
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages || loadingProducts}
                                onClick={() => fetchProducts(currentPage + 1)}
                                className="border-muted hover:bg-muted/10 text-xs"
                            >
                                Trang sau
                            </Button>
                        </div>
                    )}
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
                    <Card className="md:col-span-1 shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-[#4a3728] flex items-center gap-2 text-lg">
                                <RefreshCw className="w-5 h-5" /> Cài đặt & Chạy thử
                            </CardTitle>
                            <CardDescription>
                                Điều chỉnh tần suất chạy tác vụ nền (Background Jobs) và thực thi crawler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                        </CardContent>
                        <CardFooter>
                            <Button
                                disabled={isCrawling}
                                onClick={handleStartCrawl}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                <Play className="w-4 h-4 mr-2" /> {isCrawling ? "Đang đồng bộ..." : "Kích hoạt cào ngay"}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Đối soát Shopee Affiliate CSV */}
                    <Card className="md:col-span-1 shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-[#4a3728] flex items-center gap-2 text-lg">
                                <Database className="w-5 h-5 text-orange-500" /> Đối soát Shopee Affiliate
                            </CardTitle>
                            <CardDescription>
                                Tải lên tệp CSV chứa danh sách đơn hàng đối soát từ Shopee Affiliate để cập nhật hoa hồng.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleImportCsv}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                                        Chọn tệp CSV đối soát
                                    </label>
                                    <Input
                                        type="file"
                                        accept=".csv"
                                        className="bg-background border-muted text-sm cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#4a3728] file:text-white hover:file:bg-[#3d2d21]"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setSelectedCsvFile(e.target.files[0]);
                                            }
                                        }}
                                        required
                                    />
                                    {selectedCsvFile && (
                                        <p className="text-xs text-emerald-600 font-medium mt-1">
                                            Đã chọn: {selectedCsvFile.name} ({(selectedCsvFile.size / 1024).toFixed(1)} KB)
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    disabled={csvUploading || !selectedCsvFile}
                                    className="w-full bg-[#4a3728] hover:bg-[#3d2d21] text-white"
                                >
                                    {csvUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Đang tải lên...
                                        </>
                                    ) : (
                                        "Tải lên đối soát"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}

            {/* TAB 3: ĐỐI TÁC BRAND PARTNER */}
            {activeTab === "brands" && (
                <div className="space-y-6">
                    {/* Thanh lọc & tìm kiếm */}
                    <form onSubmit={handleSearchBrands} className="grid gap-4 md:grid-cols-4 items-center bg-card p-4 rounded-xl border border-muted shadow-sm">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm theo tên thương hiệu, đại diện, email..."
                                className="pl-8 bg-background border-muted text-sm"
                                value={brandSearch}
                                onChange={(e) => setBrandSearch(e.target.value)}
                            />
                        </div>
                        <Select value={brandStatusFilter} onValueChange={setBrandStatusFilter}>
                            <SelectTrigger className="bg-background border-muted">
                                <SelectValue placeholder="Trạng thái duyệt" />
                            </SelectTrigger>
                            <SelectContent className="bg-card">
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="Pending">Chờ duyệt (Pending)</SelectItem>
                                <SelectItem value="Verified">Đã xác thực (Verified)</SelectItem>
                                <SelectItem value="Suspended">Đã đình chỉ (Suspended)</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button type="submit" className="w-full bg-[#4a3728] hover:bg-[#3d2d21] text-white">
                                <Search className="w-4 h-4 mr-2" /> Tìm kiếm
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-muted hover:bg-muted/10 text-muted-foreground"
                                onClick={() => fetchBrands(brandStatusFilter, brandSearch)}
                                title="Tải lại danh sách"
                            >
                                <RefreshCw className={`w-4 h-4 ${brandsLoading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    </form>

                    {/* Hiển thị lỗi nếu có */}
                    {brandsError && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-rose-800">Không thể tải dữ liệu</p>
                                <p className="text-rose-600 mt-0.5 leading-relaxed text-xs">{brandsError}</p>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-rose-700 hover:text-rose-800 text-xs font-semibold mt-2 underline"
                                    onClick={() => fetchBrands(brandStatusFilter, brandSearch)}
                                >
                                    Thử lại ngay
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Bảng danh sách */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-x-auto border-muted">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-64">Đối tác / Thương hiệu</TableHead>
                                    <TableHead>Thông tin liên hệ</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead className="text-right">Số dư quảng cáo</TableHead>
                                    <TableHead className="text-center">Trạng thái</TableHead>
                                    <TableHead className="text-center">Ngày đăng ký</TableHead>
                                    <TableHead className="text-right">Thao tác duyệt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brandsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Loader2 className="w-8 h-8 text-[#4a3728] animate-spin" />
                                                <span className="text-sm text-muted-foreground font-medium">Đang tải danh sách đối tác thương hiệu...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : brands.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                                <Building2 className="w-12 h-12 text-muted-foreground/50 stroke-[1.5]" />
                                                <div className="text-sm font-semibold">Không tìm thấy đối tác thương hiệu nào</div>
                                                <p className="text-xs max-w-xs leading-relaxed text-muted-foreground/80">
                                                    Danh sách trống hoặc không khớp với bộ lọc trạng thái "<strong>{brandStatusFilter}</strong>".
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    brands.map((brand) => (
                                        <TableRow key={brand.brandId} className="hover:bg-muted/10 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-11 h-11 rounded-full overflow-hidden border bg-muted flex items-center justify-center text-[#4a3728] font-bold text-sm shrink-0 shadow-inner">
                                                        {brand.logoUrl ? (
                                                            <img src={brand.logoUrl} alt={brand.brandName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            brand.brandName.substring(0, 2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-sm text-foreground truncate">
                                                            {brand.brandName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
                                                            Đại diện: {brand.userDisplayName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        {brand.userEmail}
                                                    </span>
                                                    {brand.contactPhone && (
                                                        <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                            {brand.contactPhone}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {brand.websiteUrl ? (
                                                    <a
                                                        href={brand.websiteUrl.startsWith("http") ? brand.websiteUrl : `https://${brand.websiteUrl}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-[#4a3728] hover:underline font-semibold flex items-center gap-1 hover:text-[#3d2d21] transition-colors"
                                                    >
                                                        <Globe className="w-3.5 h-3.5" />
                                                        {brand.websiteUrl.replace(/https?:\/\/(www\.)?/, "")}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/60 italic">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-semibold text-emerald-600">
                                                {brand.creditBalance.toLocaleString("vi-VN")} đ
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={`font-medium border text-xs px-2.5 py-1 ${
                                                        brand.status === "Verified"
                                                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100/70"
                                                            : brand.status === "Pending"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70"
                                                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70"
                                                    }`}
                                                >
                                                    {brand.status === "Verified" && <Check className="w-3 h-3 mr-1 inline stroke-[2.5]" />}
                                                    {brand.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                                <span className="flex items-center justify-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(brand.createdAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 flex-wrap max-w-xs ml-auto">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-[#4a3728]/20 hover:bg-[#4a3728]/5 text-[#4a3728] font-medium text-xs px-2.5 flex items-center gap-1.5 transition-all shadow-sm"
                                                        onClick={() => {
                                                            setSelectedBrand(brand);
                                                            setCreditModalOpen(true);
                                                            setDepositAmount("");
                                                            setDepositDesc("");
                                                            setDepositError(null);
                                                        }}
                                                        title="Nạp tiền quảng cáo"
                                                    >
                                                        <Coins className="w-3.5 h-3.5 text-amber-600" /> Nạp tiền
                                                    </Button>
                                                    {brand.status === "Pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-green-600 hover:bg-green-700 text-white font-medium text-xs px-3 shadow-sm flex items-center gap-1"
                                                                onClick={() => handleUpdateBrandStatus(brand.brandId, "Verified")}
                                                            >
                                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Duyệt
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 border-rose-200 hover:bg-rose-50 text-rose-600 font-medium text-xs px-3"
                                                                onClick={() => handleUpdateBrandStatus(brand.brandId, "Suspended")}
                                                            >
                                                                Từ chối
                                                            </Button>
                                                        </>
                                                    )}
                                                    {brand.status === "Verified" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-rose-100 hover:bg-rose-50 text-rose-600 font-medium text-xs px-2.5 flex items-center gap-1 transition-all"
                                                            onClick={() => handleUpdateBrandStatus(brand.brandId, "Suspended")}
                                                            title="Đình chỉ đối tác hoạt động"
                                                        >
                                                            <X className="w-3.5 h-3.5" /> Đình chỉ
                                                        </Button>
                                                    )}
                                                    {brand.status === "Suspended" && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-[#4a3728] hover:bg-[#3d2d21] text-white font-medium text-xs px-3 flex items-center gap-1 transition-all"
                                                            onClick={() => handleUpdateBrandStatus(brand.brandId, "Verified")}
                                                            title="Kích hoạt lại đối tác"
                                                        >
                                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Kích hoạt lại
                                                        </Button>
                                                    )}
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

            {/* Modal Nạp tiền quảng cáo */}
            <Dialog open={creditModalOpen} onOpenChange={setCreditModalOpen}>
                <DialogContent className="sm:max-w-md bg-card border border-muted shadow-lg text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4a3728] font-bold text-lg">
                            <Coins className="w-5 h-5 text-amber-500" /> Nạp tiền quảng cáo
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDepositCredit} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Đối tác nhận
                            </label>
                            <div className="p-3 bg-muted/20 border border-muted rounded-xl flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[#4a3728] font-bold text-xs shrink-0">
                                    {selectedBrand?.logoUrl ? (
                                        <img src={selectedBrand.logoUrl} alt={selectedBrand.brandName} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedBrand?.brandName.substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{selectedBrand?.brandName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Số dư hiện tại: <span className="font-semibold text-emerald-600">{selectedBrand?.creditBalance.toLocaleString("vi-VN")} đ</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                                Số tiền nạp (VND)
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Ví dụ: 30000"
                                    className="bg-background border-muted text-sm font-semibold pr-10"
                                    value={depositAmount}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        if (val) {
                                            setDepositAmount(Number(val).toLocaleString("en-US"));
                                        } else {
                                            setDepositAmount("");
                                        }
                                    }}
                                    required
                                />
                                <span className="absolute right-3 top-2.5 text-xs font-semibold text-muted-foreground">đ</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                                Mô tả / Lý do nạp tiền
                            </label>
                            <Input
                                placeholder="Ví dụ: Nạp tiền quảng cáo chạy chiến dịch hè..."
                                className="bg-background border-muted text-sm"
                                value={depositDesc}
                                onChange={(e) => setDepositDesc(e.target.value)}
                            />
                        </div>

                        {depositError && (
                            <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">{depositError}</p>
                        )}

                        <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                            <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9" onClick={() => setCreditModalOpen(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" className="bg-[#4a3728] hover:bg-[#3d2d21] text-white text-xs h-9" disabled={depositLoading}>
                                {depositLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : "Xác nhận nạp tiền"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Thêm/Sửa sản phẩm */}
            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogContent className="sm:max-w-lg bg-card border border-muted shadow-lg text-foreground max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#4a3728] font-bold text-lg">
                            {editingProduct ? "Cập nhật sản phẩm Affiliate" : "Thêm sản phẩm Affiliate mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProduct ? "Chỉnh sửa thông tin chi tiết của sản phẩm tiếp thị liên kết Shopee." : "Tạo mới sản phẩm tiếp thị liên kết Shopee hiển thị trên hệ thống."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 col-span-2">
                                <Label>Tên sản phẩm *</Label>
                                <Input
                                    placeholder="Ví dụ: Áo khoác Cardigan len tăm dáng rộng..."
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label>Thể loại *</Label>
                                <Select value={formCategory} onValueChange={setFormCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thể loại" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card">
                                        <SelectItem value="Top">Top (Áo)</SelectItem>
                                        <SelectItem value="Bottom">Bottom (Quần/Váy)</SelectItem>
                                        <SelectItem value="Dress">Dress (Đầm)</SelectItem>
                                        <SelectItem value="Outerwear">Outerwear (Áo khoác)</SelectItem>
                                        <SelectItem value="Shoes">Shoes (Giày dép)</SelectItem>
                                        <SelectItem value="Bag">Bag (Túi xách)</SelectItem>
                                        <SelectItem value="Accessory">Accessory (Phụ kiện)</SelectItem>
                                        <SelectItem value="Other">Other (Khác)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5 col-span-2">
                                <Label>Đường dẫn ảnh sản phẩm *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={formImageUrl}
                                        onChange={(e) => setFormImageUrl(e.target.value)}
                                        required
                                        className="flex-1"
                                    />
                                    <div className="relative shrink-0 w-44">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={bgRemovalLoading}
                                            onChange={handleRemoveBgUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            title="Tải ảnh và tách nền"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full text-xs h-9 border-[#4a3728]/35 text-[#4a3728] hover:bg-[#4a3728]/5 flex items-center justify-center gap-1"
                                            disabled={bgRemovalLoading}
                                        >
                                            {bgRemovalLoading ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <>Tách nền & Tải lên S3</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                {bgRemovalError && (
                                    <p className="text-[10px] text-destructive mt-0.5">{bgRemovalError}</p>
                                )}
                                {formImageUrl && (
                                    <div className="mt-2 relative w-16 h-16 rounded border bg-muted/20 flex items-center justify-center overflow-hidden">
                                        <img src={formImageUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => setFormImageUrl("")}
                                            className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                                             title="Xóa ảnh"
                                         >

                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Giá bán (VND) *</Label>
                                <Input
                                    type="number"
                                    placeholder="Ví dụ: 150000"
                                    value={formPrice}
                                    onChange={(e) => setFormPrice(e.target.value)}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Giá gốc (VND) - nếu có</Label>
                                <Input
                                    type="number"
                                    placeholder="Ví dụ: 200000"
                                    value={formOriginalPrice}
                                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                                    min="0"
                                />
                            </div>

                            <div className="space-y-1.5 col-span-2">
                                <Label>Đường dẫn liên kết Shopee (Affiliate Link) *</Label>
                                <Input
                                    placeholder="https://shope.ee/..."
                                    value={formAffiliateLink}
                                    onChange={(e) => setFormAffiliateLink(e.target.value)}
                                    required
                                />
                            </div>

                             <div className="space-y-1.5 col-span-2">
                                 <Label>Mô tả sản phẩm</Label>
                                 <textarea
                                     placeholder="Nhập mô tả sản phẩm..."
                                     value={formDescription}
                                     onChange={(e) => setFormDescription(e.target.value)}
                                     className="flex min-h-[80px] w-full rounded-md border border-[#4a3728]/25 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a3728]/35 disabled:cursor-not-allowed disabled:opacity-50"
                                 />
                             </div>

                            {!editingProduct && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label>Shopee Product ID (Tùy chọn)</Label>
                                        <Input
                                            placeholder="Ví dụ: 123456789"
                                            value={formShopeeProductId}
                                            onChange={(e) => setFormShopeeProductId(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Shopee Shop ID (Tùy chọn)</Label>
                                        <Input
                                            placeholder="Ví dụ: 987654321"
                                            value={formShopeeShopId}
                                            onChange={(e) => setFormShopeeShopId(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center space-x-2 pt-2 col-span-2">
                                <input
                                    type="checkbox"
                                    id="formIsTrending"
                                    checked={formIsTrending}
                                    onChange={(e) => setFormIsTrending(e.target.checked)}
                                    className="rounded border-muted text-[#4a3728] focus:ring-[#4a3728] h-4 w-4"
                                />
                                <Label htmlFor="formIsTrending" className="cursor-pointer">Ghim sản phẩm (Trending)</Label>
                            </div>

                            <div className="flex items-center space-x-2 pt-2 col-span-2">
                                <input
                                    type="checkbox"
                                    id="formIsActive"
                                    checked={formIsActive}
                                    onChange={(e) => setFormIsActive(e.target.checked)}
                                    className="rounded border-muted text-[#4a3728] focus:ring-[#4a3728] h-4 w-4"
                                />
                                <Label htmlFor="formIsActive" className="cursor-pointer">Công khai hiển thị (Active)</Label>
                            </div>
                        </div>

                        <DialogFooter className="flex items-center gap-2 justify-end border-t border-muted pt-4">
                            <Button type="button" variant="outline" className="border-muted hover:bg-muted/10 text-xs h-9" onClick={() => setProductDialogOpen(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" className="bg-[#4a3728] hover:bg-[#3d2d21] text-white text-xs h-9" disabled={actionLoading}>
                                {actionLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : "Xác nhận lưu"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
