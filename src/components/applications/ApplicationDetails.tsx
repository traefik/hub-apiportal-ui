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

import { Box, Flex, Skeleton } from '@traefiklabs/faency'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import APIKeyCreationModal from 'components/applications/APIKeyCreationModal'
import APIKeyTable, { APIKeyTableSkeleton } from 'components/applications/APIKeyTable'
import ApplicationDeletionButton from 'components/applications/ApplicationDeletionButton'
import SubscriptionTable, { SubscriptionTableSkeleton } from 'components/applications/SubscriptionTable'
import AddButton from 'components/buttons/AddButton'
import { DeleteButtonSkeleton } from 'components/buttons/DeleteButton'
import EditButton from 'components/buttons/EditButton'
import PageHeader, { PageHeaderSkeleton } from 'components/layouts/PageHeader'
import CopyableText from 'components/shared/CopyableText'
import DefinitionSection, { DefinitionSectionSkeleton } from 'components/shared/DefinitionSection'
import ManagedByPublisher from 'components/shared/ManagedByPublisher'
import StyledH2 from 'components/shared/StyledH2'
import { useGetApplicationByAppId } from 'hooks/query/use-applications'
import { useHasFeature } from 'hooks/query/use-feature'
import { NotFoundContent } from 'pages/NotFoundPage'

function ApplicationDetails({ application, jwtAuth }: { application: API.Application; jwtAuth: boolean }) {
  const { apiKeys, appId, isManaged, name, notes } = application
  const hasSelfAppsFeature = useHasFeature('self-service-application')
  const [isAPIKeyCreationModalOpen, setIsAPIKeyCreationModalOpen] = useState<boolean>(false)

  return (
    <Flex direction="column" gap={4}>
      <PageHeader
        title={name}
        ctaButtonSlot={
          isManaged ? (
            <ManagedByPublisher resource="application" size={36} />
          ) : hasSelfAppsFeature ? (
            <EditButton />
          ) : null
        }
      />
      <Flex direction="column" gap={6}>
        <DefinitionSection
          items={[
            {
              key: 'Application ID',
              val: <CopyableText css={{ lineHeight: '24px', span: { fontSize: '16px' } }} text={appId} />,
            },
            { key: 'Notes', val: notes || '-' },
          ]}
          keyColumns={1}
          title=""
        />

        {!jwtAuth ? (
          <Box>
            <Flex justify="space-between" gap={2} css={{ width: '100%', mb: '$3' }}>
              <StyledH2>API keys</StyledH2>
              {!isManaged && hasSelfAppsFeature ? (
                <AddButton
                  text="Create API key"
                  onClick={() => setIsAPIKeyCreationModalOpen(true)}
                  data-testid="create-api-key-btn"
                />
              ) : null}
              {isAPIKeyCreationModalOpen ? (
                <APIKeyCreationModal
                  appId={appId}
                  isOpen={isAPIKeyCreationModalOpen}
                  onClose={() => setIsAPIKeyCreationModalOpen(false)}
                />
              ) : null}
            </Flex>
            <APIKeyTable appId={appId} isManaged={isManaged} apiKeys={apiKeys || []} />
          </Box>
        ) : null}

        <Box>
          <StyledH2 css={{ mb: '$3' }}>Subscriptions</StyledH2>
          <SubscriptionTable application={application} />
        </Box>

        {!isManaged && hasSelfAppsFeature ? <ApplicationDeletionButton application={application} /> : null}
      </Flex>
    </Flex>
  )
}

function ApplicationDetailsWithData({ appId, jwtAuth }: { appId: string; jwtAuth: boolean }) {
  const { data: application } = useGetApplicationByAppId(appId)

  return application ? (
    <>
      <Helmet>
        <title>{application.name}</title>
      </Helmet>
      <ApplicationDetails application={application} jwtAuth={jwtAuth} />
    </>
  ) : (
    <>
      <Helmet>
        <title>404 Not Found</title>
      </Helmet>
      <NotFoundContent returnToHref="/applications" returnToLabel="applications" what="application" />
    </>
  )
}

export function ApplicationDetailsSkeleton({ jwtAuth }: { jwtAuth: boolean }) {
  return (
    <Flex direction="column" gap={4}>
      <PageHeaderSkeleton hasCTAButton />
      <Flex direction="column" gap={6}>
        <DefinitionSectionSkeleton keyColumns={1} rows={2} title="" />

        {!jwtAuth ? (
          <Box>
            <Flex justify="space-between" gap={2} css={{ width: '100%', mb: '$3' }}>
              <StyledH2>API keys</StyledH2>
              <Skeleton css={{ height: '40px', width: '157px', borderRadius: 0 }} />
            </Flex>
            <APIKeyTableSkeleton />
          </Box>
        ) : null}

        <Box>
          <StyledH2 css={{ mb: '$3' }}>Subscriptions</StyledH2>
          <SubscriptionTableSkeleton />
        </Box>

        <DeleteButtonSkeleton />
      </Flex>
    </Flex>
  )
}

export default ApplicationDetailsWithData
