import { createContext, useContext, useState, ReactNode } from "react";

export interface BodyMeasurements {
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
}

export type BodyShapeType =
  | "hourglass"
  | "pear"
  | "rectangle"
  | "apple"
  | "inverted-triangle"
  | "unsure";

export interface UserProfile {
  nickname: string;
  referralCode: string;
  gender: string | null;
  country: string | null;
  lifestyle: string | null;
  hairColor: string | null;
  eyeColor: string | null;
  bodyShape: BodyShapeType | null;
  colorPalette: string | null;
  fashionStyle: string[];
  skinTone: string | null;
  measurements: BodyMeasurements;
  hasCompletedOnboarding: boolean;
  hasCompletedAIScan: boolean;
}

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setMeasurement: (key: keyof BodyMeasurements, value: number) => void;
  completeOnboarding: () => void;
  completeAIScan: () => void;
  dismissAIScan: () => void;
  showAIScanPrompt: boolean;
}

const defaultProfile: UserProfile = {
  nickname: "",
  referralCode: "",
  gender: null,
  country: "Việt Nam",
  lifestyle: null,
  hairColor: null,
  eyeColor: null,
  bodyShape: null,
  colorPalette: null,
  fashionStyle: [],
  skinTone: null,
  measurements: {},
  hasCompletedOnboarding: false,
  hasCompletedAIScan: false,
};

const UserProfileContext = createContext<UserProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
  setMeasurement: () => {},
  completeOnboarding: () => {},
  completeAIScan: () => {},
  dismissAIScan: () => {},
  showAIScanPrompt: true,
});

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [showAIScanPrompt, setShowAIScanPrompt] = useState(true);

  const updateProfile = (partial: Partial<UserProfile>) =>
    setProfile((p) => ({ ...p, ...partial }));

  const setMeasurement = (key: keyof BodyMeasurements, value: number) =>
    setProfile((p) => ({
      ...p,
      measurements: { ...p.measurements, [key]: value },
    }));

  const completeOnboarding = () =>
    setProfile((p) => ({ ...p, hasCompletedOnboarding: true }));

  const completeAIScan = () =>
    setProfile((p) => ({ ...p, hasCompletedAIScan: true }));

  const dismissAIScan = () => setShowAIScanPrompt(false);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        setMeasurement,
        completeOnboarding,
        completeAIScan,
        dismissAIScan,
        showAIScanPrompt,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
