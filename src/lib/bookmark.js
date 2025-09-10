// src/lib/bookmark.js
const LS_KEY = "bookmark_v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function write(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
  window.dispatchEvent(new CustomEvent("bookmark:change"));
}

/** 전체 북마크 목록 */
export function list() {
  return read();
}

/** 특정 영화가 북마크 되어있는지 */
export function has(id) {
  return read().some((m) => m.id === id);
}

/** 북마크 추가 */
export function add(movie) {
  const arr = read();
  if (!arr.some((m) => m.id === movie.id)) {
    arr.push({
      id: movie.id,
      title: movie.title || movie.name || "",
      poster_path: movie.poster_path || "",
      vote_average: movie.vote_average ?? 0,
    });
    write(arr);
  }
}

/** 북마크 제거 */
export function remove(id) {
  write(read().filter((m) => m.id !== id));
}

/** 토글: true=북마크됨, false=해제됨 */
export function toggle(movie) {
  if (has(movie.id)) {
    remove(movie.id);
    return false;
  } else {
    add(movie);
    return true;
  }
}

/** 변경 구독 (언마운트 시 리턴 호출) */
export function subscribe(handler) {
  const onChange = () => handler(list());
  window.addEventListener("bookmark:change", onChange);
  return () => window.removeEventListener("bookmark:change", onChange);
}

/* ✅ 기본 내보내기 (default) */
const api = { list, has, add, remove, toggle, subscribe };
export default api;
