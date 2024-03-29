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

import { Flex } from '@traefiklabs/faency'
import React from 'react'
import { Oval } from 'react-loader-spinner'

const SuspenseFallback = () => {
  return (
    <Flex justify="center" css={{ mt: 200 }}>
      <Oval height={80} width={80} color='#0091ff' secondaryColor='rgba(0, 0, 0, 0.54)' />
    </Flex>
  )
}

export default SuspenseFallback
