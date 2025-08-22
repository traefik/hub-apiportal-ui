import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useHasFeature } from './use-feature'
import * as usePortalModule from './use-portal'

// Mock usePortal
vi.spyOn(usePortalModule, 'usePortal')

describe('useHasFeature', () => {
  it('returns true if the feature is present', () => {
    vi.spyOn(usePortalModule, 'usePortal').mockReturnValue({ data: { features: ['foo', 'bar'] } } as any)
    const { result } = renderHook(() => useHasFeature('foo'))
    expect(result.current).toBe(true)
  })

  it('returns false if the feature is not present', () => {
    vi.spyOn(usePortalModule, 'usePortal').mockReturnValue({ data: { features: ['bar'] } } as any)
    const { result } = renderHook(() => useHasFeature('foo'))
    expect(result.current).toBe(false)
  })

  it('returns false if portal or features is undefined', () => {
    vi.spyOn(usePortalModule, 'usePortal').mockReturnValue({ data: undefined } as any)
    const { result } = renderHook(() => useHasFeature('foo'))
    expect(result.current).toBe(false)
  })
})
