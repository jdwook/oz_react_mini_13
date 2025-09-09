// src/layouts/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

export default function MainLayout() {
  const loc = useLocation();

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0B0F1E" }}>
      {/* 상단 배경 그라디언트 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background: `
            radial-gradient(1200px 600px at 20% -10%, rgba(51,102,255,.35), transparent 60%),
            radial-gradient(1000px 400px at 80% 0%, rgba(51,102,255,.25), transparent 60%)
          `,
        }}
      />

      <NavBar />

      <main className="w-full">
        <Outlet />
      </main>

      {/* 상세 페이지일 때 하단 그라디언트 살짝 */}
      {loc.pathname.startsWith("/details/") && (
        <div
          aria-hidden
          className="h-20 w-full"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(51,102,255,.18) 100%)",
          }}
        />
      )}
    </div>
  );
}
