// Lightweight fallback for language detection on Edge runtimes
// It replaces the native `whatlang-node` during EdgeOne builds.
// Note: This is heuristic and only meant as a best-effort fallback.

export function detectLang(text: string, short = true): string {
  // CJK Unified Ideographs (Chinese)
  if ([/\p{Script=Han}/u, /[\u4E00-\u9FFF]/u].some(r => r.test(text))) {
    return short ? 'ZH' : 'chinese'
  }
  // Hiragana, Katakana, and compatibility Katakana (Japanese)
  if (/[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/u.test(text)) {
    return short ? 'JA' : 'japanese'
  }
  // Hangul syllables and jamo (Korean)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/u.test(text)) {
    return short ? 'KO' : 'korean'
  }
  // Cyrillic
  if (/[\u0400-\u04FF]/u.test(text)) {
    return short ? 'RU' : 'russian'
  }
  // Default to English for Latin
  return short ? 'EN' : 'english'
}
