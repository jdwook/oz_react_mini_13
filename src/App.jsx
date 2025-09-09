import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

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
      <AuthProvider> {/* ✅ 전역 감싸기 */}
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="details/:id" element={<MovieDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="trending" element={<Trending />} />
            <Route path="top" element={<Top />} />
            <Route path="genres" element={<Genres />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
