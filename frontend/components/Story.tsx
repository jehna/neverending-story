import React from 'react'
import { lift } from '@grammarly/focal'
import styled from 'styled-components'
import { Action } from './Actions'

const NewWord = styled.span`
  color: green;
`

const DeleteWord = styled.span`
  color: red;
`

const Paragraph: React.SFC<{
  paragraph: string
  isLast: boolean
  action: Action
  additionalWord: JSX.Element
}> = ({ paragraph, isLast, action, additionalWord }) => {
  if (!isLast) {
    return <p>{paragraph}</p>
  }

  switch (action.type) {
    case 'none':
      return (
        <p>
          {paragraph} {additionalWord}
        </p>
      )
    case 'new-word':
      return (
        <p>
          {paragraph} <NewWord>{formatWord(action.nextWord)}</NewWord>
        </p>
      )
    case 'delete-last-word': {
      const lastWord = paragraph.slice(paragraph.lastIndexOf(' '))
      const otherWords = paragraph.slice(0, paragraph.lastIndexOf(' '))
      return (
        <p>
          {otherWords}
          <DeleteWord>{formatWord(lastWord)}</DeleteWord>
        </p>
      )
    }
  }
}

interface StoryProps {
  story: string
  action: Action
  additionalWord: JSX.Element
}

const Story: React.SFC<StoryProps> = ({ story, action, additionalWord }) => {
  return (
    <>
      {story.split(/\n\n(?!$)/).map((paragraph, i, stories) => (
        <Paragraph
          key={i}
          isLast={i === stories.length - 1}
          paragraph={paragraph}
          action={action}
          additionalWord={additionalWord}
        />
      ))}
    </>
  )
}

const formatWord = (word: string) => (word.trim() === '' ? ' ¶' : word)

export default lift(Story)
