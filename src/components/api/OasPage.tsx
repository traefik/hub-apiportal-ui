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
import { Box, Button, Flex } from '@traefiklabs/faency'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaArrowLeft, FaCog } from 'react-icons/fa'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ApiSettings from './ApiSettings'
import ApiVersionSelector from './ApiVersionSelector'
import ApiSubscriptionPanel from './subscribe/ApiSubscriptionPanel'

import CustomFailedError from 'components/api/CustomFailedError'
import WarningMessage from 'components/api/WarningMessage'
import IconButton from 'components/buttons/IconButton'
import { useHasFeature } from 'hooks/query/use-feature'
import { useAPI } from 'hooks/query/use-portal'
import useVerifySpec from 'hooks/query/use-verify-spec'
import { useDarkMode } from 'hooks/use-dark-mode'
import 'components/styles/element.css'

const OasPage = () => {
  const hasSelfSubsFeature = useHasFeature('self-service-subscription')
  const { isDarkMode } = useDarkMode()

  const [isPanelOpen, setPanelOpen] = useState(false)

  const { pathname, hash } = useLocation()
  const navigate = useNavigate()

  const openSettings = useMemo(() => hash?.slice(1) === 'settings', [hash])

  const { apiId, apiVersion, apiBundleId } = useParams()

  const specUrl = useMemo(() => {
    return apiVersion ? `./api/apis/${apiId}/versions/${apiVersion}` : `./api/apis/${apiId}`
  }, [apiId, apiVersion])

  const { hasSpec, hasPaths, error } = useVerifySpec(specUrl)

  const api = useAPI(apiId, apiBundleId)
  const versions = useMemo(() => (api && api.versions ? api.versions : []), [api])

  // navigate to api versions if needed
  const navigateToApiVersion = useCallback(
    (apiVersionName: string) => {
      const destination = apiBundleId
        ? `/api-catalog/bundles/${apiBundleId}/apis/${apiId}/versions/${apiVersionName}`
        : `/api-catalog/apis/${apiId}/versions/${apiVersionName}`

      if (pathname !== destination) {
        navigate(destination, { replace: true })
      }
    },
    [apiBundleId, apiId, navigate, pathname],
  )

  useEffect(() => {
    if (!apiVersion && versions.length > 0) {
      navigateToApiVersion(versions[0].name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  const pageTitle = useMemo(() => {
    if (!apiId && !apiVersion) return 'API Portal'
    if (!apiVersion) return api?.title

    const version = versions.find((version) => version.name == apiVersion)
    if (!version) return apiId

    return `${api?.title} ${version.release} - ${version.title}`
  }, [api?.title, apiId, apiVersion, versions])

  useEffect(() => {
    let observer
    const elements = document.querySelectorAll('a[href*="https://stoplight.io/"]')
    if (elements.length > 0) {
      elements.forEach((element) => element.remove())
    } else {
      observer = new MutationObserver(() => {
        const elements = document.querySelectorAll('a[href*="https://stoplight.io/"]')
        if (elements.length > 0) {
          elements.forEach((element) => element.remove())
        }
      })
      observer.observe(document, { subtree: true, childList: true })
    }
    return () => {
      if (observer) {
        observer.disconnect()
        observer = null
      }
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {hasSelfSubsFeature && (
        <ApiSubscriptionPanel api={api as API.API} isOpen={isPanelOpen} onOpenChange={setPanelOpen} />
      )}
      <Flex
        align="center"
        justify="space-between"
        css={{
          px: '$3',
          borderBottom: 'var(--borders-layoutSection)',
          py: '12px',
          height: 64,
        }}
      >
        {versions.length > 0 ? (
          <ApiVersionSelector
            api={api}
            apiVersion={apiVersion}
            navigateToApiVersion={navigateToApiVersion}
            pathname={pathname}
            versions={versions}
          />
        ) : (
          <Box />
        )}
        {!api?.subscriptions?.length && !!api?.plans?.length && hasSelfSubsFeature ? (
          <Button css={{ borderRadius: 0 }} onClick={() => setPanelOpen(true)}>
            Subscribe
          </Button>
        ) : null}
        {api?.subscriptions?.length ? (
          <IconButton
            ghost
            icon={openSettings ? <FaArrowLeft size={20} /> : <FaCog size={20} />}
            onClick={() => (openSettings ? navigate(pathname) : navigate('#settings'))}
          />
        ) : null}
      </Flex>

      {openSettings ? (
        <ApiSettings setPanelOpen={setPanelOpen} />
      ) : (
        <Box
          css={{
            flex: 1,
            '> elements-api > div:first-child': {
              height: `calc(100vh - 118}px) !important`,
            },

            '> elements-api[layout="stacked"] > div:first-child': {
              padding: '0 20px',
            },

            '> elements-api button.sl-bg-primary.sl-text-on-primary': {
              backgroundColor: '$primary',
              color: '$buttonPrimaryText',
              '&:hover': {
                backgroundColor: isDarkMode ? '#DBED68' : '#919C4C',
                color: isDarkMode ? '#303E44' : '#F8F9F5',
              },
            },
          }}
        >
          {!hasSpec ? (
            <WarningMessage />
          ) : error ? (
            <CustomFailedError />
          ) : (
            // If there's no paths in the spec, there's no need for a sidebar and an export button.
            <elements-api
              layout={hasPaths ? 'sidebar' : 'stacked'}
              hideExport={!hasPaths}
              key={specUrl}
              apiDescriptionUrl={specUrl}
              router="hash"
            />
          )}
        </Box>
      )}
    </>
  )
}

export default OasPage
