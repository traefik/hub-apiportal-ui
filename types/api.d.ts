declare namespace API {
  type RateLimit = {
    limit: number
    period: string
  }

  type Version = {
    semverVersion: string
    name: string
    title: string
    release: string
  }

  type Resp = {
    name: string
    specLink: string
    pathPrefix: string
    currentVersion?: string
    versions?: Version[]
    rateLimit?: RateLimit
  }
}
