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
import React, { useCallback, useEffect, useMemo } from 'react'
import { Badge, Box, Flex, Grid, Select, Text } from '@traefiklabs/faency'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAPI } from 'hooks/use-portal'
import { getExtendedUnit, parseDuration } from 'utils/time'
import useVerifySpec from 'hooks/use-verify-spec'
import WarningMessage from 'components/WarningMessage'
import 'components/styles/element.css'
import CustomFailedError from 'components/CustomFailedError'

const getVersionLabel = (version: API.Version) =>
  version.title ? `${version.release} - ${version.title}` : version.release

type APIVersionProps = {
  api?: API.Resp
  apiVersion?: string
  navigateToApiVersion: (apiVersionName: string) => void
  pathname: string
  versions: API.Version[]
}

const APIVersion = ({ api, apiVersion, navigateToApiVersion, pathname, versions }: APIVersionProps) => {
  const isCurrentVersion = useMemo(() => {
    if (!pathname) return false
    const parts = pathname.split('/')
    if (!parts || !parts.length) return false
    return parts.pop() === api?.currentVersion
  }, [api?.currentVersion, pathname])

  const selectOptions = useMemo(() => {
    return versions.reduce(
      (acc, version) => {
        if (api?.currentVersion === version.name) {
          acc.current.push(version)
        } else {
          acc.others.push(version)
        }
        return acc
      },
      { current: [], others: [] } as { current: API.Version[]; others: API.Version[] },
    )
  }, [api?.currentVersion, versions])

  return (
    <Flex align="center" gap={3} css={{ width: 285 }}>
      <Select
        value={apiVersion}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => navigateToApiVersion(e.target.value)}
        css={{ borderRadius: 0, width: '70%' }}
      >
        <optgroup label="Current version">
          {selectOptions.current.map((version: API.Version, key) => (
            <option key={key} value={version.name} label={getVersionLabel(version)} />
          ))}
        </optgroup>
        {!!selectOptions.others.length && (
          <optgroup label="Other versions">
            {selectOptions.others.map((version: API.Version, key) => (
              <option key={key} value={version.name} label={getVersionLabel(version)} />
            ))}
          </optgroup>
        )}
      </Select>
      {isCurrentVersion && (
        <Badge size="small" variant="blue">
          Current
        </Badge>
      )}
    </Flex>
  )
}

const RateLimit = ({ rateLimitString, hasVersions }: { rateLimitString?: string; hasVersions: boolean }) => (
  <Grid css={{ gridTemplateColumns: '96px 1fr', ml: hasVersions ? 24 : 0 }}>
    <Text size="4" css={{ fontWeight: '$semiBold', maxWidth: '80px' }}>
      Rate limit
    </Text>
    <Text size="4">{rateLimitString}</Text>
  </Grid>
)

const API = () => {
  const { pathname } = useLocation()

  const { apiName, apiVersion, collectionName } = useParams()

  const specUrl = useMemo(() => {
    if (collectionName) {
      return apiVersion
        ? `/api/collections/${collectionName}/apis/${apiName}/versions/${apiVersion}`
        : `/api/collections/${collectionName}/apis/${apiName}`
    }

    return apiVersion ? `/api/apis/${apiName}/versions/${apiVersion}` : `/api/apis/${apiName}`
  }, [apiName, apiVersion, collectionName])

  const { hasSpec, error } = useVerifySpec(specUrl)

  const navigate = useNavigate()

  const api = useAPI(apiName?.split('@')[0], collectionName)
  const rateLimitString = useMemo(() => {
    if (!api?.rateLimit) return undefined
    const requests = `${api.rateLimit.limit} request${api.rateLimit.limit > 1 ? 's' : ''}`
    const duration = parseDuration(api.rateLimit.period)
    const period = `${duration?.period} ${getExtendedUnit(
      duration as {
        period: number
        unit: string
      },
    )}`
    return `${requests} per ${period}`
  }, [api])
  const versions = useMemo(() => (api && api.versions ? api.versions : []), [api])

  const navigateToApiVersion = useCallback(
    (apiVersionName: string) => {
      const destination = collectionName
        ? `/collections/${collectionName}/apis/${apiName}/versions/${apiVersionName}`
        : `/apis/${apiName}/versions/${apiVersionName}`

      if (pathname !== destination) {
        navigate(destination, { replace: true })
      }
    },
    [apiName, collectionName, pathname],
  )

  useEffect(() => {
    if (!apiVersion && !!api?.currentVersion) {
      navigateToApiVersion(api.currentVersion)
    }
  }, [api])

  const pageTitle = useMemo(() => {
    if (!apiName && !apiVersion) return 'API Portal'
    if (!apiVersion) return apiName
    const version = versions.find((x) => x.name == apiVersion)
    if (!version) return apiName
    return `${apiName} ${version.release} - ${version.title}`
  }, [apiName, apiVersion, versions])

  const hasMetaHeader = useMemo(() => !!rateLimitString || versions.length > 0, [rateLimitString, versions.length])

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
      {hasMetaHeader ? (
        <Grid
          align="center"
          css={{
            gridTemplateColumns: versions.length > 0 ? '284px 1fr' : '1fr',
            pl: '$3',
            borderBottom: '1px solid $gray4',
            py: '12px',
          }}
        >
          {versions.length > 0 ? (
            <APIVersion
              api={api}
              apiVersion={apiVersion}
              navigateToApiVersion={navigateToApiVersion}
              pathname={pathname}
              versions={versions}
            />
          ) : null}
          {rateLimitString ? <RateLimit rateLimitString={rateLimitString} hasVersions={versions.length > 0} /> : null}
        </Grid>
      ) : null}

      <Box
        css={{
          flex: 1,
          '> elements-api > div:first-child': {
            height: `calc(100vh - ${hasMetaHeader ? '118' : '61'}px) !important`,
          },
        }}
      >
        {!hasSpec ? (
          <WarningMessage />
        ) : !!error ? (
          <CustomFailedError />
        ) : (
          <elements-api key={specUrl} apiDescriptionUrl={specUrl} router="hash" />
        )}
      </Box>
    </>
  )
}

export default API
