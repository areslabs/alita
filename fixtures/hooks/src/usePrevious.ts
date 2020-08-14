import { useRef, useEffect } from 'react'

export const usePrevious = state => {
  const ref = useRef()

  useEffect(() => {
    ref.current = state
  })

  return ref.current
}
