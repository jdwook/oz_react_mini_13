// src/layouts/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Splash from "../components/Splash.jsx";  // ✅ 추가

export default function MainLayout() {
  const loc = useLocation();

  return (
    <div className="relative min-h-screen text-white" style={{ backgroundColor: "#0B0F1E" }}>
      {/* ✅ 스플래시 (첫 로딩 시 전체화면) */}
      <Splash />

      {/* 배경 그라데이션 */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        aria-hidden
        style={{
          background: `
            radial-gradient(1200px 600px at 20% -10%, rgba(51,102,255,.35), transparent 60%),
            radial-gradient(1000px 400px at 80% 0%, rgba(51,102,255,.25), transparent 60%)
          `,
        }}
      />

      {/* 네비게이션바 */}
      <NavBar />

      {/* 메인 콘텐츠 */}
      <main className="w-full">
        <Outlet />
      </main>

      {/* 상세페이지 하단 그래디언트 */}
      {loc.pathname.startsWith("/details/") && (
        <div
          aria-hidden
          className="w-full h-20"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(51,102,255,.18) 100%)",
          }}
        />
      )}
    </div>
  );
}
