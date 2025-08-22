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
import { Flex } from '@traefiklabs/faency'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import ActiveSubscriptions, { ActiveSubscriptionsTableSkeleton } from './ActiveSubscriptions'

import ErrorSuspenseWrapper from 'components/layouts/ErrorSuspenseWrapper'
import { useAPI } from 'hooks/query/use-portal'

const ApiSettings = ({ setPanelOpen }: { setPanelOpen: (isPanelOpen: boolean) => void }) => {
  const { apiId, apiBundleId } = useParams()

  const api = useAPI(apiId, apiBundleId)

  const pageTitle = useMemo(() => {
    if (!apiId) return 'API Portal'
    return api?.title
  }, [api?.title, apiId])

  return (
    <Flex css={{ mx: '$3' }}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <ErrorSuspenseWrapper suspenseFallback={<ActiveSubscriptionsTableSkeleton />}>
        <ActiveSubscriptions
          subscriptions={api?.subscriptions || []}
          handleAddSubscription={() => {
            setPanelOpen(true)
          }}
          hasPlan={!!api?.plans?.length}
        />
      </ErrorSuspenseWrapper>
    </Flex>
  )
}

export default ApiSettings
