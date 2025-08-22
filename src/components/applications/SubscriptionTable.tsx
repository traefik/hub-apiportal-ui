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

import {
  AriaTable,
  AriaTbody,
  AriaTd,
  AriaThead,
  AriaTr,
  Tooltip,
  Flex,
  Text,
  VisuallyHidden,
} from '@traefiklabs/faency'
import React, { useMemo, useState } from 'react'

import UnsubscribeConfirmationModal from 'components/applications/UnsubscribeModal'
import ManagedByPublisher from 'components/shared/ManagedByPublisher'
import SubscriptionActions from 'components/shared/SubscriptionActions'
import AriaSortableTh from 'components/tables/AriaSortableTh'
import AriaTableEmptyState from 'components/tables/AriaTableEmptyState'
import AriaTableSkeleton from 'components/tables/AriaTableSkeleton'
import { useHasFeature } from 'hooks/query/use-feature'
import { SortingStateType, ToggleSortingType, useSort } from 'hooks/use-sort'
import { useSortHelpers } from 'hooks/use-sort-helpers'
import { formatLocaleDateTime, getAge } from 'utils/time'
import { formatUsageLimitDisplay, getNormalized } from 'utils/usage'

type SubscriptionTableHeadProps = {
  disableSorting?: boolean
  sortingState?: SortingStateType<UI.ApplicationDetailsSubscription>
  toggleSorting?: ToggleSortingType<UI.ApplicationDetailsSubscription>
}

const SubscriptionTableHead = ({ disableSorting, sortingState, toggleSorting }: SubscriptionTableHeadProps) => {
  const { onSort, order } = useSortHelpers(sortingState, toggleSorting)

  return (
    <AriaThead>
      <AriaTr>
        <AriaSortableTh label="API" />
        <AriaSortableTh
          label="Plan"
          isSortable={!disableSorting}
          onSort={onSort('plan.title')}
          order={order('plan.title')}
        />
        <AriaSortableTh
          label="Rate limit"
          isSortable={!disableSorting}
          onSort={onSort('normalizedRateLimit')}
          order={order('normalizedRateLimit')}
        />
        <AriaSortableTh
          label="Quota (currently at)"
          isSortable={!disableSorting}
          onSort={onSort('normalizedQuota')}
          order={order('normalizedQuota')}
        />
        <AriaSortableTh
          label="Subscribed since"
          isSortable={!disableSorting}
          onSort={onSort('createdAt')}
          order={order('createdAt')}
        />
        <AriaSortableTh
          label="Status"
          isSortable={!disableSorting}
          onSort={onSort('suspended')}
          order={order('suspended')}
        />
        <AriaSortableTh label="" css={{ width: '56px' }} />
      </AriaTr>
    </AriaThead>
  )
}

const SubscriptionTableRow = ({
  subscription,
  applicationName,
}: {
  subscription: API.ApplicationSubscription
  applicationName: string
}) => {
  const hasSelfSubsFeature = useHasFeature('self-service-subscription')
  const { api, plan, isManaged, createdAt, suspended } = subscription
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState<boolean>(false)
  const subscribedSince = useMemo(() => (isManaged ? 'Not applicable' : getAge(createdAt)), [createdAt, isManaged])
  const subscribedSinceFullDate = useMemo(
    () => (!isManaged ? formatLocaleDateTime(createdAt) : null),
    [createdAt, isManaged],
  )

  const quota = useMemo(() => {
    const usage = formatUsageLimitDisplay(plan?.quota)
    if (usage === 'Unlimited') return usage
    const currentQuota = plan?.quota ? `(${plan.quota.current} req)` : ''
    return `${usage} ${currentQuota}`.trim()
  }, [plan?.quota])

  const rateLimit = useMemo(() => formatUsageLimitDisplay(plan?.rateLimit), [plan?.rateLimit])

  return (
    <>
      <AriaTr css={{ height: '64px' }} data-testid="subscription-table-row">
        <AriaTd>
          <Flex direction="column" gap={2}>
            <Text>{api.title}</Text>
          </Flex>
        </AriaTd>

        <AriaTd>
          <Text>{plan?.title || '-'}</Text>
        </AriaTd>

        <AriaTd>
          <Text>{rateLimit}</Text>
        </AriaTd>

        <AriaTd>
          <Text>{quota}</Text>
        </AriaTd>

        <AriaTd>
          {subscribedSinceFullDate ? (
            <Tooltip content={subscribedSinceFullDate}>
              <Text css={{ cursor: 'pointer' }}>{subscribedSince}</Text>
            </Tooltip>
          ) : (
            <Text>{subscribedSince}</Text>
          )}
        </AriaTd>

        <AriaTd>
          <Text>{suspended ? 'Suspended' : 'Active'}</Text>
        </AriaTd>

        <AriaTd css={{ py: '$2' }}>
          {isManaged ? (
            <ManagedByPublisher resource="subscription" />
          ) : hasSelfSubsFeature ? (
            <SubscriptionActions suspended={suspended} setIsUnsubscribeModalOpen={setIsUnsubscribeModalOpen} />
          ) : null}
        </AriaTd>
      </AriaTr>

      {isUnsubscribeModalOpen ? (
        <UnsubscribeConfirmationModal
          isOpen
          onClose={() => setIsUnsubscribeModalOpen(false)}
          subscription={{ ...subscription }}
          applicationName={applicationName}
        />
      ) : null}
    </>
  )
}

type SubscriptionTableProps = {
  disableSorting?: boolean
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  application: API.Application
}

export default function SubscriptionTable({
  disableSorting = false,
  sortKey = 'createdAt',
  sortOrder = 'desc',
  application,
}: SubscriptionTableProps) {
  const mappedSubscriptions = useMemo(() => {
    if (!application.subscriptions) return []

    return application.subscriptions.map((subs) => ({
      ...subs,
      normalizedRateLimit: getNormalized(subs.plan?.rateLimit),
      normalizedQuota: getNormalized(subs.plan?.quota),
    }))
  }, [application.subscriptions])

  const [sortedData, sortingState, toggleSorting] = useSort(mappedSubscriptions, {
    key: sortKey,
    order: sortOrder,
  })

  return (
    <AriaTable
      css={{ tableLayout: 'auto', border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}
      data-testid="subscription-table"
    >
      <VisuallyHidden>Subscriptions table</VisuallyHidden>
      <SubscriptionTableHead
        disableSorting={disableSorting || !sortedData.length}
        toggleSorting={toggleSorting}
        sortingState={sortingState}
      />
      <AriaTbody>
        {sortedData?.length ? (
          sortedData.map((subscription, idx) => (
            <SubscriptionTableRow
              key={`subscription-table-row-${idx}`}
              subscription={subscription}
              applicationName={application.name}
            />
          ))
        ) : (
          <AriaTableEmptyState what="subscriptions" />
        )}
      </AriaTbody>
    </AriaTable>
  )
}

export function SubscriptionTableSkeleton() {
  return (
    <AriaTableSkeleton columns={7} rows={3}>
      <SubscriptionTableHead />
    </AriaTableSkeleton>
  )
}
