// src/api/tmdb.js
const BASE_URL = "https://api.themoviedb.org/3";
const V3_KEY   = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_TMDB_KEY; // 호환
const V4_TOKEN = import.meta.env.VITE_TMDB_V4_TOKEN; // 선택

function q(params = {}) {
  const usp = new URLSearchParams(params);
  if (V3_KEY) usp.set("api_key", V3_KEY);
  return usp.toString();
}
function h() {
  const headers = { Accept: "application/json" };
  if (!V3_KEY && V4_TOKEN) headers.Authorization = `Bearer ${V4_TOKEN}`;
  return headers;
}
function assertAuth() {
  if (!V3_KEY && !V4_TOKEN) {
    throw new Error("TMDB 인증값 없음: .env에 VITE_TMDB_API_KEY 또는 VITE_TMDB_V4_TOKEN 설정");
  }
}

export function tmdbImage(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

export async function fetchPopularMovies(page = 1, language = "ko-KR") {
  assertAuth();
  const url = `${BASE_URL}/movie/popular?${q({ page, language })}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`인기 영화 실패(${r.status})`);
  return r.json();
}

export async function fetchTopRatedMovies(page = 1, language = "ko-KR") {
  assertAuth();
  const url = `${BASE_URL}/movie/top_rated?${q({ page, language })}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`최고평점 실패(${r.status})`);
  return r.json();
}

export async function fetchTrendingMovies(time = "week") {
  assertAuth();
  const url = `${BASE_URL}/trending/movie/${time}?${q({})}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`트렌딩 실패(${r.status})`);
  return r.json();
}

export async function fetchGenres(language = "ko-KR") {
  assertAuth();
  const url = `${BASE_URL}/genre/movie/list?${q({ language })}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`장르 실패(${r.status})`);
  return r.json();
}

export async function searchMovies(query, page = 1, language = "ko-KR") {
  assertAuth();
  const url = `${BASE_URL}/search/movie?${q({ query, page, language, include_adult: false })}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`검색 실패(${r.status})`);
  return r.json();
}

export async function discoverMovies({ page = 1, language = "ko-KR", sort_by = "popularity.desc", with_genres = "", include_adult = false }) {
  assertAuth();
  const url = `${BASE_URL}/discover/movie?${q({ page, language, sort_by, with_genres, include_adult })}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`디스커버 실패(${r.status})`);
  return r.json();
}

export async function fetchMovieDetails(id, language = "ko-KR") {
  assertAuth();
  const url = `${BASE_URL}/movie/${id}?${q({ language })}`;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`상세 실패(${r.status})`);
  return r.json();
}
