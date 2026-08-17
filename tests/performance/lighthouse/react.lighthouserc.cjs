"use strict";
const { createLighthouseConfig } = require("./shared.cjs");

module.exports = createLighthouseConfig({
  artifactName: "react",
  frontendPackage: "@airbnb-skripsi/react-app",
  url: "http://localhost:3002/",
});
