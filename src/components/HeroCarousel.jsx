// src/components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { tmdbImage } from "../api/tmdb.js";

export default function HeroCarousel({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={items.length > 1}
        centeredSlides={true}          // 중앙 배치
        slidesPerView={1.05}           // ✅ 카드 크게 (1.2 → 1.05)
        spaceBetween={12}              // 카드 간격 줄여서 꽉 차 보이게
        breakpoints={{
          640: { slidesPerView: 1.15, spaceBetween: 16 },
          1024: { slidesPerView: 1.25, spaceBetween: 20 },
          1440: { slidesPerView: 1.3, spaceBetween: 24 }, // 초대형 화면
        }}
        className="[&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!text-white"
      >
        {items.map((m) => (
          <SwiperSlide key={m.id}>
            <Link to={`/details/${m.id}`} className="relative block">
              <div
                className="w-full overflow-hidden shadow-2xl rounded-2xl"
                style={{
                  aspectRatio: "16 / 7", // ✅ 기존보다 세로 높임 (16/9 → 16/7)
                  backgroundImage: `url(${tmdbImage(
                    m.backdrop_path || m.poster_path,
                    "original"
                  )})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-2xl" />
              <div className="absolute left-8 bottom-10 max-w-[70%]">
                <h3 className="text-4xl font-extrabold md:text-5xl drop-shadow">
                  {m.title}
                </h3>
                {m.tagline && (
                  <p className="mt-2 text-lg md:text-xl text-white/85 line-clamp-2">
                    {m.tagline}
                  </p>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
