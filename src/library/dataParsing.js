function makeFilterList(data) {
  let trackName = [],
    albumName = [],
    artist = [],
    trackCode = [],
    albumCode = [];
  // 필터 리스트 배열 (중복 제거 루틴)
  for (let i = 0; i < data.length; i++) {
    trackName.push(data[i].trackName);
  }
  trackName = Array.from(new Set(trackName));

  for (let i = 0; i < data.length; i++) {
    albumName.push(data[i].albumName);
  }
  albumName = Array.from(new Set(albumName));

  for (let i = 0; i < data.length; i++) {
    artist.push(data[i].artist);
  }
  artist = Array.from(new Set(artist));

  for (let i = 0; i < data.length; i++) {
    trackCode.push(data[i].trackCode);
  }
  trackCode = Array.from(new Set(trackCode));

  for (let i = 0; i < data.length; i++) {
    albumCode.push(data[i].albumCode);
  }
  albumCode = Array.from(new Set(albumCode));

  return { trackName, trackCode, albumName, albumCode, artist };
}

export { makeFilterList };
