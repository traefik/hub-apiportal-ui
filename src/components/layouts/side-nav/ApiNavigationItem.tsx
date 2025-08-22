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

import React, { useMemo } from 'react'

import { buildAPIHref } from './utils'

import NavigationTreeItem from 'components/layouts/side-nav/NavigationTreeItem'

const ApiNavigationItem = ({
  api,
  index,
  baseHrefUrl = '/api-catalog',
}: {
  api: UI.APIWithLabeledVersions
  index: number
  baseHrefUrl?: string
}) => {
  const apiStatus = useMemo(() => {
    if (!api.subscriptions?.length) {
      return 'not available'
    } else if (api.subscriptions?.some((subs) => subs.suspended)) {
      return 'warning'
    } else {
      return 'available'
    }
  }, [api.subscriptions])

  return (
    <NavigationTreeItem
      key={`sidenav-api-${index}`}
      name={api.title}
      type="api"
      apiStatus={apiStatus}
      href={`${baseHrefUrl}${buildAPIHref(api)}`}
    />
  )
}

export default ApiNavigationItem
