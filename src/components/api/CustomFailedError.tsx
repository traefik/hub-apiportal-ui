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

import { Box, H2, Text } from '@traefiklabs/faency'
import React from 'react'

export default function CustomFailedError() {
  return (
    <Box css={{ py: '$8', px: '$4' }}>
      <H2 css={{ mb: '$6' }}>Specification unavailable</H2>

      <Text css={{ fontSize: '$5' }}>
        The API cannot be displayed because the OpenAPI specification is either not reachable or not configured.
      </Text>
    </Box>
  )
}
