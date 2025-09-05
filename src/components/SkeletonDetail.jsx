// src/components/SkeletonDetail.jsx
export default function SkeletonDetail() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen text-gray-400 bg-gray-950">
      <div className="w-full max-w-6xl px-6 space-y-4 animate-pulse">
        <div className="h-64 bg-gray-800 rounded-xl" />
        <div className="w-1/3 h-6 bg-gray-700 rounded" />
        <div className="w-2/3 h-4 bg-gray-700 rounded" />
        <div className="w-1/2 h-4 bg-gray-700 rounded" />
      </div>
    </div>
  );
}
