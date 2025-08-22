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

import { Badge, Flex, Select } from '@traefiklabs/faency'
import React, { useMemo } from 'react'

import { useDarkMode } from 'hooks/use-dark-mode'

const getAPILatestVersionName = (api?: API.API): string | undefined => {
  if (!api?.versions?.length) {
    return
  }

  return api.versions[0].name
}

type APIVersionProps = {
  api?: UI.APIWithLabeledVersions
  apiVersion?: string
  navigateToApiVersion: (apiVersionName: string) => void
  pathname: string
  versions: UI.VersionWithLabel[]
}

export default function ApiVersionSelector({
  api,
  apiVersion,
  navigateToApiVersion,
  pathname,
  versions,
}: APIVersionProps) {
  const { isDarkMode } = useDarkMode()

  const isLatestVersion = useMemo(() => {
    if (!pathname) return false
    const parts = pathname.split('/')
    if (!parts || !parts.length) return false

    return parts.pop() == getAPILatestVersionName(api)
  }, [api, pathname])

  const selectOptions = useMemo(() => {
    return versions.reduce(
      (acc, version) => {
        if (getAPILatestVersionName(api) == version.name) {
          acc.latest.push(version)
        } else {
          acc.others.push(version)
        }
        return acc
      },
      { latest: [], others: [] } as { latest: UI.VersionWithLabel[]; others: UI.VersionWithLabel[] },
    )
  }, [api, versions])

  return (
    <Flex align="center" justify="space-between" css={{ width: 284, height: '100%' }}>
      <Select
        name="api-version"
        value={apiVersion}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => navigateToApiVersion(e.target.value)}
        css={{
          borderRadius: 0,
          width: '70%',
          ' optgroup': {
            color: 'initial',
          },
        }}
      >
        <optgroup label="Latest version">
          {selectOptions.latest.map((version: UI.VersionWithLabel, key) => (
            <option key={key} value={version.name} label={version.label} />
          ))}
        </optgroup>
        {!!selectOptions.others.length && (
          <optgroup label="Other versions">
            {selectOptions.others.map((version: UI.VersionWithLabel, key) => (
              <option key={key} value={version.name} label={version.label} />
            ))}
          </optgroup>
        )}
      </Select>
      {isLatestVersion && (
        <Badge size="small" variant={isDarkMode ? 'neon' : 'green'}>
          Latest
        </Badge>
      )}
    </Flex>
  )
}
