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

  tracker.storeHook('deps', `require 'eyes_selenium'`)


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
      return tracker.storeCommand(ruby`await specs.build(${options})`)
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
      tracker.storeCommand(ruby`await specs.sleep(driver, ${ms})`)
    },
    switchToFrame(selector) {
      tracker.storeCommand(ruby`await specs.switchToFrame(driver, ${selector})`)
    },
    switchToParentFrame() {
      tracker.storeCommand(ruby`await specs.switchToParentFrame(driver)`)
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
      return tracker.storeCommand(ruby`await specs.getWindowLocation(driver)`)
    },
    setWindowLocation(location) {
      tracker.storeCommand(ruby`await specs.setWindowLocation(driver, ${location})`)
    },
    getWindowSize() {
      return tracker.storeCommand(ruby`await specs.getWindowSize(driver)`)
    },
    setWindowSize(size) {
      tracker.storeCommand(ruby`await specs.setWindowSize(driver, ${size})`)
    },
    click(element) {
      tracker.storeCommand(ruby`@driver.find_element(css: ${element}).click`)
    },
    type(element, keys) {
      tracker.storeCommand(ruby`@driver(${element}, ${keys})`)
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
      let args = `name_or_id: '${element}'` +
          `${matchTimeout? `, timeout: ${matchTimeout}`: ''}` +
          `${tag? `, tag: ${tag}`: ''}`
      tracker.storeCommand(ruby`@eyes.check_frame(frame: ${element}, timeout: ${matchTimeout}, tag: ${tag})`)
    },
    checkElement(element, matchTimeout, tag) {
      tracker.storeCommand(ruby`await eyes.checkElement(
        ${element},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkElementBy(selector, matchTimeout, tag) {
      tracker.storeCommand(ruby`@eyes.check_region(:css, ${selector},
                       tag: ${tag},
                       match_timeout: ${matchTimeout},
                       stitch_content: true)`)
    },
    checkRegion(region, matchTimeout, tag) {
      tracker.storeCommand(rruby`@eyes.check_region(:css, ${selector},
                       tag: ${tag},
                       match_timeout: ${matchTimeout},
                       stitch_content: true)`)
    },
    checkRegionByElement(element, matchTimeout, tag) {
      tracker.storeCommand(ruby`await eyes.checkRegionByElement(
        ${element},
        ${tag},
        ${matchTimeout},
      )`)
    },
    checkRegionBy(selector, tag, matchTimeout, stitchContent) {
      tracker.storeCommand(ruby`await eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
    },
    checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
      tracker.storeCommand(ruby`await eyes.checkRegionInFrame(
        ${frameReference},
        ${selector},
        ${matchTimeout},
        ${tag},
        ${stitchContent},
      )`)
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