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

import {
  Box,
  Flex,
  H3,
  NavigationTreeDrawer,
  NavigationTreeContainer,
  Text,
  Button,
  TextField,
} from '@traefiklabs/faency'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { FaFolder, FaFolderOpen, FaSearch, FaTimes } from 'react-icons/fa'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import Markdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import ApiBundleNavigationTreeItem from './ApiBundleNavigationItem'
import ApiNavigationItem from './ApiNavigationItem'

import IconButton from 'components/buttons/IconButton'
import { usePortal } from 'hooks/query/use-portal'
import { useDebouncedQuerySearch } from 'hooks/use-search'
import components from 'utils/components'

const SideNavbar = () => {
  const [searchQuery, setSearchQuery] = useDebouncedQuerySearch()
  const { apiBundleId } = useParams()
  const { data: portal } = usePortal(searchQuery)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <AnimatePresence>
      <motion.div
        style={{ overflow: 'hidden' }}
        animate={{
          width: isCollapsed ? 30 : 300,
          maxWidth: isCollapsed ? 30 : 300,
        }}
        transition={{ duration: 0.2, type: 'tween' }}
      >
        {isCollapsed ? (
          <Box
            css={{
              backgroundColor: 'var(--colors-navbarBackground)',
              borderRight: 'var(--borders-layoutSection)',
              borderLeft: 'none',
              boxShadow: 'none',
              height: 'calc(100vh - 65px)',
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setIsCollapsed(false)}
              css={{
                p: '$2',
                borderRadius: 0,
                height: '100%',
                boxShadow: 'none',
              }}
            >
              <FaAnglesRight />
            </Button>
          </Box>
        ) : (
          <NavigationTreeDrawer
            css={{
              backgroundColor: 'var(--colors-navbarBackground)',
              borderRight: 'var(--borders-layoutSection)',
              width: 300,
              maxWidth: 300,
              boxShadow: 'none',
              height: 'calc(100vh - 65px)',
              p: 0,
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
              <Flex direction="column" css={{ height: '100%' }}>
                <TextField
                  placeholder="Search bundles and APIs"
                  css={{
                    p: '$5',
                    pt: '$3',
                    ':first-child': {
                      '&:before': {
                        borderRadius: 0,
                      },
                      '&:after': {
                        borderRadius: 0,
                      },
                    },
                    ' input': {
                      borderRadius: 0,
                    },

                    ':focus': {
                      boxShadow: 'inset 0 0 0 2px var(--colors-inputFocusBorder)',
                    },
                  }}
                  startAdornment={<FaSearch />}
                  endAdornment={
                    <IconButton
                      icon={<FaTimes />}
                      onClick={() => setSearchQuery(null as any)} //remove query completely
                      ghost
                      css={{ p: 0, height: 'fit-content', color: 'inherit' }}
                    />
                  }
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <H3 className="sl-text-paragraph" css={{ mb: '$2', pl: '$5', lineHeight: 1.375 }}>
                  Available APIs
                </H3>

                <Flex direction="column" justify="space-between" css={{ flex: 1, pb: 30 }}>
                  {portal?.apis?.length || portal?.bundles?.length ? (
                    <Box>
                      <NavigationTreeContainer
                        defaultCollapseIcon={<FaFolderOpen />}
                        defaultExpandIcon={<FaFolder />}
                        fullWidth
                      >
                        {portal?.bundles?.map((apiBundle, index) => (
                          <ApiBundleNavigationTreeItem
                            key={`sidenav-${index}`}
                            apiBundle={apiBundle}
                            disabled={!apiBundle.apis?.length}
                            defaultExpanded={`${apiBundle.name}@${apiBundle.namespace}` === apiBundleId}
                          />
                        ))}
                      </NavigationTreeContainer>
                      {portal?.apis?.map((api, index) => (
                        <ApiNavigationItem key={`sidenav-api-${index}`} api={api} index={index} />
                      ))}
                    </Box>
                  ) : (
                    <Text variant="subtle" css={{ pl: '$5', pt: '$3' }}>
                      No bundles or APIs result.
                    </Text>
                  )}

                  <Flex direction="column" gap={1} css={{ p: '$3 $4' }}>
                    <Markdown components={components} remarkPlugins={[remarkGfm]}>
                      {portal?.description}
                    </Markdown>
                  </Flex>
                </Flex>
                <Button
                  variant="secondary"
                  onClick={() => setIsCollapsed(true)}
                  css={{
                    boxSizing: 'border-box',
                    boxShadow: 'none',
                    backgroundColor: 'var(--colors-navbarBackground)',
                    borderRight: 'var(--borders-layoutSection)',
                    borderRadius: 0,
                    p: 0,
                    width: 300,
                    borderTop: 'var(--borders-button)',
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  <FaAnglesLeft />
                </Button>
              </Flex>
            </NavigationTreeContainer>
          </NavigationTreeDrawer>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default SideNavbar
