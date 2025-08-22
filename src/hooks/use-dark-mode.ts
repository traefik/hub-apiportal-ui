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

/**
 * Modified version of https://usehooks-ts.com/react-hook/use-dark-mode
 * add a workaround to persist current theme selection.
 */

import { useRef } from 'react'
import { useLocalStorage, useMediaQuery } from 'usehooks-ts'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'
const LOCAL_STORAGE_KEY = 'usehooks-ts-dark-mode'

type DarkModeOptions = {
  defaultValue?: boolean
  localStorageKey?: string
  initializeWithValue?: boolean
}

interface DarkModeOutput {
  isDarkMode: boolean
  toggle: () => void
  enable: () => void
  disable: () => void
  set: (value: boolean) => void
}

export function useDarkMode(options?: DarkModeOptions): DarkModeOutput
/**
 * Custom hook that returns the current state of the dark mode.
 * @deprecated this useDarkMode's signature is deprecated, it now accepts an options object instead of multiple parameters.
 * @param  {boolean} defaultValue the initial value of the dark mode, default `false`.
 * @param  {string} [localStorageKey] the key to use in the local storage, default `'usehooks-ts-dark-mode'`.
 * @returns {DarkModeOutput} An object containing the dark mode's state and its controllers.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-dark-mode)
 * @example
 * const { isDarkMode, toggle, enable, disable, set } = useDarkMode(false, 'my-key');
 */
export function useDarkMode(defaultValue: boolean, localStorageKey?: string): DarkModeOutput
/**
 * Custom hook that returns the current state of the dark mode.
 * @param  {?boolean | ?DarkModeOptions} [options] - the initial value of the dark mode, default `false`.
 * @param  {?boolean} [options.defaultValue] - the initial value of the dark mode, default `false`.
 * @param  {?string} [options.localStorageKey] - the key to use in the local storage, default `'usehooks-ts-dark-mode'`.
 * @param  {?boolean} [options.initializeWithValue] - if `true` (default), the hook will initialize reading `localStorage`. In SSR, you should set it to `false`, returning the `defaultValue` or `false` initially.
 * @param  {?string} [localStorageKeyProps] the key to use in the local storage, default `'usehooks-ts-dark-mode'`.
 * @returns {DarkModeOutput} An object containing the dark mode's state and its controllers.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-dark-mode)
 * @example
 * const { isDarkMode, toggle, enable, disable, set } = useDarkMode({ defaultValue: true });
 */
export function useDarkMode(
  options?: boolean | DarkModeOptions,
  localStorageKeyProps: string = LOCAL_STORAGE_KEY,
): DarkModeOutput {
  const counter = useRef(0)
  counter.current++
  // TODO: Refactor this code after the deprecated signature has been removed.
  const defaultValue = typeof options === 'boolean' ? options : options?.defaultValue
  const localStorageKey =
    typeof options === 'boolean'
      ? (localStorageKeyProps ?? LOCAL_STORAGE_KEY)
      : (options?.localStorageKey ?? LOCAL_STORAGE_KEY)
  const initializeWithValue = typeof options === 'boolean' ? undefined : (options?.initializeWithValue ?? undefined)

  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue,
    defaultValue,
  })
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(localStorageKey, defaultValue ?? isDarkOS ?? false, {
    initializeWithValue,
  })

  return {
    isDarkMode,
    toggle: () => {
      setDarkMode((prev) => !prev)
    },
    enable: () => {
      setDarkMode(true)
    },
    disable: () => {
      setDarkMode(false)
    },
    set: (value) => {
      setDarkMode(value)
    },
  }
}
