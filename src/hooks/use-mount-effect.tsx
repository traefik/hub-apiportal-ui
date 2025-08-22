import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

type UseMountEffect = (effect: EffectCallback, deps?: DependencyList) => void

/**
 * useEffect wrapper to trigger effect and its cleanup only on component mount, then never again
 * @param effect Imperative function that can return a cleanup function
 * @param deps effect will activate once with initial values in this list.
 */
const useMountEffect: UseMountEffect = (effect, deps) => {
  const isMountedRef = useRef(false)

  useEffect(() => {
    const { current } = isMountedRef
    if (current === false) {
      isMountedRef.current = true
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useMountEffect
