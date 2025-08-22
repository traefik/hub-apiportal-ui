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

const getApiVersions = (apiName: string, skipMinors = false) => {
  const versions = [
    {
      semverVersion: '3.0.0',
      name: `${apiName}-3.0.0`,
      title: 'third',
      release: 'v3.0.0',
    },
    {
      semverVersion: '2.0.0',
      name: `${apiName}-2.0.0`,
      title: 'second',
      release: 'v2.0.0',
    },
    {
      semverVersion: '2.0.0-rc.1',
      name: `${apiName}-2.0.0-rc.1`,
      title: '',
      release: 'v2.0.0-rc.1',
    },
    {
      semverVersion: '2.0.0-beta.2',
      name: `${apiName}-2.0.0-beta.2`,
      title: '',
      release: 'v2.0.0-beta.2',
    },
    {
      semverVersion: '2.0.0-beta.1',
      name: `${apiName}-2.0.0-beta.1`,
      title: '',
      release: 'v2.0.0-beta.1',
    },
    {
      semverVersion: '1.1.0',
      name: `${apiName}-1.1.0`,
      title: '',
      release: 'v1.1.0',
    },
    {
      semverVersion: '1.0.0',
      name: `${apiName}-1.0.0`,
      title: 'first',
      release: 'v1.0.0',
    },
  ]
  return skipMinors ? versions.filter((x) => x.title) : versions
}

const MARKDOWN_EXAMPLE = `
Markdown is a lightweight markup language used to format text. It is very popular among programmers and content creators due to its simplicity and ease of use. If you want to learn more about how to use Markdown, you can visit the [official documentation](https://daringfireball.net/projects/markdown/).

### Benefits of Markdown

There are several advantages to using Markdown:

- **Simplicity**: Easy to learn and use.
- **Versatility**: Supported on various platforms.
- **Readability**: Clean and straightforward formatting.

Here is an example of a table in Markdown:

| Feature | Description         |
|---------|---------------------|
| Key     | ~~value~~ new value |

### Conclusion

In conclusion, Markdown is a powerful tool for anyone who needs to write and format text in a **simple** and **effective** way. Thanks to its simplicity and versatility, it has become a *de facto* standard for documentation and online writing.

Autolink: https://traefik.io/`

const API_DESCRIPTION = `
*A Markdown description of the API.* Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Contact [the API owner](mailto) if you have further questions.
`

const PORTAL_DESCRIPTION = `
**API Demo Portal**

More information [here](https://traefik.io/)
`

export const portalMock: API.Portal = {
  title: 'Traefik Airlines',
  description: PORTAL_DESCRIPTION,
  jwtAuth: false,
  logoUrl: 'https://placehold.co/120x120.png',
  features: ['self-service-application', 'self-service-subscription'],
  apis: [
    {
      name: 'no-oas-suspended',
      namespace: 'default',
      title: 'Empty API',
      specLink: '/apis/no-oas@default',
      plans: [
        {
          name: 'free-plan',
          title: 'Free',
          description: API_DESCRIPTION,
          rateLimit: { limit: 1, period: '30s' },
        },
      ],
      subscriptions: [
        {
          createdAt: '2024-12-17T09:50:30.187Z',
          suspended: true,
          application: {
            name: 'application-1',
            appId: '6bc1160e-663e-454a-bc46-1ef0ab0cb5b4',
          },
          id: 'subscription-1',
          name: '',
          isManaged: false,
          plan: {
            name: 'free-plan',
            title: 'Free',
            description: MARKDOWN_EXAMPLE,
            rateLimit: { limit: 1, period: '30s' },
          },
        },
      ],
    },
    {
      name: 'error-oas',
      namespace: 'default',
      title: 'OAS error',
      description: API_DESCRIPTION,
      specLink: '/apis/error-oas@default',
      versions: getApiVersions('my-api'),
      plans: [
        {
          name: 'free-plan',
          title: 'Free',
          description: MARKDOWN_EXAMPLE,
          rateLimit: { limit: 10, period: '15s' },
        },
        {
          name: 'gold-plan',
          rateLimit: { limit: 2000, period: '30m' },
          quota: { limit: 10000, period: '1h', current: 7546 },
        },
      ],
    },
    {
      name: 'my-api',
      namespace: 'petstore',
      title: 'Customer API',
      description: API_DESCRIPTION,
      specLink: '/apis/my-api@petstore',
      versions: getApiVersions('my-api'),
      plans: [
        {
          title: 'Silver',
          description: 'Standard Plan description',
          name: 'silver-plan',
          rateLimit: {
            limit: 5,
            period: '1s',
          },
          quota: {
            limit: 75,
            period: '1h',
            current: 0,
          },
          operationFilter: {
            include: ['operation1', 'operation2'],
          },
        },
        {
          title: 'Gold',
          description: 'Standard Plan description',
          name: 'gold-plan',
          rateLimit: {
            limit: 10,
            period: '1s',
          },
          quota: {
            limit: 100,
            period: '1h',
            current: 30,
          },
        },
      ],
      subscriptions: [
        {
          createdAt: '0001-01-01T00:00:00Z',
          suspended: false,
          application: {
            name: 'application-2',
            appId: 'my-managed-application',
          },
          id: '',
          name: 'managed-subs',
          isManaged: true,
          plan: {
            title: 'Gold',
            description: 'Standard Plan description',
            name: 'gold-plan',
            rateLimit: {
              limit: 10,
              period: '1s',
            },
            quota: {
              limit: 100,
              period: '1h',
              current: 30,
            },
          },
        },
        {
          createdAt: '2025-01-16T14:00:20.192Z',
          suspended: false,
          application: {
            name: 'application-1',
            appId: '6bc1160e-663e-454a-bc46-1ef0ab0cb5b4',
          },
          id: 'subscription-1',
          name: '',
          isManaged: false,
          plan: {
            title: 'Silver',
            description: 'Standard Plan description',
            name: 'silver-plan',
            rateLimit: {
              limit: 15,
              period: '1s',
            },
            quota: {
              limit: 75,
              period: '1h',
              current: 0,
            },
            operationFilter: {
              include: ['operation1', 'operation2'],
            },
          },
        },
        {
          createdAt: '2024-12-27T15:13:20.192Z',
          suspended: true,
          application: {
            name: 'application-3',
            appId: 'c28b00c5-a3a7-40c3-85e2-52d9175b5880',
          },
          id: 'subscription-2',
          name: '',
          isManaged: false,
          plan: {
            title: 'Silver',
            description: 'Standard Plan description',
            name: 'silver-plan',
            rateLimit: {
              limit: 5,
              period: '1s',
            },
            quota: {
              limit: 75,
              period: '1h',
              current: 0,
            },
          },
        },
      ],
    },
    {
      name: 'my-api-2',
      namespace: 'petstore',
      title: 'Petstore',
      description: 'This is a petstore example API.',
      specLink: '/apis/my-api-2@petstore',
      versions: getApiVersions('my-api-2', true),
      plans: [
        {
          title: 'Silver',
          description: 'Standard Plan description',
          name: 'silver-plan',
          rateLimit: {
            limit: 15,
            period: '1s',
          },
          quota: {
            limit: 75,
            period: '1h',
            current: 0,
          },
          operationFilter: {
            include: ['operation1', 'operation2'],
          },
        },
        {
          title: 'Gold',
          description: 'Standard Plan description',
          name: 'gold-plan',
          rateLimit: {
            limit: 10,
            period: '1s',
          },
          quota: {
            limit: 100,
            period: '1h',
            current: 30,
          },
        },
      ],
      subscriptions: [
        {
          createdAt: '2025-01-16T14:00:20.192Z',
          suspended: false,
          application: {
            name: 'application-1',
            appId: '6bc1160e-663e-454a-bc46-1ef0ab0cb5b4',
          },
          id: 'subscription-1',
          name: '',
          isManaged: true,
          plan: {
            title: 'Silver',
            description: 'Standard Plan description',
            name: 'silver-plan',
            rateLimit: {
              limit: 15,
              period: '1s',
            },
            quota: {
              limit: 75,
              period: '1h',
              current: 0,
            },
            operationFilter: {
              include: ['operation1', 'operation2'],
            },
          },
        },
      ],
    },
    {
      name: 'my-unversioned-api',
      namespace: 'petstore',
      title: 'Unversioned',
      specLink: '/apis/my-unversioned-api@petstore',
      plans: [
        {
          name: 'free-plan',
          title: 'Free',
          description: MARKDOWN_EXAMPLE,
          rateLimit: { limit: 10, period: '15s' },
        },
        {
          name: 'gold-plan',
          quota: { limit: 2000000000000, period: '300000m', current: 189850 },
          rateLimit: { limit: 1000, period: '1h' },
        },
      ],
    },
  ],
  bundles: [
    {
      name: 'my-bundle',
      namespace: 'petstore',
      title: 'Awesome bundle',
      apis: [
        {
          name: 'my-api',
          namespace: 'petstore',
          title: 'Customer API',
          description: API_DESCRIPTION,
          specLink: '/apis/my-api@petstore',
          versions: getApiVersions('my-api'),
          plans: [
            {
              title: 'Silver Plan',
              description: 'Silver Plan description',
              name: 'silver-plan',
              rateLimit: {
                limit: 15,
                period: '1s',
              },
              quota: {
                limit: 250,
                period: '1h',
                current: 0,
              },
              operationFilter: {
                include: ['operation1', 'operation2'],
              },
            },
            {
              name: 'standard-plan',
              title: 'Standard Plan Title',
              description: MARKDOWN_EXAMPLE,
              quota: { limit: 100, period: '30m', current: 54 },
              rateLimit: { limit: 10, period: '1s' },
            },
            {
              title: 'Gold',
              description: 'Gold Plan description',
              name: 'gold-plan',
              rateLimit: {
                limit: 100,
                period: '1s',
              },
              quota: {
                limit: 1000,
                period: '1h',
                current: 30,
              },
            },
          ],
          subscriptions: [
            {
              createdAt: '0001-01-01T00:00:00Z',
              suspended: false,
              application: {
                name: 'application-2',
                appId: 'my-managed-application',
              },
              id: '',
              name: 'managed-subs',
              isManaged: true,
              plan: {
                title: 'Gold',
                description: 'Standard Plan description',
                name: 'gold-plan',
                rateLimit: {
                  limit: 10,
                  period: '1s',
                },
                quota: {
                  limit: 100,
                  period: '1h',
                  current: 30,
                },
              },
            },
            {
              createdAt: '2025-01-16T14:00:20.192Z',
              suspended: false,
              application: {
                name: 'application-1',
                appId: '6bc1160e-663e-454a-bc46-1ef0ab0cb5b4',
              },
              id: 'subscription-1',
              name: '',
              isManaged: false,
              plan: {
                title: 'Silver',
                description: 'Standard Plan description',
                name: 'silver-plan',
                rateLimit: {
                  limit: 15,
                  period: '1s',
                },
                quota: {
                  limit: 75,
                  period: '1h',
                  current: 0,
                },
                operationFilter: {
                  include: ['operation1', 'operation2'],
                },
              },
            },
            {
              createdAt: '2024-12-27T15:13:20.192Z',
              suspended: true,
              application: {
                name: 'application-3',
                appId: 'c28b00c5-a3a7-40c3-85e2-52d9175b5880',
              },
              id: 'subscription-2',
              name: '',
              isManaged: false,
              plan: {
                title: 'Silver',
                description: 'Standard Plan description',
                name: 'silver-plan',
                rateLimit: {
                  limit: 5,
                  period: '1s',
                },
                quota: {
                  limit: 75,
                  period: '1h',
                  current: 0,
                },
              },
            },
          ],
        },
        {
          name: 'my-other-new-api',
          namespace: 'petstore',
          title: 'Other API',
          description: 'This is an example API with a simple string description.',
          specLink: '/apis/my-api@petstore',
          plans: [
            {
              title: 'Silver',
              description: 'Standard Plan description',
              name: 'silver-plan',
              rateLimit: {
                limit: 5,
                period: '1s',
              },
              quota: {
                limit: 75,
                period: '1h',
                current: 0,
              },
              operationFilter: {
                include: ['operation1', 'operation2'],
              },
            },
          ],
        },
      ],
      plans: [
        {
          title: 'Silver',
          description: 'The silver plan.',
          name: 'silver-plan',
          rateLimit: {
            limit: 15,
            period: '1s',
          },
          quota: {
            limit: 75,
            period: '1h',
            current: 0,
          },
          operationFilter: {
            include: ['operation1', 'operation2'],
          },
        },
        {
          title: 'Gold',
          description: 'The gold plan.',
          name: 'gold-plan',
          rateLimit: {
            limit: 100,
            period: '1s',
          },
          quota: {
            limit: 1000,
            period: '1h',
            current: 0,
          },
          operationFilter: {
            include: ['operation1', 'operation2'],
          },
        },
      ],
    },
    {
      name: 'bundle-no-plan',
      namespace: 'petstore',
      title: 'Bundle with no plans',
      apis: [
        {
          name: 'my-unversioned-api',
          title: 'Unversioned',
          namespace: 'petstore',
          specLink: '/apis/my-unversioned-api@petstore',
          plans: [
            {
              name: 'free-plan',
              title: 'Free',
              description: MARKDOWN_EXAMPLE,
              rateLimit: { limit: 10, period: '15s' },
            },
            {
              name: 'gold-plan',
              quota: { limit: 2000000000000, period: '300000m', current: 189850 },
              rateLimit: { limit: 1000, period: '1h' },
            },
          ],
        },
      ],
    },
  ],
}
