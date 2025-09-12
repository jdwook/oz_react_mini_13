// src/components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce.js";
import { useAuth } from "../context/AuthContext.jsx";

const BRAND_BLUE = "#3366FF";

export default function NavBar() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const dq = useDebounce(q, 500);

  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();

  const [avatarOpen, setAvatarOpen] = useState(false); // 데스크탑 아바타 드롭다운
  const [mobileOpen, setMobileOpen] = useState(false); // 모바일 상단 패널
  const avatarRef = useRef(null);

  // 바깥 클릭 시 아바타 드롭다운 닫기
  useEffect(() => {
    const onDocDown = (e) => {
      if (avatarOpen && avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [avatarOpen]);

  // 검색어 ↔ URL 동기화
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (dq.trim()) {
      next.set("q", dq.trim());
      next.set("page", "1");
    } else {
      next.delete("q");
      next.delete("page");
    }
    setParams(next, { replace: false });
    if (dq.trim() && loc.pathname !== "/") {
      nav(`/?${next.toString()}`, { replace: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]);

  // 모바일 패널 열릴 때 스크롤 잠금
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const onLogout = async () => {
    await logout();
    setAvatarOpen(false);
    setMobileOpen(false);
    nav("/", { replace: true });
  };

  const menus = [
    { to: "/", label: "홈" },
    { to: "/trending", label: "실시간" },
    { to: "/top", label: "평점" },
    { to: "/genres", label: "장르" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B1020]/70 backdrop-blur-md">
      <nav className="flex items-center gap-4 px-4 mx-auto h-14 max-w-7xl">
        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid w-10 h-10 p-0 bg-transparent border-0 rounded-lg md:hidden place-items-center hover:bg-white/10 focus:outline-none"
          style={{ backgroundColor: "transparent" }}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 로고 */}
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-[#3366FF]">OZ</span>Wave
        </Link>

        {/* 상단 메뉴 (md↑) */}
        <div className="hidden gap-6 ml-6 md:flex">
          {menus.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                "text-sm transition-colors hover:text-white/90 " +
                (isActive ? "font-semibold" : "text-white/70")
              }
              style={({ isActive }) => ({ color: isActive ? BRAND_BLUE : undefined })}
            >
              {i.label}
            </NavLink>
          ))}
        </div>

        {/* 검색 + 계정 (md↑) */}
        <div className="items-center hidden gap-3 ml-auto md:flex">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목으로 검색"
            className="w-48 md:w-72 rounded-full px-4 py-2 text-sm outline-none
                       bg-white/10 text-white placeholder-white/50
                       focus:ring-2 focus:ring-[rgba(51,102,255,.45)]"
          />

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm">
                로그인
              </Link>
              <Link to="/signup" className="px-3 py-1.5 rounded-lg bg-[#3366FF] text-white text-sm">
                회원가입
              </Link>
            </div>
          ) : (
            <div className="relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setAvatarOpen((v) => !v)}
                className="p-0 overflow-hidden rounded-full w-9 h-9 focus:ring-2 focus:ring-indigo-300"
                title={user.userName || user.email}
                aria-haspopup="menu"
                aria-expanded={avatarOpen}
                style={{ backgroundColor: "transparent", border: 0 }}
              >
                <img src={user.profileImageUrl} alt="avatar" className="object-cover w-full h-full pointer-events-none" />
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#121833] shadow-xl border border-white/10 p-1 z-[9999]" role="menu">
                  <div className="px-3 py-2 text-xs text-white/60">
                    {user.userName || user.email}
                  </div>

                  <Link
                    to="/mypage"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nav("/mypage");
                      setAvatarOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-sm text-left text-white rounded-lg hover:bg-white/10"
                    role="menuitem"
                  >
                    마이페이지
                  </Link>

                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full px-3 py-2 text-sm text-left text-red-400 rounded-lg hover:bg-white/10"
                    role="menuitem"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* md 미만에서 오른쪽 공간 확보용 */}
        <div className="ml-auto md:hidden" />
      </nav>

      {/* ===== 모바일 전체 패널 ===== */}
      {mobileOpen && (
        <>
          {/* 어두운 배경 */}
          <div className="fixed inset-0 z-[60] bg-black/60" onClick={() => setMobileOpen(false)} />

          {/* 상단 슬라이드다운 패널 */}
          <aside
            className="fixed top-0 left-0 right-0 z-[70] bg-[#0E1324] border-b border-white/10 rounded-b-2xl
                       px-4 pt-3 pb-6 shadow-2xl transform transition-transform duration-300 translate-y-0"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-extrabold">
                <span className="text-[#3366FF]">OZ</span>Wave
              </div>
              {/* ✕ 닫기 버튼: 투명 배경 + 호버만 살짝 */}
              <button
                type="button"
                className="grid w-10 h-10 p-0 text-white bg-transparent border-0 rounded-lg place-items-center hover:bg-white/10 focus:outline-none"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                style={{ backgroundColor: "transparent" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 검색 (모바일) */}
            <div className="mt-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="제목으로 검색"
                className="w-full rounded-full px-4 py-2 text-sm outline-none
                           bg-white/10 text-white placeholder-white/50
                           focus:ring-2 focus:ring-[rgba(51,102,255,.45)]"
              />
            </div>

            {/* 메뉴 목록 */}
            <div className="flex flex-col gap-1 mt-4">
              {menus.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    "px-3 py-2 rounded-lg text-base " +
                    (isActive ? "text-white bg-white/10" : "text-white/80 hover:text-white hover:bg-white/10")
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </div>

            {/* 계정 영역 (모바일) */}
            <div className="pt-4 mt-5 border-t border-white/10">
              {!user ? (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#3366FF] text-white text-sm text-center"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 px-3 py-2 text-sm text-center text-white rounded-lg bg-white/10"
                  >
                    회원가입
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <img src={user.profileImageUrl} alt="avatar" className="object-cover w-10 h-10 border rounded-full border-white/10" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{user.userName || "사용자"}</p>
                    <p className="text-xs text-white/60">{user.email}</p>
                  </div>
                  <Link
                    to="/mypage"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15"
                  >
                    마이페이지
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-3 py-2 text-sm text-red-300 rounded-lg bg-white/10 hover:bg-white/15"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
