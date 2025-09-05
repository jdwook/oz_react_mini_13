export default function NavBar() {
  return (
    // ✅ 배경은 전체, 내부는 중앙정렬
    <header className="sticky top-0 z-50 w-screen bg-[#0B0B0F]/85 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <h1 className="text-xl font-bold">
          <span className="text-violet-400">oz</span>무비
        </h1>

        {/* 메뉴 */}
        <nav className="flex gap-4">
          <a href="/" className="text-white/70 hover:text-white text-sm">인기순</a>
          <a href="/details/1011985" className="text-white/70 hover:text-white text-sm">상세</a>
        </nav>

        {/* 버튼들 */}
        <div className="flex gap-2">
          <button className="rounded-xl bg-violet-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-400 transition">
            로그인
          </button>
          <button className="rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-100 transition">
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}