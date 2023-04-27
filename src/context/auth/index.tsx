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

import { AuthReducer, initialState } from './reducer'
import { reloadSession } from './actions'
import React, { useEffect, useReducer, createContext } from 'react'

const AuthStateContext = createContext(initialState)
const AuthDispatchContext = createContext(null)

export const useAuthState = () => {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider')
  }

  return context
}

export const useAuthDispatch = () => {
  const context = React.useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider')
  }

  return context
}

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(AuthReducer, initialState)

  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  if (token && !authState.isLoading && !authState.user?.username) dispatch({ type: 'REQUEST_LOGIN' })

  useEffect(() => {
    if (token) {
      reloadSession(dispatch, token, JSON.parse(user as string))
    }
  }, [token])

  return (
    <AuthStateContext.Provider value={{ ...authState }}>
      <AuthDispatchContext.Provider value={dispatch as any}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export default AuthProvider
