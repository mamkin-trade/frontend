export function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPair(pair: string) {
  return `${pair.slice(0, 3)}/${pair.slice(3)}`
}

export function formatVolume(volume: number) {
  return volume.toFixed(3)
}