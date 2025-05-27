// renderer.js
// DOM生成・ハイライト更新・クリックでシーク

/**
 * @param {HTMLElement} container
 * @param {Array<{time:number,text:string}>} lines
 * @param {HTMLAudioElement} audio
 */
export function mount(container, lines, audio) {
  container.innerHTML = '';
  lines.forEach(line => {
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.dataset.time = line.time;
    // 2言語横並び
    const jp = document.createElement('span');
    jp.className = 'lyric-jp';
    jp.textContent = line.text_jp || '';
    const en = document.createElement('span');
    en.className = 'lyric-en';
    en.textContent = line.text_en || '';
    div.appendChild(jp);
    div.appendChild(en);
    container.appendChild(div);
  });
  container.addEventListener('click', e => {
    const target = e.target.closest('.lyric-line');
    if (target) {
      audio.currentTime = Number(target.dataset.time);
    }
  });
}

/**
 * ハイライト更新
 * @param {HTMLElement} container
 * @param {number} index
 */
export function highlight(container, index) {
  const lines = container.querySelectorAll('.lyric-line');
  lines.forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  // アクセシビリティ: aria-live
  const live = document.getElementById('live');
  if (live && lines[index]) {
    // 日本語＋英語両方
    const jp = lines[index].querySelector('.lyric-jp')?.textContent || '';
    const en = lines[index].querySelector('.lyric-en')?.textContent || '';
    live.textContent = jp + (en ? ' / ' + en : '');
  }
}
