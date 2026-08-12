"use strict";
const { createLighthouseConfig } = require("./shared.cjs");

module.exports = createLighthouseConfig({
  artifactName: "vue",
  frontendPackage: "@airbnb-skripsi/vue-app",
  url: "http://localhost:3000/",
});
