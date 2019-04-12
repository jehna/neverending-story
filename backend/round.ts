import { Vote } from "../shared/app-state"

interface OpenRound {
  type: 'Open',
  votes: readonly Vote[]
}

export type Round = OpenRound