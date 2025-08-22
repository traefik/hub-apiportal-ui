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

import { Flex, H1, Image } from '@traefiklabs/faency'
import React, { ReactNode } from 'react'
import { FiGrid, FiLayers } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import NavItemWithIcon from 'components/layouts/top-nav/NavItemWithIcon'
import ThemeSwitcher from 'components/layouts/top-nav/ThemeSwitcher'
import UserMenu from 'components/layouts/top-nav/UserMenu'

type TopNavbarRoute = {
  icon: ReactNode
  isExternal?: boolean
  label: string
  locationPrefix?: string
  to: string
}

const ROUTES: TopNavbarRoute[] = [
  {
    icon: <FiLayers size={20} />,
    label: 'API catalog',
    locationPrefix: '/api-catalog',
    to: '/',
  },
  {
    icon: <FiGrid size={20} />,
    label: 'Applications',
    locationPrefix: '/applications',
    to: '/applications',
  },
]

export default function TopNavbar({ portal }: { portal?: API.Portal }) {
  return (
    <Flex
      as="nav"
      role="navigation"
      aria-label="main navigation"
      align="center"
      css={{
        gap: '$2',
        height: 64,
        width: '100%',
        position: 'relative',
        px: '$4',
        borderBottom: 'var(--borders-layoutSection)',
      }}
    >
      {!!portal?.logoUrl && (
        <Link to="/">
          <Image
            src={portal?.logoUrl}
            alt=""
            css={{
              border: '1px solid $grayA6',
              boxSizing: 'border-box',
              height: '$7',
              width: '$7',
              objectFit: 'contain',
            }}
          />
        </Link>
      )}
      <Link to="/">
        <H1 as="span" css={{ fontSize: '$6', mr: '$2' }}>
          {portal?.title as string}
        </H1>
      </Link>
      <Flex align="center" gap={2}>
        {ROUTES.map(({ icon, isExternal, label, locationPrefix, to }, index) => (
          <NavItemWithIcon
            key={index}
            icon={icon}
            isExternal={isExternal}
            label={label}
            locationPrefix={locationPrefix}
            to={to}
          />
        ))}
      </Flex>
      <Flex align="center" gap={2} css={{ marginLeft: 'auto' }}>
        <ThemeSwitcher />
        <UserMenu />
      </Flex>
    </Flex>
  )
}
