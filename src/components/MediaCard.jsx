import { Link } from "react-router-dom";
import { tmdbImage } from "../api/tmdb.js";
import { has as wishHas, toggle as wishToggle } from "../lib/wishlist.js";
import { useEffect, useState } from "react";

function MediaCard({ item, badge, to = `/details/${item.id}` }) {
  const [liked, setLiked] = useState(wishHas(item.id));

  // 외부에서 변경되었을 때도 반영
  useEffect(() => {
    const off = () => setLiked(wishHas(item.id));
    window.addEventListener("wishlist:change", off);
    return () => window.removeEventListener("wishlist:change", off);
  }, [item.id]);

  const onHeart = (e) => {
    e.preventDefault(); // 카드 링크 이동 막기
    e.stopPropagation();
    const now = wishToggle(item);
    setLiked(now);
  };

  return (
    <Link
      to={to}
      className="block group relative rounded-2xl overflow-hidden bg-[#121833] border border-white/5"
    >
      {/* badge */}
      {badge && (
        <span className="absolute left-2 top-2 z-10 rounded-md px-2 py-0.5 text-[11px] font-semibold
                         bg-fuchsia-600/90 text-white shadow">
          {badge}
        </span>
      )}

      {/* poster */}
      <img
        src={tmdbImage(item.poster_path, "w500")}
        alt={item.title}
        className="w-full h-[280px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
      />

      {/* title */}
      <div className="px-2.5 py-2">
        <p className="text-sm font-medium text-white truncate">{item.title}</p>
      </div>

      {/* ♥ 버튼 */}
      <button
        type="button"
        onClick={onHeart}
        aria-label={liked ? "찜 해제" : "찜하기"}
        className="absolute right-2 bottom-2 z-10 rounded-full px-2.5 py-1 text-sm
                   bg-black/50 hover:bg-black/70 border border-white/10"
      >
        <span className={liked ? "text-red-400" : "text-white/80"}>
          {liked ? "♥" : "♡"}
        </span>
      </button>

      {/* gradient hover */}
      <div className="absolute inset-0 transition-opacity opacity-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100" />
    </Link>
  );
}

export default MediaCard;
