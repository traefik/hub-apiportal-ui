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

import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import useLazyFetch from 'hooks/fetcher/use-lazy-fetch'
import useInvalidateQueries from 'hooks/query/use-invalidate-queries'
import useToasts from 'hooks/use-toasts'

type DeleteResourceProps = {
  defaultReturnTo?: string
  errorMessage?: string
  lastKnownVersion?: string
  mutateUrls: string[]
  onComplete?: () => void
  payload?: Record<string, boolean | number | string>
  resourceName: string
  successMessage?: string
  url: string
}

const useDeleteResource = ({
  defaultReturnTo,
  errorMessage,
  lastKnownVersion,
  mutateUrls,
  onComplete,
  payload,
  resourceName,
  successMessage,
  url,
}: DeleteResourceProps): [handleDelete: () => void, isDeleting: boolean] => {
  const navigate = useNavigate()
  const invalidateQueries = useInvalidateQueries()
  const [searchParams] = useSearchParams()
  const { addToast } = useToasts()

  const [deleteResource, { loading: isDeleting }] = useLazyFetch(url, {
    method: 'DELETE',
    ...(lastKnownVersion ? { headers: { 'Last-Known-Version': lastKnownVersion } } : {}),
  })

  const handleDelete = useCallback(async () => {
    try {
      const reqBody = JSON.stringify({
        ...payload,
      })
      await deleteResource({ ...(payload ? { body: reqBody } : {}) })

      for (const mutateUrl of mutateUrls) {
        invalidateQueries({ queryKey: [mutateUrl] })
      }
      addToast({ severity: 'success', message: successMessage || `Your ${resourceName} has been deleted` })
      if (defaultReturnTo) navigate(searchParams.get('returnTo') || defaultReturnTo)
      if (onComplete) onComplete()
    } catch (e) {
      console.error(e)
      addToast({
        severity: 'error',
        message: errorMessage || `An error occurred while deleting your ${resourceName}. Please try again later. ${e}.`,
        timeout: 60000,
      })
    }
  }, [
    addToast,
    defaultReturnTo,
    deleteResource,
    errorMessage,
    invalidateQueries,
    mutateUrls,
    navigate,
    onComplete,
    payload,
    resourceName,
    searchParams,
    successMessage,
  ])

  return [handleDelete, isDeleting]
}

export default useDeleteResource
