Package.describe({
  name: 'nicolaslopezj:roles',
  summary: 'The most advanced roles package for meteor',
  version: '2.6.5',
  git: 'https://github.com/nicolaslopezj/roles'
})

Package.onUse(function (api) {
  api.versionsFrom('1.0')

  api.use([
    'meteor-base@1.0.4',
    'accounts-base@1.2.9',
    'check@1.2.3',
    'mongo@1.1.10',
    'ecmascript@0.1.6',
    'dburles:collection-helpers@1.0.3',
    'underscore'
  ])

  api.use([
    'templating'
  ], {weak: true})

  api.addFiles([
    'helpers.js',
    'roles.js',
    'keys.js'
  ])

  api.addFiles([
    'roles_server.js'
  ], 'server')

  api.addFiles([
    'roles_client.js'
  ], 'client')

  api.export('Roles')
  api.export('objectHasKey')
})

Package.onTest(function (api) {
  api.use('tinytest')
  api.use('orionjs:core')
})
