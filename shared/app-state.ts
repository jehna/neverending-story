export const ROUND_TIME_MS =
  process.env.NODE_ENV === 'production' ? 15000 : 5000

export interface AppState {
  story: string
  msUntilNextRound: number
}

interface VoteNewWord {
  type: 'new-word'
  nextWord: string
}

interface VoteDeleteWord {
  type: 'delete-last-word'
}

export type Vote = VoteNewWord | VoteDeleteWord
