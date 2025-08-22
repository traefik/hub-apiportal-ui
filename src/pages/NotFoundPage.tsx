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

import { Flex, H1, Link } from '@traefiklabs/faency'
import React from 'react'

import PageLayout from 'components/layouts/PageLayout'

type NotFoundPageContentProps = {
  returnToHref?: string
  returnToLabel?: string
  what?: string
}

export function NotFoundContent({
  returnToHref = '/',
  returnToLabel = 'the main page',
  what = 'page',
}: NotFoundPageContentProps) {
  return (
    <Flex direction="column" align="center" justify="center" gap={4} css={{ height: 500 }}>
      <H1>This {what} doesn&apos;t exist</H1>
      <Link href={returnToHref} css={{ cursor: 'pointer', mt: '$2' }}>
        Return to {returnToLabel}
      </Link>
    </Flex>
  )
}

export default function NotFoundPage() {
  return (
    <PageLayout title="404 Not Found">
      <NotFoundContent />
    </PageLayout>
  )
}
