const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'xg7544',
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  viewportWidth: 1600,
  viewportHeight: 760,
  video: true,
  videosFolder: "cypress/videos", // The folder where recorded videos will be stored
  chromeWebSecurity: false,
  experimentalSourceRewriting: true,
  defaultCommandTimeout:120000,
  setupNodeEvents: true,
  e2e: {
    supportFile:false,
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:4200/#/',
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/mochareports",
    overwrite: false,
    html: false,
    json: false
  }
})
