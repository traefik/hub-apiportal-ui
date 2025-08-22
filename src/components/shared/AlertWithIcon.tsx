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

import { Alert, Box, Flex } from '@traefiklabs/faency'
import React, { ComponentProps, ReactNode } from 'react'

const variantToColor: Record<string, string> = {
  error: '$red9',
  gray: '$slate9',
  info: '$blue9',
  success: '$green9',
  warning: '$orange9',
}

type AlertWithIconProps = ComponentProps<typeof Alert> & {
  align?: 'baseline' | 'center' | 'start'
  icon: ReactNode
}

export default function AlertWithIcon({ align = 'start', children, css, icon, ...props }: AlertWithIconProps) {
  return (
    <Alert
      {...props}
      css={{
        border: 'var(--borders-layoutSection)',
        borderRadius: 0,
        boxShadow: 'none',
        '&:before': { borderRadius: 0 },
        ...css,
      }}
    >
      <Flex align={align} gap={2}>
        <Box css={{ color: variantToColor[props.variant ? props.variant.toString() : 'info'] || 'inherit' }}>
          {icon}
        </Box>
        {children}
      </Flex>
    </Alert>
  )
}
