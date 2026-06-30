import { createBrowserRouter, Navigate } from "react-router";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { UserManagement } from "./components/admin/UserManagement";
import { AffiliateManagement } from "./components/admin/AffiliateManagement";
import { SubscriptionManagement } from "./components/admin/SubscriptionManagement";
import { FinanceManagement } from "./components/admin/FinanceManagement";
import { CampaignManagement } from "./components/admin/CampaignManagement";
import { AIConfig } from "./components/admin/AIConfig";
import { ReportManagement } from "./components/admin/ReportManagement";
import { AdminLoginPage } from "./components/admin/AdminLoginPage";
import { NotificationManagement } from "./components/admin/NotificationManagement";
import { WardrobeManagement } from "./components/admin/WardrobeManagement";
import { OutfitManagement } from "./components/admin/OutfitManagement";
import { ClosetManagement } from "./components/admin/ClosetManagement";
import { CouponManagement } from "./components/admin/CouponManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLoginPage,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", Component: Dashboard },
      { path: "users", Component: UserManagement },
      { path: "closet", Component: ClosetManagement },
      { path: "wardrobes", element: <Navigate to="/admin/closet?tab=wardrobes" replace /> },
      { path: "outfits", element: <Navigate to="/admin/closet?tab=outfits" replace /> },
      { path: "reports", Component: ReportManagement },
      { path: "campaigns", Component: CampaignManagement },
      { path: "notifications", Component: NotificationManagement },
      { path: "affiliate", Component: AffiliateManagement },
      { path: "subscriptions", Component: SubscriptionManagement },
      { path: "finance", Component: FinanceManagement },
      { path: "coupons", Component: CouponManagement },
      { path: "ai-config", Component: AIConfig },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);