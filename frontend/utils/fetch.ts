import { Atom } from "@grammarly/focal"
import { fromPromise } from "rxjs/observable/fromPromise"
import { flatMap } from "rxjs/operators"

interface NetworkRequestState_Success<T> {
  type: "Success"
  value: T
}
interface NetworkRequestState_Error {
  type: "Error"
  reason: string
}
interface NetworkRequestState_Loading {
  type: "Loading"
}

export type NetworkRequestState<T> =
  | NetworkRequestState_Success<T>
  | NetworkRequestState_Error
  | NetworkRequestState_Loading

export function getUrl<T>(
  url: string,
  data = Atom.create<NetworkRequestState<T>>({ type: "Loading" })
) {
  data.set({ type: "Loading" })

  fromPromise(fetch(url))
    .pipe(
      flatMap(v => {
        if (!v.ok) throw new Error("Not ok")
        return v.json() as Promise<T>
      })
    )
    .subscribe(
      value => data.set({ type: "Success", value }),
      (err: Error) => data.set({ type: "Error", reason: err.message })
    )

  return data
}
