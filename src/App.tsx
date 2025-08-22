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

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { FaencyProvider, darkTheme, globalCss, lightTheme } from '@traefiklabs/faency'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import ToastPool from 'components/layouts/ToastPool'
import { ToastProvider } from 'context/toasts'
import { useDarkMode } from 'hooks/use-dark-mode'
import Routes from 'Routes'

import 'components/styles/element.css'
import 'components/styles/theme.css'

const LIGHT_THEME = lightTheme('neon')
const DARK_THEME = darkTheme('neon')

/* axios global setup to handle 401 error status
 ** reload page when user's session end to initiate the auth flow
 */
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      location.reload()
      return error
    }
    return Promise.reject(error)
  },
)

const bodyGlobalStyle = globalCss({
  body: {
    boxSizing: 'border-box',
    margin: 0,
  },
})

const queryClient = new QueryClient()

export default function App() {
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove(LIGHT_THEME)
      document.documentElement.classList.add(DARK_THEME)
      document.documentElement.dataset.theme = 'dark'
      localStorage.setItem('mosaic-theme', `{"mode":"dark","version":0}`)
    } else {
      document.documentElement.classList.remove(DARK_THEME)
      document.documentElement.classList.add(LIGHT_THEME)
      document.documentElement.dataset.theme = 'light'
      localStorage.setItem('mosaic-theme', `{"mode":"light","version":0}`)
    }
  }, [isDarkMode])

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <FaencyProvider>
            <BrowserRouter
              basename={
                window.portalAPIBasePath.endsWith('/')
                  ? window.portalAPIBasePath.slice(0, -1)
                  : window.portalAPIBasePath
              }
              future={{
                v7_relativeSplatPath: true,
                v7_startTransition: false,
              }}
            >
              <QueryParamProvider adapter={ReactRouter6Adapter}>
                <>
                  {bodyGlobalStyle()}
                  <Helmet>
                    <script src="https://unpkg.com/@stoplight/elements@9.0.0/web-components.min.js"></script>
                  </Helmet>
                  <Routes />
                  <ToastPool />
                </>
              </QueryParamProvider>
            </BrowserRouter>
          </FaencyProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ToastProvider>
  )
}
