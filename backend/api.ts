import Router from 'koa-router'
import { Atom, Lens } from '@grammarly/focal'
import { AppState, ROUND_TIME_MS } from '../shared/app-state'
import { flatMap } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'
import { Round, Vote } from './round'
const INITIAL_STORY = 'Once upon a time'

const roundStartStore = Atom.create(Date.now())
const storyStore = Atom.create<string>(INITIAL_STORY)
const roundStore = Atom.create<Round>({ type: 'Open', votes: [] })

const appState = Atom.combine<number, string, AppState>(
  roundStartStore,
  storyStore,
  (timer, story) => ({
    story,
    msUntilNextRound: timer + ROUND_TIME_MS - Date.now()
  })
)

function takeRandom<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const addWord = () => {
  const { votes } = roundStore.get()
  if (votes.length === 0) return

  const { nextWord: winningWord } = takeRandom(votes)
  storyStore.modify(story => story.concat(' ', winningWord))
}

const resetRound = () => {
  roundStartStore.set(Date.now())
  addWord()
  roundStore.set({ type: 'Open', votes: [] })
}
const waitForRound = () => timer(ROUND_TIME_MS)

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
