// lrcParser.js
// LRCテキスト→[{time,text}]パース & メタ情報抽出

/**
 * @typedef {Object} LyricLine
 * @property {number} time - 秒(float)
 * @property {string} text
 */

/**
 * LRCテキストをパースしてLyricLine[]を返す
 * @param {string} text
 * @returns {LyricLine[]}
 */
export function parseLRC(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{1,2}))?](.*)/);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const cs = match[3] ? parseInt(match[3].padEnd(2, '0'), 10) : 0;
      const time = min * 60 + sec + cs / 100;
      result.push({ time, text: match[4].trim() });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

/**
 * LRCメタ情報を抽出
 * @param {string[]} lines
 * @returns {{title?:string, artist?:string}}
 */
export function getMeta(lines) {
  const meta = {};
  for (const line of lines) {
    if (line.startsWith('[ti:')) meta.title = line.slice(4, -1);
    if (line.startsWith('[ar:')) meta.artist = line.slice(4, -1);
  }
  return meta;
}
