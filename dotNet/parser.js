'use strict'

const types = require('./mapping/types')
const selectors = require('./mapping/selectors')

function checkSettings(cs, mobile=false) {
    let target = `Target`
    if(cs === undefined){
        return target + '.Window()'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.Window()'
    else {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) {
			if (cs.region.type) element += region(cs.region, cs.region.type, mobile)
			else element += region(cs.region, undefined, mobile)
		}
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions, mobile)
	if (cs.floatingRegions) options += floatingRegions(cs.floatingRegions)
    if(cs.scrollRootElement) options+=scrollRootElement(cs.scrollRootElement)
	if(cs.accessibilityRegions) options+=accessibilityRegions(cs.accessibilityRegions[0].region, cs.accessibilityRegions[0].type)
	if(cs.layoutRegions) options+=layoutRegions(cs.layoutRegions)
	if (cs.ignoreDisplacements !== undefined) options += `.IgnoreDisplacements(${cs.ignoreDisplacements})`
	if (cs.sendDom !== undefined) options += `.SendDom(${cs.sendDom})`
    if (cs.matchLevel) options += `.MatchLevel(MatchLevel.${cs.matchLevel})`
    if(cs.isFully) options += '.Fully()'
	if (cs.name) options += `.WithName(${cs.name})`
    return target + element + options
}

function frames(arr) {
	return arr.reduce((acc, val) => acc + `${frame(val)}`, '')
}

function frame(frames) {
	if (frames && frames.isRef) return `.Frame(` + frames.ref() + `)`
    switch (typeof frames){
	case 'object':
		let stringified = JSON.stringify(frames)
		if (frames.frame) return `.Frame(${takeSelector(frames.frame)}).ScrollRootElement(By.CssSelector(${takeSelector(frames.scrollRootElement)}))`
		if (frames.type) return `.Frame(${selectors[frames.type]}(${takeSelector(frames.selector)}))`
		throw Error(`Couldn't treat frame ${frames} for type 'object'`)
		break;
	case 'string':
		return `.Frame(${takeSelector(frames)})`
		break;
	default:
		throw Error(`Couldn't treat frame ${frames} - code for type ${(typeof frames)} is not ready yet`)
	}
}

function takeSelector(selector) {
	selector = selector.toString()
    selector = selector.replace(/"/g, "")
	selector = selector.replace(/'/g, "")
	selector = selector.replace(/\[/g, "")
	selector = selector.replace(/\]/g, "")
	selector = selector.replace('name=', "")
	selector = '"' + selector + '"'
	return selector
}

function region(region) {
    return `.Region(${regionParameter(region)})`
}

function ignoreRegions(arr, mobile=false) {
    return arr.reduce((acc, val) => acc + ignore(val, mobile), '')
}

function ignore(region, type=undefined, mobile=false){
    return `.Ignore(${regionParameter(region, type, mobile)})`
}

function floatingRegions(arr) {
	return `.Floating(${regionParameter(arr[0].region)}, ${arr[0].maxUpOffset}, ${arr[0].maxDownOffset}, ${arr[0].maxLeftOffset}, ${arr[0].maxRightOffset})`
}

function layoutRegions(arr) {
	return `.Layout(${regionParameter(arr[0])})`
}

function scrollRootElement(cssSelector) {	
    return `.ScrollRootElement(By.CssSelector(\"${cssSelector}\"))`	
}

function accessibilityRegions(region, type) {	
    return `.Accessibility(${regionParameter(region)}, AccessibilityRegionType.${type})`	
}

function regionParameter (region) {
    let string
    switch (typeof region) {
        case 'string':
            string = `By.CssSelector(\"${region}\")`
            break;
        case "object":
			if (region.type) string = findElementBySelectorType(region.selector, region.type)
			else string = `new System.Drawing.Rectangle(${region.left}, ${region.top}, ${region.width}, ${region.height})`
			break
		case 'function':
			string = serializeRegion(region)
			break
		default:
			throw new Error(`Region parameter of the unimplemented type was used`)
    }
    return string
}

function serializeRegion(data) {
  if (data && data.isRef) {
    return data.ref()
  } else if (Array.isArray(data)) {
    return `[${data.map(serializeRegion).join(', ')}]`
  } else if (typeof data === 'object' && data !== null) {
	return `new System.Drawing.Rectangle(${data.left}, ${data.top}, ${data.width}, ${data.height})`
  } else {
    return JSON.stringify(data)
  }
}

function findElementBySelectorType(selector, type){
	switch (type) {
		case 'css':
            return `By.CssSelector(\"${selector}\")`
			break;
		default:
			return `By.CssSelector(\"${selector}\")`
	}
}

function parseAssertActual(actual){
	let elements = actual.includes('[')? actual.split('[') : actual.split('.');
	let result = ""
	elements.forEach(element => {
		if (result === "") {result = result + element; return;}
		element = element.replace(/"/g, "")
		element = element.replace(/]/g, "")
		if (isNaN(Number(element))) element = "." + element.charAt(0).toUpperCase() + element.slice(1)
		else element = "[" + element + "]"
		if (element === ".Version") element = ".GuidelinesVersion"
		result = result + element
	})
	return result
}

function expectParser(expected){
	if (expected.hasOwnProperty('left')){
		if (expected.hasOwnProperty('maxUpOffset')) return `new FloatingMatchSettings(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, ${expected.maxUpOffset}, ${expected.maxDownOffset}, ${expected.maxLeftOffset}, ${expected.maxRightOffset})`
		else {
			if (expected.hasOwnProperty('isDisabled')) return `new AccessibilityRegionByRectangle(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, AccessibilityRegionType.${expected.type})`
			else return `new Region(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height})`//return `new Rectangle(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height})`
		}
	}
	else{ 
		switch (expected){
			case 'AA':
			case 'AAA':
				return `AccessibilityLevel.` + expected
			case 'WCAG_2_0':
			case 'WCAG_2_1':
				return `AccessibilityGuidelinesVersion.` + expected
		}
		if (expected.hasOwnProperty('width')) return `new RectangleSize(${expected.width}, ${expected.height})`
		if (expected.hasOwnProperty('applitools_title')) return `new Region(${expected.applitools_title[0].left}, ${expected.applitools_title[0].top}, ${expected.applitools_title[0].width}, ${expected.applitools_title[0].height})`
		return expected
	}
}

module.exports = {
    checkSettingsParser: checkSettings,
	regionParameterParser: regionParameter,
	parseAssertActual: parseAssertActual,
	expectParser: expectParser,
	takeSelector: takeSelector,
}