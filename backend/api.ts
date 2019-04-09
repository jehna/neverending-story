import Router from 'koa-router'
import { Atom } from '@grammarly/focal'
import { AppState } from '../shared/app-state'
import { Subject } from 'rxjs/Subject'
import { flatMap } from 'rxjs/Operators'
import { timer } from 'rxjs/observable/timer'
const initialStory = require('./data.json')
const MAX_ROUND_LENGTH_MS = process.env.NODE_ENV === 'production' ? 30000 : 5000

const roundStartStore = Atom.create(Date.now())
const storyStore = Atom.create<string>(initialStory)

const appState = Atom.combine<number, string, AppState>(
  roundStartStore,
  storyStore,
  (timer, story) => ({
    story,
    msUntilNextRound: timer + MAX_ROUND_LENGTH_MS - Date.now()
  })
)

const resetTimer = () => roundStartStore.set(Date.now())
const waitForRound = () => timer(MAX_ROUND_LENGTH_MS)

roundStartStore.pipe(flatMap(waitForRound)).subscribe(resetTimer)

const router = new Router({
  prefix: '/api'
})

router.get('/state', ctx => {
  ctx.body = appState.get()
})

export default router
