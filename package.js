Package.describe({
  name: 'nicolaslopezj:roles',
  summary: 'The most advanced roles package for meteor',
  version: '2.3.0',
  git: 'https://github.com/nicolaslopezj/roles'
})

Package.onUse(function (api) {
  api.versionsFrom('1.0')

  api.use([
    'meteor-platform',
    'accounts-base',
    'ecmascript@0.1.6',
    'dburles:collection-helpers@1.0.3'
  ])

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
