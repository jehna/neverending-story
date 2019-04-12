interface VoteNewWord {
  type: 'new-word'
  nextWord: string
}

interface VoteDeleteWord {
  type: 'delete-last-word'
}

export type Vote = VoteNewWord | VoteDeleteWord

interface OpenRound {
  type: 'Open',
  votes: readonly Vote[]
}

export type Round = OpenRound