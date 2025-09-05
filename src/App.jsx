import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail"; // 상세 페이지 컴포넌트

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* "/" → Home */}
          <Route index element={<Home />} />
          {/* "/details/:id" → MovieDetail */}
          <Route path="details/:id" element={<MovieDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}