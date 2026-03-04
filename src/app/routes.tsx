import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { LoginPage } from "./components/LoginPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { CommunityPage } from "./components/CommunityPage";
import { WardrobePage } from "./components/WardrobePage";
import { CameraPage } from "./components/CameraPage";
import { OutfitPage } from "./components/OutfitPage";
import { ProfilePage } from "./components/ProfilePage";
import { ShopeeImportPage } from "./components/ShopeeImportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/onboarding",
    Component: OnboardingPage,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, element: <Navigate to="/app/community" replace /> },
      { path: "community", Component: CommunityPage },
      { path: "wardrobe", Component: WardrobePage },
      { path: "camera", Component: CameraPage },
      { path: "outfit", Component: OutfitPage },
      { path: "profile", Component: ProfilePage },
      { path: "shopee", Component: ShopeeImportPage },
    ],
  },
]);