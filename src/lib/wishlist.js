// src/lib/wishlist.js
const LS_KEY = "wishlist_v1";

// 내부: 저장/로드
function read() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function write(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
  // 구독자 알림
  window.dispatchEvent(new CustomEvent("wishlist:change"));
}

/** 전체 목록 */
export function list() {
  return read();
}

/** 해당 id가 찜 상태인지 */
export function has(id) {
  return read().some((m) => m.id === id);
}

/** 추가(중복방지) */
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

/** 제거 */
export function remove(id) {
  write(read().filter((m) => m.id !== id));
}

/** 토글 (찜/해제) → true=찜됨, false=해제됨 */
export function toggle(movie) {
  if (has(movie.id)) {
    remove(movie.id);
    return false;
  } else {
    add(movie);
    return true;
  }
}

/** 상태 변경 구독 (언마운트 시 리턴 함수 호출) */
export function subscribe(handler) {
  const onChange = () => handler(list());
  window.addEventListener("wishlist:change", onChange);
  return () => window.removeEventListener("wishlist:change", onChange);
}
