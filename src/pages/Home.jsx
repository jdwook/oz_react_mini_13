import { useEffect, useState, useMemo } from "react";
import { fetchPopularMovies, fetchTrendingMovies, fetchTopRatedMovies } from "../api/tmdb.js";
import SectionHeader from "../components/SectionHeader.jsx";
import MediaCard from "../components/MediaCard.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  const canShowHero = trending.length > 0;

  const perView = useMemo(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width:1280px)").matches) return 7;
    if (typeof window !== "undefined" && window.matchMedia("(min-width:1024px)").matches) return 6;
    if (typeof window !== "undefined" && window.matchMedia("(min-width:640px)").matches) return 4;
    return 2;
  }, []);

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
        setPopular((p.results || []).filter((m) => !m.adult));
        setTrending((t.results || []).filter((m) => !m.adult));
        setTop((r.results || []).filter((m) => !m.adult));
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#181a1c" }}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 space-y-10">
        {/* 상단 히어로 */}
        {canShowHero && <HeroCarousel items={trending.slice(0, 8)} />}

        {/* 에디터 추천작(=인기) */}
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

        {/* 실시간 인기 콘텐츠(=트렌딩) */}
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

        {/* 평점 좋은 작품 */}
        <section className="pb-12">
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
      </div>
    </div>
  );
}
