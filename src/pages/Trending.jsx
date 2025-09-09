import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";

function Trending() {
  const [items, setItems] = useState([]);
  const [time, setTime] = useState("day"); // "day" or "week"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const r = await fetchTrendingMovies(time);
        if (alive) setItems((r.results || []).filter((m) => !m.adult));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [time]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8 space-y-6">
      <SectionHeader title="실시간 인기 콘텐츠" />
      <div className="flex gap-2">
        {["day", "week"].map((t) => (
          <button
            key={t}
            onClick={() => setTime(t)}
            className={
              "px-3 py-1.5 rounded-lg text-sm " +
              (time === t
                ? "bg-[#3366FF] text-white"
                : "bg-white/10 text-white/80 hover:bg-white/15")
            }
          >
            {t === "day" ? "오늘" : "이번 주"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/70">불러오는 중…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 pb-10">
          {items.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Trending; // ✅ 반드시 추가
