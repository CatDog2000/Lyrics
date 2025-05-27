// player.js (module)
import { parseLRC, getMeta } from './lrcParser.js';
import { startSync, stopSync } from './syncEngine.js';
import { mount, highlight } from './renderer.js';
import { fireLyricChange } from './stateBus.js';

const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');
let linesJp = [];
let linesEn = [];

Promise.all([
  fetch('song_jp.lrc').then(res => res.text()),
  fetch('song_en.lrc').then(res => res.text())
])
  .then(([jpText, enText]) => {
    linesJp = parseLRC(jpText);
    linesEn = parseLRC(enText);
    // 時刻でマージ（同じindexで並べる）
    const merged = mergeLyrics(linesJp, linesEn);
    mount(lyricsContainer, merged, audio);
    // メタ情報表示（日本語優先）
    const meta = getMeta(jpText.split(/\r?\n/));
    if (meta.title) document.getElementById('title').textContent = meta.title;
    // 歌詞同期
    startSync(audio, merged, idx => {
      highlight(lyricsContainer, idx);
      if (idx >= 0) fireLyricChange(idx, merged[idx]);
    });
  })
  .catch(e => {
    lyricsContainer.textContent = '歌詞ファイルの読み込みエラー';
    console.error(e);
  });

// 2言語の歌詞を時刻でマージ
function mergeLyrics(jp, en) {
  // 両方同じ数・同じタイムスタンプ前提
  return jp.map((jpLine, i) => ({
    time: jpLine.time,
    text_jp: jpLine.text,
    text_en: en[i] ? en[i].text : ''
  }));
}

// ページ離脱時に同期停止
window.addEventListener('beforeunload', stopSync);