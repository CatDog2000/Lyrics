import { parseLRC, getMeta } from './lrcParser.js';

describe('lrcParser', () => {
  test('parseLRC should correctly parse LRC text', () => {
    const lrcText = `
[00:01.00]Line 1
[00:02.50]Line 2
[00:00.00]Line 0
`;
    const expected = [
      { time: 0, text: 'Line 0' },
      { time: 1, text: 'Line 1' },
      { time: 2.5, text: 'Line 2' },
    ];
    expect(parseLRC(lrcText)).toEqual(expected);
  });

  test('getMeta should extract title and artist', () => {
    const lrcLines = [
      '[ti:Song Title]',
      '[ar:Artist Name]',
      '[00:00.00]Lyric Line'
    ];
    const expected = {
      title: 'Song Title',
      artist: 'Artist Name'
    };
    expect(getMeta(lrcLines)).toEqual(expected);
  });
});
