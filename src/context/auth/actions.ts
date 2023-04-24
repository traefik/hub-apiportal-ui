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

import axios from 'axios'

export const handleLogIn = async (dispatch, payload) => {
  try {
    dispatch({ type: 'REQUEST_LOGIN' })
    const { data } = await axios.post('/login', payload)

    const token = data.accessToken
    const user = data.user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    axios.defaults.headers.common.Authorization = `Bearer ${token}`

    dispatch({ payload: { user, token }, type: 'LOGIN_SUCCESS' })
  } catch (error) {
    console.error(error)
    dispatch({ error, type: 'LOGIN_ERROR' })
  }
}

export const reloadSession = async (dispatch, token, user) => {
  try {
    dispatch({ type: 'REQUEST_LOGIN' })
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    dispatch({ payload: { token, user }, type: 'LOGIN_SUCCESS' })
  } catch (error) {
    await handleLogOut(dispatch)
  }
}

export const handleLogOut = async (dispatch) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete axios.defaults.headers.common.Authorization
  dispatch({ type: 'LOGOUT' })
}
