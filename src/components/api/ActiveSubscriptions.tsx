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
  Flex,
  Link as FaencyLink,
  Text,
  VisuallyHidden,
  Tooltip,
} from '@traefiklabs/faency'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import UnsubscribeConfirmationModal from 'components/applications/UnsubscribeModal'
import AddButton from 'components/buttons/AddButton'
import ErrorSuspenseWrapper from 'components/layouts/ErrorSuspenseWrapper'
import ManagedByPublisher from 'components/shared/ManagedByPublisher'
import StyledH2 from 'components/shared/StyledH2'
import SubscriptionActions from 'components/shared/SubscriptionActions'
import AriaSortableTh from 'components/tables/AriaSortableTh'
import AriaTableEmptyState from 'components/tables/AriaTableEmptyState'
import AriaTableSkeleton, { AriaTableRowSkeleton } from 'components/tables/AriaTableSkeleton'
import { useHasFeature } from 'hooks/query/use-feature'
import { useHrefWithReturnTo } from 'hooks/use-href-with-return-to'
import { SortingStateType, ToggleSortingType, useSort } from 'hooks/use-sort'
import { useSortHelpers } from 'hooks/use-sort-helpers'
import { formatLocaleDateTime, getAge } from 'utils/time'
import { formatUsageLimitDisplay, getNormalized } from 'utils/usage'

type ActiveSubscriptionsTableHeadProps = {
  disableSorting?: boolean
  sortingState?: SortingStateType<API.APISubscription>
  toggleSorting?: ToggleSortingType<API.APISubscription>
}
const ActiveSubscriptionsTableHead = ({
  disableSorting,
  sortingState,
  toggleSorting,
}: ActiveSubscriptionsTableHeadProps) => {
  const { onSort, order } = useSortHelpers(sortingState, toggleSorting)

  return (
    <AriaThead>
      <AriaTr>
        <AriaSortableTh
          label="Application"
          isSortable={!disableSorting}
          onSort={onSort('application.name')}
          order={order('application.name')}
        />
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

const ActiveSubscriptionsTableRow = ({ subscription }: { subscription: API.APISubscription }) => {
  const { application, plan, isManaged, createdAt, suspended } = subscription
  const hasSelfSubsFeature = useHasFeature('self-service-subscription')
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

  const to = useHrefWithReturnTo(`/applications/${application.appId}`)

  return (
    <>
      <AriaTr css={{ height: '64px' }} data-testid="subscription-table-row">
        <AriaTd>
          <Link to={to}>
            <FaencyLink as="span" variant="blue">
              {application.name}
            </FaencyLink>
          </Link>
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
          ) : (
           null
          )}
        </AriaTd>
      </AriaTr>

      {isUnsubscribeModalOpen ? (
        <UnsubscribeConfirmationModal
          isOpen
          onClose={() => setIsUnsubscribeModalOpen(false)}
          subscription={subscription}
        />
      ) : null}
    </>
  )
}

const ActiveSubscriptions = ({
  subscriptions,
  handleAddSubscription,
  hasPlan,
}: {
  subscriptions: API.APISubscription[]
  handleAddSubscription: () => void
  hasPlan: boolean
}) => {
  const hasSelfSubsFeature = useHasFeature('self-service-subscription')

  const mappedSubscriptions = useMemo(
    () =>
      subscriptions?.map((subs) => ({
        ...subs,
        normalizedRateLimit: getNormalized(subs.plan?.rateLimit),
        normalizedQuota: getNormalized(subs.plan?.quota),
      })),
    [subscriptions],
  )

  const [sortedData, sortingState, toggleSorting] = useSort<API.APISubscription>(mappedSubscriptions, {
    key: 'createdAt',
    order: 'desc',
  })

  return (
    <Flex direction="column" css={{ mt: '$4' }} gap={4}>
      <Flex justify="space-between" css={{ width: '100%' }}>
        <StyledH2>Subscriptions</StyledH2>
        {hasPlan && hasSelfSubsFeature && (
          <AddButton text="Add subscription" onClick={handleAddSubscription} data-testid="add-subscription-btn" />
        )}
      </Flex>

      <AriaTable css={{ border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}>
        <VisuallyHidden>Subscriptions table</VisuallyHidden>
        <ActiveSubscriptionsTableHead
          disableSorting={!sortedData.length}
          toggleSorting={toggleSorting}
          sortingState={sortingState}
        />
        <AriaTbody>
          {sortedData?.length ? (
            sortedData.map((subscription, idx) => (
              <ErrorSuspenseWrapper
                key={`subscription-table-row-${idx}`}
                suspenseFallback={<AriaTableRowSkeleton rows={1} columns={4} />}
              >
                <ActiveSubscriptionsTableRow subscription={subscription} />
              </ErrorSuspenseWrapper>
            ))
          ) : (
            <AriaTableEmptyState what="subscriptions" />
          )}
        </AriaTbody>
      </AriaTable>
    </Flex>
  )
}

export function ActiveSubscriptionsTableSkeleton() {
  return (
    <Flex direction="column" css={{ mt: '$4' }} gap={4}>
      <StyledH2>Subscriptions</StyledH2>
      <AriaTableSkeleton columns={7} rows={3}>
        <ActiveSubscriptionsTableHead />
      </AriaTableSkeleton>
    </Flex>
  )
}

export default ActiveSubscriptions
