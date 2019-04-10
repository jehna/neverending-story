export const ROUND_TIME_MS =
  process.env.NODE_ENV === 'production' ? 15000 : 5000

export interface AppState {
  story: string
  msUntilNextRound: number
}
