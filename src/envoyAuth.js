const passport = require("passport");
const { Strategy } = require("@envoy/passport-envoy");
const createRouter = require("./routes");
const verifyRequest = require("./verifyRequest");

module.exports = function createEnvoyAuth(app) {
  return function envoyAuth({
    afterAuth,
    callback,
    clientID,
    host,
    prefix = "",
    profileQuery,
    scopes,
    secret,
  }) {
    app.use(passport.initialize());
    app.use(passport.session());

    if (host) {
      Strategy.host = host;
    }

    passport.use(
      new Strategy({
        callbackURL: callback,
        clientID,
        clientSecret: secret,
        profileQuery,
        scope: scopes,
      })
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    app.use(prefix, createRouter({ afterAuth }));

    return verifyRequest({ authRoute: `${prefix}/auth` });
  };
};
