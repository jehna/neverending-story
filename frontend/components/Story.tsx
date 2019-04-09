import React from 'react'
import UrlLoader from './UrlLoader'
import NewStory from './NewStory'
import styled from 'styled-components'
import { AppState } from '../../shared/app-state'

const Wrapper = styled.main`
  margin: auto;
  font-size: 22px;
  max-width: 38em;
  padding: 0.5em;
  box-sizing: border-box;
  line-height: 1.6;
  white-space: pre-line;
  color: #313538;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smooth: always;
  font-feature-settings: 'onum' 1;
  color: #333;
  -moz-osx-font-smoothing: grayscale;
  font-family: Calibri, Georgia, serif;
  -webkit-text-size-adjust: 100%;
`

const FrontPage = styled.div`
  height: 87vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const Title = styled.h1`
  font-size: 3em;
  margin: 0;
  font-weight: 600;
  line-height: 1.1;

  @media (max-width: 500px) {
    font-size: 1.8em;
  }
`

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

const Author = styled.div`
  display: block;
  color: inherit;
  font-size: 1.4em;
  border-top: 2px #ccc groove;
  font-weight: 100;
  font-style: italic;
  padding-top: 0.1em;

  @media (max-width: 500px) {
    font-size: 0.8em;
  }
`

export default () => (
  <Wrapper>
    <FrontPage>
      <Title>Neverending story</Title>
      <Author>By: The Internet</Author>
    </FrontPage>
    <UrlLoader
      url="/api/state"
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
  </Wrapper>
)
