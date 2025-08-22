import { usePortal } from './use-portal'

export const useHasFeature = (featureName: string) => {
  const { data: portal } = usePortal()

  if (!featureName || !portal?.features) {
    return false
  }

  return portal.features.includes(featureName)
}
