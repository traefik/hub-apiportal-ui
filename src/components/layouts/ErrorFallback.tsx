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

import { Box, Button, Card, Flex, Text } from '@traefiklabs/faency'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { FaExclamationCircle } from 'react-icons/fa'

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Card role="alert" variant="ghost" css={{ p: '$8' }}>
      <Flex direction="column" align="center" gap={2} justify="center">
        <Box css={{ mb: '$2', color: '$textRed' }}>
          <FaExclamationCircle size={20} />
        </Box>
        <Text size={4} variant="red" css={{ fontWeight: 600 }}>
          An error occurred while processing your request:
        </Text>
        <Text size={4} variant="red" css={{ fontWeight: 600 }}>
          {error.message}
        </Text>
        <Button type="button" onClick={resetErrorBoundary} css={{ mt: '$2' }}>
          Try again
        </Button>
      </Flex>
    </Card>
  )
}
