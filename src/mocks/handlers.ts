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

import api from './api.json'
import collectionApi from './collection-api.json'
import tokens from './tokens.json'

const waitAsync = (seconds: number) => new Promise((res) => setTimeout(res, seconds * 1000))

export const handlers = [
  rest.get('/api/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: 'my portal',
        description: 'a description of my portal',
        logoUrl: 'https://example.com/logo.png',
        collections: [
          {
            name: 'my-empty-store-collection',
            apis: [],
          },
          {
            name: 'my-store-collection',
            pathPrefix: '/api',
            apis: [
              {
                name: 'my-petstore-api',
                specLink: '/collections/my-store-collection/apis/my-petstore-api@petstore',
                pathPrefix: '/prefix',
              },
            ],
          },
          {
            name: 'my-store-collection-2',
            apis: [
              {
                name: 'my-petstore-api-2',
                specLink: '/collections/my-store-collection-2/apis/my-petstore-api-2@petstore',
                pathPrefix: '/path',
              },
            ],
          },
        ],
        apis: [{ name: 'my-petstore-api', specLink: '/apis/my-petstore-api@petstore', pathPrefix: '/api' }],
      }),

      // Unauthorized user mock
      // ctx.status(401),
      // ctx.json({
      //   errorMessage: 'Unauthorized',
      // }),
    )
  }),

  rest.get('/api/apis/:apiName', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(api))
  }),

  rest.get('/api/collections/:collectionName/apis/:apiName', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(collectionApi))
  }),

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
