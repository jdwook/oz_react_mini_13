import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen text-white bg-gray-950">
      {/* 공통 헤더 */}
      <header className="p-4 text-lg font-bold bg-gray-800">
        🎬 My Movie App
      </header>

      {/* 페이지 콘텐츠 */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}