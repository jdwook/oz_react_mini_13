// src/pages/MyPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function MyPage() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-10 text-white">
      {/* 프로필 카드 */}
      <div className="mx-auto w-[min(92vw,1000px)] rounded-2xl bg-[#0E1324] border border-white/10 p-6 md:p-8">
        <div className="flex items-center gap-5">
          <img
            src={user.profileImageUrl}
            alt="avatar"
            className="object-cover w-20 h-20 border rounded-full border-white/10"
          />
          <div>
            <h1 className="text-2xl font-extrabold">{user.userName || "닉네임 없음"}</h1>
            <p className="mt-1 text-white/70">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 액션 카드 2개: 위시리스트 / 북마크 */}
      <div className="mx-auto mt-6 w-[min(92vw,1000px)] grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 위시리스트 카드 */}
        <button
          type="button"
          onClick={() => nav("/mypage/wishlist")}
          className="group flex items-center justify-between rounded-2xl bg-[#121833] border border-white/10 p-6
                     hover:bg-[#172044] transition text-left"
        >
          <div>
            <h2 className="text-xl font-bold">위시리스트</h2>
            <p className="mt-1 text-sm text-white/70">내가 ♥ 로 저장한 콘텐츠</p>
          </div>
          <span className="ml-4 text-white/60 text-2xl group-hover:translate-x-0.5 transition" aria-hidden>
            ›
          </span>
        </button>

        {/* 북마크 카드 */}
        <button
          type="button"
          onClick={() => nav("/mypage/bookmark")}
          className="group flex items-center justify-between rounded-2xl bg-[#121833] border border-white/10 p-6
                     hover:bg-[#172044] transition text-left"
        >
          <div>
            <h2 className="text-xl font-bold">북마크</h2>
            <p className="mt-1 text-sm text-white/70">상세 페이지에서 북마크한 콘텐츠</p>
          </div>
          <span className="ml-4 text-white/60 text-2xl group-hover:translate-x-0.5 transition" aria-hidden>
            ›
          </span>
        </button>
      </div>
    </div>
  );
}
