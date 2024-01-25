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

import React, { Suspense } from 'react'
import { Box, Container, Flex, H1, Text, VariantProps, CSS, Image } from '@traefiklabs/faency'
import { Helmet } from 'react-helmet-async'

import SideNavbar from 'components/SideNavbar'
import { Portal } from 'hooks/use-portal'
import SuspenseFallback from 'components/SuspenseFallback'
import COLORS from 'components/styles/colors'

type Props = {
  portal?: Portal
  title?: string
  children?: React.ReactNode
  noGutter?: boolean
  containerSize?: VariantProps<typeof Container>['size']
  maxWidth?: CSS['maxWidth']
  contentAlignment?: 'default' | 'left'
  fixedHeight?: boolean
}

const PageLayout = ({
  children,
  title,
  portal,
  noGutter = false,
  containerSize = '4',
  maxWidth,
  contentAlignment = 'default',
  fixedHeight = false,
}: Props) => {
  return (
    <Box css={{ margin: 'auto', border: `1px solid ${COLORS.border}` }}>
      <Helmet>
        <title>{title || 'API Portal'}</title>
      </Helmet>
      <Flex
        align="center"
        css={{
          background: '#fff',
          color: '#222',
          width: '100%',
          borderBottom: `1px solid ${COLORS.border}`,
          pl: '$4',
          gap: '$2',
          position: 'relative',
          height: 88,
        }}
      >
        {!!portal?.logoUrl && (
          <Image
            src={portal?.logoUrl}
            alt="logo"
            css={{
              border: '1px solid $grayA6',
              boxSizing: 'border-box',
              height: '$8',
              width: '$8',
              objectFit: 'contain',
            }}
          />
        )}
        <H1 css={{ fontSize: '$6', color: 'inherit' }}>{portal?.title as string}</H1>
        <Text css={{ color: 'inherit', opacity: 0.7 }}>{portal?.description as string}</Text>
      </Flex>
      <Flex>
        <SideNavbar portal={portal} />
        <Flex
          direction="column"
          css={{
            flex: 1,
            height: `calc(100vh - 90px)`,
            overflowY: fixedHeight ? 'hidden' : 'auto',
            position: 'relative',
            py: fixedHeight ? 0 : '$3',
          }}
        >
          <Flex direction="column" css={{ flex: 1 }}>
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
                px: 0,
              }}
            >
              <Flex direction="column" css={{ flex: 1, height: '100%' }}>
                <Flex direction="column" css={{ p: noGutter ? 0 : '$3 $5', height: '100%' }}>
                  <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
                </Flex>
              </Flex>
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default PageLayout
