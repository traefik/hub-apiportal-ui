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

import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const useHrefWithReturnTo = (href: string, returnTo?: string): string => {
  const { hash, pathname, search } = useLocation()

  return useMemo(() => {
    const base = new URL(href, window.location.origin)
    const params = new URLSearchParams(base.search)

    const returnToValue = returnTo ?? `${pathname}${search}${hash}`
    params.set('returnTo', returnToValue)

    base.search = params.toString()

    // Make it relative again, since URL() made it absolute
    return base.pathname + (base.search ? `${base.search}` : '')
  }, [hash, href, pathname, returnTo, search])
}
