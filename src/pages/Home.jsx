// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularMovies, tmdbImage } from "../api/tmdb";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// ⬇️ 확장자 .jsx까지 정확히 명시
import SkeletonCard from "../components/SkeletonCard.jsx";
import SkeletonDetail from "../components/SkeletonDetail.jsx";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPopularMovies();
        // 성인물 제외
        setMovies((data.results || []).filter((m) => m.adult === false));
      } catch (err) {
        console.error("영화 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 현재 화면 크기에 따른 보여줄 카드 수
  const getDisplayedSlides = () => {
    if (window.matchMedia("(min-width:1024px)").matches) return 5;
    if (window.matchMedia("(min-width:640px)").matches) return 3;
    return 2;
  };

  const displayed = getDisplayedSlides();
  const canLoop = movies.length > displayed;

  return (
    <div className="w-full min-h-screen text-white bg-gray-950">
      <h1 className="mb-6 text-2xl font-bold">인기 영화</h1>

      {/* 슬라이드 영역 */}
      {loading ? (
        <div className="mb-10">
          <SkeletonDetail />
        </div>
      ) : (
        <Swiper
          key={`pop-${movies.length}-${displayed}`}
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}
          loop={canLoop}
          rewind={!canLoop}
          watchOverflow
          slidesPerGroup={1}
          observer
          observeParents
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          preventClicks={false}
          preventClicksPropagation={false}
          onInit={(sw) => sw.autoplay?.start()}
          className="mb-10"
        >
          {movies.map((m) => (
            <SwiperSlide key={m.id}>
              <Link
                to={`/details/${m.id}`}
                className="block overflow-hidden transition-transform bg-gray-800 shadow-md rounded-xl hover:scale-105"
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
      )}

      {/* 그리드 영역 */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)
          : movies.map((m) => (
              <Link
                key={m.id}
                to={`/details/${m.id}`}
                className="block overflow-hidden transition-shadow bg-gray-800 shadow-md rounded-2xl hover:shadow-xl"
              >
                <img
                  src={tmdbImage(m.poster_path, "w500")}
                  alt={m.title}
                  className="object-cover w-full h-72"
                  loading="lazy"
                />
                <div className="p-2">
                  <h2 className="text-base font-semibold truncate">{m.title}</h2>
                  <p className="text-sm text-gray-400">
                    ⭐ {m.vote_average?.toFixed(1) ?? "N/A"}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
