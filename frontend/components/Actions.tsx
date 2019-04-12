import React from 'react'
import styled from 'styled-components'
import { Atom, F } from '@grammarly/focal'
import { voteForRemoval, voteForParagraph } from '../models/api'

export type StoryState = 'choose' | 'voted' | 'input-word'

const Wrapper = styled(F.div)`
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;
  font-size: 0.9em;
  flex-wrap: wrap;
  max-width: 100%;
  justify-content: center;
`

const Action = styled.button`
  border: 0;
  background: none;
  display: flex;
  appearance: none;
  font-size: inherit;
  font-family: inherit;
  box-sizing: border-box;
  color: #777;
  padding: 0.9em 1.3em;
  position: relative;
  margin: 0 1em;
  cursor: pointer;
  transition: transform 0.1s;
  margin-bottom: 1em;
  flex: 1;
  text-align: center;
  justify-content: center;
  max-width: 320px;

  &:hover {
    transform: translateY(-2px);

    &:after {
      transform: translateY(10px) scale(1.01);
    }
  }

  &:active {
    transform: translateY(5px);

    &:after {
      transform: translateY(3px) scale(0.95);
    }
  }

  &:after {
    content: '';
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: -2;
    background: #f4f4f4;
    filter: blur(6px);
    transform: translateY(8px);
    transition: transform 0.1s;
  }

  &:before {
    content: '';
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: -1;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0.3em;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }
`

interface ActionsProps {
  state?: Atom<StoryState>
  onSubmitWord?: () => void
}

export default ({
  state = Atom.create<StoryState>('choose'),
  onSubmitWord
}: ActionsProps) => (
  <Wrapper>
    {state.view(currentState => {
      switch (currentState) {
        case 'choose':
          return (
            <>
              <Action onClick={() => state.set('input-word')}>
                Vote for the next word
              </Action>
              <Action
                onClick={() =>
                  voteForRemoval().subscribe(() => state.set('voted'))
                }
              >
                Vote for removal of the latest word
              </Action>
              <Action
                onClick={() =>
                  voteForParagraph().subscribe(() => state.set('voted'))
                }
              >
                Vote for end of paragraph
              </Action>
            </>
          )
        case 'input-word':
          return <Action onClick={onSubmitWord}>Vote</Action>
        default:
          return null
      }
    })}
  </Wrapper>
)