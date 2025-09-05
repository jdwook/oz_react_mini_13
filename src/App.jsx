import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* index = "/" */}
          <Route index element={<Home />} />
          {/* ✅ 상대 경로로 "details/:id" */}
          <Route path="details/:id" element={<MovieDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}