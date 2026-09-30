import { useCallback, useEffect, useState } from 'react'

type State<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string }

export function useAsync<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ status: 'loading', data: null, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })
    fn()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({
            status: 'error',
            data: null,
            error: e instanceof Error ? e.message : 'Terjadi kesalahan tak terduga.',
          })
      })
    return () => {
      cancelled = true
    }
    // fn adalah fungsi service module-level yang stabil; hanya reload() yang memicu ulang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
