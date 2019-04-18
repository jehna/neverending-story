import React from 'react'
import styled from 'styled-components'
import { Atom, F } from '@grammarly/focal'
import { Vote } from '../../shared/app-state'

interface NoAction {
  type: 'none'
}

export type Action = Vote | NoAction

const Wrapper = styled(F.div)`
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;
  font-size: 0.9em;
  flex-wrap: wrap;
  max-width: 100%;
  justify-content: center;
  align-items: center;

  @media (max-width: 800px) {
    flex-direction: column;
  }
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
  max-width: 280px;
  width: 100%;

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
  showWordInput?: Atom<boolean>
  action?: Atom<Action>
  onSubmitWord?: () => void
}

export default ({
  showWordInput = Atom.create(true),
  action = Atom.create<Action>({ type: 'none' }),
  onSubmitWord
}: ActionsProps) => {
  const combined = Atom.combine(
    showWordInput,
    action,
    (visible, currentAction) => ({
      visible,
      actionSelected: currentAction.type !== 'none'
    })
  )
  return (
    <Wrapper>
      {combined.view(({ visible, actionSelected }) =>
        actionSelected ? null : visible ? (
          <Action onClick={onSubmitWord}>Vote</Action>
        ) : (
          <>
            <Action onClick={() => showWordInput.set(true)}>
              Vote for the next word
            </Action>
            <Action onClick={() => action.set({ type: 'delete-last-word' })}>
              Vote for removal of the latest word
            </Action>
            <Action
              onClick={() => action.set({ type: 'new-word', nextWord: '\n\n' })}
            >
              Vote for end of paragraph
            </Action>
          </>
        )
      )}
    </Wrapper>
  )
}
