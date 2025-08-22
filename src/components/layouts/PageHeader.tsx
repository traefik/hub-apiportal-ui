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

import { CSS, Flex, H1, H2, H3, H4, H5, H6, Skeleton, TextField, styled } from '@traefiklabs/faency'
import { InputHandle } from '@traefiklabs/faency/dist/components/Input' // eslint-disable-line import/no-unresolved
import React, { useRef, ReactNode } from 'react'
import { FiXCircle } from 'react-icons/fi'

const StyledCloseCircle = styled(FiXCircle, {
  '@hover': {
    '&:hover': {
      cursor: 'pointer',
    },
  },
} as any)

const TITLE_ELEMENTS = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
}

type PageHeaderProps = {
  ctaButtonSlot?: ReactNode
  disabled?: boolean
  filterSlot?: ReactNode
  search?: any
  setSearch?: any
  setSearchDebounced?: any
  title: ReactNode
  titleCSS?: CSS
  titleEl?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const PageHeader = ({
  ctaButtonSlot,
  disabled = false,
  filterSlot,
  search,
  setSearch,
  setSearchDebounced,
  title,
  titleCSS = {},
  titleEl = 'h1',
}: PageHeaderProps) => {
  const searchInputRef = useRef<InputHandle>(null)
  const Heading = TITLE_ELEMENTS[titleEl]

  return (
    <Flex direction="column">
      <Flex gap="4" css={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Heading css={{ fontSize: '36px', fontWeight: 600, wordBreak: 'break-all', ...titleCSS }}>{title}</Heading>
        <Flex gap={3}>
          <Flex gap="4" align="center">
            {filterSlot}
            {!!setSearch && (
              <TextField
                ref={searchInputRef}
                defaultValue={search}
                disabled={disabled}
                onChange={setSearchDebounced}
                size="large"
                placeholder="Search"
                endAdornment={
                  <StyledCloseCircle
                    aria-label="Clear"
                    onClick={() => {
                      setSearch(undefined, 'replaceIn')
                      searchInputRef.current?.clear()
                    }}
                    size={20}
                  />
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    setSearch(e.currentTarget.value, 'replaceIn')
                  }
                }}
                css={{
                  '> div:first-child': { borderRadius: 0 },
                  ':before': { borderRadius: 0 },
                  ':after': { borderRadius: 0 },
                }}
              />
            )}
          </Flex>
          {ctaButtonSlot}
        </Flex>
      </Flex>
    </Flex>
  )
}

export function PageHeaderSkeleton({ hasCTAButton = false }: { hasCTAButton?: boolean }) {
  return (
    <Flex direction="column">
      <Flex gap="4" css={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Skeleton css={{ height: '45px', width: '224px', borderRadius: 0 }} />
        <Flex gap={3}>
          {hasCTAButton ? <Skeleton css={{ height: '40px', width: '88px', borderRadius: 0 }} /> : null}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PageHeader
