import { Context, useContext } from 'react'

export function useContextWrapper<T>(ReactContext: Context<T>, name: string) {
  const context = useContext(ReactContext)

  if (!context) {
    throw new Error(`use${name}Context must be used within a ${name}ContextProvider`)
  }

  return context
}
