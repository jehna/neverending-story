import Router from 'koa-router'
import { Atom, Lens } from '@grammarly/focal'
import { AppState } from '../shared/app-state'
import { flatMap } from 'rxjs/Operators'
import { timer } from 'rxjs/observable/timer'
import { Round, Vote } from './round'
const initialStory = require('./data.json')
const MAX_ROUND_LENGTH_MS = process.env.NODE_ENV === 'production' ? 30000 : 5000

const roundStartStore = Atom.create(Date.now())
const storyStore = Atom.create<string>(initialStory)
const roundStore = Atom.create<Round>({ type: 'Open', votes: [] })

const appState = Atom.combine<number, string, AppState>(
  roundStartStore,
  storyStore,
  (timer, story) => ({
    story,
    msUntilNextRound: timer + MAX_ROUND_LENGTH_MS - Date.now()
  })
)

const resetRound = () => {
  roundStartStore.set(Date.now())
  roundStore.set({ type: 'Open', votes: [] })
}
const waitForRound = () => timer(MAX_ROUND_LENGTH_MS)

roundStartStore.pipe(flatMap(waitForRound)).subscribe(resetRound)

const router = new Router({
  prefix: '/api'
})

router.get('/state', ctx => {
  ctx.body = appState.get()
})

router.post('/vote/:word', ctx => {
  const word = ctx.params.word
  if (!isValidWord(word)) {
    ctx.status = 400
    ctx.body = { message: 'Word not allowed' }
    return
  }

  const currentRound = roundStore.get()
  if (currentRound.type !== 'Open') {
    ctx.status = 400
    ctx.body = { message: 'New word entry not allowed on this round' }
    return
  }

  const votesLens = Lens.key<Round>()('votes')
  const vote: Vote = { ip: Math.random().toFixed(10), nextWord: word }

  // Add cote to round
  roundStore.set(votesLens.modify(votes => [...votes, vote], currentRound))

  ctx.status = 201
})

const isValidWord = (word: string) => /^[\w-.,]+$/.test(word)

export default router
