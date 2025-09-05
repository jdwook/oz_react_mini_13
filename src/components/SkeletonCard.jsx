export default function SkeletonCard() {
  return (
    <div className="overflow-hidden bg-gray-800 shadow-md rounded-2xl animate-pulse">
      <div className="w-full bg-gray-700 h-72" />
      <div className="p-2 space-y-2">
        <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}
