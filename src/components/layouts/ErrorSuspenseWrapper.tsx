/*
Copyright (C) 2022-2025 Traefik Labs
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import React, { ComponentType, ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import ErrorFallback from 'components/layouts/ErrorFallback'

type SuspenseWrapperProps = {
  children?: ReactNode
  errorFallback?: ComponentType<FallbackProps>
  silentFail?: boolean
  suspenseFallback?: ReactNode
}

export default function ErrorSuspenseWrapper({
  children,
  errorFallback = ErrorFallback,
  silentFail = false,
  suspenseFallback = null,
}: SuspenseWrapperProps) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary FallbackComponent={silentFail ? () => null : errorFallback} onReset={reset}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
