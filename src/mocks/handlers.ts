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

import { rest } from 'msw'

import { api1, api2, collection1, collection2, tokens } from 'mocks/data'
import { portalMock } from 'mocks/portal'

const getApiSpec = (req, res, ctx) => {
  const { apiName, apiVersion } = req.params

  // mock API with no OAS
  if (apiName === 'no-oas') {
    return res(
      ctx.status(404),
      ctx.json({
        errorMessage: 'Not found',
      }),
    )
  }

  // mock API with OAS fetch failure
  if (apiName === 'error-oas') {
    return res(
      ctx.status(502),
      ctx.json({
        errorMessage: 'Bad gateway',
      }),
    )
  }
  const data = JSON.parse(JSON.stringify(apiName.includes('2') ? api2 : api1))
  data.info.title = `${data.info.title} - ${apiName}`
  if (apiVersion) {
    data.info.title = `${data.info.title} - ${apiVersion}`
  }
  return res(ctx.status(200), ctx.json(data))
}

const getCollectionSpec = (req, res, ctx) => {
  const { apiName, apiVersion, collectionName } = req.params
  const data = JSON.parse(JSON.stringify(apiName.includes('2') ? collection2 : collection1))
  data.info.title = `${data.info.title} - ${collectionName} - ${apiName}`
  if (apiVersion) {
    data.info.title = `${data.info.title} - ${apiVersion}`
  }
  return res(ctx.status(200), ctx.json(data))
}

const waitAsync = (seconds: number) => new Promise((res) => setTimeout(res, seconds * 1000))

export const handlers = [
  rest.get('/api/', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(portalMock),

      // Unauthorized user mock
      // ctx.status(401),
      // ctx.json({
      //   errorMessage: 'Unauthorized',
      // }),
    )
  }),

  rest.get('/api/apis/:apiName', getApiSpec),

  rest.get('/api/apis/:apiName/versions/:apiVersion', getApiSpec),

  rest.get('/api/collections/:collectionName/apis/:apiName', getCollectionSpec),

  rest.get('/api/collections/:collectionName/apis/:apiName/versions/:apiVersion', getCollectionSpec),

  rest.get('/logout', async (_, res, ctx) => {
    await waitAsync(1)
    const rnd = Math.floor(Math.random() * 100) + 1
    return rnd % 2 === 0
      ? res(ctx.status(204))
      : res(ctx.status(500), ctx.json({ errorMessage: 'Internal Server Error' }))
  }),

  rest.get('/api/tokens', async (_, res, ctx) => {
    await waitAsync(1)
    return res(ctx.status(200), ctx.json(tokens))
  }),

  rest.post('/api/tokens', async (_, res, ctx) => {
    await waitAsync(1)
    return res(ctx.status(200), ctx.json({ token: `${+new Date()}` }))
  }),

  rest.post('/api/tokens/suspend', async (_, res, ctx) => {
    await waitAsync(1)
    return res(ctx.status(200))
  }),

  rest.delete('/api/tokens', async (_, res, ctx) => {
    await waitAsync(1)
    return res(ctx.status(204))
  }),
]
