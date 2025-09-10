import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { tmdbImage } from "../api/tmdb.js";

export default function HeroCarousel({ items = [] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/30">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={items.length > 1}
        slidesPerView={1}
        className="[&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!text-white"
      >
        {items.map((m) => (
          <SwiperSlide key={m.id}>
            <Link to={`/details/${m.id}`} className="block">
              <div
                className="w-full"
                style={{
                  /* 16:6 정도의 와이드 */
                  aspectRatio: "16 / 6",
                  backgroundImage: `url(${tmdbImage(m.backdrop_path || m.poster_path, "original")})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute left-8 bottom-8 max-w-[50%]">
                <h3 className="text-3xl md:text-4xl font-extrabold drop-shadow">{m.title}</h3>
                {m.tagline && (
                  <p className="mt-2 text-white/85 line-clamp-2">{m.tagline}</p>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
