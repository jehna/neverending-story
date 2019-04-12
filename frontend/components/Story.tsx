import React, { useEffect } from 'react'
import NewStory from './NewStory'
import { AppState } from '../../shared/app-state'
import StateLoader from './StateLoader'
import Progress from './Progress'
import Actions, { Action } from './Actions'
import { Atom, F } from '@grammarly/focal'
import styled from 'styled-components'
import { voteForWord, voteForRemoval } from '../models/api'

const NewWord = styled.span`
  color: green;
`

const DeleteWord = styled.span`
  color: red;
`

export default ({
  showWordInput = Atom.create(false),
  action = Atom.create<Action>(undefined),
  nextWordToVote = Atom.create('')
}) => {
  const onSubmitWord = () =>
    action.set({ type: 'new-word', nextWord: nextWordToVote.get() })

  useEffect(() => {
    const subscription = action.subscribe(currentAction => {
      nextWordToVote.set('')
      showWordInput.set(false)
      performAction(currentAction)
    })
    return () => subscription.unsubscribe()
  })

  return (
    <>
      <StateLoader
        onRoundStart={() => action.set(undefined)}
        onInitialLoad={() => <p>Loading...</p>}
        onSuccess={({ story, msUntilNextRound }: AppState) => (
          <>
            {story.split('\n\n').map((t, i, stories) => (
              <F.p key={i}>
                {action.view(currentAction =>
                  !currentAction || i < stories.length - 1 ? (
                    t
                  ) : currentAction.type === 'new-word' ? (
                    <>
                      {t}{' '}
                      <NewWord>
                        {currentAction.nextWord === '\n\n'
                          ? '¶'
                          : currentAction.nextWord}
                      </NewWord>
                    </>
                  ) : (
                    <>
                      {t.slice(0, t.lastIndexOf(' '))}
                      <DeleteWord>{t.slice(t.lastIndexOf(' '))}</DeleteWord>
                    </>
                  )
                )}
                {showWordInput.view(
                  visible =>
                    visible &&
                    i === stories.length - 1 && (
                      <NewStory
                        onSubmit={onSubmitWord}
                        newText={nextWordToVote}
                      />
                    )
                )}
                &nbsp;
              </F.p>
            ))}
            <Actions
              showWordInput={showWordInput}
              onSubmitWord={onSubmitWord}
              action={action}
            />
            <Progress time={msUntilNextRound} />
          </>
        )}
      />
    </>
  )
}

const performAction = (action: Action) => {
  if (!action) return

  switch (action.type) {
    case 'new-word':
      return voteForWord(action.nextWord)
    case 'delete-last-word':
      return voteForRemoval()
  }
}
