import { useState, useEffect } from "react";
import { getAdminTierConfigs, updateAdminTierConfig } from "@/lib/api";
import {
    Sparkles,
    Cpu,
    Coins,
    TrendingUp,
    Eye,
    EyeOff,
    Save,
    Key,
    AlertTriangle,
    CheckCircle2,
    UserCheck,
    Lock,
    Unlock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

// Mockup dữ liệu hoạt động gọi API trong 7 ngày gần nhất
const apiCallData = [
    { name: "T.Hai", photoroom: 120, fashn: 80 },
    { name: "T.Ba", photoroom: 150, fashn: 95 },
    { name: "T.Tư", photoroom: 210, fashn: 140 },
    { name: "T.Năm", photoroom: 180, fashn: 110 },
    { name: "T.Sáu", photoroom: 310, fashn: 240 },
    { name: "T.Bảy", photoroom: 450, fashn: 380 },
    { name: "C.Nhật", photoroom: 380, fashn: 310 },
];

export function AIConfig() {
    // API Keys visibility states
    const [showPhotoKey, setShowPhotoKey] = useState(false);
    const [showFashnKey, setShowFashnKey] = useState(false);
    
    // API key values
    const [photoKey, setPhotoKey] = useState("pr_live_45a7b8c9d0e1f2a3b4c5d6e7f8");
    const [fashnKey, setFashnKey] = useState("fashn_sk_90a1b2c3d4e5f6a7b8c9d0e1f2");

    // Hạn ngạch (User Quotas) - Free Tier
    const [freeWardrobeLimit, setFreeWardrobeLimit] = useState<number | "">("");
    const [freeOutfitLimit, setFreeOutfitLimit] = useState<number | "">("");
    const [freeBgCredits, setFreeBgCredits] = useState<number>(0);
    const [freeTryOnCredits, setFreeTryOnCredits] = useState<number>(0);

    // Hạn ngạch (User Quotas) - Premium Tier
    const [premiumWardrobeLimit, setPremiumWardrobeLimit] = useState<number | "">("");
    const [premiumOutfitLimit, setPremiumOutfitLimit] = useState<number | "">("");
    const [premiumBgCredits, setPremiumBgCredits] = useState<number>(0);
    const [premiumTryOnCredits, setPremiumTryOnCredits] = useState<number>(0);

    const [isSavingKeys, setIsSavingKeys] = useState(false);
    const [isSavingQuotas, setIsSavingQuotas] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch configurations on mount
    useEffect(() => {
        let isMounted = true;
        async function fetchTierConfigs() {
            try {
                const configs = await getAdminTierConfigs();
                if (!isMounted) return;
                
                const free = configs.find(c => c.tierName === "free");
                if (free) {
                    setFreeWardrobeLimit(free.wardrobeItemLimit ?? "");
                    setFreeOutfitLimit(free.outfitLimit ?? "");
                    setFreeBgCredits(free.bgRemovalCredits);
                    setFreeTryOnCredits(free.tryOnCredits);
                }
                
                const premium = configs.find(c => c.tierName === "premium");
                if (premium) {
                    setPremiumWardrobeLimit(premium.wardrobeItemLimit ?? "");
                    setPremiumOutfitLimit(premium.outfitLimit ?? "");
                    setPremiumBgCredits(premium.bgRemovalCredits);
                    setPremiumTryOnCredits(premium.tryOnCredits);
                }
            } catch (err) {
                console.error("Lỗi khi tải cấu hình hạn ngạch:", err);
            }
        }
        fetchTierConfigs();
        return () => { isMounted = false; };
    }, []);

    const handleSaveKeys = () => {
        setIsSavingKeys(true);
        setTimeout(() => {
            setIsSavingKeys(false);
            showToast("Đã lưu cấu hình API Keys thành công!");
        }, 1500);
    };

    const handleSaveQuotas = async () => {
        setIsSavingQuotas(true);
        try {
            // Save Free Tier
            await updateAdminTierConfig("free", {
                bgRemovalCredits: freeBgCredits,
                tryOnCredits: freeTryOnCredits,
                wardrobeItemLimit: freeWardrobeLimit === "" ? null : Number(freeWardrobeLimit),
                outfitLimit: freeOutfitLimit === "" ? null : Number(freeOutfitLimit)
            });

            // Save Premium Tier
            await updateAdminTierConfig("premium", {
                bgRemovalCredits: premiumBgCredits,
                tryOnCredits: premiumTryOnCredits,
                wardrobeItemLimit: premiumWardrobeLimit === "" ? null : Number(premiumWardrobeLimit),
                outfitLimit: premiumOutfitLimit === "" ? null : Number(premiumOutfitLimit)
            });

            showToast("Đã cập nhật hạn ngạch người dùng thành công!");
        } catch (err: any) {
            console.error("Lỗi khi cập nhật hạn ngạch:", err);
            alert(err.message || "Đã xảy ra lỗi khi cập nhật hạn ngạch.");
        } finally {
            setIsSavingQuotas(false);
        }
    };

    const showToast = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728]">Cấu hình AI & Hệ thống API</h2>
                    <p className="text-muted-foreground mt-1">
                        Quản lý chi phí gọi API, cấu hình hạn ngạch tính năng thông minh của tài khoản người dùng.
                    </p>
                </div>
                {successMessage && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-none py-1.5 px-3 flex items-center gap-1.5 animate-bounce">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {successMessage}
                    </Badge>
                )}
            </div>

            {/* Hàng 1: Thống kê số dư & Chi phí API */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Photoroom Credit Info */}
                <Card className="shadow-sm border-muted">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-semibold text-foreground">API Tách nền (Photoroom)</CardTitle>
                        <Cpu className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-blue-600">8,240 <span className="text-sm text-muted-foreground font-normal">lượt</span></div>
                        <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Đủ dùng cho ~45 ngày tiếp theo
                        </div>
                        <Separator className="my-3 border-muted" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Chi phí mỗi lượt tách nền:</span>
                            <span className="font-semibold text-foreground font-mono">$0.02 (0.5k đ)</span>
                        </div>
                    </CardContent>
                </Card>

                {/* FASHN AI Credit Info */}
                <Card className="shadow-sm border-muted">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-semibold text-foreground">API Phối đồ AI (FASHN AI)</CardTitle>
                        <Sparkles className="w-4 h-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-purple-600">$145.20</div>
                        <div className="flex items-center mt-2 text-xs text-amber-500 font-medium">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Số dư còn trung bình, đề xuất nạp thêm
                        </div>
                        <Separator className="my-3 border-muted" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Chi phí mỗi lượt Try-on:</span>
                            <span className="font-semibold text-foreground font-mono">$0.05 (1.2k đ)</span>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Cost Summary Card */}
                <Card className="shadow-sm border-muted bg-[#4a3728]/5 border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-semibold text-[#4a3728]">Tạm tính chi phí AI tháng này</CardTitle>
                        <Coins className="w-4 h-4 text-[#4a3728]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-[#4a3728]">$312.80</div>
                        <div className="flex items-center mt-2 text-xs text-[#4a3728]/70">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Tăng 14.5% so với tháng trước
                        </div>
                        <Separator className="my-3 border-[#4a3728]/10" />
                        <div className="flex justify-between text-xs text-[#4a3728]/80">
                            <span>Tách nền: $92.40</span>
                            <span>Phối đồ AI: $220.40</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 2: Biểu đồ cuộc gọi & Quản lý Hạn ngạch (Quota) */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Cột 1 & 2: Biểu đồ gọi API trong tuần */}
                <Card className="md:col-span-2 shadow-sm border-muted">
                    <CardHeader>
                        <CardTitle className="text-[#4a3728] text-lg">Biểu đồ lượt gọi API trong tuần</CardTitle>
                        <CardDescription>
                            So sánh tần suất hoạt động của API Photoroom (Tách nền tủ đồ) vs FASHN AI (Thử đồ trực quan).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={apiCallData}>
                                    <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                                    <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", fontSize: "11px" }} />
                                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                                    <Bar dataKey="photoroom" name="Photoroom (Tách nền)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="fashn" name="FASHN AI (Phối đồ)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Cột 3: Quản lý Quotas (Hạn ngạch người dùng) */}
                <Card className="shadow-sm border-muted">
                    <CardHeader>
                        <CardTitle className="text-[#4a3728] text-lg flex items-center gap-2">
                            <UserCheck className="w-5 h-5" /> Hạn ngạch Thành viên
                        </CardTitle>
                        <CardDescription>
                            Điều chỉnh quyền lợi lưu trữ tủ đồ và giới hạn sử dụng AI Try-on để tối ưu hóa ngân sách API.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Free Tier */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-[#4a3728]/10 text-[#4a3728] border-none font-medium">Free Tier</Badge>
                                <span className="text-xs text-muted-foreground">Giới hạn tài khoản miễn phí</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Tủ đồ tối đa (Items)</label>
                                    <Input
                                        type="number"
                                        placeholder="Không giới hạn"
                                        value={freeWardrobeLimit}
                                        onChange={(e) => setFreeWardrobeLimit(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Phối đồ tối đa (Outfits)</label>
                                    <Input
                                        type="number"
                                        placeholder="Không giới hạn"
                                        value={freeOutfitLimit}
                                        onChange={(e) => setFreeOutfitLimit(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Lượt tách nền (Credits)</label>
                                    <Input
                                        type="number"
                                        value={freeBgCredits}
                                        onChange={(e) => setFreeBgCredits(Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Lượt thử đồ AI (Credits)</label>
                                    <Input
                                        type="number"
                                        value={freeTryOnCredits}
                                        onChange={(e) => setFreeTryOnCredits(Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="border-muted my-2" />

                        {/* Premium Tier */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-1.5">
                                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-white border-none font-medium">Premium Tier</Badge>
                                <span className="text-xs text-muted-foreground">Giới hạn tài khoản Premium</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Tủ đồ tối đa (Items)</label>
                                    <Input
                                        type="number"
                                        placeholder="Không giới hạn"
                                        value={premiumWardrobeLimit}
                                        onChange={(e) => setPremiumWardrobeLimit(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Phối đồ tối đa (Outfits)</label>
                                    <Input
                                        type="number"
                                        placeholder="Không giới hạn"
                                        value={premiumOutfitLimit}
                                        onChange={(e) => setPremiumOutfitLimit(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Lượt tách nền (Credits)</label>
                                    <Input
                                        type="number"
                                        value={premiumBgCredits}
                                        onChange={(e) => setPremiumBgCredits(Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Lượt thử đồ AI (Credits)</label>
                                    <Input
                                        type="number"
                                        value={premiumTryOnCredits}
                                        onChange={(e) => setPremiumTryOnCredits(Number(e.target.value))}
                                        className="bg-background border-muted h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-muted bg-muted/10 p-3.5 flex justify-end">
                        <Button
                            onClick={handleSaveQuotas}
                            disabled={isSavingQuotas}
                            className="bg-[#4a3728] hover:bg-[#3d2d21] text-white w-full sm:w-auto h-9 text-xs"
                        >
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            {isSavingQuotas ? "Đang lưu..." : "Lưu hạn ngạch"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Hàng 3: Cấu hình khóa API Keys */}
            <Card className="shadow-sm border-muted">
                <CardHeader>
                    <CardTitle className="text-[#4a3728] text-lg flex items-center gap-2">
                        <Key className="w-5 h-5" /> Cấu hình API Keys liên kết dịch vụ
                    </CardTitle>
                    <CardDescription>
                        Thiết lập các khoá API kết nối tới dịch vụ tách nền Photoroom và dịch vụ thử đồ Generative AI FASHN.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Photoroom Key */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-blue-500" /> Photoroom API Key
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPhotoKey ? "text" : "password"}
                                    value={photoKey}
                                    onChange={(e) => setPhotoKey(e.target.value)}
                                    className="bg-background border-muted pr-10 font-mono text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPhotoKey(!showPhotoKey)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    {showPhotoKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Sử dụng cho tính năng bóc tách nền của tủ đồ cá nhân và cào Shopee.
                            </p>
                        </div>

                        {/* FASHN AI Key */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> FASHN AI API Secret Key
                            </label>
                            <div className="relative">
                                <Input
                                    type={showFashnKey ? "text" : "password"}
                                    value={fashnKey}
                                    onChange={(e) => setFashnKey(e.target.value)}
                                    className="bg-background border-muted pr-10 font-mono text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowFashnKey(!showFashnKey)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    {showFashnKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Khoá bí mật dùng để sinh Lookbook AI Try-on 2D/3D lên mẫu người thật.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-muted bg-muted/10 p-4 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-green-600" /> Kết nối mã hóa SSL bảo mật an toàn.
                    </span>
                    <Button
                        onClick={handleSaveKeys}
                        disabled={isSavingKeys}
                        className="bg-[#4a3728] hover:bg-[#3d2d21] text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSavingKeys ? "Đang lưu..." : "Cập nhật API Keys"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
