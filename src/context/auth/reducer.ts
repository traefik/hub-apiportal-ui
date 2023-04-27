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

export const initialState: {
  // TODO confirm how user and error object would look like
  user:
    | {
        username: string
      }
    | undefined
  error: any
  isLoading: boolean
  token: string
  isLoggedIn: boolean
} = {
  user: undefined,
  error: null,
  isLoading: false,
  token: '',
  isLoggedIn: false,
}

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        ...initialState,
        isLoading: true,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        user: action.payload.user,
        isLoading: false,
        token: action.payload.token,
        isLoggedIn: true,
      }
    case 'LOGOUT':
      return {
        ...initialState,
        user: undefined,
        token: '',
        isLoggedIn: false,
      }

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        user: undefined,
        error: action.error,
        isLoading: false,
        token: '',
      }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}
