import { useEffect, useRef, useState } from "react";

const KEY = "ozwave_splash_v2"; // 세션 1회만 보이도록 하는 키

export default function Splash() {
  const shouldShow =
    typeof window !== "undefined" && sessionStorage.getItem(KEY) !== "1";

  const [mounted, setMounted] = useState(shouldShow);
  const [fade, setFade] = useState(false);
  const [needTap, setNeedTap] = useState(false); // 자동재생 차단되면 버튼 표시
  const audioRef = useRef(null);
  const timers = useRef([]);

  // 오디오 재생 시도
  const tryPlay = async () => {
    if (!audioRef.current) return false;
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setNeedTap(false);
      return true;
    } catch {
      setNeedTap(true);
      return false;
    }
  };

  // 페이드아웃 스케줄
  const scheduleFadeOut = () => {
    timers.current.push(
      setTimeout(() => setFade(true), 900),
      setTimeout(() => {
        setMounted(false);
        sessionStorage.setItem(KEY, "1");
      }, 1600)
    );
  };

  useEffect(() => {
    if (!shouldShow) return;

    if (audioRef.current) {
      audioRef.current.volume = 0.9;
      try {
        audioRef.current.load();
      } catch {}
    }

    (async () => {
      const ok = await tryPlay();
      if (ok) {
        scheduleFadeOut();
      }
    })();

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [shouldShow]);

  // 버튼 클릭 시 재생 후 페이드아웃
  const onTapToPlay = async () => {
    const ok = await tryPlay();
    if (ok) scheduleFadeOut();
  };

  if (!mounted) return null;

  return (
    <div
      className={
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center " +
        "bg-[#0B1020] transition-opacity duration-700 " +
        (fade ? "opacity-0" : "opacity-100")
      }
      aria-label="앱 로딩"
    >
      {/* 로고 */}
      <div className="text-5xl font-extrabold tracking-tight text-center select-none md:text-7xl">
        <span className="text-[#3366FF]">OZ</span>Wave
      </div>

      {/* 효과음 */}
      <audio ref={audioRef} preload="auto" src="/sounds/hhhhhh.mp3" playsInline />

      {/* 자동재생이 막혔을 때만 버튼 표시 */}
      {needTap && (
        <div className="flex flex-col items-center mt-10">
          <button
            type="button"
            onClick={onTapToPlay}
            className="px-8 py-3 rounded-xl bg-[#3366FF] border border-white/20 
                       text-white font-bold text-lg hover:bg-[#264bcc] transition"
          >
            Click to Join
          </button>
        </div>
      )}

      {/* 배경 그라데이션 */}
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
