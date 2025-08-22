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

import { AccessibleIcon, Button } from '@traefiklabs/faency'
import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

import { useDarkMode } from 'hooks/use-dark-mode'

export default function ThemeSwitcher() {
  const { isDarkMode, toggle } = useDarkMode()

  return (
    <Button
      type="button"
      data-testid="theme-switcher"
      ghost
      css={{ px: '$2', color: '$buttonSecondaryText', '&:focus': { borderRadius: 0 } }}
      onClick={toggle}
    >
      <AccessibleIcon label="toggle theme">{isDarkMode ? <FiMoon size={20} /> : <FiSun size={20} />}</AccessibleIcon>
    </Button>
  )
}
