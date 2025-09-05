import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* ✅ NavBar는 전체 폭 */}
      <NavBar />

      {/* ✅ 기본 컨텐츠는 중앙 정렬 */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}