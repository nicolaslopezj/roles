Roles
=====

Roles is like a common roles package with more features.

```
meteor add nicolaslopezj:roles
```

The main features of Roles is that allows you to create **actions** and add allow/deny rules to that action for a specific role


### Basic use

You can use roles as a normal roles package

#### Attach roles to users ```server```

To add roles to a user.

```js
Roles.addUsersToRoles(userId, roles)
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
Roles.removeUsersFromRoles(userId, roles)
```

- ```userId``` String. The id of the user.
- ```roles``` Array or String. The name of the roles you want to **remove** from the user.












