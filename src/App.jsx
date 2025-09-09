// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// 레이아웃 & 페이지
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Trending from "./pages/Trending.jsx";
import Top from "./pages/Top.jsx";
import Genres from "./pages/Genres.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ 전역 인증 컨텍스트로 전체 앱 감싸기 */}
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            {/* 홈 */}
            <Route index element={<Home />} />

            {/* 상세 */}
            <Route path="details/:id" element={<MovieDetail />} />

            {/* 인증 */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            {/* 메뉴 페이지들 */}
            <Route path="trending" element={<Trending />} />
            <Route path="top" element={<Top />} />
            <Route path="genres" element={<Genres />} />

            {/* 없는 경로 → 홈으로 */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
