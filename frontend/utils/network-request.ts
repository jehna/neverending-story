interface NetworkRequestState_Success<T> {
  type: 'Success'
  value: T
}
interface NetworkRequestState_Error {
  type: 'Error'
  reason: string
}
interface NetworkRequestState_Loading {
  type: 'Loading'
}

export type NetworkRequestState<T> =
  | NetworkRequestState_Success<T>
  | NetworkRequestState_Error
  | NetworkRequestState_Loading
