export function getIdFromURL(url: string) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

export function buildURLToImage(id: string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
