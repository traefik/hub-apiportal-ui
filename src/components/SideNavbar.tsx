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

import React, { useState } from 'react'
import {
  Flex,
  H3,
  NavigationContainer,
  NavigationDrawer,
  NavigationItem,
  NavigationLink,
  NavigationTreeContainer,
  NavigationTreeItem as FaencyNavTreeItem,
} from '@traefiklabs/faency'
import axios from 'axios'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaCog, FaFolder, FaFolderOpen, FaFileAlt } from 'react-icons/fa'
import { FiPower } from 'react-icons/fi'

import { Portal } from '../hooks/use-portal'

// import { useAuthDispatch, useAuthState } from 'context/auth'
import { useToasts } from 'context/toasts'
// import { handleLogOut } from 'context/auth/actions'

const CustomNavigationLink = NavigationLink as any

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

type Props = {
  portal?: Portal
}

const SideNavbar = ({ portal }: Props) => {
  // const authDispatch = useAuthDispatch()
  // const { user } = useAuthState()

  const { pathname } = useLocation()

  const navigate = useNavigate()

  const { collectionName } = useParams()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { addToast } = useToasts()

  const onLogOutClick = async () => {
    setIsLoggingOut(true)
    try {
      await axios.get('/logout')
      location.reload()
    } catch (err) {
      addToast({
        severity: 'error',
        message: 'Something went wrong while logging out, please try again later',
        timeout: 60000,
      })
      console.error(err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <NavigationDrawer css={{ backgroundColor: 'white', borderRight: '1px solid $gray4', width: 240 }} elevation={1}>
      <NavigationContainer
        css={{
          flexGrow: 1,
        }}
      >
        <>
          {portal?.collections?.length || portal?.apis?.length ? (
            <H3 css={{ color: '$gray9', fontSize: '$3', margin: '$4 0 0 $2' }}>Available APIs</H3>
          ) : null}
          <Flex direction="column" css={{ mt: '$2' }}>
            <NavigationTreeContainer defaultCollapseIcon={<FaFolderOpen />} defaultExpandIcon={<FaFolder />}>
              {portal?.collections?.map((collection, index: number) => (
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
            {portal?.apis?.map((api, index: number) => (
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
        {/* <Text css={{ pl: '$3', fontWeight: '500' }}>user?.username</Text> */}
        <CustomNavigationLink
          as="button"
          onClick={onLogOutClick}
          startAdornment={<FiPower />}
          css={{ cursor: isLoggingOut ? 'wait' : 'pointer' }}
        >
          Log Out
        </CustomNavigationLink>
      </NavigationContainer>
    </NavigationDrawer>
  )
}

export default SideNavbar
