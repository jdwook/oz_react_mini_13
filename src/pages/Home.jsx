import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPopularMovies, searchMovies, tmdbImage } from "../api/tmdb";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import SkeletonCard from "../components/SkeletonCard.jsx";
import SkeletonDetail from "../components/SkeletonDetail.jsx";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const page = Number(params.get("page") || "1");

  const displayed = useMemo(() => {
    if (window.matchMedia("(min-width:1024px)").matches) return 5;
    if (window.matchMedia("(min-width:640px)").matches) return 3;
    return 2;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = q
          ? await searchMovies(q, page)
          : await fetchPopularMovies(page);
        const safe = (data.results || []).filter((m) => m.adult === false);
        if (alive) setMovies(safe);
      } catch (e) {
        console.error("영화 불러오기 실패:", e);
        if (alive) setMovies([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [q, page]);

  const canLoop = movies.length > displayed;

  return (
    <div className="w-full min-h-screen text-white" style={{ backgroundColor: "#0B0F1E" }}>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <h1 className="mb-6 text-2xl font-bold">
          {q ? `검색 결과: “${q}”` : "인기 영화"}
        </h1>

        {/* 슬라이드 */}
        {loading ? (
          <div className="mb-10">
            <SkeletonDetail />
          </div>
        ) : movies.length > 0 ? (
          <Swiper
            key={`pop-${movies.length}-${displayed}`}
            modules={[Navigation, Autoplay]}
            navigation
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            loop={canLoop}
            rewind={!canLoop}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="mb-10"
          >
            {movies.map((m) => (
              <SwiperSlide key={m.id}>
                <Link
                  to={`/details/${m.id}`}
                  className="block overflow-hidden transition-transform bg-[#121833] shadow-md rounded-xl hover:scale-105"
                >
                  <img
                    src={tmdbImage(m.poster_path, "w300")}
                    alt={m.title}
                    className="object-cover w-full h-72"
                    loading="lazy"
                  />
                  <div className="p-2">
                    <h2 className="text-sm font-semibold truncate">{m.title}</h2>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="mb-10 text-white/60">검색 결과가 없습니다.</p>
        )}

        {/* 그리드 */}
        <div className="grid grid-cols-2 gap-6 pb-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)
            : movies.map((m) => (
                <Link
                  key={m.id}
                  to={`/details/${m.id}`}
                  className="block overflow-hidden transition-shadow bg-[#121833] shadow-md rounded-2xl hover:shadow-xl"
                >
                  <img
                    src={tmdbImage(m.poster_path, "w500")}
                    alt={m.title}
                    className="object-cover w-full h-72"
                    loading="lazy"
                  />
                  <div className="p-2">
                    <h2 className="text-base font-semibold truncate">{m.title}</h2>
                    <p className="text-sm text-white/60">
                      ⭐ {Number.isFinite(m.vote_average) ? m.vote_average.toFixed(1) : "N/A"}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
