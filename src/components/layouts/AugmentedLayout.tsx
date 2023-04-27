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

import React, { useEffect, useState } from 'react'

import CustomFailedError from './CustomFailedError'

type AugmentedLayoutProps = {
  errSelectors: any
  errActions: any
  specSelectors: any
  oas3Selectors: any
  oas3Actions: any
  getComponent: (arg1: string, arg2?: boolean) => any
}

export const AugmentedLayout = ({ errSelectors, specSelectors, getComponent }: AugmentedLayoutProps): JSX.Element => {
  const SvgAssets = getComponent('SvgAssets')
  const InfoContainer = getComponent('InfoContainer', true)
  const VersionPragmaFilter = getComponent('VersionPragmaFilter')
  const Operations = getComponent('operations', true)
  const Models = getComponent('Models', true)
  const Row = getComponent('Row')
  const Col = getComponent('Col')
  const Errors = getComponent('errors', true)

  const ServersContainer = getComponent('ServersContainer', true)
  const SchemesContainer = getComponent('SchemesContainer', true)
  const AuthorizeBtnContainer = getComponent('AuthorizeBtnContainer', true)
  const FilterContainer = getComponent('FilterContainer', true)

  const [hasServers, setHasServers] = useState<boolean>(false)
  const [hasSchemes, setHasSchemes] = useState<boolean>(false)
  const [hasSecurityDefinitions, setHasSecurityDefinitions] = useState<boolean>(false)
  const [isSwagger2, setIsSwagger2] = useState<boolean>(false)
  const [isOAS3, setIsOAS3] = useState<boolean>(false)
  const [pageStatus, setPageStatus] = useState<'loading' | 'failed' | 'failedConfig' | 'noSpec' | 'loaded'>('loading')

  const getUI = () => {
    switch (pageStatus) {
      case 'loading':
        return (
          <div className="swagger-ui">
            <div className="loading-container">
              <div className="info">
                <div className="loading-container">
                  <div className="loading"></div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'failed':
        return (
          <div className="swagger-ui">
            <CustomFailedError />
          </div>
        )
      case 'failedConfig': {
        const lastErr = errSelectors.lastError()
        const lastErrMsg = lastErr ? lastErr.get('message') : ''
        return (
          <div className="swagger-ui">
            <div className="loading-container">
              <div className="info failed-config">
                <div className="loading-container">
                  <h4 className="title">Failed to load remote configuration.</h4>
                  <p>{lastErrMsg}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
      case 'noSpec':
        return (
          <div className="swagger-ui">
            <div className="loading-container">
              <h4>No API definition provided.</h4>
            </div>
          </div>
        )
      default:
        return (
          <div className="swagger-ui">
            <SvgAssets />
            <VersionPragmaFilter isSwagger2={isSwagger2} isOAS3={isOAS3} alsoShow={<Errors />}>
              <Errors />
              <Row className="information-container">
                <Col mobile={12}>
                  <InfoContainer />
                </Col>
              </Row>

              {hasServers || hasSchemes || hasSecurityDefinitions ? (
                <div className="scheme-container">
                  <Col className="schemes wrapper" mobile={12}>
                    {hasServers ? <ServersContainer /> : null}
                    {hasSchemes ? <SchemesContainer /> : null}
                    {hasSecurityDefinitions ? <AuthorizeBtnContainer /> : null}
                  </Col>
                </div>
              ) : null}

              <FilterContainer />

              <Row>
                <Col mobile={12} desktop={12}>
                  <Operations />
                </Col>
              </Row>
              <Row>
                <Col mobile={12} desktop={12}>
                  <Models />
                </Col>
              </Row>
            </VersionPragmaFilter>
          </div>
        )
    }
  }

  useEffect(() => {
    setIsSwagger2(specSelectors.isSwagger2())
    setIsOAS3(specSelectors.isOAS3())

    const servers = specSelectors.servers()
    const schemes = specSelectors.schemes()

    setHasServers(servers && servers.size)
    setHasSchemes(schemes && schemes.size)
    setHasSecurityDefinitions(!!specSelectors.securityDefinitions())

    const loadingStatus = specSelectors.loadingStatus()
    const isSpecEmpty = !specSelectors.specStr()
    if (!['loading', 'failed', 'failedConfig'].includes(loadingStatus)) {
      if (isSpecEmpty) {
        setPageStatus('noSpec')
      } else {
        setPageStatus('loaded')
      }
    } else {
      setPageStatus(loadingStatus)
    }
  }, [
    specSelectors,
    specSelectors.isSwagger2(),
    specSelectors.isOAS3(),
    specSelectors.servers(),
    specSelectors.schemes(),
    specSelectors.securityDefinitions(),
    specSelectors.loadingStatus(),
    specSelectors.specStr(),
  ])

  return getUI()
}

export const AugmentedLayoutPlugin = () => {
  return {
    components: {
      AugmentedLayout,
    },
  }
}
