import React from 'react'
import UrlLoader from './UrlLoader'
import NewStory from './NewStory'
import styled from 'styled-components'
import { AppState } from '../../shared/app-state'

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
    <UrlLoader
      url="/api/state"
      onLoading={() => <p>Loading...</p>}
      onSuccess={({ story }: AppState) => (
        <>
          <Heading>Chapter 1</Heading>
          <span>
            {story.split('\n\n').map((t, i, stories) => (
              <p key={i}>
                {t}
                {i === stories.length - 1 && <NewStory />}
              </p>
            ))}
          </span>
        </>
      )}
    />
  </>
)
