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

import { Box, Card, Flex, Text } from '@traefiklabs/faency'
import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

export const SomethingWentWrong = () => {
  return (
    <Card css={{ p: '$8' }}>
      <Flex direction="column" align="center" justify="center">
        <Box css={{ mb: '$2', color: '$textRed' }}>
          <FaExclamationCircle size={24} />
        </Box>
        <Text size={4} variant="red" css={{ fontWeight: 600 }}>
          An error occurred while processing your request. Please try again.
        </Text>
      </Flex>
    </Card>
  )
}

export default SomethingWentWrong
