// src/hooks/useThrottle.js
import { useRef, useCallback } from "react";

/**
 * 함수 실행을 지정한 delay(ms) 단위로 제한하는 훅
 * @param {Function} fn 실행할 함수
 * @param {number} delay 지연 시간(ms), 기본값 500ms
 */
export default function useThrottle(fn, delay = 500) {
  const last = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - last.current >= delay) {
      last.current = now;
      fn(...args);
    }
  }, [fn, delay]);
}
