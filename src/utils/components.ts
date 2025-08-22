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

import {
  AriaTable,
  AriaTbody,
  AriaTd,
  AriaTh,
  AriaThead,
  AriaTr,
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Li,
  Link,
  Ol,
  Text,
  Ul,
} from '@traefiklabs/faency'
import { Components } from 'react-markdown'

const components: Components = {
  a: Link,
  blockquote: Blockquote as any,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  li: Li,
  ol: Ol,
  p: Text as any,
  table: AriaTable as any,
  tbody: AriaTbody as any,
  td: AriaTd as any,
  th: AriaTh as any,
  thead: AriaThead as any,
  tr: AriaTr as any,
  ul: Ul,
}

export default components
