export function formatNumber(value: number, places = 4): string {
  return Number(value.toFixed(places)).toString()
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function softmax(values: readonly number[]): number[] {
  const max = Math.max(...values)
  const exps = values.map((value) => Math.exp(value - max))
  const sum = exps.reduce((total, value) => total + value, 0)
  return exps.map((value) => value / sum)
}

export function dot(left: readonly number[], right: readonly number[]): number {
  return left.reduce((sum, value, index) => sum + value * (right[index] ?? 0), 0)
}

export function attentionWeights(query: readonly number[], keys: readonly (readonly number[])[]): number[] {
  const scale = Math.sqrt(query.length)
  return softmax(keys.map((key) => dot(query, key) / scale))
}

export function weightedSum(weights: readonly number[], values: readonly (readonly number[])[]): number[] {
  const width = values[0]?.length ?? 0
  return Array.from({ length: width }, (_, column) =>
    weights.reduce((sum, weight, index) => sum + weight * (values[index]?.[column] ?? 0), 0),
  )
}

export function positionalEncoding(position: number, dimension: number): number[] {
  return Array.from({ length: dimension }, (_, index) => {
    const pair = Math.floor(index / 2)
    const angle = position / 10000 ** ((2 * pair) / dimension)
    return index % 2 === 0 ? Math.sin(angle) : Math.cos(angle)
  })
}

export const VIZ_TOKENS = [
  { text: '我', id: 10 },
  { text: '喜欢', id: 25 },
  { text: '编程', id: 38 },
  { text: '爱', id: 5 },
  { text: '你', id: 6 },
  { text: 'I', id: 7 },
  { text: 'love', id: 8 },
  { text: 'you', id: 9 },
  { text: 'play', id: 41 },
  { text: 'er', id: 42 },
  { text: 's', id: 43 },
  { text: ' ', id: 44 },
] as const

export type TokenPiece = { piece: string; id: number }

export function tokenize(input: string): TokenPiece[] {
  const tokens: TokenPiece[] = []
  let rest = input
  while (rest.length > 0 && tokens.length < 48) {
    const match = VIZ_TOKENS.filter((token) => rest.startsWith(token.text)).sort(
      (left, right) => right.text.length - left.text.length,
    )[0]
    if (match) {
      tokens.push({ piece: match.text, id: match.id })
      rest = rest.slice(match.text.length)
      continue
    }
    const character = Array.from(rest)[0]
    if (!character) break
    tokens.push({ piece: character, id: 0 })
    rest = rest.slice(character.length)
  }
  return tokens
}

export const EMBED_ROWS = [
  { token: '我', id: 10, vector: [0.1, 0.2, 0.3, 0.4] },
  { token: '喜欢', id: 25, vector: [0.5, 0.1, 0.2, 0.3] },
  { token: '编程', id: 38, vector: [0.2, 0.4, 0.1, 0.5] },
  { token: '爱', id: 5, vector: [0.3, 0.6, 0.2, 0.7] },
  { token: '你', id: 6, vector: [0.4, 0.2, 0.5, 0.1] },
] as const

export const BASE_K = [
  [1, 0],
  [0, 1],
  [1, 1],
] as const

export const BASE_V = [
  [1, 0],
  [0, 2],
  [3, 1],
] as const

export const QUERY_OPTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
] as const

const W1 = [
  [0.5, -0.2, 0.1, 0.3, 0.4, 0, 0.2, -0.1],
  [0, 0.4, -0.3, 0.1, 0.2, 0.5, -0.1, 0.1],
  [0.2, 0.1, 0.2, -0.4, 0.1, -0.3, 0.2, 0.2],
  [0, -0.4, 0.2, -0.3, 0, 0.1, 0.4, -0.2],
] as const

const B1 = [0, -0.1, 0, -0.2, 0.1, -0.2, 0, -0.1] as const

const W2 = [
  [0.3, -0.2, 0.1, 0.4],
  [0.2, 0.1, -0.1, 0.3],
  [-0.1, 0.4, 0.2, -0.2],
  [0.5, 0.1, -0.4, 0.2],
  [0.1, -0.3, 0.2, 0.1],
  [-0.2, 0.2, 0.4, -0.1],
  [0.4, 0.2, -0.3, 0.2],
  [0.3, -0.1, 0.1, -0.4],
] as const

const B2 = [0.1, -0.1, 0, 0.05] as const

const BASE_INPUT = [1, 0, -1, 2] as const

function project(input: readonly number[], weights: readonly (readonly number[])[], bias: readonly number[]): number[] {
  return Array.from({ length: bias.length }, (_, column) => {
    const weighted = input.reduce((sum, value, row) => sum + value * (weights[row]?.[column] ?? 0), 0)
    return (bias[column] ?? 0) + weighted
  })
}

export const FFNU = project(BASE_INPUT, W1, B1)
export const FFNR = FFNU.map((value) => Math.max(0, value))
export const FFNO = project(FFNR, W2, B2)

export const BASE_INPUT_VECTOR = BASE_INPUT

export const GENERATION_SEQUENCE = ['<bos>', 'I', 'love', 'you', '<eos>'] as const

export const GENERATION_PROBABILITIES = [
  [0.08, 0.7, 0.22],
  [0.07, 0.84, 0.09],
  [0.05, 0.2, 0.75],
  [0.82, 0.1, 0.08],
] as const

export const GENERATION_LABELS = [
  ['love', 'I', 'you'],
  ['you', 'love', '<eos>'],
  ['I', 'love', 'you'],
  ['<eos>', 'love', 'I'],
] as const
