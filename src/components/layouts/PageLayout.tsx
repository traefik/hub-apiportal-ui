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

import { CSS, Container, Flex, VariantProps } from '@traefiklabs/faency'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import BackLink from 'components/layouts/BackLink'
import { usePortal } from 'hooks/query/use-portal'

const FAVICON_FILE_FORMATS = ['gif', 'ico', 'jpg', 'jpeg', 'png', 'svg']

type Props = {
  children?: React.ReactNode
  containerSize?: VariantProps<typeof Container>['size']
  contentAlignment?: 'default' | 'left'
  fixedHeight?: boolean
  hideBackLink?: boolean
  maxWidth?: CSS['maxWidth']
  noGutter?: boolean
  sideNavbar?: React.ReactNode
  title?: string
}

const PageLayout = ({
  children,
  containerSize = '3',
  contentAlignment = 'default',
  fixedHeight = false,
  hideBackLink = false,
  maxWidth,
  noGutter = false,
  sideNavbar,
  title,
}: Props) => {
  const {
    data: { logoUrl },
  } = usePortal()

  const canUseLogoAsFavicon = useMemo(
    () => logoUrl && FAVICON_FILE_FORMATS.some((ext) => logoUrl.toLowerCase().endsWith(`.${ext.toLowerCase()}`)),
    [logoUrl],
  )

  return (
    <>
      <Helmet>
        <title>{title || 'API Portal'}</title>
        {<link rel="icon" href={canUseLogoAsFavicon ? logoUrl : './assets/favicon.ico'} />}
      </Helmet>
      <Flex>
        {sideNavbar}
        <Flex
          direction="column"
          css={{
            flex: 1,
            height: `calc(100vh - 65px)`,
            overflowY: 'auto',
            position: 'relative',
            py: fixedHeight ? 0 : '$3',
          }}
        >
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
            {!hideBackLink ? <BackLink /> : null}
            {children}
          </Container>
        </Flex>
      </Flex>
    </>
  )
}

export default PageLayout
