import React from 'react'
import NewStory from './NewStory'
import styled from 'styled-components'
import { AppState } from '../../shared/app-state'
import StateLoader from './StateLoader'
import Progress from './Progress'
import Actions from './Actions'

const Heading = styled.h2`
  font-family: inherit;
  font-size: 2em;
  font-weight: 600;
  color: #111;
  border-bottom: 2px groove #ccc;
  line-height: 1.1;
  padding-bottom: 0.2em;

  @media (max-width: 500px) {
    font-size: 1.3em;
  }
`

export default () => (
  <>
    <StateLoader
      onInitialLoad={() => <p>Loading...</p>}
      onSuccess={({ story, msUntilNextRound }: AppState) => (
        <>
          <span>
            {story.split('\n\n').map((t, i, stories) => (
              <p key={i}>
                {t}
                {i === stories.length - 1 && <NewStory />}
              </p>
            ))}
          </span>
          <Actions />
          <Progress time={msUntilNextRound} />
        </>
      )}
    />
  </>
)
