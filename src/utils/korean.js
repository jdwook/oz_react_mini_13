const CHOSEONG = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
];

export function toChoseong(str = "") {
  let out = "";
  for (const ch of String(str)) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const idx = Math.floor((code - 0xac00) / 588);
      out += CHOSEONG[idx];
    } else if (/[ㄱ-ㅎ]/.test(ch)) out += ch;
  }
  return out;
}

export function isChoseongQuery(q = "") {
  return q.trim() !== "" && /^[ㄱ-ㅎ]+$/.test(q.trim());
}

export function includesChoseong(title = "", q = "") {
  return toChoseong(title).includes(q.trim());
}
