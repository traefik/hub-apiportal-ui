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

import { Box, CSS, Card, Flex, H1, H2, H3, H4, H5, H6, Text, Skeleton as FaencySkeleton } from '@traefiklabs/faency'
import React, { useMemo, ReactNode } from 'react'

import { useDarkMode } from 'hooks/use-dark-mode'

export type FormSectionProps = {
  title: string | React.ReactNode
  titleEl?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description?: string | React.ReactNode
  css?: CSS
  disabled?: boolean
  titleWidth?: number
  children?: React.ReactNode
  titleCss?: CSS
  noDivider?: boolean
  required?: boolean
}

export const TITLE_ELEMENTS = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
}

export const DescriptionSubtleText = ({ children, css }: { children: ReactNode; css?: CSS }) => {
  return (
    <Text variant="subtle" size="3" css={{ fontWeight: 300, lineHeight: '18px', ...css }}>
      {children}
    </Text>
  )
}

const FormSection = ({
  children,
  title,
  titleEl = 'h2',
  description,
  css,
  disabled = false,
  titleWidth = 288,
  titleCss,
  noDivider = false,
  required = false,
  ...props
}: FormSectionProps) => {
  const { isDarkMode } = useDarkMode()

  const Heading = TITLE_ELEMENTS[titleEl]

  const borderColor = useMemo((): string => (!isDarkMode ? 'hsl(209, 29%, 82%)' : 'hsl(209, 29%, 19%)'), [isDarkMode])

  const renderedDescription = useMemo(() => {
    if (typeof description === 'string') {
      return <DescriptionSubtleText>{description}</DescriptionSubtleText>
    }

    return <>{description}</>
  }, [description])

  return (
    <Flex
      {...props}
      css={{
        flexWrap: 'wrap',
        borderBottom: noDivider ? 'none' : `1px solid ${borderColor}`,
        my: '$3',
        opacity: disabled ? 0.3 : 1,
        ...css,
      }}
    >
      <Flex css={{ flexDirection: 'column', width: titleWidth, mr: '$5', paddingBottom: '$6' }}>
        <Box css={{ mb: description ? '$2' : 0 }}>
          <Heading css={{ fontSize: '$5', ...titleCss }}>
            {title}
            {required && <Text css={{ fontSize: '$5', ...titleCss, ml: '$1', color: '$inputInvalidBorder' }}>*</Text>}
          </Heading>
        </Box>
        {renderedDescription}
      </Flex>
      <Flex css={{ flex: 1, alignItems: 'flex-start', minWidth: 346, paddingBottom: '$6' }}>{children}</Flex>
    </Flex>
  )
}

export const FormSectionSkeleton = () => {
  return (
    <Flex
      css={{
        flexWrap: 'wrap',
        my: '$3',
      }}
    >
      <Flex gap={2} css={{ flexDirection: 'column', width: 288, mr: '$5', paddingBottom: '$6' }}>
        <FaencySkeleton variant="text" css={{ height: '$5', width: '80%' }} />
        <FaencySkeleton variant="text" css={{ height: '$3', width: '70%' }} />
        <FaencySkeleton variant="text" css={{ height: '$3', width: '70%' }} />
      </Flex>
      <Flex css={{ flex: 1, alignItems: 'flex-start', minWidth: 346, paddingBottom: '$6' }}>
        <Card css={{ width: '100%', display: 'flex', gap: '$2', flexDirection: 'column', borderRadius: 0 }}>
          <FaencySkeleton css={{ width: '100%', height: '$6' }} />
          <FaencySkeleton variant="text" css={{ height: '$3', width: '70%' }} />
        </Card>
      </Flex>
    </Flex>
  )
}

export default FormSection
