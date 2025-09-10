import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";
import { includesChoseong, isChoseongQuery } from "../utils/korean.js";

function SearchResults({ fallbackPool = [] }) {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    if (!q) {
      setItems([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const list = [];

        // 1) TMDB 검색
        try {
          const api = await searchMovies(q, 1);
          if (api?.results) list.push(...api.results.filter((m) => !m.adult));
        } catch (_) {}

        // 2) 초성 쿼리 → 로컬 풀 검색 보강
        if (isChoseongQuery(q) && Array.isArray(fallbackPool)) {
          const extra = fallbackPool.filter((m) =>
            includesChoseong(m.title || "", q)
          );
          list.push(...extra);
        }

        // 3) 중복 제거
        const uniq = Array.from(new Map(list.map((m) => [m.id, m])).values());
        if (alive) setItems(uniq);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [q, fallbackPool]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 space-y-6">
      <SectionHeader title="검색 결과" />
      {loading ? (
        <p className="text-white/70">검색 중…</p>
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {items.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      ) : (
        <p className="text-white/60">"{q}"에 대한 결과가 없습니다.</p>
      )}
    </section>
  );
}

export default SearchResults;   // ✅ 기본 내보내기
