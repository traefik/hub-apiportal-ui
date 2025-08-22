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

export const buildAPIHref = (api: API.API) => {
  return `/apis/${api.name}@${api.namespace}`
}

export const getVersionLabel = (version: API.Version) =>
  version.title ? `${version.release} - ${version.title}` : version.release

export const getCleanPath = (path: string) => {
  const versionIndex = path.indexOf('/versions/')
  const overviewIndex = path.indexOf('/overview')

  if (versionIndex >= 0) return path.substring(0, versionIndex)

  return overviewIndex >= 0 ? path.substring(0, overviewIndex) : path
}

export const stringMatchQuery = (str: string, query: string) => {
  return str.toLowerCase().includes(query.toLowerCase())
}

export const addApiVersionsLabel = (api: API.API) => {
  return {
    ...api,
    versions: api.versions?.map((version) => ({ ...version, label: getVersionLabel(version) })),
  }
}

export const filterApiBySearchQuery = (api: API.API, query?: string) => {
  // to simplify the search via displayed label for versions
  const versionsWithLabel = api.versions?.map((version) => ({ ...version, label: getVersionLabel(version) }))

  if (!query) return { ...api, versions: versionsWithLabel }

  const isApiOnSearchQuery = stringMatchQuery(api.title, query)

  const filteredVersions =
    !isApiOnSearchQuery && !!versionsWithLabel?.length
      ? versionsWithLabel.filter((item) => stringMatchQuery(item.label, query))
      : versionsWithLabel

  // do not return anything if the api and its versions have no query match
  if (!isApiOnSearchQuery && !filteredVersions?.length) {
    return null
  }

  return { ...api, versions: filteredVersions }
}

export const filterBundleBySearchQuery = (apiBundle: API.APIBundle, query?: string) => {
  if (!query) return { ...apiBundle, apis: apiBundle.apis.map((api) => addApiVersionsLabel(api)) }

  const isBundleOnSearchQuery = stringMatchQuery(apiBundle.title, query)

  const filteredApis = isBundleOnSearchQuery
    ? apiBundle.apis.map((api) => addApiVersionsLabel(api))
    : apiBundle.apis.map((api) => filterApiBySearchQuery(api, query)).filter((api) => !!api)

  // do not return anything if the bundle and its descendants have no query match
  if (!isBundleOnSearchQuery && !filteredApis.length) {
    return null
  }

  return { ...apiBundle, apis: filteredApis }
}
