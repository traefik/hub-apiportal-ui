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

import { AriaTable, AriaTbody, AriaTd, AriaThead, AriaTr, Text } from '@traefiklabs/faency'
import React, { useState } from 'react'

import ApplicationActions from 'components/applications/ApplicationActions'
import ApplicationDeletionModal from 'components/applications/ApplicationDeletionModal'
import CopyableText from 'components/shared/CopyableText'
import ManagedByPublisher from 'components/shared/ManagedByPublisher'
import AriaLinkTr from 'components/tables/AriaLinkTr'
import AriaSortableTh from 'components/tables/AriaSortableTh'
import AriaTableEmptyState from 'components/tables/AriaTableEmptyState'
import AriaTableSkeleton from 'components/tables/AriaTableSkeleton'
import { useApplicationList } from 'hooks/query/use-applications'
import { useHasFeature } from 'hooks/query/use-feature'
import { useHrefWithReturnTo } from 'hooks/use-href-with-return-to'
import { SortingStateType, ToggleSortingType, useSort } from 'hooks/use-sort'
import { useSortHelpers } from 'hooks/use-sort-helpers'

type ApplicationListHeadProps = {
  disableSorting?: boolean
  jwtAuth: boolean
  sortingState?: SortingStateType<UI.ApplicationListItem>
  toggleSorting?: ToggleSortingType<UI.ApplicationListItem>
}

const ApplicationListHead = ({
  disableSorting = false,
  jwtAuth,
  sortingState,
  toggleSorting,
}: ApplicationListHeadProps) => {
  const { onSort, order } = useSortHelpers(sortingState, toggleSorting)

  return (
    <AriaThead>
      <AriaTr>
        <AriaSortableTh label="Name" isSortable={!disableSorting} onSort={onSort('name')} order={order('name')} />
        <AriaSortableTh
          label="Application ID"
          isSortable={!disableSorting}
          onSort={onSort('appId')}
          order={order('appId')}
        />
        {!jwtAuth ? (
          <AriaSortableTh
            label="API keys"
            isSortable={!disableSorting}
            onSort={onSort('apiKeysCount')}
            order={order('apiKeysCount')}
          />
        ) : null}
        <AriaSortableTh
          label="Subscriptions"
          isSortable={!disableSorting}
          onSort={onSort('subscriptionsCount')}
          order={order('subscriptionsCount')}
        />
        <AriaSortableTh label="" css={{ width: '56px' }} />
      </AriaTr>
    </AriaThead>
  )
}

function ApplicationListRow({ application, jwtAuth }: { application: UI.ApplicationListItem; jwtAuth: boolean }) {
  const hasSelfAppsFeature = useHasFeature('self-service-application')
  const { apiKeysCount, appId, isManaged, name, subscriptionsCount } = application
  const to = useHrefWithReturnTo(`/applications/${appId}`)
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState<boolean>(false)

  return (
    <>
      <AriaLinkTr href={to} data-testid="application-table-row">
        <AriaTd>
          <Text>{name}</Text>
        </AriaTd>

        <AriaTd css={{ py: '$2' }}>
          <CopyableText text={appId} />
        </AriaTd>

        {!jwtAuth ? (
          <AriaTd>
            <Text>{apiKeysCount || '-'}</Text>
          </AriaTd>
        ) : null}

        <AriaTd>
          <Text>{subscriptionsCount || '-'}</Text>
        </AriaTd>

        <AriaTd css={{ py: '$2' }}>
          {isManaged ? (
            <ManagedByPublisher resource="application" />
          ) : hasSelfAppsFeature ? (
            <ApplicationActions setIsDeletionModalOpen={setIsDeletionModalOpen} />
          ) : null}
        </AriaTd>
      </AriaLinkTr>

      {isDeletionModalOpen ? (
        <ApplicationDeletionModal
          appId={appId}
          applicationName={name}
          isOpen={isDeletionModalOpen}
          onClose={() => setIsDeletionModalOpen(false)}
        />
      ) : null}
    </>
  )
}

function ApplicationListWithData({ jwtAuth, search }: { jwtAuth: boolean; search?: string }) {
  const { data: applications } = useApplicationList(search)

  const [sortedData, sortingState, toggleSorting] = useSort<UI.ApplicationListItem>(applications, {
    key: 'name',
    order: 'asc',
  })

  return (
    <AriaTable
      css={{ tableLayout: 'auto', border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}
      data-testid="application-table"
    >
      <ApplicationListHead
        disableSorting={!sortedData.length}
        jwtAuth={jwtAuth}
        sortingState={sortingState}
        toggleSorting={toggleSorting}
      />
      <AriaTbody>
        {sortedData?.length ? (
          sortedData.map((application, idx) => (
            <ApplicationListRow key={`application-table-row-${idx}`} application={application} jwtAuth={jwtAuth} />
          ))
        ) : (
          <AriaTableEmptyState what="applications" />
        )}
      </AriaTbody>
    </AriaTable>
  )
}

export function ApplicationListSkeleton({ jwtAuth }: { jwtAuth: boolean }) {
  return (
    <AriaTableSkeleton columns={jwtAuth ? 4 : 5} lastColumnIsNarrow>
      <ApplicationListHead jwtAuth={jwtAuth} />
    </AriaTableSkeleton>
  )
}

export default ApplicationListWithData
