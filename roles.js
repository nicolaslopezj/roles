/**
 * Init the variable
 */
Roles = {};

/**
 * Initialize variables
 */
Roles._roles = {};
Roles._actions = [];
Roles._helpers = [];

/**
 * To save the roles in the database
 */
Roles._collection = new Mongo.Collection('roles');

/**
 * Check if a user has a role
 */
Roles.userHasRole = function(userId, role) {
  return Roles._collection.find({ userId: userId, roles: role }).count() > 0;
}

/**
 * Creates a new action
 */
Roles.registerAction = function(name, adminAllow, adminDeny) {
  check(name, String);
  check(adminAllow, Match.Optional(Match.Any));
  check(adminDeny, Match.Optional(Match.Any));

  this._actions.push(name);

  if (adminAllow) {
    Roles._adminRole.allow(name, adminAllow);
  }
  if (adminDeny) {
    Roles._adminRole.deny(name, adminDeny);
  }
}

/**
 * Creates a new helper
 */
Roles.registerHelper = function(name, adminHelper) {
  check(name, String);
  check(adminHelper, Match.Any);
  this._helpers.push(name);

  if (adminHelper) {
    Roles._adminRole.helper(name, adminHelper);
  }
}

/**
 * Constructs a new role
 */
Roles.Role = function(name) {
  check(name, String);

  if (! (this instanceof Roles.Role))
    throw new Error('use "new" to construct a role');

  this.name = name;
  this.allowRules = {};
  this.denyRules = {};
  this.helpers = {};

  Roles._roles[name] = this;
}

/**
 * Adds allow properties to a role
 */
Roles.Role.prototype.allow = function(action, allow) {
  check(action, String);
  check(allow, Match.Any);
  if (!_.contains(Roles._actions, action)) throw 'Action "' + action + '" is not defined';

  if (!_.isFunction(allow)) {
    var clone = _.clone(allow);
    allow = function() {
      return clone;
    }
  }

  this.allowRules[action] = this.allowRules[action] || [];
  this.allowRules[action].push(allow);
}

/**
 * Adds deny properties to a role
 */
Roles.Role.prototype.deny = function(action, deny) {
  check(action, String);
  check(deny, Match.Any);
  if (!_.contains(Roles._actions, action)) throw 'Action "' + action + '" is not defined';

  if (!_.isFunction(deny)) {
    var clone = _.clone(deny);
    deny = function() {
      return clone;
    }
  }

  this.denyRules[action] = this.denyRules[action] || [];
  this.denyRules[action].push(deny);
}

/**
 * Adds a helper to a role
 */
Roles.Role.prototype.helper = function(helper, func) {
  check(helper, String);
  check(func, Match.Any);
  if (!_.contains(Roles._helpers, helper)) throw 'Helper "' + helper + '" is not defined';

  if (!_.isFunction(func)) {
    func = function() {
      return func;
    }
  }

  this.helpers[helper] = func;
}

/**
 * Calls a helper
 */
Roles.helper = function(userId, helper) {
  check(userId, Match.Optional(String));
  check(helper, String);
  if (!_.contains(this._helpers, helper)) throw 'Helper "' + helper + '" is not defined';
  
  var args = _.toArray(arguments).slice(2);
  var self = this;
  var context = { userId: userId };
  var responses = [];
  var userRoles = Roles._collection.findOne({ userId: userId });
  if (!userRoles) return;

  _.each(userRoles.roles, function(role){
    if (self._roles[role] && self._roles[role].helpers && self._roles[role].helpers[helper]) {
      responses.push(self._roles[role].helpers[helper].apply(context, args));
    }
  });

  return responses;
}

/**
 * Returns if the user passes the allow check
 */
Roles.allow = function(userId, action) {
  if (!userId) return false;

  check(userId, Match.Optional(String));
  check(action, String);

  var args = _.toArray(arguments).slice(2);
  var self = this;
  var context = { userId: userId };
  var allowed = false;
  var userRoles = Roles._collection.findOne({ userId: userId });
  if (!userRoles) return;
  _.each(userRoles.roles, function(role){
    if (!allowed && self._roles[role] && self._roles[role].allowRules && self._roles[role].allowRules[action]) {
      _.each(self._roles[role].allowRules[action], function(func){
        var allow = func.apply(context, args);
        if (allow === true) {
          allowed = true;
        }
      });
    }
  });

  return allowed;
}

/**
 * Returns if the user has permission using deny and deny
 */
Roles.deny = function(userId, action) {
  if (!userId) return false;
  
  check(userId, Match.Optional(String));
  check(action, String);

  var args = _.toArray(arguments).slice(2);
  var self = this;
  var context = { userId: userId };
  var denied = false;
  var userRoles = Roles._collection.findOne({ userId: userId });
  if (!userRoles) return;

  _.each(userRoles.roles, function(role){
    if (!denied && self._roles[role] && self._roles[role].denyRules && self._roles[role].denyRules[action]) {
      _.each(self._roles[role].denyRules[action], function(func){
        var denies = func.apply(context, args);
        if (denies === true) {
          denied = true;
        }
      });
    }
  });

  return denied;
}

/**
 * To check if a user has permisisons to execute an action
 */
Roles.userHasPermission = function() {
  var allows = this.allow.apply(this, arguments);
  var denies = this.deny.apply(this, arguments);
  return allows === true && denies === false;
}

/**
 * Adds helpers to users
 */
Meteor.users.helpers({
  /**
   * Returns the user roles
   */
  roles: function () {
    var object = Roles._collection.findOne({ userId: this._id });
    return object ? object.roles : [];
  },
  /**
   * To check if the user has a role
   */
  hasRole: function(role) {
    return Roles.userHasRole(this._id, role);
  }
});

/**
 * The admin role, who recives the default actions.
 */
Roles._adminRole = new Roles.Role('admin');





