import React from 'react'
import Story from './Story'
import StateLoader from './StateLoader'
import Progress from './Progress'
import { Atom } from '@grammarly/focal'
import Actions, { Action } from './Actions'
import { voteForWord, voteForRemoval } from '../models/api'
import NewStory from './NewStory'
import { showIf } from '../utils/atom-utils'

const showWordInput = Atom.create(false)
const action = Atom.create<Action>({ type: 'none' })
const nextWordToVote = Atom.create('')

const onSubmitWord = () =>
  action.set({ type: 'new-word', nextWord: nextWordToVote.get() })

const performAction = (action: Action) => {
  if (!action) return

  switch (action.type) {
    case 'new-word':
      return voteForWord(action.nextWord)
    case 'delete-last-word':
      return voteForRemoval()
  }
}

action.subscribe(currentAction => {
  nextWordToVote.set('')
  showWordInput.set(false)
  performAction(currentAction)
})

export default () => (
  <StateLoader
    onRoundStart={() => action.set({ type: 'none' })}
    onInitialLoad={() => <p>Loading...</p>}
    onSuccess={({ story, msUntilNextRound }) => (
      <>
        <Story
          story={story}
          action={action}
          additionalWord={showIf(
            showWordInput,
            <NewStory onSubmit={onSubmitWord} newText={nextWordToVote} />
          )}
        />
        <Actions
          showWordInput={showWordInput}
          onSubmitWord={onSubmitWord}
          action={action}
        />
        <Progress time={msUntilNextRound} />
      </>
    )}
  />
)
