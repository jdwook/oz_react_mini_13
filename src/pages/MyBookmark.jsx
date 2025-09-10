// src/pages/MyBookmark.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaCard from "../components/MediaCard.jsx";
import bookmark from "../lib/bookmark.js"; // default export 사용

export default function MyBookmark() {
  const [items, setItems] = useState(() => bookmark.list());

  useEffect(() => {
    // 변경 구독
    const off = bookmark.subscribe(setItems);
    // 마운트 시 동기화
    setItems(bookmark.list());
    return off;
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 text-white">
      <div className="mx-auto w-[min(92vw,1200px)] rounded-2xl bg-[#1b2038] border border-white/10 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">BOOKMARK</h2>
          <Link to="/mypage" className="text-sm text-white/70 hover:text-white">
            ← 마이페이지
          </Link>
        </div>
        <hr className="mt-4 border-white/10" />

        {items.length ? (
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((m) => (
              <MediaCard key={m.id} item={m} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-white/60">
            아직 북마크한 작품이 없어요. 상세 페이지에서 <b>북마크</b> 버튼을 눌러 추가하세요.
          </p>
        )}
      </div>
    </div>
  );
}
