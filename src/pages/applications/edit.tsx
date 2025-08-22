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

import { Box, Flex } from '@traefiklabs/faency'
import React from 'react'
import { useParams } from 'react-router-dom'

import ApplicationFormWithData from 'components/applications/ApplicationForm'
import ErrorSuspenseWrapper from 'components/layouts/ErrorSuspenseWrapper'
import PageHeader from 'components/layouts/PageHeader'
import PageLayout from 'components/layouts/PageLayout'

export default function ApplicationEditingPage() {
  const { appId } = useParams()

  return (
    <PageLayout>
      <Flex direction="column" gap={4}>
        <Box css={{ maxWidth: '912px', width: '100%', mx: 'auto' }}>
          <PageHeader title="Edit application" />
          <ErrorSuspenseWrapper>
            <ApplicationFormWithData appId={appId} />
          </ErrorSuspenseWrapper>
        </Box>
      </Flex>
    </PageLayout>
  )
}
