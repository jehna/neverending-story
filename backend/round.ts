export interface Vote {
  ip: string // For catching bots
  nextWord: string
}

interface OpenRound {
  type: 'Open',
  votes: readonly Vote[]
}

export type Round = OpenRound