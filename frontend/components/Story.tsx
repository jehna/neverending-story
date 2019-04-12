import React from 'react'
import NewStory from './NewStory'
import { AppState } from '../../shared/app-state'
import StateLoader from './StateLoader'
import Progress from './Progress'
import Actions, { StoryState } from './Actions'
import { Atom, F } from '@grammarly/focal'
import { voteForWord } from '../models/api'

export default ({
  state = Atom.create<StoryState>('choose'),
  nextWordToVote = Atom.create('')
}) => {
  const onSubmitWord = () =>
    voteForWord(nextWordToVote.get()).subscribe(() => {
      nextWordToVote.set('')
      state.set('voted')
    })

  return (
    <>
      <StateLoader
        onRoundStart={() => state.set('choose')}
        onInitialLoad={() => <p>Loading...</p>}
        onSuccess={({ story, msUntilNextRound }: AppState) => (
          <>
            {story.split('\n\n').map((t, i, stories) => (
              <F.p key={i}>
                {t}
                {state.view(
                  currentState =>
                    currentState === 'input-word' &&
                    i === stories.length - 1 && (
                      <NewStory
                        onSubmit={onSubmitWord}
                        newText={nextWordToVote}
                      />
                    )
                )}
              </F.p>
            ))}
            <Actions state={state} onSubmitWord={onSubmitWord} />
            <Progress time={msUntilNextRound} />
          </>
        )}
      />
    </>
  )
}
