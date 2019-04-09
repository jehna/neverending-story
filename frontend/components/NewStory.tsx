import React from 'react'
import { F, Atom } from '@grammarly/focal'
import styled from 'styled-components'
import { fromPromise } from 'rxjs/observable/fromPromise'

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

export default ({ newText = Atom.create(''), lock = Atom.create(false) }) => {
  return (
    <F.Fragment>
      {lock.view(isLocked =>
        isLocked ? null : (
          <>
            {' '}
            <From
              onSubmit={e => {
                e.preventDefault()
                lock.set(true)
                submit(newText.get()).subscribe(() => newText.set(''))
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
      )}
    </F.Fragment>
  )
}

const sanitize = (str: string) => str.replace(/[^\w-.,]/g, '')

const submit = (word: string) =>
  fromPromise(
    fetch('/api/vote/' + encodeURIComponent(word), { method: 'POST' })
  )
