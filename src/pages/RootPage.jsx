// src/pages/RootPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Home from "./Home.jsx";
import SearchResults from "./SearchResults.jsx";
import { fetchPopularMovies, fetchTrendingMovies, fetchTopRatedMovies } from "../api/tmdb.js";

function RootPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [pool, setPool] = useState([]);
  useEffect(() => {
    if (!q) return;
    let alive = true;
    (async () => {
      try {
        const [p, t, r] = await Promise.all([
          fetchPopularMovies(1),
          fetchTrendingMovies("week"),
          fetchTopRatedMovies(1),
        ]);
        if (!alive) return;
        const clean = (x) => (x?.results || []).filter((m) => !m.adult);
        setPool([...clean(p), ...clean(t), ...clean(r)]);
      } catch {
        setPool([]);
      }
    })();
    return () => { alive = false; };
  }, [q]);

  return q ? <SearchResults fallbackPool={pool} /> : <Home />;
}

export default RootPage;  // ✅ 기본 내보내기
