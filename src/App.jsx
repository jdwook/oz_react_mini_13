// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// 공용 레이아웃
import MainLayout from "./layouts/MainLayout.jsx";

// 페이지
import RootPage from "./pages/RootPage.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Trending from "./pages/Trending.jsx";
import Top from "./pages/Top.jsx";
import Genres from "./pages/Genres.jsx";

// 마이페이지 관련
import MyPage from "./pages/MyPage.jsx";
import MyWishlist from "./pages/MyWishlist.jsx";
import MyBookmark from "./pages/MyBookmark.jsx";

// 보호 라우트
import RequireAuth from "./routes/RequireAuth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            {/* 홈 */}
            <Route index element={<RootPage />} />

            {/* 상세 */}
            <Route path="details/:id" element={<MovieDetail />} />

            {/* 공개 페이지 */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="trending" element={<Trending />} />
            <Route path="top" element={<Top />} />
            <Route path="genres" element={<Genres />} />

            {/* 보호 라우트: 로그인 필요 */}
            <Route
              path="mypage"
              element={
                <RequireAuth>
                  <MyPage />
                </RequireAuth>
              }
            />
            <Route
              path="mypage/wishlist"
              element={
                <RequireAuth>
                  <MyWishlist />
                </RequireAuth>
              }
            />
            <Route
              path="mypage/bookmark"
              element={
                <RequireAuth>
                  <MyBookmark />
                </RequireAuth>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<RootPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
