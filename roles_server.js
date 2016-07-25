/**
 * Publish user roles
 */
Meteor.publish('nicolaslopezj_roles', function () {
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } })
})

/**
 * Migrate
 */
Meteor.methods({
  nicolaslopezj_roles_migrate: function () {
    var selector = Roles._oldCollection.find({})
    console.log('migrating ' + selector.count() + ' roles...')
    selector.forEach(function (userRoles) {
      Meteor.users.update(userRoles.userId, { $set: { roles: userRoles.roles } })
      Roles._oldCollection.remove(userRoles)
    })

    console.log('roles migrated')
  },
})

/**
 * Adds roles to a user
 */
Roles.addUserToRoles = function (userId, roles) {
  check(userId, String)
  check(roles, Match.OneOf(String, Array))
  if (!_.isArray(roles)) {
    roles = [roles]
  }

  return Meteor.users.update({ _id: userId }, { $addToSet: { roles: { $each: roles } } })
}

/**
 * Set user roles
 */
Roles.setUserRoles = function (userId, roles) {
  check(userId, String)
  check(roles, Match.OneOf(String, Array))
  if (!_.isArray(roles)) {
    roles = [roles]
  }

  return Meteor.users.update({ _id: userId }, { $set: { roles: roles } })
}

/**
 * Removes roles from a user
 */
Roles.removeUserFromRoles = function (userId, roles) {
  check(userId, String)
  check(roles, Match.OneOf(String, Array))
  if (!_.isArray(roles)) {
    roles = [roles]
  }

  return Meteor.users.update({ _id: userId }, { $pullAll: { roles: roles } })
}
