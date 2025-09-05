import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MovieCard from "./MovieCard";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieSlider({ movies }) {
  return (
    <div className="relative">
      {/* 슬라이더 */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, Keyboard]}
        spaceBetween={16}
        slidesPerView={2}
        slidesPerGroup={2}
        navigation
        // ✅ 도트를 슬라이더 밖의 커스텀 엘리먼트에 렌더
        pagination={{ el: ".slider-pagination", clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        loop
        speed={500}
        grabCursor
        breakpoints={{
          640:  { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 18 },
          768:  { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 22 },
          1280: { slidesPerView: 6, slidesPerGroup: 6, spaceBetween: 24 },
        }}
        // ✅ 도트가 카드 아래로 파고들지 않게, 컨테이너 높이만 사용
        className="pb-2"
      >
        {movies.map((m) => (
          <SwiperSlide key={m.id} className="h-auto">
            <Link to={`/details/${m.id}`} state={{ movie: m }} className="no-underline block h-full">
              {/* 카드 높이를 채워 균일하게 */}
              <div className="h-full">
                <MovieCard
                  posterPath={m.poster_path}
                  title={m.title}
                  rating={m.vote_average}
                  baseUrl={BASE_IMG_URL}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ 슬라이더 바깥에 위치한 도트 컨테이너 */}
      <div className="slider-pagination mt-2 flex justify-center" />
    </div>
  );
}