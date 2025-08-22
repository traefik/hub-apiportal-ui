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

import { Box, Bubble, NavigationTreeItem as FaencyNavTreeItem, Flex, styled, Text, Tooltip } from '@traefiklabs/faency'
import React, { ComponentProps, useMemo } from 'react'
import { HiDocumentText } from 'react-icons/hi2'
import { useLocation, useNavigate } from 'react-router-dom'

import { getCleanPath } from './utils'

export const StyledNavItem = styled(FaencyNavTreeItem, {
  pl: '$5',
} as any)

export const customActiveNavButtonStyle = {
  color: 'var(--colors-textPrimary)',
  '&:focus': {
    color: 'var(--colors-textPrimary)',
    '&:before': {
      backgroundColor: 'var(--colors-navbarItemBackgroundActive)',
    },
    '&:after': {
      backgroundColor: 'transparent',
    },
  },
  '> div': {
    zIndex: 0,
  },
  '&:before': {
    backgroundColor: 'var(--colors-navbarItemBackgroundActive)',
  },
  '&:after': {
    display: 'none',
  },
}

export type BaseNavigationTreeItemProps = {
  key: string
  children?: React.ReactNode
  href?: string
  disabled?: boolean
  defaultExpanded?: boolean
}

type ApiStatus = 'available' | 'warning' | 'not available'

type NavigationTreeItemProps = ComponentProps<typeof StyledNavItem> &
  BaseNavigationTreeItemProps & {
    name: string
    type: string
    apiStatus?: ApiStatus
  }

const ApiStatusBubble = ({ apiStatus }: { apiStatus: ApiStatus }) => {
  const isAvailable = useMemo(() => apiStatus === 'available', [apiStatus])

  return (
    <Tooltip
      css={{ zIndex: 2, pt: '$1' }}
      content={isAvailable ? 'All subscriptions are active.' : 'One or more subscriptions are suspended.'}
    >
      <Box css={{ zIndex: 1 }}>
        <Bubble variant={isAvailable ? 'green' : 'orange'} noAnimation />
      </Box>
    </Tooltip>
  )
}

const NavigationTreeItem = ({
  name,
  type,
  children,
  href,
  disabled,
  defaultExpanded,
  apiStatus,
  ...props
}: Omit<NavigationTreeItemProps, 'label'>) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isActive = useMemo(() => {
    if (!href) return false

    return getCleanPath(pathname) === getCleanPath(href)
  }, [pathname, href])

  const customCss = useMemo(() => {
    if (!isActive)
      return {
        '&:focus': {
          '&:after': {
            display: 'none',
          },
        },
      }

    return customActiveNavButtonStyle
  }, [isActive])

  return (
    <StyledNavItem
      active={isActive}
      onClick={() => navigate(href as string)}
      css={
        disabled
          ? {
              textAlign: 'justify',
              width: '100%',
              opacity: 0.5,
              '&:hover': { cursor: 'default' },
              mt: '8px !important',
            }
          : { textAlign: 'justify', width: '100%', mt: '8px !important', ...customCss }
      }
      label={
        (
          <Flex align="center" gap={2}>
            <Text css={{ lineHeight: 1.2, flex: 1 }}>{name}</Text>
            {!!apiStatus && apiStatus !== 'not available' && <ApiStatusBubble apiStatus={apiStatus} />}
          </Flex>
        ) as any // TODO fix, silent type error
      }
      startAdornment={type === 'api' ? <HiDocumentText size={16} /> : null}
      disabled={disabled}
      defaultExpanded={defaultExpanded}
      {...props}
    >
      {children}
    </StyledNavItem>
  )
}

export default NavigationTreeItem
