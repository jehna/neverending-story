import Router from 'koa-router'
import { Atom } from '@grammarly/focal'
import { AppState } from '../shared/app-state'

const appState = Atom.create<AppState>({
  story: require('./data.json')
})

const router = new Router({
  prefix: '/api'
})

router.get('/state', ctx => {
  ctx.body = appState.get()
})

export default router
