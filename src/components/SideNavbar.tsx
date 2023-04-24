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

import React from 'react'
import {
  NavigationDrawer,
  NavigationContainer,
  H3,
  Flex,
  NavigationItem,
  NavigationTreeContainer,
  NavigationTreeItem as FaencyNavTreeItem,
} from '@traefiklabs/faency'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaCog, FaFolder, FaFolderOpen, FaFileAlt } from 'react-icons/fa'
// import { FiPower } from 'react-icons/fi'

// import { useAuthDispatch, useAuthState } from 'context/auth'
// import { handleLogOut } from 'context/auth/actions'
import { useAPIs } from 'hooks/use-apis'

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

  return (
    <FaencyNavTreeItem
      active={pathname === specLink}
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
          : { textAlign: 'justify', width: '100%', mt: '8px !important' }
      }
      label={name}
      subtitle={subtitle}
      startAdornment={type === 'api' ? <FaFileAlt /> : null}
      disabled={disabled}
      defaultExpanded={defaultExpanded}
      {...props}
    >
      {children}
    </FaencyNavTreeItem>
  )
}

const SideNavbar = () => {
  const { data: apis } = useAPIs()
  // const authDispatch = useAuthDispatch()
  // const { user } = useAuthState()

  const { pathname } = useLocation()

  const navigate = useNavigate()

  const { collectionName } = useParams()

  return (
    <NavigationDrawer css={{ backgroundColor: 'white', borderRight: '1px solid $gray4', width: 240 }} elevation={1}>
      <NavigationContainer
        css={{
          flexGrow: 1,
        }}
      >
        <>
          {apis?.collections?.length || apis?.apis?.length ? (
            <H3 css={{ color: '$gray9', fontSize: '$3', margin: '$4 0 0 $2' }}>Available APIs</H3>
          ) : null}
          <Flex direction="column" css={{ mt: '$2' }}>
            <NavigationTreeContainer defaultCollapseIcon={<FaFolderOpen />} defaultExpandIcon={<FaFolder />}>
              {apis?.collections?.map((collection, index: number) => (
                <NavigationTreeItem
                  key={`sidenav-${index}`}
                  name={collection.name}
                  subtitle={collection.pathPrefix}
                  type="collection"
                  disabled={!collection.apis?.length}
                  defaultExpanded={collection.name === collectionName}
                >
                  {collection.apis?.length &&
                    collection.apis.map((api: { name: string; specLink: string; pathPrefix: string }, idx: number) => (
                      <NavigationTreeItem
                        key={`sidenav-${index}-${idx}`}
                        name={api.name}
                        subtitle={api.pathPrefix}
                        specLink={api.specLink}
                        type="api"
                      />
                    ))}
                </NavigationTreeItem>
              ))}
            </NavigationTreeContainer>
            {apis?.apis?.map((api, index: number) => (
              <NavigationTreeItem
                key={`sidenav-api-${index}`}
                name={api.name}
                subtitle={api.pathPrefix}
                specLink={api.specLink}
                type="api"
              />
            ))}
          </Flex>
        </>
      </NavigationContainer>
      <NavigationContainer>
        <NavigationItem
          active={pathname === '/settings'}
          startAdornment={<FaCog />}
          onClick={() => navigate('/settings')}
        >
          Settings
        </NavigationItem>
        {/* <Text css={{ pl: '$3', fontWeight: '500' }}>user?.username</Text>
        <CustomNavigationLink as="button" startAdornment={<FiPower />} onClick={() => console.log('click')}>
          Log Out
        </CustomNavigationLink> */}
      </NavigationContainer>
    </NavigationDrawer>
  )
}

export default SideNavbar
