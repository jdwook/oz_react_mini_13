import { useEffect, useState } from "react";
import { discoverMovies, fetchGenres } from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";

function Genres() {
  const [genres, setGenres] = useState([]);
  const [active, setActive] = useState(""); // TMDB genre id string
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 장르 목록
  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await fetchGenres();
      if (alive) setGenres(r.genres || []);
    })();
    return () => { alive = false; };
  }, []);

  // 선택 장르/페이지에 맞는 영화
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const r = await discoverMovies({
          page,
          with_genres: active,
          sort_by: "popularity.desc",
        });
        if (alive) setItems((r.results || []).filter((m) => !m.adult));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [active, page]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8 space-y-6">
      <SectionHeader title="장르로 찾기" />

      {/* 장르 칩 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActive(""); setPage(1); }}
          className={
            "px-3 py-1.5 rounded-lg text-sm " +
            (active === "" ? "bg-[#3366FF] text-white" : "bg-white/10 text-white/80 hover:bg-white/15")
          }
        >
          전체
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => { setActive(String(g.id)); setPage(1); }}
            className={
              "px-3 py-1.5 rounded-lg text-sm " +
              (active === String(g.id)
                ? "bg-[#3366FF] text-white"
                : "bg-white/10 text-white/80 hover:bg-white/15")
            }
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* 결과 */}
      {loading ? (
        <p className="text-white/70">불러오는 중…</p>
      ) : items.length ? (
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
      ) : (
        <p className="text-white/60">해당 장르에 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default Genres;
