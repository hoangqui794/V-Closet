import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { CommunityPage } from "./components/CommunityPage";
import { WardrobePage } from "./components/WardrobePage";
import { CameraPage } from "./components/CameraPage";
import { OutfitPage } from "./components/OutfitPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { EditProfilePage } from "./components/EditProfilePage";
import { ChangePasswordPage } from "./components/ChangePasswordPage";
import { NotificationSettingsPage } from "./components/NotificationSettingsPage";
import { LanguageSettingsPage } from "./components/LanguageSettingsPage";
import { ShopeeImportPage } from "./components/ShopeeImportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
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
      { path: "settings", Component: SettingsPage },
      { path: "settings/edit-profile", Component: EditProfilePage },
      { path: "settings/change-password", Component: ChangePasswordPage },
      { path: "settings/notifications", Component: NotificationSettingsPage },
      { path: "settings/language", Component: LanguageSettingsPage },
      { path: "shopee", Component: ShopeeImportPage },
    ],
  },
]);