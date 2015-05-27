Roles
=====

Roles is like a common roles package with more features.

```
meteor add nicolaslopezj:roles
```

The main features of Roles is that allows you to create **actions** and add allow/deny rules to that action for a specific role.

> This roles package introduces a new way of thinking about roles. It makes you think first about actions and then define the different responses for each role to that action.

## Basic use

You can use roles as a normal roles package

#### Attach roles to users

**Only on server**

To add roles to a user.

```js
Roles.addUserToRoles(userId, roles)
```

- ```userId``` String. The id of the user.
- ```roles``` Array or String. The name of the roles you want to **add** to the user.

To set roles.

```js
Roles.setUserRoles(userId, roles)
```

- ```userId``` String. The id of the user.
- ```roles``` Array or String. The name of the roles you want to **set** to the user.

To remove roles from a user

```js
Roles.removeUserFromRoles(userId, roles)
```

- ```userId``` String. The id of the user.
- ```roles``` Array or String. The name of the roles you want to **remove** from the user.


#### Check if a user has a role

```js
Roles.userHasRole(userId, role)
```

- ```userId``` String. The id of the user.
- ```role``` String. The name of the role.

### Users collection helpers

Roles also attach helpers to the ```Meteor.users``` collection.

#### Get user roles

```js
var user = Meteor.user();
var roles = user.roles();
```

#### Check if a user has a role

```js
var user = Meteor.user();
var hasRole = user.hasRole();
```

## Advanced features

Roles allows you to define actions and have differente responses for each role on that action.

### Register a action

```js
Roles.registerAction(name, adminAllow, adminDeny)
```

- ```name``` String. The name of the action.
- ```adminAllow```, ```adminDeny``` Any. Optional. The response for the admin role on this action.

If the value you pass to ```adminAllow``` and/or ```adminDeny``` is not a function **Roles** will convert it to a Function that returns that value.

### Creating a role

If you use Roles as the basic way this is not necesary, but if you wan't to use actions, this is needed.

```js
myRole = new Roles.Role(name)
```
- ```name``` String. The name of the new role.

### Adding rules

Now, to set responses of a role on a action

#### Allow

```js
myRole.allow(action, func)
```

- ```action``` String. The name of the action.
- ```func``` Function. Return true to allow the role to perform this action. You can get the user id using ```this.userId```. To pass arguments to this function pass extra arguments when checking, example: Roles.allow(userId, action, arg1, arg2)

#### Deny

```js
myRole.deny(action, func)
```

- ```action``` String. The name of the action.
- ```func``` Function. Return true to deny the role to perform this action. You can get the user id using ```this.userId```. To pass arguments to this function pass extra arguments when checking, example: Roles.deny(userId, action, arg1, arg2)

### Check permissions

Now that we have our allow/deny rules we want to check if the user has permissions. Note that a user can have more than one role, so **Roles** will check every action. If a role doesn't have allow/deny rules for a action they won't be considered.

#### Check allow

To check if a user is **allowed** to perform an action. **Roles** will check all the roles the user has and if at least one role return ```true``` on a action, this function will return ```true```.

```js
Roles.allow(userId, action, [extra])
```

- ```userId``` String. The id of the user.
- ```action``` String. The name of the action.
- ```[extra]``` Each argument that you add to this function will be passed to the allow/deny functions you defined.

#### Check deny

To check if a user is **denied** to perform an action. **Roles** will check all the roles the user has and if at least one role return ```true``` on a action, this function will return ```true```.

```js
Roles.deny(userId, action, [extra])
```

- ```userId``` String. The id of the user.
- ```action``` String. The name of the action.
- ```[extra]``` Each argument that you add to this function will be passed to the allow/deny functions you defined.

#### Check combined

This function will return ```true``` if the user **is allowed** and **not denied** to perform an action.

```js
Roles.userHasPermission(userId, action, [extra])
```

- ```userId``` String. The id of the user.
- ```action``` String. The name of the action.
- ```[extra]``` Each argument that you add to this function will be passed to the allow/deny functions you defined.

### Example

We will create a collection and create a action to update it.

```js
// We create the collection
Posts = new Mongo.Collection('posts');

// Create the action
Roles.registerAction('posts.update', true); // The admin (which is automatically created) role can update posts always

// Use the action
Posts.allow({
  update: function (userId, doc, fields, modifier) {
    return Roles.allow(userId, 'posts.update', userId, doc, fields, modifier);
  },
});
Posts.deny({
  update: function (userId, doc, fields, modifier) {
    return Roles.deny(userId, 'posts.update', userId, doc, fields, modifier);
  },
});

// Create a new role
EditorRole = new Roles.Role('editor');

// Set the allow/deny rules
EditorRole.allow('posts.update', function(userId, doc, fields, modifier) {
  return doc.userId === userId; // Will be allowed to edit his own posts
})
EditorRole.deny('posts.update', function(userId, doc, fields, modifier) {
  return !_.contains(fields, 'userId') // Can't update userId field.
})
```

Now, we will create a publication only for editors.

```js

// Register the action
Roles.registerAction('posts.subscribeToMyPosts');

// Create the publication
if (Meteor.isServer) {
  Meteor.publish('myPosts', function () {
    // Roles.userHasPermission checks allow and deny rules
    if (!Roles.userHasPermission(this.userId, 'posts.subscribeToMyPosts')) {
      return [];
    } else {
      return Posts.find({ userId: this.userId })
    }
  });
}

// Now we will allow editor to subscribe to their posts
EditorRole.allow('posts.subscribeToMyPosts', true)
```

### Helper for collections

Instead of registering and implementing the actions for a collection, there is a helper that do
that for you.

```js
myCollection.attachRoles('myCollectionRolesPrefix')
```

That code will register the following actions:

```
myCollectionRolesPrefix.insert
myCollectionRolesPrefix.update
myCollectionRolesPrefix.remove
```

And automatically attach the allow/deny rules to the collection.