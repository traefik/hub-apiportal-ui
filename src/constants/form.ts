export const DNS_COMPLIANT = {
  regex: /^[a-z]([a-z0-9-]+)?$/,
  message: 'Only lowercase alphanumeric characters and dashes are allowed.',
}

export const DNS_SUBDOMAIN_COMPLIANT = {
  regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
  message: 'Must be a valid DNS subdomain name.',
}

export const START_END_ALPHANUM = {
  regex: /^[a-z0-9](.*[a-z0-9])?$/,
  message: 'The first and last characters have to be lowercase alphanumeric character.',
}

export const ALPHABETIC_FIRST_CHAR = {
  regex: /^[a-z](.+)?$/,
  message: 'The first character must be a lowercase letter (a-z).',
}

export const ALPHANUMERIC = {
  regex: /^[A-Za-z0-9]([A-Za-z0-9-]+)?$/,
  errorMessage: 'Only alphanumeric characters and dashes are allowed.',
}

export const RELATIVE_DOMAIN = {
  regex:
    /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
  errorMessage: 'Invalid domain.',
}

export const URL_DOMAIN = {
  regex: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
  errorMessage: 'Invalid address.',
}

export const SEMVER = {
  regex:
    /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
  errorMessage: 'Invalid semantic version.',
}

export const NO_DOTS = {
  regex: /^[^.]+$/,
  errorMessage: 'Must not contain dots.',
}
