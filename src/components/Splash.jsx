// src/components/Splash.jsx
import { useEffect, useState } from "react";

export default function Splash() {
  const shouldShow =
    typeof window !== "undefined" &&
    sessionStorage.getItem("splashSeen") !== "1";

  const [mounted, setMounted] = useState(shouldShow);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    const t1 = setTimeout(() => setFade(true), 900);       // 0.9s 후 페이드 시작
    const t2 = setTimeout(() => {
      setMounted(false);
      sessionStorage.setItem("splashSeen", "1");
    }, 1600); // 0.9 + 0.7
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shouldShow]);

  if (!mounted) return null;

  return (
    <div
      className={
        "fixed inset-0 z-[9999] flex items-center justify-center " +
        "bg-[#0B1020] transition-opacity duration-700 " +
        (fade ? "opacity-0" : "opacity-100")
      }
      aria-label="앱 로딩"
    >
      <div className="text-5xl font-extrabold tracking-tight select-none md:text-7xl">
        <span className="text-[#3366FF]">OZ</span>Wave
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 400px at 50% -10%, rgba(51,102,255,.25), transparent 60%)",
        }}
      />
    </div>
  );
}
