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

import { Card, Flex, Grid, H2, Skeleton, styled, Text } from '@traefiklabs/faency'
import React, { Fragment } from 'react'

const StyledText = styled(Text, {
  fontSize: 'inherit !important',
  lineHeight: '24px',
} as any)

export const ValText = styled(StyledText, {
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
} as any)

type DefinitionSectionProps = {
  keyColumns?: number
  items: { key: string; val: string | React.ReactElement }[]
  testidPrefix?: string
  title?: string
}

export default function DefinitionSection({
  keyColumns = 2,
  items,
  testidPrefix = 'definition',
  title = 'Definition',
}: DefinitionSectionProps) {
  return (
    <Flex as="section" direction="column" gap={2} data-testid={`${testidPrefix}-section`}>
      {title ? <H2 css={{ fontSize: '$5' }}>{title}</H2> : null}
      <Card css={{ flex: 1, border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}>
        <Grid css={{ gap: '$2 $3', gridTemplateColumns: `repeat(${keyColumns}, auto 1fr)` }}>
          {items.map((item, index) => (
            <Fragment key={index}>
              <Grid>
                {index < keyColumns
                  ? items
                      .filter((hiddenItem) => hiddenItem.key != item.key)
                      .map((hiddenItem, jndex) => (
                        <StyledText
                          key={`hidden-${index}-${jndex}`}
                          aria-hidden="true"
                          css={{ gridArea: '1 / 1', fontWeight: 600, visibility: 'hidden' }}
                        >
                          {hiddenItem.key}
                        </StyledText>
                      ))
                  : null}
                <StyledText css={{ gridArea: '1 / 1', fontWeight: 600 }}>{item.key}</StyledText>
              </Grid>
              {typeof item.val === 'string' ? (
                <ValText css={{ flex: 1 }}>{item.val}</ValText>
              ) : (
                <Flex align="center">{item.val}</Flex>
              )}
            </Fragment>
          ))}
        </Grid>
      </Card>
    </Flex>
  )
}

export function DefinitionSectionSkeleton({
  keyColumns = 2,
  rows = 3,
  testidPrefix = 'definition',
  title = 'Definition',
}: { rows?: number } & Omit<DefinitionSectionProps, 'items'>) {
  return (
    <Flex as="section" direction="column" gap={2} data-testid={`${testidPrefix}-section-skeleton`}>
      {title ? <H2 css={{ fontSize: '$5' }}>{title}</H2> : null}
      <Card css={{ flex: 1, border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}>
        <Grid css={{ gap: '$2 $3', gridTemplateColumns: `repeat(${keyColumns}, auto 1fr)` }}>
          {[...Array(rows * keyColumns)].map((_, idx) => (
            <Fragment key={idx}>
              <Skeleton css={{ height: '$5', width: '96px', borderRadius: 0 }} />
              <Skeleton css={{ height: '$5', width: '192px', borderRadius: 0 }} />
            </Fragment>
          ))}
        </Grid>
      </Card>
    </Flex>
  )
}
