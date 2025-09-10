// src/utils/validators.js

/** 이메일 형식 검증 */
export function isEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** 이름 검증: 2~8자, 한글/영문/숫자만 허용 */
export function isName(value) {
  if (!value) return false;
  return /^[A-Za-z0-9가-힣]{2,8}$/.test(value);
}

/** 비밀번호 검증: 영문 대/소문자 + 숫자 포함, 8자 이상 */
export function isPassword(value) {
  if (!value) return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
}

/** 두 값이 같은지 확인 */
export function equals(a, b) {
  return a === b;
}
