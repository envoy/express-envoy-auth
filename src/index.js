const createEnvoyAuth = require("./envoyAuth");

module.exports = function expressEnvoyAuth(app) {
  return createEnvoyAuth(app);
};
