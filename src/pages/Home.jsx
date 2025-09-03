import movieListData from "../data/movieListData.json";
import HeroBanner from "../components/HeroBanner";
import MovieSlider from "../components/MovieSlider";

export default function Home() {
  const movies = movieListData.results ?? [];

  const topRated = [...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 18);
  const latest   = [...movies].sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 18);

  return (
    <>
      {/* ✅ HeroBanner: 풀블리드 */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <HeroBanner />
      </div>

      {/* ✅ 인기순 */}
      <Section title="인기순">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <MovieSlider movies={topRated} />
        </div>
      </Section>

      {/* ✅ 최신 */}
      <Section title="최신">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <MovieSlider movies={latest} />
        </div>
      </Section>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6 mb-10">
      <div className="mx-auto max-w-7xl px-4 mb-3 flex items-baseline justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <button className="text-sm text-[#9b87f5] hover:underline">전체 보기</button>
      </div>
      {children}
    </section>
  );
}