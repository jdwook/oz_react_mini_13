import { useEffect, useState } from "react";
import { fetchTopRatedMovies } from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";

function Top() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const r = await fetchTopRatedMovies(page);
        if (alive) setItems((r.results || []).filter((m) => !m.adult));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [page]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8 space-y-6">
      <SectionHeader title="평점이 높은 작품" />
      {loading ? (
        <p className="text-white/70">불러오는 중…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {items.map((m) => (
              <MediaCard key={m.id} item={m} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50"
              disabled={page === 1}
            >
              이전
            </button>
            <span className="text-white/70 text-sm">페이지 {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Top;   // ✅ 반드시 추가
