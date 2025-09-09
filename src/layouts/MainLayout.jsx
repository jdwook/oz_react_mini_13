import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useSearchParams, useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { Search } from "lucide-react"; // lucide 아이콘 (npm i lucide-react 필요)

export default function MainLayout() {
  const [params, setParams] = useSearchParams();
  const loc = useLocation();
  const [q, setQ] = useState(params.get("q") || "");
  const dq = useDebounce(q, 500);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (dq?.trim()) {
      next.set("q", dq.trim());
      next.set("page", "1");
    } else {
      next.delete("q");
      next.delete("page");
    }
    setParams(next, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]);

  const brand = useMemo(() => ({ accent: "#3366FF", bg: "#0B1020" }), []);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: brand.bg }}>
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

      {/* 헤더 */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1020]/70 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span style={{ color: brand.accent }}>OZ</span>wave
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
                style={({ isActive }) => ({
                  color: isActive ? brand.accent : undefined,
                })}
              >
                {i.label}
              </NavLink>
            ))}
          </div>

          {/* 검색 */}
          <div className="ml-auto flex items-center">
            <div className="relative w-64 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="제목으로 검색 (예: Dune)"
                className="w-full rounded-full pl-9 pr-4 py-2 text-sm outline-none
                           bg-white/10 text-white placeholder-white/50
                           focus:ring-2 focus:ring-[rgba(51,102,255,.45)]"
              />
            </div>
          </div>
        </nav>
      </header>

      {/* 페이지 컨텐츠 */}
      <main className="w-full">
        <Outlet />
      </main>

      {/* 상세 페이지일 때 하단 그라디언트 */}
      {loc.pathname.startsWith("/details/") && (
        <div
          aria-hidden
          className="h-24 w-full"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(51,102,255,.18) 100%)",
          }}
        />
      )}
    </div>
  );
}
