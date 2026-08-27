// 发音地址拼接（联调确认的 base，如有道词典 dictvoice）
const AUDIO_BASE = 'https://dict.youdao.com/dictvoice';

/**
 * 拼接发音地址
 * @param word 单词
 * @param type 1=英式，2=美式
 */
export function audioUrl(word: string, type: 1 | 2): string {
  return `${AUDIO_BASE}?audio=${encodeURIComponent(word)}&type=${type}`;
}

/** 播放发音（音频加载失败时静默忽略） */
export function playAudio(src: string) {
  try {
    const audio = new Audio(src);
    audio.volume = 1;
    audio.play().catch(() => {});
  } catch {
    // 忽略播放失败
  }
}

/** 从相对发音参数（如 "ruler&type=1"）解析 type */
export function parseSpeechType(speech?: string): 1 | 2 {
  const m = speech?.match(/type=(\d)/);
  return m && m[1] === '2' ? 2 : 1;
}
