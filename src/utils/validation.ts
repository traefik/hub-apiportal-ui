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

import * as Yup from 'yup'

import { DNS_SUBDOMAIN_COMPLIANT, START_END_ALPHANUM } from 'constants/form'

export const DNSSubdomainCompliantTextSchema = Yup.string()
  .matches(START_END_ALPHANUM.regex, START_END_ALPHANUM.message)
  .matches(DNS_SUBDOMAIN_COMPLIANT.regex, DNS_SUBDOMAIN_COMPLIANT.message)
  .max(63, 'Name can have a maximum length of 63 characters.')
