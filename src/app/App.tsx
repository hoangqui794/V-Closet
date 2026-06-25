import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { UserProfileProvider } from "./components/UserProfileContext";
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
      <LanguageProvider>
      <UserProfileProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'Manrope', sans-serif",
              background: "#3b2d22",
              color: "#f5ebe0",
              border: "none",
              borderRadius: "12px",
            },
          }}
        />
      </UserProfileProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}