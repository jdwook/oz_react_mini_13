import { useLocation, useParams } from "react-router-dom";
import movieListData from "../data/movieListData.json";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieDetail() {
  const { id } = useParams();
  const location = useLocation();
  const passed = location.state?.movie;

  const movie =
    passed || movieListData.results?.find((m) => Number(m.id) === Number(id));

  if (!movie) {
    return <div className="text-white">영화 정보를 찾을 수 없습니다. (id: {id})</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 text-white">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <img
            src={`${IMG_BASE}${movie.poster_path || movie.backdrop_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-yellow-400">평점: {movie.vote_average}</p>
          <p className="leading-6">{movie.overview || "줄거리 정보가 없습니다."}</p>
        </div>
      </div>
    </div>
  );
}
