import React, { ReactNode } from "react"
import { F, Atom } from "@grammarly/focal"
import { getUrl, NetworkRequestState } from "../utils/fetch"
import { map } from "rxjs/operators"

export interface UrlLoaderProps<T> {
  url: string
  onSuccess: (value: T) => ReactNode
  onError?: (reason: string) => ReactNode
  onLoading?: () => ReactNode
  data?: Atom<NetworkRequestState<T>>
}

export default function UrlLoader<T>({
  url,
  data = getUrl(url),
  onSuccess,
  onLoading,
  onError
}: UrlLoaderProps<T>) {
  return (
    <F.Fragment>
      {data.pipe(
        map(value => {
          switch (value.type) {
            case "Success":
              return onSuccess(value.value)
            case "Loading":
              return onLoading ? onLoading() : null
            case "Error":
              return onError ? onError(value.reason) : null
          }
        })
      )}
    </F.Fragment>
  )
}
