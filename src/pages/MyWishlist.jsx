// src/pages/MyWishlist.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaCard from "../components/MediaCard.jsx";
import { list as wishList, subscribe as wishSubscribe } from "../lib/wishlist.js";

export default function MyWishlist() {
  const [items, setItems] = useState(() => wishList());

  useEffect(() => {
    // 최초 로드 + 변경 구독
    const off = wishSubscribe(setItems);
    setItems(wishList());
    return off;
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 text-white">
      <div className="mx-auto w-[min(92vw,1200px)] rounded-2xl bg-[#1b2038] border border-white/10 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">WISHLIST</h2>
          <Link to="/mypage" className="text-sm text-white/70 hover:text-white">← 마이페이지</Link>
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
            아직 찜한 작품이 없어요. 목록의 카드에서 ♥를 눌러 추가해보세요.
          </p>
        )}
      </div>
    </div>
  );
}
