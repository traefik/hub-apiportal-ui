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

const getApiVersions = (apiName, skipMinors = false) => {
  const versions = [
    {
      semverVersion: '3.0.0',
      name: `${apiName}-3.0.0`,
      title: 'third',
      release: 'v3.0.0',
    },
    {
      semverVersion: '2.0.0',
      name: `${apiName}-2.0.0`,
      title: 'second',
      release: 'v2.0.0',
    },
    {
      semverVersion: '2.0.0-rc.1',
      name: `${apiName}-2.0.0-rc.1`,
      title: '',
      release: 'v2.0.0-rc.1',
    },
    {
      semverVersion: '2.0.0-beta.2',
      name: `${apiName}-2.0.0-beta.2`,
      title: '',
      release: 'v2.0.0-beta.2',
    },
    {
      semverVersion: '2.0.0-beta.1',
      name: `${apiName}-2.0.0-beta.1`,
      title: '',
      release: 'v2.0.0-beta.1',
    },
    {
      semverVersion: '1.1.0',
      name: `${apiName}-1.1.0`,
      title: '',
      release: 'v1.1.0',
    },
    {
      semverVersion: '1.0.0',
      name: `${apiName}-1.0.0`,
      title: 'first',
      release: 'v1.0.0',
    },
  ]
  return skipMinors ? versions.filter((x) => x.title) : versions
}

export const portalMock = {
  title: 'my portal',
  description: 'a description of my portal',
  jwtAuth: false,
  logoUrl: 'https://placehold.co/120x120',
  collections: [
    {
      name: 'my-empty-collection',
      apis: [],
    },
    {
      name: 'my-collection',
      pathPrefix: '/collection',
      apis: [
        {
          name: 'my-api',
          specLink: '/collections/my-collection/apis/my-api@petstore',
          pathPrefix: '/api',
          currentVersion: 'my-api-2.0.0',
          versions: getApiVersions('my-api'),
          rateLimit: { limit: 1, period: '30s' },
        },
        {
          name: 'my-api-2',
          specLink: '/collections/my-collection/apis/my-api-2@petstore',
          pathPrefix: '/api-2',
          currentVersion: 'my-api-2-3.0.0',
          versions: getApiVersions('my-api-2', true),
          rateLimit: { limit: 2000, period: '30m' },
        },
      ],
    },
    {
      name: 'my-collection-2',
      apis: [
        {
          name: 'my-unversioned-api',
          specLink: '/collections/my-collection-2/apis/my-unversioned-api@petstore',
          pathPrefix: '/path',
        },
      ],
    },
  ],
  apis: [
    {
      name: 'no-oas',
      specLink: '/apis/no-oas',
      pathPrefix: '/api',
      rateLimit: { limit: 1, period: '30s' },
    },
    {
      name: 'error-oas',
      specLink: '/apis/error-oas',
      pathPrefix: '/api',
      currentVersion: 'my-api-2.0.0',
      versions: getApiVersions('my-api'),
      rateLimit: { limit: 1, period: '30s' },
    },
    {
      name: 'my-api',
      specLink: '/apis/my-api@petstore',
      pathPrefix: '/api',
      currentVersion: 'my-api-2.0.0',
      versions: getApiVersions('my-api'),
      rateLimit: { limit: 1, period: '30s' },
    },
    {
      name: 'my-api-2',
      specLink: '/apis/my-api-2@petstore',
      pathPrefix: '/api-2',
      currentVersion: 'my-api-2-3.0.0',
      versions: getApiVersions('my-api-2', true),
      rateLimit: { limit: 2000, period: '30m' },
    },
    {
      name: 'my-unversioned-api',
      specLink: '/apis/my-unversioned-api@petstore',
      pathPrefix: '/api',
    },
  ],
}
