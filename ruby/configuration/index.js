const supportedTests = require('./supported-tests')
const {initialize} = require('./initialize')
const testFrameworkTemplate = require('./template')

module.exports = {
  name: 'ruby',
  initialize: initialize,
  supportedTests,
  testFrameworkTemplate: testFrameworkTemplate,
  extname: '_spec.rb'
}
