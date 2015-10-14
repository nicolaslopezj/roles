Roles.keys = {};

/**
 * Initialize the collection
 */
Roles.keys.collection = new Meteor.Collection('nicolaslopezj_roles_keys');

/**
 * Set the permissions
 * Users can request keys just for them
 */
Roles.keys.collection.allow({
  insert: function(userId, doc) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return userId === doc.userId;
  }
});

/**
 * Requests a new key
 * @param  {String} userId Id of the userId
 * @return {String}        Id of the key
 */
Roles.keys.request = function(userId) {
  return this.collection.insert({
    userId: userId,
    createdAt: new Date()
  });
};

/**
 * Returns the userId of the specified key and deletes the key from the database
 * @param  {String}  key
 * @param  {Boolean} dontDelete True to leave the key in the database
 * @return {String}             Id of the user
 */
Roles.keys.getUserId = function(key, dontDelete) {
  check(key, String);
  check(dontDelete, Match.Optional(Boolean));

  var doc = this.collection.findOne({ _id: key });

  if (!dontDelete) {
    this.collection.remove({ _id: key });
  }

  return doc && doc.userId;
};
