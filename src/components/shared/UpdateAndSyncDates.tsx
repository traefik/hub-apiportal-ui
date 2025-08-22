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

import { Flex, Skeleton, Text } from '@traefiklabs/faency'
import { parseISO, isBefore } from 'date-fns'
import React, { useMemo } from 'react'

import { getFormattedDateWithTime } from 'utils/time'

type UpdateAndSyncDatesProps = {
  hideSyncedAt?: boolean
  syncedAt?: string
  updatedAt?: string
}

export default function UpdateAndSyncDates({ hideSyncedAt = false, syncedAt, updatedAt }: UpdateAndSyncDatesProps) {
  const lastUpdate = useMemo(() => getFormattedDateWithTime(updatedAt), [updatedAt])
  const lastSync = useMemo(
    () => (syncedAt === '0001-01-01T00:00:00Z' ? undefined : getFormattedDateWithTime(syncedAt)),
    [syncedAt],
  )
  const isSyncing = useMemo(() => {
    if (!syncedAt || !updatedAt) {
      return false
    }
    return syncedAt === '0001-01-01T00:00:00Z' || isBefore(parseISO(syncedAt), parseISO(updatedAt))
  }, [syncedAt, updatedAt])

  return (
    <Flex direction="column" align="end" gap={2} css={{ alignSelf: 'flex-end' }}>
      <Text>Last update: {lastUpdate || '-'}</Text>
      {!hideSyncedAt ? <Text>Last sync: {lastSync || '-'}</Text> : null}
      {isSyncing && <Text css={{ color: '$primary' }}>Changes queued for sync...</Text>}
    </Flex>
  )
}

export function UpdateAndSyncDatesSkeleton() {
  return (
    <Flex direction="column" align="end" gap={2} css={{ alignSelf: 'flex-end' }}>
      <Flex gap={2}>
        <Text>Last update:</Text>
        <Skeleton css={{ height: '14px', width: '128px', borderRadius: 0 }} />
      </Flex>
      <Flex gap={2}>
        <Text>Last sync:</Text>
        <Skeleton css={{ height: '14px', width: '128px', borderRadius: 0 }} />
      </Flex>
    </Flex>
  )
}
