import movieListData from "../data/movieListData.json";

const IMG = "https://image.tmdb.org/t/p/original";

export default function HeroBanner() {
  const hero = movieListData.results?.[0];
  if (!hero) return null;

  return (
    <section
      className="relative h-[42vw] max-h-[520px] min-h-[260px] overflow-hidden"
      style={{ backgroundImage: `url(${IMG}${hero.backdrop_path || hero.poster_path})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 pb-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold drop-shadow">{hero.title}</h2>
        <p className="mt-2 max-w-xl text-sm sm:text-base text-white/85 line-clamp-3">{hero.overview}</p>
        <div className="mt-4 flex gap-3">
          <button className="rounded-xl bg-white text-black font-semibold px-4 py-2">재생</button>
          <button className="rounded-xl bg-white/10 border border-white/20 px-4 py-2">상세정보</button>
        </div>
      </div>
    </section>
  );
}