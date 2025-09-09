// src/components/NavBar.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/useDebounce.js";

const BRAND_BLUE = "#3366FF";

export default function NavBar() {   // ✅ default export
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const dq = useDebounce(q, 500);

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
              style={({ isActive }) => ({
                color: isActive ? BRAND_BLUE : undefined,
              })}
            >
              {i.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목으로 검색 (예: Dune)"
            className="w-64 md:w-80 rounded-full px-4 py-2 text-sm outline-none
                       bg-white/10 text-white placeholder-white/50
                       focus:ring-2 focus:ring-[rgba(51,102,255,.45)]"
          />
        </div>
      </nav>
    </header>
  );
}
