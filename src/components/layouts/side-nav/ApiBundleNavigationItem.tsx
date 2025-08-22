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

import { Box, Flex, Tooltip, VisuallyHidden } from '@traefiklabs/faency'
import React, { useMemo, useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'

import ApiNavigationItem from './ApiNavigationItem'
import { BaseNavigationTreeItemProps, customActiveNavButtonStyle, StyledNavItem } from './NavigationTreeItem'

import ApiBundleSubscriptionPanel from 'components/api/subscribe/ApiBundleSubscriptionPanel'
import { useHasFeature } from 'hooks/query/use-feature'
import { eventPreventStop } from 'utils/events'

const ApiBundleNavigationTreeItem = ({
  apiBundle,
  href,
  disabled,
  defaultExpanded,
  ...props
}: BaseNavigationTreeItemProps & { apiBundle: UI.APIBundleWithLabeledVersions }) => {
  const hasSelfSubsFeature = useHasFeature('self-service-subscription')
  const [isBundleSubscriptionPanelOpen, setBundleSubscriptionPanelOpen] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { name, title } = apiBundle

  const isActive = useMemo(() => {
    if (!href) return false

    return pathname === href
  }, [pathname, href])

  const customCss = useMemo(() => {
    if (!isActive)
      return {
        '&:focus': {
          '&:after': {
            backgroundColor: 'transparent',
          },
        },
      }

    return customActiveNavButtonStyle
  }, [isActive])

  const hasPlans = useMemo(() => !!apiBundle.plans?.length, [apiBundle.plans])

  return (
    <>
      {hasSelfSubsFeature && <ApiBundleSubscriptionPanel
        apiBundle={apiBundle}
        isOpen={isBundleSubscriptionPanelOpen}
        onOpenChange={setBundleSubscriptionPanelOpen}
      />}
      <StyledNavItem
        active={isActive}
        onClick={() => navigate(href as string)}
        css={
          disabled
            ? {
                textAlign: 'justify',
                width: '100%',
                opacity: 0.5,
                '&:hover': { cursor: 'default' },
                mt: '8px !important',
              }
            : { textAlign: 'justify', width: '100%', mt: '8px !important', ...customCss }
        }
        label={
          hasPlans && hasSelfSubsFeature
            ? ((
                <Flex align="center" gap={2} onClick={eventPreventStop}>
                  {title}
                  <Tooltip content={`Subscribe to ${title}`} css={{ zIndex: 2, pt: '$1' }}>
                    <Box
                      css={{ color: '$primary', cursor: 'pointer', zIndex: 1 }}
                      onClick={() => setBundleSubscriptionPanelOpen(true)}
                    >
                      <VisuallyHidden>Subscribe to {name}</VisuallyHidden>
                      <FiPlusCircle size={20} />
                    </Box>
                  </Tooltip>
                </Flex>
              ) as any) // TODO fix, silent type error
            : title
        }
        disabled={disabled}
        defaultExpanded={defaultExpanded}
        {...props}
      >
        {apiBundle?.apis?.length
          ? apiBundle.apis.map((api: API.API, index: number) => (
              <ApiNavigationItem
                key={`sidenav-bundle-${index}`}
                api={api as UI.APIWithLabeledVersions}
                index={index}
                baseHrefUrl={`/api-catalog/bundles/${apiBundle.name}@${apiBundle.namespace}`}
              />
            ))
          : undefined}
      </StyledNavItem>
    </>
  )
}

export default ApiBundleNavigationTreeItem
