import React from 'react'
import { F, Atom } from '@grammarly/focal'
import styled from 'styled-components'
import { voteForWord } from '../models/api'

const Input = styled(F.input)`
  border: 0;
  display: inline-block;
  font-size: inherit;
  font-family: inherit;
  color: green;
  width: 3em;
`

const From = styled.form`
  display: inline-block;
`

interface NewStoryProps {
  newText?: Atom<string>
  onSubmit?: () => void
}

export default ({
  newText = Atom.create(''),
  onSubmit = () => voteForWord(newText.get()).subscribe(() => newText.set(''))
}: NewStoryProps) => {
  return (
    <>
      {' '}
      <From
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Input
          onChange={v => newText.set(sanitize(v.currentTarget.value))}
          value={newText}
          placeholder="..."
          autoFocus
        />
      </From>
    </>
  )
}

const sanitize = (str: string) => str.replace(/[^\w-.,!?]/g, '')
