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
import { Box, Flex, H2, Text } from '@traefiklabs/faency'

const WarningMessage = () => {
  const fontCss = {
    fontSize: '$5',
  }
  return (
    <Box css={{ py: '$8', px: '$4' }}>
      <H2 css={{ mb: '$6' }}>Hey there! 👋</H2>
      <Flex direction="column" gap={3}>
        <Text css={fontCss}>You see this message because the API is published without an OpenAPI specification.</Text>
        <Text css={fontCss}>Don&apos;t worry, the API is functional!</Text>
      </Flex>
    </Box>
  )
}

export default WarningMessage
