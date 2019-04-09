import React, { ReactNode } from 'react'
import { F, Atom } from '@grammarly/focal'
import { NetworkRequestState } from '../utils/network-request'
import { map, flatMap } from 'rxjs/operators'
import { AppState } from '../../shared/app-state'
import { timer } from 'rxjs/observable/timer'

const DATA_URL = '/api/state'

export interface AppStateLoaderProps {
  onSuccess: (value: AppState) => ReactNode
  onError?: (reason: string) => ReactNode
  onInitialLoad?: () => ReactNode
}

const data = Atom.create<NetworkRequestState<AppState>>({ type: 'Loading' })

const timerUntilNextRound = (request: NetworkRequestState<AppState>) =>
  request.type === 'Success' ? timer(request.value.msUntilNextRound) : timer(0)
const refreshData = () =>
  fetch(DATA_URL).then(r => r.json() as Promise<AppState>)

data
  .pipe(
    flatMap(timerUntilNextRound),
    flatMap(refreshData)
  )
  .subscribe(value => data.set({ type: 'Success', value }))

export default function StateLoader({
  onSuccess,
  onInitialLoad,
  onError
}: AppStateLoaderProps) {
  return (
    <F.Fragment>
      {data.pipe(
        map(value => {
          switch (value.type) {
            case 'Success':
              return onSuccess(value.value)
            case 'Loading':
              return onInitialLoad ? onInitialLoad() : null
            case 'Error':
              return onError ? onError(value.reason) : null
          }
        })
      )}
    </F.Fragment>
  )
}
