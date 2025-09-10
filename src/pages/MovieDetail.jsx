// src/pages/MovieDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { fetchMovieDetails, tmdbImage } from "../api/tmdb.js";
import SkeletonDetail from "../components/SkeletonDetail.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import bookmark from "../lib/bookmark.js";

function Info({ label, value }) {
  return (
    <div className="p-4 bg-gray-800/60 rounded-xl">
      <p className="mb-1 text-sm text-gray-400">{label}</p>
      <p className="text-base font-semibold text-white">{value}</p>
    </div>
  );
}

export default function MovieDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError("");
    fetchMovieDetails(id)
      .then((d) => {
        setMovie(d);
        setBookmarked(bookmark.has(d.id));
      })
      .catch((e) => setError(e.message || "불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  const onBookmark = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      const next = encodeURIComponent(loc.pathname + loc.search);
      nav(`/login?next=${next}`);
      return;
    }
    if (!movie) return;
    setBookmarked(bookmark.toggle(movie));
  };

  if (loading) return <SkeletonDetail />;
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-950">
        <div className="space-y-4 text-center">
          <p className="text-red-400">오류: {error}</p>
          <Link to="/" className="underline">목록으로</Link>
        </div>
      </div>
    );
  }
  if (!movie) return null;

  return (
    <div className="w-full min-h-screen text-white bg-gray-950">
      {/* 히어로 */}
      <header
        className="relative w-full min-h-[40vh] md:min-h-[46vh] flex items-end"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${tmdbImage(movie.backdrop_path, "original")})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative w-full px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/"
              className="inline-block px-4 py-2 mb-4 text-gray-900 rounded-xl bg-white/90 hover:bg-white"
            >
              ← 목록으로
            </Link>
            <h1 className="text-3xl font-extrabold md:text-5xl drop-shadow">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-2 text-sm text-white/80 md:text-base">“{movie.tagline}”</p>
            )}

            {/* ✅ 상세페이지 전용 북마크 버튼 */}
            <div className="mt-4">
              <button
                type="button"
                onClick={onBookmark}
                className={
                  "px-4 py-2 rounded-lg text-sm font-medium border transition " +
                  (bookmarked
                    ? "bg-[#3366FF] border-[#3366FF] text-white hover:brightness-110"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20")
                }
              >
                {bookmarked ? "북마크 해제" : "북마크"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="w-full px-6">
        <div className="max-w-6xl pt-10 pb-16 mx-auto">
          <div className="flex flex-col items-start gap-8 md:flex-row md:gap-10">
            {/* 포스터 */}
            <div className="shrink-0">
              {movie.poster_path ? (
                <img
                  src={tmdbImage(movie.poster_path, "w500")}
                  alt={movie.title}
                  className="w-56 shadow-2xl md:w-64 rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center w-56 text-gray-300 md:w-64 h-80 rounded-2xl bg-gray-800/60">
                  No Image
                </div>
              )}
            </div>

            {/* 텍스트/정보 */}
            <section className="flex-1 w-full">
              <p className="mb-6 leading-relaxed text-gray-200/90">
                {movie.overview || "줄거리 정보가 없습니다."}
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="개봉일" value={movie.release_date || "-"} />
                <Info
                  label="평점"
                  value={
                    Number.isFinite(movie.vote_average)
                      ? `⭐ ${movie.vote_average.toFixed(1)}`
                      : "-"
                  }
                />
                <Info label="상영시간" value={movie.runtime ? `${movie.runtime}분` : "-"} />
                <Info
                  label="장르"
                  value={movie.genres?.length ? movie.genres.map((g) => g.name).join(", ") : "-"}
                />
                <Info label="원제" value={movie.original_title || "-"} />
                <Info label="언어" value={movie.original_language?.toUpperCase() || "-"} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
