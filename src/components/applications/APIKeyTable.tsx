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

import { AriaTable, AriaTbody, AriaTd, AriaThead, AriaTr, Skeleton, Text, VisuallyHidden } from '@traefiklabs/faency'
import React, { useCallback, useState } from 'react'

import APIKeyActions from './APIKeyActions'

import APIKeyDeletionModal from 'components/applications/APIKeyDeletionModal'
import ManagedByPublisher from 'components/shared/ManagedByPublisher'
import AriaSortableTh from 'components/tables/AriaSortableTh'
import AriaTableEmptyState from 'components/tables/AriaTableEmptyState'
import AriaTableSkeleton from 'components/tables/AriaTableSkeleton'
import useLazyFetch from 'hooks/fetcher/use-lazy-fetch'
import { APPLICATIONS_URL } from 'hooks/query/use-applications'
import { useHasFeature } from 'hooks/query/use-feature'
import useInvalidateQueries from 'hooks/query/use-invalidate-queries'
import { SortingStateType, ToggleSortingType, useSort } from 'hooks/use-sort'
import { useSortHelpers } from 'hooks/use-sort-helpers'
import useToasts from 'hooks/use-toasts'
import { getFormattedDateWithTime } from 'utils/time'

type APIKeyTableHeadProps = {
  disableSorting?: boolean
  hasUpdatedAt?: boolean
  sortingState?: SortingStateType<API.APIKey>
  toggleSorting?: ToggleSortingType<API.APIKey>
}

const APIKeyTableHead = ({
  disableSorting,
  hasUpdatedAt = false,
  sortingState,
  toggleSorting,
}: APIKeyTableHeadProps) => {
  const { onSort, order } = useSortHelpers(sortingState, toggleSorting)

  return (
    <AriaThead>
      <AriaTr>
        <AriaSortableTh label="Title" isSortable={!disableSorting} onSort={onSort('title')} order={order('title')} />
        <AriaSortableTh
          label="Created at"
          isSortable={!disableSorting}
          onSort={onSort('createdAt')}
          order={order('createdAt')}
        />
        {hasUpdatedAt ? (
          <AriaSortableTh
            label="Updated at"
            isSortable={!disableSorting}
            onSort={onSort('updatedAt')}
            order={order('updatedAt')}
          />
        ) : undefined}
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

type APIKeyTableRowProps = { apiKey: API.APIKey; appId: string; isManaged: boolean; hasUpdatedAt?: boolean }

const APIKeyTableRow = ({ apiKey, appId, isManaged, hasUpdatedAt = false }: APIKeyTableRowProps) => {
  const invalidateQueries = useInvalidateQueries()
  const hasSelfAppsFeature = useHasFeature('self-service-application')
  const { addToast } = useToasts()

  const [suspendToken, { loading: isSuspending }] = useLazyFetch(`./api/applications/${appId}/api-keys/suspend`, {
    method: 'POST',
  })

  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState<boolean>(false)

  const onSuspendClick = useCallback(async () => {
    try {
      await suspendToken({
        body: JSON.stringify({
          suspend: !apiKey.suspended,
          title: apiKey.title,
        }),
      })
      invalidateQueries({ queryKey: [APPLICATIONS_URL] })
      addToast({
        severity: 'success',
        message: `API key successfully ${apiKey.suspended ? 'resumed' : 'suspended'}.`,
      })
    } catch (err) {
      console.error(err)
      addToast({
        severity: 'error',
        message: `An error occurred while ${
          apiKey.suspended ? 'resuming' : 'suspending'
        } your API key. Please try again later.`,
        timeout: 60000,
      })
    }
  }, [addToast, apiKey.suspended, apiKey.title, invalidateQueries, suspendToken])

  return (
    <>
      <AriaTr css={{ height: '64px' }} data-testid="api-key-table-row">
        <AriaTd>
          <Text>{apiKey.title}</Text>
        </AriaTd>

        <AriaTd>
          <Text>{apiKey.createdAt ? getFormattedDateWithTime(apiKey.createdAt) : '-'}</Text>
        </AriaTd>

        {hasUpdatedAt ? (
          <AriaTd>
            <Text>
              {apiKey.updatedAt && apiKey.updatedAt !== apiKey.createdAt
                ? getFormattedDateWithTime(apiKey.updatedAt)
                : '-'}
            </Text>
          </AriaTd>
        ) : undefined}

        <AriaTd>
          {isSuspending ? (
            <Skeleton variant="text" css={{ width: '73px', borderRadius: 0 }} />
          ) : (
            <Text>{apiKey.suspended ? 'Suspended' : 'Active'}</Text>
          )}
        </AriaTd>

        <AriaTd css={{ py: '$2' }}>
          {isManaged ? (
            <ManagedByPublisher resource="API key" />
          ) : hasSelfAppsFeature ? (
            <APIKeyActions
              isSuspended={apiKey.suspended || false}
              onSuspendClick={onSuspendClick}
              setIsDeletionModalOpen={setIsDeletionModalOpen}
            />
          ) : null}
        </AriaTd>
      </AriaTr>

      {isDeletionModalOpen ? (
        <APIKeyDeletionModal
          appId={appId}
          isOpen={isDeletionModalOpen}
          onClose={() => setIsDeletionModalOpen(false)}
          title={apiKey.title}
        />
      ) : null}
    </>
  )
}

type APIKeyTableProps = {
  apiKeys?: API.APIKey[]
  appId: string
  disableSorting?: boolean
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  isManaged: boolean
}

export default function APIKeyTable({
  apiKeys,
  appId,
  disableSorting = false,
  sortKey = 'title',
  sortOrder = 'asc',
  isManaged,
}: APIKeyTableProps) {
  const [sortedData, sortingState, toggleSorting] = useSort(apiKeys, {
    key: sortKey,
    order: sortOrder,
  })

  return (
    <AriaTable
      css={{ border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}
      data-testid="api-key-table"
    >
      <VisuallyHidden>API keys table</VisuallyHidden>
      <APIKeyTableHead
        disableSorting={disableSorting || !sortedData.length}
        hasUpdatedAt={!isManaged}
        toggleSorting={toggleSorting}
        sortingState={sortingState}
      />
      <AriaTbody>
        {sortedData?.length ? (
          sortedData.map((apiKey, idx) => (
            <APIKeyTableRow
              key={`api-key-table-row-${idx}`}
              apiKey={apiKey}
              appId={appId}
              isManaged={isManaged}
              hasUpdatedAt={!isManaged}
            />
          ))
        ) : (
          <AriaTableEmptyState what="API keys" />
        )}
      </AriaTbody>
    </AriaTable>
  )
}

export function APIKeyTableSkeleton() {
  return (
    <AriaTableSkeleton columns={4} lastColumnIsNarrow rows={3}>
      <APIKeyTableHead />
    </AriaTableSkeleton>
  )
}
