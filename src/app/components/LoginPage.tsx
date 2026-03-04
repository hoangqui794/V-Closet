import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-ta7we0nsx9";
import imgImage1 from "@/assets/v-closet-logo.png";
import imgLogo from "@/assets/92375b66cc5f6db228cbba4fabc2bd6032c970de.png";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigate("/onboarding");
  };

  return (
    <div className="mobile-frame items-center">
      <div className="flex flex-col items-center justify-center w-full px-[16px] pt-[28px] pb-[40px]">
        {/* Spacer */}
        <div className="h-[6px] shrink-0 w-px" />

        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-[142px] relative rounded-[119px] shrink-0 w-[136px]"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[119px]">
            <img
              alt="V-Closet Logo"
              className="absolute h-[110.82%] left-[-13.97%] max-w-none top-[-11.12%] w-[127.44%]"
              src={imgImage1}
            />
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-[11px] mb-[40px]"
        >
          <div className="font-['Manrope',sans-serif] font-[800] text-[30px] text-[#4a3728] tracking-[-0.75px] leading-[36px]">
            V-Closet
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-[8px] items-center w-full mb-[32px]"
        >
          <div className="font-['Manrope',sans-serif] font-bold text-[24px] text-[#4a3728] text-center leading-[30px]">
            Welcome Back
          </div>
          <div className="font-['Manrope',sans-serif] font-normal text-[16px] text-[rgba(74,55,40,0.7)] text-center leading-[24px]">
            Access your digital wardrobe and virtual try-on.
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-[20px] items-start w-full max-w-[350px]"
        >
          {/* Email Field */}
          <div className="flex flex-col gap-[8px] items-start w-full">
            <div className="pl-[4px] w-full">
              <div className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.8)] leading-[20px]">
                Email or Username
              </div>
            </div>
            <div className="relative w-full">
              <div className="bg-white h-[56px] relative rounded-[12px] w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-full rounded-[12px] border border-[#dccbb5] pl-[49px] pr-[17px] py-[17px] font-['Manrope',sans-serif] font-normal text-[16px] text-[#4a3728] placeholder-[#6b7280] bg-white outline-none focus:border-[#4a3728]"
                />
              </div>
              <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
                <svg
                  width="13.333"
                  height="13.333"
                  viewBox="0 0 13.3333 13.3333"
                  fill="none"
                >
                  <path
                    d={svgPaths.pfeb5cc0}
                    fill="#4A3728"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-[8px] items-start w-full">
            <div className="pl-[4px] flex items-center justify-between w-full">
              <div className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.8)] leading-[20px]">
                Password
              </div>
              <button className="font-['Manrope',sans-serif] font-bold text-[12px] text-[#4a3728] leading-[16px] bg-transparent border-none cursor-pointer p-0">
                Forgot password?
              </button>
            </div>
            <div className="relative w-full">
              <div className="bg-white h-[56px] relative rounded-[12px] w-full">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="????????"
                  className="w-full h-full rounded-[12px] border border-[#dccbb5] pl-[49px] pr-[17px] py-[17px] font-['Manrope',sans-serif] font-normal text-[16px] text-[#4a3728] placeholder-[#6b7280] bg-white outline-none focus:border-[#4a3728]"
                />
              </div>
              <div className="absolute left-[20px] top-1/2 -translate-y-1/2">
                <svg
                  width="13.333"
                  height="17.5"
                  viewBox="0 0 13.3333 17.5"
                  fill="none"
                >
                  <path
                    d={svgPaths.p2eed4060}
                    fill="#4A3728"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            onClick={handleLogin}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="bg-[#4a3728] flex gap-[8px] h-[56px] items-center justify-center rounded-[12px] w-full cursor-pointer border-none shadow-[0px_10px_15px_-3px_rgba(74,55,40,0.2),0px_4px_6px_-4px_rgba(74,55,40,0.2)]"
          >
            <span className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#fdfaf6] text-center leading-[24px]">
              Login to Your Closet
            </span>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d={svgPaths.p1acd9480} fill="#FDFAF6" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-[16px] items-center w-full max-w-[254px] mt-[20px]"
        >
          <div className="bg-[rgba(220,203,181,0.6)] flex-1 h-px" />
          <div className="font-['Manrope',sans-serif] font-bold text-[12px] text-[rgba(74,55,40,0.4)] tracking-[0.6px] uppercase leading-[16px]">
            Or continue with
          </div>
          <div className="bg-[rgba(220,203,181,0.6)] flex-1 h-px" />
        </motion.div>

        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-start justify-between w-full max-w-[316px] mt-[16px]"
        >
          {/* Google */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white flex gap-[8px] h-[48px] items-center justify-center rounded-[12px] w-[151px] border border-[#dccbb5] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip_google)">
                <path d={svgPaths.p33b7ccc0} fill="#4285F4" />
                <path d={svgPaths.p15123a40} fill="#34A853" />
                <path d={svgPaths.p28bf8e80} fill="#FBBC05" />
                <path d={svgPaths.p1e563600} fill="#EB4335" />
              </g>
              <defs>
                <clipPath id="clip_google">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
            <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[#4a3728] text-center leading-[20px]">
              Google
            </span>
          </motion.button>

          {/* Apple */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white flex gap-[8px] h-[48px] items-center justify-center rounded-[12px] w-[143px] border border-[#dccbb5] cursor-pointer"
          >
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt=""
                  className="absolute left-[-28.84%] max-w-none size-[158.73%] top-[-29.1%]"
                  src={imgLogo}
                />
              </div>
            </div>
            <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[#4a3728] text-center leading-[20px]">
              Apple
            </span>
          </motion.button>
        </motion.div>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex gap-[4px] items-start mt-[27px]"
        >
          <span className="font-['Manrope',sans-serif] font-normal text-[16px] text-[rgba(74,55,40,0.6)] text-center leading-[24px]">
            Don't have an account?{" "}
          </span>
          <button
            className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#4a3728] text-center leading-[24px] bg-transparent border-none cursor-pointer p-0"
            onClick={() => { }}
          >
            Register
          </button>
        </motion.div>
      </div>
    </div>
  );
}