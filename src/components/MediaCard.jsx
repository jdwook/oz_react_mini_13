// src/components/MediaCard.jsx
import { Link } from "react-router-dom";
import { tmdbImage } from "../api/tmdb.js";

function MediaCard({ item, badge, to = `/details/${item.id}` }) {
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

      {/* gradient hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

export default MediaCard; // ✅ 반드시 default export
