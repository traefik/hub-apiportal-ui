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

import React from 'react'

import { ToastState } from 'components/layouts/Toast'

function handleHideToast(toast: ToastState): (t: ToastState) => ToastState {
  return (t: ToastState): ToastState => {
    if (t === toast) {
      t.isVisible = false
    }
    return t
  }
}

interface ToastProviderProps {
  children: React.ReactNode
}

interface ToastContextProps {
  toasts: ToastState[]
  addToast: (toast: ToastState) => void
  hideToast: (toast: ToastState) => void
}

export const ToastContext = React.createContext({} as ToastContextProps)

export const ToastProvider = (props: ToastProviderProps) => {
  const [toasts, setToastList] = React.useState<ToastState[]>([])

  const addToast = React.useCallback((toast: ToastState) => {
    setToastList((toasts) => [...toasts, toast])
  }, [])

  const hideToast = React.useCallback((toast: ToastState) => {
    setToastList((toasts) => toasts.map(handleHideToast(toast)))
  }, [])

  const value: ToastContextProps = { toasts, addToast, hideToast }

  return <ToastContext.Provider value={value}>{props.children}</ToastContext.Provider>
}
