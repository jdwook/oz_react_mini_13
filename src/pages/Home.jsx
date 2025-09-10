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
  // ===== 공통 상태 =====
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 URL ?q= 읽어서 검색 모드 전환
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const canShowHero = trending.length > 0;

  const perView = useMemo(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width:1280px)").matches) return 7;
    if (typeof window !== "undefined" && window.matchMedia("(min-width:1024px)").matches) return 6;
    if (typeof window !== "undefined" && window.matchMedia("(min-width:640px)").matches) return 4;
    return 2;
  }, []);

  // 홈 기본 데이터
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
    return () => { alive = false; };
  }, []);

  // 🔎 검색 모드: TMDB 검색 + (초성만이면) 로컬 초성 매칭 보강
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

        // 1) TMDB API 검색
        try {
          const api = await searchMovies(q, 1);
          if (api?.results) list.push(...api.results.filter((m) => !m.adult));
        } catch (err) {
          console.warn("TMDB search failed:", err);
        }

        // 2) 초성 쿼리면 로컬 풀에서 초성 매칭
        if (isChoseongQuery(q)) {
          const pool = [...popular, ...trending, ...top];
          const extra = pool.filter((m) => includesChoseong(m.title || "", q));
          list.push(...extra);
        }

        // 3) id 기준 중복 제거
        const uniq = Array.from(new Map(list.map((m) => [m.id, m])).values());
        if (alive) setResults(uniq);
      } finally {
        if (alive) setSearching(false);
      }
    })();
    return () => { alive = false; };
  }, [q, popular, trending, top]);

  // ===== 메인 무한 스크롤 (인기 영화 기반) =====
  const [infPage, setInfPage] = useState(0);         // 마지막으로 로드 완료한 페이지
  const [infItems, setInfItems] = useState([]);      // 누적 리스트
  const [infLoading, setInfLoading] = useState(false);
  const [infDone, setInfDone] = useState(false);
  const guardRef = useRef(null);
  const fetchingRef = useRef(false);

  const loadMore = useCallback(async (nextPage) => {
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
      // 실패 시엔 다음 기회에 재시도 가능하게만 처리
      console.warn("infinite load error:", e);
    } finally {
      setInfLoading(false);
      fetchingRef.current = false;
    }
  }, [infDone]);

  // 초기 1페이지
  useEffect(() => {
    if (q) return; // 검색 모드일 땐 무한스크롤 섹션 숨김
    loadMore(1);
  }, [q, loadMore]);

  // sentinel 관찰
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

  // 뷰포트 채우기(스크롤 생성 안 될 때 자동 추가 로드)
  useEffect(() => {
    if (q || infDone || infLoading) return;
    const notScrollable =
      document.documentElement.scrollHeight <= window.innerHeight + 100;
    if (notScrollable && infPage >= 1) throttledLoad(infPage + 1);
  }, [q, infItems, infPage, infLoading, infDone, throttledLoad]);

  // ===== 렌더 =====
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#181a1c" }}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 space-y-10">

        {/* 🔎 검색 모드 섹션 */}
        {q ? (
          <section className="pb-12">
            <SectionHeader title="검색 결과" moreTo="#" />
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
          // 기본 홈 섹션
          <>
            {canShowHero && <HeroCarousel items={trending.slice(0, 8)} />}

            <section>
              <SectionHeader title="믿고 보는 에디터 추천작" moreTo="#" />
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={16}
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

            <section>
              <SectionHeader title="실시간 인기 콘텐츠" moreTo="#" />
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={16}
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

            <section>
              <SectionHeader title="고평점 작품" moreTo="#" />
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={16}
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

            {/* ✅ 메인 무한 스크롤 섹션 */}
            <section className="pb-12">
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

              {/* 관찰용 센티넬 */}
              <div ref={guardRef} className="h-4" />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
