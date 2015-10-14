/**
 * Publish user roles
 */
Meteor.publish('nicolaslopezj_roles', function () {
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
});


/**
 * Adds roles to a user
 */
Roles.addUserToRoles = function(userId, roles) {
  check(userId, String);
  check(roles, Match.OneOf(String, Array));
  if (!_.isArray(roles)) {
    roles = [roles];
  }
  return Meteor.users.update({ _id: userId }, { $addToSet: { roles: { $each: roles } } });
};

/**
 * Set user roles
 */
Roles.setUserRoles = function(userId, roles) {
  check(userId, String);
  check(roles, Match.OneOf(String, Array));
  if (!_.isArray(roles)) {
    roles = [roles];
  }
  return Meteor.users.update({ _id: userId }, { $set: { roles: roles } });
};

/**
 * Removes roles from a user
 */
Roles.removeUserFromRoles = function(userId, roles) {
  check(userId, String);
  check(roles, Match.OneOf(String, Array));
  if (!_.isArray(roles)) {
    roles = [roles];
  }
  return Meteor.users.update({ _id: userId }, { $pullAll: { roles: roles } });
};
