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

import { HttpResponse, http, passthrough } from 'msw'

import { apiAPI1, apiAPI2, apiApplications } from 'mocks/data'
import { portalMock } from 'mocks/portal'

const NOT_FOUND = '404 Not Found'

const getApiSpec = ({ params }) => {
  const { apiId, apiVersion } = params

  // mock API with no OAS
  if (apiId.includes('no-oas')) {
    return HttpResponse.json({ errorMessage: 'Not found' }, { status: 404 })
  }

  // mock API with OAS fetch failure
  if (apiId.includes('error-oas')) {
    return HttpResponse.json({ errorMessage: 'Bad gateway' }, { status: 502 })
  }
  const data = JSON.parse(JSON.stringify(apiId.includes('2') ? apiAPI2 : apiAPI1))
  data.info.title = `${data.info.title} - ${apiId}`
  if (apiVersion) {
    data.info.title = `${data.info.title} - ${apiVersion}`
  }
  return HttpResponse.json(data, { status: 200 })
}

const waitAsync = (seconds: number) => new Promise((res) => setTimeout(res, seconds * 1000))

export const getHandlers = () => [
  http.get('/api/', () => {
    if (
      portalMock.bundles &&
      portalMock.bundles[0].plans &&
      portalMock.bundles[0].plans[0] &&
      portalMock.bundles[0].plans[0].rateLimit
    ) {
      portalMock.bundles[0].plans[0].rateLimit.limit = Math.floor(Math.random() * 10 + 1) * 10
    }
    return HttpResponse.json(portalMock, { status: 200 })
    // return HttpResponse.json({ errorMessage: 'Unauthorized' }, { status: 401 }) // Unauthorized user mock.
  }),

  http.get('/api/apis/:apiId', getApiSpec),
  http.get('/api/apis/:apiId/versions/:apiVersion', getApiSpec),

  http.get('/logout', async () => {
    await waitAsync(1)
    const rnd = Math.floor(Math.random() * 100) + 1
    return rnd % 2 === 0
      ? HttpResponse.json(undefined, { status: 204 })
      : HttpResponse.json({ errorMessage: 'Internal Server Error' }, { status: 500 })
  }),

  // Applications.

  http.get('/api/applications', async ({ request }) => {
    const url = new URL(request.url)
    let results = [...apiApplications]
    if (url.searchParams.has('search')) {
      results = results.filter(
        (result) =>
          result.appId.includes(url.searchParams.get('search') || '') ||
          result.name.includes(url.searchParams.get('search') || ''),
      )
    }
    await waitAsync(1)
    return HttpResponse.json(results, { status: 200 })
  }),

  http.post('/api/applications', async ({ request }) => {
    const { name } = (await request.json()) as { name: string }
    const application = apiApplications.find((application) => application.name === name)
    await waitAsync(1)
    return HttpResponse.json(application || apiApplications[0], { status: 200 })
  }),

  http.put('/api/applications/:id', async ({ request }) => {
    const { name } = (await request.json()) as { name: string }
    const application = apiApplications.find((application) => application.name === name)
    await waitAsync(1)
    return HttpResponse.json(application || apiApplications[0], { status: 200 })
  }),

  http.delete('/api/applications/:id', async () => {
    await waitAsync(1)
    return HttpResponse.json(undefined, { status: 204 })
  }),

  // Application API keys.

  http.post('/api/applications/:id/api-keys', async ({ request }) => {
    const { title } = (await request.json()) as { title: string }
    await waitAsync(1)
    const apiKeys = apiApplications.flatMap((application) => application.apiKeys || [])
    if (apiKeys.find((apiKey) => apiKey.title === title)) {
      return HttpResponse.json(undefined, { status: 409 })
    }
    return HttpResponse.json({ token: `${+new Date()}` }, { status: 201 })
  }),

  http.delete('/api/applications/:id/api-keys', async () => {
    await waitAsync(1)
    return HttpResponse.json(undefined, { status: 204 })
  }),

  http.post('/api/applications/:id/api-keys/suspend', async () => {
    await waitAsync(1)
    return HttpResponse.json(undefined, { status: 200 })
  }),

  // Self-service subscriptions.

  http.post('/api/self-service-subscriptions', async () => {
    await waitAsync(1)
    return HttpResponse.json(undefined, { status: 201 })
  }),

  http.delete('/api/self-service-subscriptions/:id', async () => {
    await waitAsync(1)
    return HttpResponse.json(undefined, { status: 204 })
  }),

  // Others.

  http.all('*', ({ request }) => {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      return HttpResponse.text(NOT_FOUND, { status: 404 })
    }
    return passthrough()
  }),
]
