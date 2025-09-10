// src/pages/Top.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchTopRatedMovies } from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";
import useThrottle from "../hooks/useThrottle.js";

function Top() {
  const [page, setPage] = useState(0);          // 마지막으로 로드 완료한 페이지 번호
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);      // 더 이상 불러올 게 없을 때
  const guardRef = useRef(null);
  const fetchingRef = useRef(false);            // 동시/중복 요청 방지

  const loadPage = useCallback(async (nextPage) => {
    if (fetchingRef.current || done) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const r = await fetchTopRatedMovies(nextPage);
      const rows = (r.results || []).filter((m) => !m.adult);
      setItems((prev) => prev.concat(rows));
      setPage(nextPage);
      if (!rows.length || nextPage >= (r.total_pages || 500)) {
        setDone(true);
      }
    } catch {
      // 실패 시 다음 기회에 다시 시도할 수 있게만 처리
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [done]);

  // 초기 1페이지
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // sentinel이 보이면 다음 페이지 로드
  const throttledLoad = useThrottle((p) => loadPage(p), 700);

  useEffect(() => {
    const el = guardRef.current;
    if (!el || done) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) throttledLoad(page + 1);
      },
      {
        root: null,
        // 화면 아래쪽에 여유를 넉넉히 줘서 빨리 당겨오기
        rootMargin: "800px 0px",
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [page, done, throttledLoad]);

  // 화면에 스크롤이 안 생기면 자동으로 추가 로드(뷰포트 채우기 보정)
  useEffect(() => {
    if (done || loading) return;
    const notScrollable =
      document.documentElement.scrollHeight <= window.innerHeight + 100;
    if (notScrollable && page >= 1) {
      throttledLoad(page + 1);
    }
  }, [items, page, loading, done, throttledLoad]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8 space-y-6">
      <SectionHeader title="평점이 높은 작품 (무한 스크롤)" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {items.map((m) => (
          <MediaCard key={`${m.id}-${m.title}`} item={m} />
        ))}
      </div>

      <div className="py-6 text-center text-white/70">
        {loading && <p>불러오는 중…</p>}
        {done && <p>모든 데이터를 불러왔습니다.</p>}
      </div>

      {/* 관찰용 센티넬 */}
      <div ref={guardRef} className="h-4" />
    </div>
  );
}

export default Top;
