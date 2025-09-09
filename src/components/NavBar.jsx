// src/components/NavBar.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, useSearchParams, useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce.js";
import { useAuth } from "../context/AuthContext.jsx";

const BRAND_BLUE = "#3366FF";

function avatarFallback(nameOrEmail) {
  return (
    "https://ui-avatars.com/api/?" +
    new URLSearchParams({
      name: nameOrEmail || "user",
      background: "3366FF",
      color: "FFFFFF",
      bold: "true",
      size: "96",
      format: "png",
    }).toString()
  );
}

export default function NavBar() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const dq = useDebounce(q, 500);

  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    await logout();
    setMenuOpen(false);
    nav("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1020]/70 backdrop-blur-md">
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
            className="w-52 md:w-80 rounded-full px-4 py-2 text-sm
                       bg-white/10 text-white placeholder-white/50
                       border border-white/10
                       outline-none focus:outline-none focus:ring-0 focus:border-white/20"
          />

          {!user ? (
            <div className="flex items-center gap-2 min-w-[180px] justify-end">
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
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                // 파란 포커스 링 제거
                className="w-9 h-9 rounded-full overflow-hidden bg-white/10"
                title={user.userName || user.email}
              >
                <img
                  src={user.profileImageUrl || avatarFallback(user.userName || user.email)}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = avatarFallback(user.userName || user.email);
                  }}
                />
              </button>
              {menuOpen && (
                <div
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute right-0 mt-2 w-40 rounded-xl bg-[#121833] shadow-lg border border-white/10 p-1"
                >
                  <button
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
