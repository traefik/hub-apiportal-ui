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

import { Flex, config } from '@traefiklabs/faency'
import React, { useEffect, useState } from 'react'

import { CustomIconProps } from 'components/icons'
import { useDarkMode } from 'hooks/use-dark-mode'

type SortIconProps = CustomIconProps & {
  order?: 'asc' | 'desc' | ''
}

const SortIcon = ({ css = {}, order, flexProps = {}, ...props }: SortIconProps) => {
  const [enabledColor, setEnabledColor] = useState<string>((config.theme.colors as any).deepBlue3)
  const [disabledColor, setDisabledColor] = useState<string>((config.theme.colors as any).deepBlue8)

  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    setEnabledColor(isDarkMode ? (config.theme.colors as any).deepBlue3 : (config.theme.colors as any).deepBlue11)
    setDisabledColor(isDarkMode ? (config.theme.colors as any).deepBlue8 : (config.theme.colors as any).deepBlue6)
  }, [isDarkMode])

  return (
    <Flex {...flexProps} css={css}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        role="img"
        aria-labelledby="sort-icon"
        viewBox="0 0 8 15"
        {...props}
      >
        <title id="sort-icon">Sort</title>
        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
          <g transform="translate(-438 -204)">
            <g transform="translate(368 190)">
              <g>
                <path d="M0 0H217V40H0z"></path>
              </g>
              <text
                fill="#000"
                fillOpacity="0.85"
                fontFamily="RubikRoman-Medium, Rubik"
                fontSize="16"
                fontWeight="400"
                letterSpacing="0.615"
              >
                <tspan x="17" y="26.057">
                  Name
                </tspan>
              </text>
            </g>
            <g>
              <g transform="translate(435 201.557)">
                <g transform="translate(3 12)">
                  <path
                    fill={!!order && order === 'desc' ? enabledColor : disabledColor}
                    d="M7.815.2a.72.72 0 010 .964L4.447 4.8a.6.6 0 01-.894 0L.185 1.164a.72.72 0 010-.964.6.6 0 01.893 0L4 3.354 6.922.2a.6.6 0 01.893 0z"
                  ></path>
                </g>
              </g>
              <g transform="translate(435 201.557)">
                <g transform="rotate(180 5.5 4)">
                  <path
                    fill={!!order && order === 'asc' ? enabledColor : disabledColor}
                    d="M7.815.2a.72.72 0 010 .964L4.447 4.8a.6.6 0 01-.894 0L.185 1.164a.72.72 0 010-.964.6.6 0 01.893 0L4 3.354 6.922.2a.6.6 0 01.893 0z"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </Flex>
  )
}

export default SortIcon
