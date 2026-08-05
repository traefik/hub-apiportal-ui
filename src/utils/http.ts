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

/* Minimal fetch wrapper providing the behaviors we relied on from axios:
 ** throwing on non-2xx responses, JSON encoding/decoding, and reloading the
 ** page on 401 so the auth flow gets initiated when the session ends.
 */

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly data: unknown

  constructor(status: number, statusText: string, data: unknown) {
    super(`Request failed with status code ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }

  /* Equivalent of the axios `ERR_BAD_REQUEST` error code. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }
}

const parseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return null

  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/* Queries are retried by react-query, so a single expired session can produce
 ** several 401s. Only the first one needs to trigger the reload.
 */
let isReloading = false

const request = async <T>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(url, init)

  if (response.status === 401) {
    // Expired auth, reload the page to trigger the sign in flow.
    if (!isReloading) {
      isReloading = true
      location.reload()
    }
    throw new HttpError(response.status, response.statusText, null)
  }

  const data = await parseBody(response)

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, data)
  }

  return data as T
}

export const get = <T>(url: string): Promise<T> => request<T>(url, { method: 'GET' })

export const post = <T>(url: string, body?: unknown): Promise<T> =>
  request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
