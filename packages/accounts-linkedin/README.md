This package is based on the work of https://github.com/codifytools/meteor-accounts-linkedin. Since the `codifytools:accounts-linkedin` package has not been updated for a couple of years, I decided to start maintaining it.

## Installation
```
meteor add codifytools:accounts-linkedin
```

## Setup
On the server-side you must setup the clientId and secret of your Linkedin Application by using the following code:

```js
import { ServiceConfiguration } from "meteor/service-configuration";

ServiceConfiguration.configurations.upsert({ service: 'linkedin' }, { $set: {
  clientId: 'client_id_here',
  secret: 'secret_here',
  loginStyle: 'popup'
} });
```

On the client-side, you should use the following structure in order to execute the new Linkedin authentication (example with React):
```js
import React from 'react';

export function Authentication() {
  const handleAuthenticate = () => {
    Meteor.loginWithLinkedin({ requestPermissions: ["r_liteprofile","r_emailaddress"] }, (error) => {
      if (error) { console.log(error); }
    });
  };

  return <button type="button" onClick={handleAuthenticate}>Sign in With Linkedin</button>;
};
```

To configure the user's collection, you should use the following code on the server-side:

```js
import { Accounts } from "meteor/accounts-base";

Accounts.onCreateUser((options, user) => {
  if (!user.services.linkedin) return user;
  user.emails = [{ address: user.services.linkedin.email, verified: true }]
  return user;
});

```



