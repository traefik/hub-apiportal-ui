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

import { CSS, Flex, NavigationItem, NavigationLink, Text, styled } from '@traefiklabs/faency'
import React, { ComponentProps, ReactNode, useMemo } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'

const IconContainer = styled(Flex, {
  mr: 8,

  '@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.laptop})': {
    mr: 0,
  },
} as any)

const TextHideOnTablet = styled(Text, {
  fontWeight: '$semiBold',

  '@media (min-width: ${breakpoints.tablet}) and (max-width: 1230px)': {
    display: 'none',
  },
} as any)

type NavItemWrapperProps = {
  children: ReactNode
  css?: CSS
  isExternal?: boolean
  to: string
}

const NavItemWrapper = ({ children, css, isExternal = false, to, ...props }: NavItemWrapperProps) => {
  const mergedCSS = {
    mt: 0,
    '&:before, &:focus': { borderRadius: 0 },
    '> div:first-child': { alignItems: 'center' },
    ...css,
  }

  const navigate = useNavigate()

  if (isExternal)
    return (
      <NavigationLink href={to} target="_blank" css={mergedCSS} {...props}>
        {children}
      </NavigationLink>
    )

  return (
    <NavigationItem css={mergedCSS} onClick={() => navigate(to)} {...props}>
      {children}
    </NavigationItem>
  )
}

type NavItemWithIconProps = ComponentProps<typeof NavigationItem> & {
  icon?: ReactNode
  isExternal?: boolean
  label: string
  locationPrefix?: string
  to: string
}

export default function NavItemWithIcon({
  icon,
  isExternal,
  label,
  locationPrefix,
  to,
  ...props
}: NavItemWithIconProps) {
  const location = useLocation()

  const isActive = useMemo(
    () => (locationPrefix ? location.pathname.includes(locationPrefix) : !!matchPath(to, location.pathname)),
    [location.pathname, locationPrefix, to],
  )

  const css = useMemo<CSS>(
    () => ({ color: isActive ? '$primary' : '$navButtonText', opacity: isActive ? 1 : 0.74 }),
    [isActive],
  )

  return (
    <NavItemWrapper active={isActive} isExternal={isExternal} to={to} {...props}>
      <IconContainer>
        <Text css={css}>{icon ? icon : null}</Text>
      </IconContainer>
      <TextHideOnTablet css={css}>{label}</TextHideOnTablet>
    </NavItemWrapper>
  )
}
