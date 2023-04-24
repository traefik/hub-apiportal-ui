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
import { Flex, H1 } from '@traefiklabs/faency'

const EmptyState = () => {
  return (
    <Flex direction="column" gap={3} align="center" justify="center" css={{ height: 500 }}>
      <H1>No API is shared yet</H1>
      {/* <Link>See how to create one</Link> */}
    </Flex>
  )
}

export default EmptyState
