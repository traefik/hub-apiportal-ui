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

import React, { useMemo, useState, useCallback, createContext, useContext } from 'react'

import { ToastState } from 'components/Toast'

const hideToastFilter = (toast: ToastState) => (t: ToastState) => {
  return t.key !== toast.key
}

interface ToastProviderProps {
  children: React.ReactNode
}

interface ToastContextProps {
  toasts: ToastState[]
  addToast: (toast: ToastState) => ToastState
  hideToast: (toast: ToastState) => void
  hideAllToasts: () => void
}

export const ToastContext = createContext({} as ToastContextProps)

export const ToastProvider = (props: ToastProviderProps) => {
  const [toasts, setToastList] = useState<ToastState[]>([])
  const addToast = useCallback(
    (toast: ToastState) => {
      toast.key = Date.now()
      setToastList((toasts) => [...toasts, toast])

      return toast
    },
    [setToastList],
  )

  const hideToast = useCallback(
    (toast: ToastState) => {
      setToastList((toasts) => toasts.filter(hideToastFilter(toast)))
    },
    [setToastList],
  )

  const hideAllToasts = useCallback(() => {
    setToastList([])
  }, [setToastList])

  const value: ToastContextProps = useMemo(
    () => ({ toasts, addToast, hideToast, hideAllToasts }),
    [toasts, addToast, hideToast, hideAllToasts],
  )

  return <ToastContext.Provider value={value}>{props.children}</ToastContext.Provider>
}

export const useToasts = (): ToastContextProps => useContext(ToastContext)
