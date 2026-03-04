import { Outlet, useLocation } from "react-router";
import { BottomNav } from "./BottomNav";
import { MenuProvider } from "./MenuContext";
import { SideMenu } from "./SideMenu";
import { NotificationPanel } from "./NotificationPanel";
import { AnimatePresence, motion } from "motion/react";

export function AppLayout() {
  const location = useLocation();
  const isOutfitPage = location.pathname.includes("/app/outfit");
  const isCameraPage = location.pathname.includes("/app/camera");
  const isShopeePage = location.pathname.includes("/app/shopee");
  const isSpecialPage = isOutfitPage || isCameraPage || isShopeePage;

  // Define transition direction
  const variants = {
    initial: isOutfitPage || isShopeePage ? { x: "100%", opacity: 1 } : (isCameraPage ? { x: "-100%", opacity: 1 } : { opacity: 0 }),
    animate: { x: 0, y: 0, opacity: 1 },
    exit: isCameraPage ? { opacity: 0 } : (isOutfitPage || isShopeePage ? { x: "100%", opacity: 1 } : { opacity: 0 }),
  };

  return (
    <MenuProvider>
      <div className="mobile-frame">
        {/* Status bar simulation */}
        <div className="h-[env(safe-area-inset-top,0px)] bg-[#fdfaf6] shrink-0" />

        {/* Main content — with slide transition for special pages */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#fdfaf6]"
              style={{ zIndex: isSpecialPage ? 50 : 1, willChange: "transform" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed bottom nav — slides down for special pages like native apps */}
        <motion.div
          animate={isSpecialPage ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-20 overflow-hidden"
          style={{ height: isSpecialPage ? 0 : "auto" }}
        >
          <BottomNav />
        </motion.div>

        {/* Safe area bottom spacer behind nav (for notch devices) */}
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-[#fdfaf6] shrink-0" />

        {/* Side Menu Overlay */}
        <SideMenu />

        {/* Notification Panel */}
        <NotificationPanel />
      </div>
    </MenuProvider>
  );
}