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
import { Box, Card, Container, Flex, H1, Text, VariantProps, CSS } from '@traefiklabs/faency'
import { Helmet } from 'react-helmet-async'

import SideNavbar from 'components/SideNavbar'
import { getInjectedValues } from 'utils/getInjectedValues'

const { portalDescription, portalTitle } = getInjectedValues()

type Props = {
  title?: string
  children?: React.ReactNode
  hasCard?: boolean
  noGutter?: boolean
  containerSize?: VariantProps<typeof Container>['size']
  maxWidth?: CSS['maxWidth']
  contentAlignment?: 'default' | 'left'
}

const PageLayout = ({
  children,
  title,
  hasCard = true,
  noGutter = false,
  containerSize = '3',
  maxWidth,
  contentAlignment = 'default',
}: Props) => {
  return (
    <>
      <Helmet>
        <title>{title || 'API Portal'}</title>
      </Helmet>
      <Flex
        align="center"
        css={{
          background: '#fff',
          color: '#222',
          width: '100%',
          borderBottom: '1px solid $gray4',
          padding: '$3',
          gap: '$2',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <H1 css={{ fontSize: '$6', color: 'inherit' }}>{portalTitle as string}</H1>
        <Text css={{ color: 'inherit', opacity: 0.7 }}>{portalDescription as string}</Text>
      </Flex>
      <Flex>
        <SideNavbar />
        <Flex
          direction="column"
          css={{
            backgroundColor: '$gray2',
            flex: 1,
            height: 'calc(100vh - 58px)',
            overflowY: 'auto',
            position: 'relative',
            py: '$3',
          }}
        >
          <Flex direction="column" css={{ flex: 1, pb: noGutter ? 0 : '$2' }}>
            <Container
              size={containerSize}
              noGutter={noGutter}
              css={{
                display: 'flex',
                maxWidth,
                flexDirection: 'column',
                width: '100%',
                flex: 1,
                mx: contentAlignment === 'left' ? 0 : 'auto',
              }}
            >
              <Flex direction="column" css={{ flex: 1 }}>
                {hasCard ? (
                  <Card css={{ backgroundColor: 'white' }}>{children}</Card>
                ) : (
                  <Box css={{ p: '$3' }}>{children}</Box>
                )}
              </Flex>
              {/* <Footer /> */}
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default PageLayout
