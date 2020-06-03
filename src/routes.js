const express = require("express");
const passport = require("passport");

module.exports = function createRouter({ afterAuth }) {
  const router = express.Router();

  router.get("/auth", passport.authenticate("envoy"));
  if (afterAuth) {
    router.get(
      "/auth/callback",
      passport.authenticate("envoy"),
      async function (req, res, next) {
        await afterAuth(req, res);
        next();
      }
    );
  } else {
    router.get(
      "/auth/callback",
      passport.authenticate("envoy", { successRedirect: "/" })
    );
  }

  return router;
};
