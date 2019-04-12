import Router from 'koa-router'
import { Atom, Lens } from '@grammarly/focal'
import { AppState, ROUND_TIME_MS } from '../shared/app-state'
import { flatMap } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'
import { Round, Vote } from './round'
import knex, { Config } from 'knex'
const INITIAL_STORY = 'Once upon a time'
const ENV = process.env.NODE_ENV || 'development'
const db = knex(require('../knexfile')[ENV] as Config)

const roundStartStore = Atom.create(Date.now())
const storyStore = Atom.create<string>('')
const roundStore = Atom.create<Round>({ type: 'Open', votes: [] })

db.select('word').from('words').then((words: { word: string}[]) => storyStore.set(words.map(w => w.word).join(' ')))

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

const addWord = async () => {
  const { votes } = roundStore.get()
  if (votes.length === 0) return

  const winningVote = takeRandom(votes)
  if (winningVote.type === 'new-word') {
    const { nextWord: winningWord } = winningVote
    storyStore.modify(story => story.concat(' ', winningWord))
    await db.insert({ word: winningWord }).into('words')
  } else if (winningVote.type === 'delete-last-word') {
    storyStore.modify(story => story.slice(0, story.lastIndexOf(' ')))
    await db.delete().from('words').where('id', db('words').max('id'))
  }
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
  const vote: Vote = { type: 'new-word', nextWord: word }

  // Add cote to round
  roundStore.set(votesLens.modify(votes => [...votes, vote], currentRound))

  ctx.status = 201
})

router.delete('/vote/', ctx => {
  const vote: Vote = { type: 'delete-last-word' }

  // Add cote to round
  const votesLens = Lens.key<Round>()('votes')
  const currentRound = roundStore.get()
  roundStore.set(votesLens.modify(votes => [...votes, vote], currentRound))

  ctx.status = 204
})

const isValidWord = (word: string) => /^[\w-.,!?]+$|^\n\n$/.test(word)

export default router
