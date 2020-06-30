'use strict'
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const {checkSettingsParser} = require('./parser')

function initialize(options) {
  const tracker = makeEmitTracker()
  function ruby(chunks, ...values) {
    let code = ''
    values.forEach((value, index) => {
      let stringified = ''
      if (value && value.isRef) {
        stringified = value.resolve()
      } else if (typeof value === 'function') {
        stringified = value.toString()
      } else if (typeof value === 'undefined'){
        stringified = 'nil'
      } else {
        stringified = JSON.stringify(value)
      }
      code += chunks[index] + stringified
    })
    return code + chunks[chunks.length - 1]
  }

  // tracker.storeHook('deps', `require 'eyes_selenium'`)
  tracker.addSyntax('var', ({name, value}) => `${name} = ${value}`)

  tracker.storeHook(
      'beforeEach',
      ruby`@driver = Selenium::WebDriver.for :remote, desired_capabilities: :chrome`,
  )

  tracker.storeHook(
      'beforeEach',
      ruby`@eyes = eyes(is_visual_grid: ${options.executionMode.isVisualGrid}, is_css_stitching: ${options.executionMode.isCssStitching}, branch_name: ${options.branchName})`,
  )

  tracker.storeHook('afterEach', ruby`@driver.quit`)
  tracker.storeHook('afterEach', ruby`@eyes.abort`)

  const driver = {
    build(options) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    cleanup() {
      tracker.storeCommand(ruby`@driver.quit`)
    },
    visit(url) {
      tracker.storeCommand(ruby`@driver.get(${url})`)
    },
    executeScript(script, ...args) {
      return tracker.storeCommand(ruby`@driver.execute_script(${script})`)
    },
    sleep(ms) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    switchToFrame(selector) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    switchToParentFrame() {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    findElement(selector) {
      return tracker.storeCommand(
          ruby`@driver.find_element(css: ${selector})`,
      )
    },
    findElements(selector) {
      return tracker.storeCommand(
          ruby`@driver.find_elements(css: ${selector})`,
      )
    },
    getWindowLocation() {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    setWindowLocation(location) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    getWindowSize() {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    setWindowSize(size) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    click(element) {
      if(typeof element === 'object') tracker.storeCommand(ruby`${element}.click`)
      else tracker.storeCommand(ruby`@driver.find_element(css: ${element}).click`)
    },
    type(element, keys) {
      tracker.storeCommand(ruby`${element}.send_keys(${keys})`)
    },
    waitUntilDisplayed() {
      // TODO: implement if needed
    },
    getElementRect() {
      // TODO: implement if needed
    },
    getOrientation() {
      // TODO: implement if needed
    },
    isMobile() {
      // TODO: implement if needed
    },
    isAndroid() {
      // TODO: implement if needed
    },
    isIOS() {
      // TODO: implement if needed
    },
    isNative() {
      // TODO: implement if needed
    },
    getPlatformVersion() {
      // TODO: implement if needed
    },
    getBrowserName() {
      // TODO: implement if needed
    },
    getBrowserVersion() {
      // TODO: implement if needed
    },
    getSessionId() {
      // TODO: implement if needed
    },
    takeScreenshot() {
      // TODO: implement if needed
    },
    getTitle() {
      // TODO: implement if needed
    },
    getUrl() {
      // TODO: implement if needed
    },
  }

  const eyes = {
    open({appName, viewportSize}) {
      tracker.storeCommand(ruby`@eyes.configure do |conf|
      conf.app_name = ${appName}
      conf.test_name =  ${options.baselineTestName}
      conf.viewport_size = Applitools::RectangleSize.new(${viewportSize.width}, ${viewportSize.height})
    end
    @eyes.open(driver: @driver)`)
    },
    check(checkSettings) {
      tracker.storeCommand(`@eyes.check(${checkSettingsParser(checkSettings)})`)
    },
    checkWindow(tag, matchTimeout, stitchContent) {
      tracker.storeCommand(ruby`@eyes.check_window(tag: ${tag}, timeout: ${matchTimeout})`)
    },
    checkFrame(element, matchTimeout, tag) {
      tracker.storeCommand(ruby`@eyes.check_frame(frame: ${element}, timeout: ${matchTimeout}, tag: ${tag})`)
    },
    checkElement(element, matchTimeout, tag) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    checkElementBy(selector, matchTimeout, tag) {
      tracker.storeCommand(ruby`@eyes.check_region(:css, ${selector},
                       tag: ${tag},
                       match_timeout: ${matchTimeout},
                       stitch_content: true)`)
    },
    checkRegion(region, matchTimeout, tag) {
      tracker.storeCommand(ruby`@eyes.check_region(:css, ${selector},
                       tag: ${tag},
                       match_timeout: ${matchTimeout},
                       stitch_content: true)`)
    },
    checkRegionByElement(element, matchTimeout, tag) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    checkRegionBy(selector, tag, matchTimeout, stitchContent) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    close(throwEx) {
      tracker.storeCommand(ruby`@eyes.close(throw_exception: ${throwEx})`)
    },
    abort() {
      tracker.storeCommand(ruby`@eyes.abort`)
    },
  }

  return {tracker, driver, eyes}
}

module.exports = {initialize}