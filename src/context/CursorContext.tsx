/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { CursorMode } from '../types/content'

interface CursorContextValue {
  mode: CursorMode
  setMode: (mode: CursorMode) => void
  reset: () => void
}

const CursorContext = createContext<CursorContextValue | null>(null)

export function CursorProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<CursorMode>('default')

  const reset = useCallback(() => {
    setMode('default')
  }, [])

  const value = useMemo(
    () => ({
      mode,
      setMode,
      reset,
    }),
    [mode, reset],
  )

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}

export function useCursor() {
  const context = useContext(CursorContext)

  if (!context) {
    throw new Error('useCursor must be used inside CursorProvider')
  }

  return context
}