// syncEngine.js
// audio.currentTimeと歌詞配列を同期し“いまの行”を求める

let rafId = null;
let lastIndex = -1;

/**
 * @param {HTMLAudioElement} audio
 * @param {Array<{time:number,text:string}>} lines
 * @param {(index:number)=>void} onUpdate
 */
export function startSync(audio, lines, onUpdate) {
  stopSync();
  function findIndex(time) {
    // 二分探索
    let lo = 0, hi = lines.length - 1, res = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (time >= lines[mid].time) {
        res = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return res;
  }
  function loop() {
    const idx = findIndex(audio.currentTime);
    if (idx !== lastIndex) {
      lastIndex = idx;
      onUpdate(idx);
    }
    rafId = requestAnimationFrame(loop);
  }
  loop();
}

export function stopSync() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  lastIndex = -1;
}
