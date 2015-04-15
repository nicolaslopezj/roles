/**
 * Ensure mongo index
 */
Roles._collection._ensureIndex('userId', { unique: true });

/**
 * Publish user roles
 */
Meteor.publish(null, function () {
  return Roles._collection.find({ userId: this.userId });
})


/**
 * Adds roles to a user
 */
Roles.addUsersToRoles = function(userId, roles) {
  check(userId, String);
  check(roles, Match.OneOf(String, Array));
  if (!_.isArray(roles)) {
    roles = [roles];
  }
  return Roles._collection.upsert({ userId: userId }, { $addToSet: { roles: { $each: roles } } });
}

/**
 * Set user roles
 */
Roles.setUserRoles = function(userId, roles) {
  check(userId, String);
  check(roles, Match.OneOf(String, Array));
  if (!_.isArray(roles)) {
    roles = [roles];
  }
  return Roles._collection.upsert({ userId: userId }, { $set: { roles: roles } });
}

/**
 * Removes roles from a user
 */
Roles.removeUsersFromRoles = function(userId, roles) {
  check(userId, String);
  check(roles, Match.OneOf(String, Array));
  if (!_.isArray(roles)) {
    roles = [roles];
  }
  return Roles._collection.update({ userId: userId }, { $pullAll: { roles: roles } });
}