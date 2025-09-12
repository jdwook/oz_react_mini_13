// src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  searchMovies,
} from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { includesChoseong, isChoseongQuery } from "../utils/korean.js";
import useThrottle from "../hooks/useThrottle.js";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const canShowHero = trending.length > 0;

  // 기본 데이터 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [p, t, r] = await Promise.all([
          fetchPopularMovies(1),
          fetchTrendingMovies("week"),
          fetchTopRatedMovies(1),
        ]);
        if (!alive) return;
        const clean = (arr) => (arr || []).filter((m) => !m.adult);
        setPopular(clean(p.results));
        setTrending(clean(t.results));
        setTop(clean(r.results));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 검색 모드
  useEffect(() => {
    let alive = true;
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }
    (async () => {
      setSearching(true);
      try {
        const list = [];
        try {
          const api = await searchMovies(q, 1);
          if (api?.results) list.push(...api.results.filter((m) => !m.adult));
        } catch (_) {}
        if (isChoseongQuery(q)) {
          const pool = [...popular, ...trending, ...top];
          const extra = pool.filter((m) =>
            includesChoseong(m.title || "", q)
          );
          list.push(...extra);
        }
        const uniq = Array.from(new Map(list.map((m) => [m.id, m])).values());
        if (alive) setResults(uniq);
      } finally {
        if (alive) setSearching(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [q, popular, trending, top]);

  // 무한 스크롤 인기 영화
  const [infPage, setInfPage] = useState(0);
  const [infItems, setInfItems] = useState([]);
  const [infLoading, setInfLoading] = useState(false);
  const [infDone, setInfDone] = useState(false);
  const guardRef = useRef(null);
  const fetchingRef = useRef(false);

  const loadMore = useCallback(
    async (nextPage) => {
      if (fetchingRef.current || infDone) return;
      fetchingRef.current = true;
      setInfLoading(true);
      try {
        const r = await fetchPopularMovies(nextPage);
        const rows = (r.results || []).filter((m) => !m.adult);
        setInfItems((prev) => prev.concat(rows));
        setInfPage(nextPage);
        if (!rows.length || nextPage >= (r.total_pages || 500)) {
          setInfDone(true);
        }
      } catch (e) {
        console.warn("infinite load error:", e);
      } finally {
        setInfLoading(false);
        fetchingRef.current = false;
      }
    },
    [infDone]
  );

  useEffect(() => {
    if (q) return;
    loadMore(1);
  }, [q, loadMore]);

  const throttledLoad = useThrottle((p) => loadMore(p), 700);

  useEffect(() => {
    if (q || infDone) return;
    const el = guardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) throttledLoad(infPage + 1);
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [q, infPage, infDone, throttledLoad]);

  // ===== 렌더 =====
  return (
    <div className="min-h-screen bg-[#181a1c]">
      {/* 히어로 */}
      {canShowHero && <HeroCarousel items={trending.slice(0, 8)} />}

      {/* 🔎 검색 모드 */}
      {q ? (
        <section className="py-12">
          <SectionHeader title="검색 결과" />
          {searching ? (
            <p className="text-white/70">검색 중…</p>
          ) : results.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
              {results.map((m) => (
                <MediaCard key={m.id} item={m} />
              ))}
            </div>
          ) : (
            <p className="text-white/60">"{q}"에 대한 결과가 없습니다.</p>
          )}
        </section>
      ) : (
        <>
          {/* 인기 */}
          <section className="w-screen px-0 py-10">
            <SectionHeader title="믿고 보는 에디터 추천작" />
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={12}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
                1280: { slidesPerView: 7 },
              }}
              className="[&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!text-white"
            >
              {popular.map((m, i) => (
                <SwiperSlide key={m.id}>
                  <MediaCard item={m} badge={i < 3 ? "NEW" : undefined} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* 실시간 */}
          <section className="w-screen px-0 py-10">
            <SectionHeader title="실시간 인기 콘텐츠" />
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={12}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
                1280: { slidesPerView: 7 },
              }}
              className="[&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!text-white"
            >
              {trending.map((m) => (
                <SwiperSlide key={m.id}>
                  <MediaCard item={m} badge="Quick VOD" />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* 고평점 */}
          <section className="w-screen px-0 py-10">
            <SectionHeader title="고평점 작품" />
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={12}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
                1280: { slidesPerView: 7 },
              }}
              className="[&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!text-white"
            >
              {top.map((m) => (
                <SwiperSlide key={m.id}>
                  <MediaCard item={m} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* 무한 스크롤 */}
          <section className="w-screen px-0 py-12">
            <SectionHeader title="전체 인기 작품 (무한 스크롤)" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
              {infItems.map((m) => (
                <MediaCard key={`${m.id}-${m.title}`} item={m} />
              ))}
            </div>

            <div className="py-6 text-center text-white/70">
              {infLoading && <p>불러오는 중…</p>}
              {infDone && <p>모든 데이터를 불러왔습니다.</p>}
            </div>

            <div ref={guardRef} className="h-4" />
          </section>
        </>
      )}
    </div>
  );
}
