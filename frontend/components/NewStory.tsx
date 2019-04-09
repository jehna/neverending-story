import React from 'react'
import { F, Atom } from '@grammarly/focal'
import styled from 'styled-components'

const Input = styled(F.input)`
  border: 0;
  display: inline-block;
  font-size: inherit;
  font-family: inherit;
  color: green;
  width: 3em;
`

export default ({ newText = Atom.create('') }) => (
  <>
    {' '}
    <Input
      onChange={v => newText.set(sanitize(v.currentTarget.value))}
      value={newText}
      placeholder="..."
      autoFocus
    />
  </>
)

const sanitize = (str: string) => str.replace(/[^\w-.,]/g, '')
