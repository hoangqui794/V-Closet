import { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  isNotifOpen: boolean;
  openNotif: () => void;
  closeNotif: () => void;
}

const MenuContext = createContext<MenuContextType>({
  isMenuOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
  isNotifOpen: false,
  openNotif: () => {},
  closeNotif: () => {},
});

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  return (
    <MenuContext.Provider
      value={{
        isMenuOpen,
        openMenu: () => setIsMenuOpen(true),
        closeMenu: () => setIsMenuOpen(false),
        isNotifOpen,
        openNotif: () => setIsNotifOpen(true),
        closeNotif: () => setIsNotifOpen(false),
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
