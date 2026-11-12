import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { BASE_K, BASE_V, FFNO, FFNR, FFNU, dot, positionalEncoding, softmax } from '@/core'
import { GLOSSARY } from '@/content/glossary'

const near = (actual: number, expected: number, eps = 1e-6): void => {
  assert.ok(Math.abs(actual - expected) < eps, `${actual} != ${expected}`)
}

const lessonDir = path.resolve('src/content/lessons')

test('14 chapters with unique route ids', () => {
  const files = fs.readdirSync(lessonDir).filter((name) => name.endsWith('.mdx')).sort()
  assert.equal(files.length, 14)
  const ids = files.map((name) => {
    const text = fs.readFileSync(path.join(lessonDir, name), 'utf8')
    const id = text.match(/^id:\s+"([^"]+)"/m)?.[1]
    assert.ok(id, `${name} 缺少 id`)
    assert.ok(text.includes(`<LabSection id={"${id}"} />`) || text.includes(`<LabSection id={${JSON.stringify(id)}} />`))
    assert.ok(text.includes('<Formula'))
    assert.ok(text.includes('<Step'))
    return id
  })
  assert.equal(new Set(ids).size, 14)
  for (const id of ['tokenizer', 'embedding', 'position', 'attention', 'multihead', 'normalization', 'ffn', 'mask', 'encoder', 'decoder', 'training', 'generation']) {
    assert.ok(ids.includes(id))
  }
  const joined = files.map((name) => fs.readFileSync(path.join(lessonDir, name), 'utf8')).join('\n')
  for (const phrase of ['Causal Mask', 'Tokenizer', 'Cross-Attention', 'LayerNorm', 'Softmax', 'Generation']) {
    assert.ok(joined.includes(phrase))
  }
})

test('softmax preserves sum and sign', () => {
  const probabilities = softmax([1, 2, 3])
  near(probabilities.reduce((sum, value) => sum + value, 0), 1)
  probabilities.forEach((value) => assert.ok(value > 0 && value < 1))
  const last = probabilities[2]
  if (last === undefined) assert.fail('missing softmax value')
  near(last, 0.6652409558)
})

test('masked softmax puts 0 on future position', () => {
  const probabilities = softmax([1, 2, 3, Number.NEGATIVE_INFINITY])
  assert.equal(probabilities[3], 0)
  near((probabilities[0] ?? 0) + (probabilities[1] ?? 0) + (probabilities[2] ?? 0), 1)
})

test('attention single query correct weights and output', () => {
  const weights = softmax(BASE_K.map((key) => dot([1, 0], key) / Math.sqrt(2)))
  near(weights[0] ?? 0, 0.401112)
  near(weights[1] ?? 0, 0.197776)
  near(weights[2] ?? 0, 0.401112)
  const output = [0, 1].map((column) =>
    weights.reduce((sum, weight, index) => sum + weight * (BASE_V[index]?.[column] ?? 0), 0),
  )
  near(output[0] ?? 0, 1.604448, 0.00001)
  near(output[1] ?? 0, 0.796664, 0.00001)
})

test('classic positional encoding has correct dimension values', () => {
  const encoded = positionalEncoding(1, 4)
  near(encoded[0] ?? 0, Math.sin(1))
  near(encoded[1] ?? 0, Math.cos(1))
  near(encoded[2] ?? 0, Math.sin(0.01))
  near(encoded[3] ?? 0, Math.cos(0.01))
})

test('FFN expansion and projection shapes', () => {
  assert.equal(FFNU.length, 8)
  assert.equal(FFNR.length, 8)
  assert.equal(FFNO.length, 4)
  near(FFNU[0] ?? 0, 0.3)
  assert.equal(FFNR.filter((value) => value < 0).length, 0)
})

test('cross entropy decreases with higher true class logit', () => {
  const low = softmax([0.4, 1.2, 0.8])[0] ?? 0
  const high = softmax([2.4, 1.2, 0.8])[0] ?? 0
  assert.ok(-Math.log(high) < -Math.log(low))
})

test('glossary keeps twenty terms', () => {
  assert.equal(GLOSSARY.length, 20)
})
