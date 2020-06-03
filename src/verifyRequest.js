module.exports = function createVerifyRequest({ authRoute = "/auth" }) {
  return function verifyRequest(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect(authRoute);
    }
  };
};
