import { fromPromise } from 'rxjs/observable/fromPromise'

export const voteForWord = (word: string) =>
  fromPromise(
    fetch('/api/vote/' + encodeURIComponent(word), { method: 'POST' })
  )

export const voteForRemoval = () =>
  fromPromise(fetch('/api/vote/', { method: 'DELETE' }))

export const voteForParagraph = () =>
  fromPromise(
    fetch('/api/vote/' + encodeURIComponent('\n\n'), { method: 'POST' })
  )
