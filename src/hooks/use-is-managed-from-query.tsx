import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function useIsManagedFromQuery() {
  const [searchParams] = useSearchParams()

  return useMemo(() => searchParams.get('isManaged') === 'true', [searchParams])
}
