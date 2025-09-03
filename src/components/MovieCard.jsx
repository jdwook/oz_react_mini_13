export default function MovieCard({ posterPath, title, rating, baseUrl }) {
  const src = posterPath ? `${baseUrl}${posterPath}` : "/no-image.png";
  return (
    <div className="overflow-hidden rounded-lg bg-gray-900 text-white shadow hover:scale-105 transition-transform">
      <img src={src} alt={title} className="aspect-[2/3] w-full object-cover" />
      <div className="p-2">
        <h3 className="truncate text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-400">평점: {Number(rating).toFixed(2)}</p>
      </div>
    </div>
  );
}