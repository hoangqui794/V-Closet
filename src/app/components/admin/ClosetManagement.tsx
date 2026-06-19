import { useSearchParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { WardrobeManagement } from "./WardrobeManagement";
import { OutfitManagement } from "./OutfitManagement";
import { Shirt, Sparkles } from "lucide-react";

export function ClosetManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "wardrobes";

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value }, { replace: true });
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins text-foreground w-full">
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#4a3728] flex items-center gap-2">
                        <Shirt className="w-8 h-8" /> Quản lý Tủ đồ & Phối đồ
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Quản lý toàn bộ hình ảnh tủ đồ thành viên và các bộ phối đồ tự thiết kế của người dùng.
                    </p>
                </div>
                <TabsList className="bg-stone-100 p-[3px] border border-stone-200/60 shrink-0">
                    <TabsTrigger value="wardrobes" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <Shirt className="w-3.5 h-3.5" />
                        Tủ đồ thành viên
                    </TabsTrigger>
                    <TabsTrigger value="outfits" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Bộ phối đồ
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="wardrobes" className="outline-none mt-0">
                <WardrobeManagement showHeader={false} />
            </TabsContent>
            <TabsContent value="outfits" className="outline-none mt-0">
                <OutfitManagement showHeader={false} />
            </TabsContent>
        </Tabs>
    );
}
