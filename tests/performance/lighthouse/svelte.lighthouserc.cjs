"use strict";
const { createLighthouseConfig } = require("./shared.cjs");

module.exports = createLighthouseConfig({
  artifactName: "svelte",
  frontendPackage: "@airbnb-skripsi/svelte-app",
  url: "http://localhost:5173/",
});
