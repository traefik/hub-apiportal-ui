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
import React from 'react'

import ApplicationListWithData, { ApplicationListSkeleton } from 'components/applications/ApplicationList'
import AddButton from 'components/buttons/AddButton'
import ErrorSuspenseWrapper from 'components/layouts/ErrorSuspenseWrapper'
import PageHeader from 'components/layouts/PageHeader'
import PageLayout from 'components/layouts/PageLayout'
import { useHasFeature } from 'hooks/query/use-feature'
import { useJWTAuth } from 'hooks/query/use-portal'
import { useHrefWithReturnTo } from 'hooks/use-href-with-return-to'

export default function ApplicationListPage() {
  const hasSelfAppsFeature = useHasFeature('self-service-application')
  const creationHref = useHrefWithReturnTo('/applications/new')
  const jwtAuth = useJWTAuth()

  return (
    <PageLayout title="Applications">
      <Flex direction="column" gap={4}>
        <PageHeader
          title="Applications"
          ctaButtonSlot={
            hasSelfAppsFeature ? <AddButton text="Create application" href={creationHref} data-testid="create-application-btn" /> : null
          }
        />
        <ErrorSuspenseWrapper suspenseFallback={<ApplicationListSkeleton jwtAuth={jwtAuth} />}>
          <ApplicationListWithData jwtAuth={jwtAuth} />
        </ErrorSuspenseWrapper>
      </Flex>
    </PageLayout>
  )
}
