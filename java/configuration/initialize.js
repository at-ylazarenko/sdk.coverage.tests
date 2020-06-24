'use strict'
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const {checkSettingsParser} = require('./parser')

function initialize(options) {
  const tracker = makeEmitTracker()
  function java(chunks, ...values) {
    let code = ''
    values.forEach((value, index) => {
      let stringified = ''
      if (value && value.isRef) {
        stringified = value.resolve()
      } else if (typeof value === 'function') {
        stringified = value.toString()
      } else if (typeof value === 'undefined'){
        throw Error(`Undefined shouldn't be passed to the java code`)
      } else {
        stringified = JSON.stringify(value)
      }
      code += chunks[index] + stringified
    })
    return code + chunks[chunks.length - 1]
  }

  function argumentCheck(actual, ifUndefined){
     return (typeof actual === 'undefined') ? ifUndefined : actual
  }

  tracker.storeHook('deps', `package test.coverage.generic;`)
  tracker.storeHook('deps', ``)
  tracker.storeHook('deps', `import test.coverage.TestSetup;`)
  tracker.storeHook('deps', `import com.applitools.eyes.*;`)
  tracker.storeHook('deps', `import org.openqa.selenium.By;`)
  tracker.storeHook('deps', `import org.testng.annotations.*;`)

  tracker.addSyntax('var', ({name, value}) => `WebElement ${name} = ${value}`)

  tracker.storeHook(
      'beforeEach',
      java`initEyes(${argumentCheck(options.executionMode.isVisualGrid, false)}, ${argumentCheck(options.executionMode.isCssStitching, false)}, ${argumentCheck(options.branchName, "master")});`,
  )

  tracker.storeHook(
      'beforeEach',
      java`buildDriver();`,
  )

  tracker.storeHook('afterEach', java`driver.quit();`)
  tracker.storeHook('afterEach', java`eyes.abort();`)

  const driver = {
    build(options) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    cleanup() {
      tracker.storeCommand(java`driver.quit();`)
    },
    visit(url) {
      tracker.storeCommand(java`driver.get(${url});`)
    },
    executeScript(script, ...args) {
      return tracker.storeCommand(java`driver.execute_script(${script});`)
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
          java`driver.findElement(css: ${selector});`,
      )
    },
    findElements(selector) {
      return tracker.storeCommand(
          java`driver.findElements(css: ${selector})`,
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
      if(typeof element === 'object') tracker.storeCommand(java`${element}.click`)
      else tracker.storeCommand(java`driver.findElement(By.cssSelector(${element})).click`)
    },
    type(element, keys) {
      tracker.storeCommand(java`${element}.sendKeys(${keys})`)
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
      tracker.storeCommand(java`eyes.open(driver, ${appName}, ${options.baselineTestName}, new RectangleSize(${viewportSize.width}, ${viewportSize.height}));`)
    },
    check(checkSettings) {
      tracker.storeCommand(`@eyes.check(${checkSettingsParser(checkSettings)});`)
    },
    checkWindow(tag, matchTimeout, stitchContent) {
      if(matchTimeout || stitchContent) throw new Error(`There is no signature in java SDK for usage both matchTimeout and stitchContent`)
      tracker.storeCommand(java`eyes.checkWindow(${argumentCheck(tag, '')});`)
    },
    checkFrame(element, matchTimeout, tag) {
      tracker.storeCommand(java`@eyes.check_frame(frame: ${element}, timeout: ${matchTimeout}, tag: ${tag});`)
    },
    checkElement(element, matchTimeout, tag) {
      // TODO need implementation
      console.log('Need to be implemented')
    },
    checkElementBy(selector, matchTimeout, tag) {
      tracker.storeCommand(java`@eyes.check_region(:css, ${selector},
                       tag: ${tag},
                       match_timeout: ${matchTimeout},
                       stitch_content: true)`)
    },
    checkRegion(region, matchTimeout, tag) {
      tracker.storeCommand(rjava`@eyes.check_region(:css, ${selector},
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
      tracker.storeCommand(java`eyes.close(${argumentCheck(throwEx, true)});`)
    },
    abort() {
      tracker.storeCommand(java`eyes.abort();`)
    },
  }

  return {tracker, driver, eyes}
}

module.exports = {initialize}