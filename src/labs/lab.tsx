import { type JSX } from 'react'
import { AttentionLab, MultiheadLab } from '@/labs/attention-lab'
import { DecoderLab, EncoderLab } from '@/labs/layer-lab'
import { EmbeddingLab } from '@/labs/embedding-lab'
import { FfnLab } from '@/labs/ffn-lab'
import { GenerationLab } from '@/labs/generation-lab'
import { GlossaryLab } from '@/labs/glossary-lab'
import { MaskLab } from '@/labs/mask-lab'
import { NormalizationLab } from '@/labs/normalization-lab'
import { OverviewLab } from '@/labs/overview-lab'
import { PositionLab } from '@/labs/position-lab'
import { TokenizerLab } from '@/labs/tokenizer-lab'
import { TrainingLab } from '@/labs/training-lab'

const labs = {
  overview: OverviewLab,
  tokenizer: TokenizerLab,
  embedding: EmbeddingLab,
  position: PositionLab,
  attention: AttentionLab,
  multihead: MultiheadLab,
  normalization: NormalizationLab,
  ffn: FfnLab,
  mask: MaskLab,
  encoder: EncoderLab,
  decoder: DecoderLab,
  training: TrainingLab,
  generation: GenerationLab,
  glossary: GlossaryLab,
} as const

type LabId = keyof typeof labs

function isLabId(id: string): id is LabId {
  return Object.hasOwn(labs, id)
}

export function Lab({ id }: { id: string }): JSX.Element | null {
  if (!isLabId(id)) return null
  const ActiveLab = labs[id]
  return <ActiveLab />
}
