/*
Copyright (C) 2022-2023 Traefik Labs
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
import {
  Flex,
  H3,
  NavigationTreeDrawer,
  NavigationTreeContainer,
  NavigationTreeItem as FaencyNavTreeItem,
  styled,
} from '@traefiklabs/faency'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaCog, FaFolder, FaFolderOpen, FaFileAlt } from 'react-icons/fa'
import { FiPower } from 'react-icons/fi'

import { Portal } from 'hooks/use-portal'
import useIsUsingJWTAuth from 'hooks/use-is-using-jwt-auth'
import COLORS from 'components/styles/colors'

const getPathWithoutVersion = (path: string) => {
  const index = path.indexOf('/versions/')
  return index >= 0 ? path.substring(0, index) : path
}

const StyledNavItem = styled(FaencyNavTreeItem, {
  color: COLORS.defaultText,
  pl: '$5',
})

const customActiveNavButtonStyle = {
  color: COLORS.primary,
  '&:focus': {
    color: COLORS.primary,
    '&:before': {
      backgroundColor: COLORS.lightBg,
    },
    '&:after': {
      backgroundColor: '$navButtonHoverBg2',
    },
  },
  '> div': {
    zIndex: 1,
  },
  '&:before': {
    backgroundColor: COLORS.lightBg,
  },
  '&:after': {
    backgroundColor: '$navButtonHoverBg2',
  },
}

const NavigationTreeItem = ({
  name,
  subtitle,
  type,
  children,
  specLink,
  disabled,
  defaultExpanded,
  ...props
}: {
  key: string
  name: string
  subtitle?: string
  type: string
  children?: React.ReactNode
  specLink?: string
  disabled?: boolean
  defaultExpanded?: boolean
}) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isActive = useMemo(() => {
    if (!specLink) return false

    return getPathWithoutVersion(pathname) === getPathWithoutVersion(specLink)
  }, [pathname, specLink])

  const customCss = useMemo(() => {
    if (!isActive)
      return {
        '&:focus': {
          '&:after': {
            backgroundColor: 'transparent',
          },
        },
      }

    return customActiveNavButtonStyle
  }, [isActive])

  return (
    <StyledNavItem
      active={isActive}
      onClick={() => navigate(specLink as string)}
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
      label={name}
      subtitle={subtitle}
      startAdornment={type === 'api' ? <FaFileAlt /> : null}
      disabled={disabled}
      defaultExpanded={defaultExpanded}
      {...props}
    >
      {children}
    </StyledNavItem>
  )
}

type Props = {
  portal?: Portal
}

const SideNavbar = ({ portal }: Props) => {
  const { pathname } = useLocation()
  const isUsingJWT = useIsUsingJWTAuth()

  const navigate = useNavigate()

  const { collectionName } = useParams()

  return (
    <NavigationTreeDrawer
      css={{
        backgroundColor: COLORS.darkBg,
        borderRight: `1px solid ${COLORS.border}`,
        width: 240,
        boxShadow: 'none',
        height: 'calc(100vh - 90px)',
        pb: 0,
        pt: '$6',
      }}
      elevation={1}
      fullWidth
    >
      <NavigationTreeContainer
        css={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <>
          {portal?.collections?.length || portal?.apis?.length ? (
            <H3 className="sl-text-paragraph" css={{ mb: '$4', pl: '$5', lineHeight: 1.375 }}>
              Available APIs
            </H3>
          ) : null}
          <Flex direction="column" css={{ mt: '$2' }}>
            <NavigationTreeContainer defaultCollapseIcon={<FaFolderOpen />} defaultExpandIcon={<FaFolder />} fullWidth>
              {portal?.collections?.map((collection: Collection.Resp, index: number) => (
                <NavigationTreeItem
                  key={`sidenav-${index}`}
                  name={collection.name}
                  subtitle={collection.pathPrefix}
                  type="collection"
                  disabled={!collection.apis?.length}
                  defaultExpanded={collection.name === collectionName}
                >
                  {collection.apis?.length &&
                    collection.apis.map((api: API.Resp, idx: number) => (
                      <NavigationTreeItem
                        key={`sidenav-${index}-${idx}`}
                        name={api.name}
                        subtitle={api.pathPrefix}
                        specLink={api.currentVersion ? `${api.specLink}/versions/${api.currentVersion}` : api.specLink}
                        type="api"
                      />
                    ))}
                </NavigationTreeItem>
              ))}
            </NavigationTreeContainer>
            {portal?.apis?.map((api: API.Resp, index: number) => (
              <NavigationTreeItem
                key={`sidenav-api-${index}`}
                name={api.name}
                subtitle={api.pathPrefix}
                specLink={api.currentVersion ? `${api.specLink}/versions/${api.currentVersion}` : api.specLink}
                type="api"
              />
            ))}
          </Flex>
        </>
      </NavigationTreeContainer>
      <NavigationTreeContainer css={{ borderTop: `1px solid ${COLORS.border}`, py: '$2' }}>
        <StyledNavItem
          label="Settings"
          active={pathname === '/settings'}
          startAdornment={<FaCog />}
          onClick={() => navigate('/settings')}
          css={{
            display: isUsingJWT ? 'none' : 'flex',
            ...(pathname === '/settings' ? customActiveNavButtonStyle : {}),
          }}
        />
        <StyledNavItem onClick={() => location.replace('/logout')} startAdornment={<FiPower />} label="Log out" />
      </NavigationTreeContainer>
    </NavigationTreeDrawer>
  )
}

export default SideNavbar
