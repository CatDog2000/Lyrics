// stateBus.js
// 外部連携イベントを発火 (lyricChange)

export const bus = new EventTarget();

/**
 * 歌詞行が変わったときに発火
 * @param {number} index
 * @param {object} line
 */
export function fireLyricChange(index, line) {
  bus.dispatchEvent(new CustomEvent('lyricChange', { detail: { index, line } }));
}
