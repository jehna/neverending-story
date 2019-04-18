import { ReadOnlyAtom } from '@grammarly/focal'

export function showIf<T, R>(atom: ReadOnlyAtom<T>, result: R) {
  return atom.view(value => value && result)
}
