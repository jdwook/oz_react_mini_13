import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useSearchParams, useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce.js";
import { useAuth } from "../context/AuthContext.jsx";

const BRAND_BLUE = "#3366FF";

export default function NavBar() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const dq = useDebounce(q, 500);

  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // 드롭다운 외부 클릭 시 닫기
  const menuRef = useRef(null);
  useEffect(() => {
    function handleDocPointerDown(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleDocPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocPointerDown);
  }, [menuOpen]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]);

  const onLogout = async () => {
    await logout(); // Context에서 세션/캐시 제거 + setUser(null)
    setMenuOpen(false);
    nav("/", { replace: true });
  };

  return (
    // z-index를 더 높여 위에 깔리게
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B1020]/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-[#3366FF]">OZ</span>Wave
        </Link>

        <div className="ml-6 hidden gap-6 md:flex">
          {[
            { to: "/", label: "홈" },
            { to: "/trending", label: "실시간" },
            { to: "/top", label: "평점" },
            { to: "/genres", label: "장르" },
          ].map((i) => (
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

        {/* 오른쪽: 검색 + 계정 */}
        <div className="ml-auto flex items-center gap-3">
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
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-lg bg-[#3366FF] text-white text-sm"
              >
                회원가입
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"                       // ✅ 명시
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full overflow-hidden bg-white/10 focus:ring-2 focus:ring-indigo-300"
                title={user.userName || user.email}
              >
                <img
                  src={user.profileImageUrl}
                  alt="avatar"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-[#121833] shadow-xl
                             border border-white/10 p-1 z-[9999]"   // ✅ 매우 높은 z-index
                  role="menu"
                  aria-label="account menu"
                >
                  <div className="px-3 py-2 text-xs text-white/60">
                    {user.userName || user.email}
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-white/10"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
