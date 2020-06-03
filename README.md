# @envoy/express-envoy-auth

Middleware to authenticate a [Express](http://expressjs.com) application with [Envoy](https://envoy.com).

## Installation

```bash
$ npm install @envoy/express-envoy-auth
```

## Usage

```js
import envoyAuth from "@envoy/express-envoy-auth";
```

### envoyAuth

Returns an authentication middleware taking up (by default) the routes `/auth` and `/auth/callback`.

```js
app.use(
  envoyAuth({
    // if specified, constructs OAuth and GraphQL URLs
    // against this base host. Defaults to envoy.com
    host: "envoy.dev",
    // if specified, mounts the routes off of the given path
    // eg. /envoy/auth, /envoy/auth/callback
    // defaults to ''
    prefix: "/envoy",
    // your envoy client ID
    clientID: ENVOY_CLIENT_ID,
    // your envoy client secret
    secret: ENVOY_SECRET,
    // scopes to request on the user
    scopes: ["public"],
    // redirect URL after OAuth 2.0 authorize
    callback: "https://www.example.com/envoy/auth/callback",
    // if specified, `afterAuth` is called when auth is
    // completed. middleware will redirect to "/" by
    // default
    afterAuth(req, res) {
      const { accessToken } = req.session;
      console.log("We did it!", accessToken);
      res.redirect("/");
    },
  })
);
```

#### `/auth`

This route starts the oauth process.

### `/auth/callback`

You should never have to manually go here. This route is purely for Envoy to send data
back during the oauth process.

### Example app

```javascript
import express from "express";
import session from "express-session";
import envoyAuth from "@envoy/express-envoy-auth";

const { ENVOY_CLIENT_ID, ENVOY_SECRET } = process.env;

const app = express();

app.use(
  session({
    secret: ENVOY_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

// everything after this point will require authentication
app.use(
  envoyAuth({
    clientID: ENVOY_CLIENT_ID,
    secret: ENVOY_SECRET,
    scopes: ["public"],
    callback: "https://plugin-home.ngrok.io/auth/callback",
    afterAuth(req, res) {
      const {
        session: { accessToken },
        user,
      } = req;
      console.log("Logged in", { accessToken, user });
      res.redirect("/");
    },
  })
);

// application code
app.use((req, res) => {
  res.send("🎉");
});
```
