'use strict'
const {capitalizeFirstLetter} = require('./util')
const types = require('./mapping/types')
const selectors = require('./mapping/selectors')

function checkSettings(cs) {
    let name = `'', `
    let target = `Target`
    if(cs === undefined){
        return name + target + '.window()'
    }
    let element = ''
    let options = ''
    element = '.window()'
    if (cs.scrollRootElement) element += `.scroll_root_element(${printSelector(cs.scrollRootElement)})`
    //if (cs.frames === undefined && cs.region === undefined) element = '.window()'
    if (cs.frames !== undefined || cs.region !== undefined) {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) element += region(cs.region, true)
    }
    if (cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions)
    if (cs.floatingRegions) options += floatingRegions(cs.floatingRegions)
    if (cs.accessibilityRegions) options += accessibilityRegions(cs.accessibilityRegions)
    if (cs.layoutRegions) options += layoutRegions(cs.layoutRegions)
    if (cs.layoutBreakpoints) options += layoutBreakpoints(cs.layoutBreakpoints)
    if (cs.scrollRootElement) options += `.scroll_root_element(${printSelector(cs.scrollRootElement)})`
    if (cs.ignoreDisplacements) options += `.ignore_displacements(${capitalizeFirstLetter(cs.ignoreDisplacements)})`
    if (cs.sendDom !== undefined) options += `.send_dom(${serialize(cs.sendDom)})`
    if (cs.variationGroupId) options += `.variation_group_id(${serialize(cs.variationGroupId)})`
    if (cs.matchLevel) options += `.match_level(MatchLevel.${cs.matchLevel.toUpperCase()})`
    if (cs.hooks) options += handleHooks(cs.hooks)
    if (cs.isFully !== undefined) options += `.fully(${capitalizeFirstLetter(cs.isFully)})`
    if (cs.name) options += `.with_name(${cs.name})`
    if (cs.waitBeforeCapture) options += `.wait_before_capture(${cs.waitBeforeCapture})`
    return name + target + element + options
}

function frames(arr) {
    return arr.reduce((acc, val) => acc + `${frame(val)}`, '')
}
function framesClassic(arr) {
    if (arr === null) return ""
    if (arr.isRef) return arr.ref()
    return arr.reduce((acc, val) => acc + `${parseSelector(val)}`, '')
}
function frame(frame) {
    return  ( !frame.isRef && frame.frame) ? `.frame(${parseSelector(frame.frame)}).scroll_root_element(${printSelector(frame.scrollRootElement)})` : `.frame(${parseSelector(frame)})`
}
function parseSelectorByType(selector) {
     if ((typeof selector) === 'string') {
         if (selector.includes('name=')) {
             selector = selector.replace('name=', "")
             return `By.NAME, ${parseSelector(selector)}`
         }
         else if (selector.includes('#')) {
                  selector = selector.replace('#', "")
                  return `By.ID, ${parseSelector(selector)}`
              }
              else if (selector.includes('.')) {
                       selector = selector.replace('.', "")
                       return `By.CLASS_NAME, ${parseSelector(selector)}`
                   }
                   else return `By.CSS_SELECTOR, ${parseSelector(selector)}`
     } else return parseSelector(selector)
}
function parseSelector(selector) {
    let string
    switch (typeof selector) {
        case 'string':          
	    string = wrapSelector(selector)
            break;
        case "object":
            string = parseObject(selector)
            break;
        case "undefined":
            string = 'None'
            break;
        case "function":
            string = selector.isRef ? selector.ref() : 'None'
            break;
    }
    return string
}

function region(region_param, first_call) {
    if ((typeof region_param === "object") && ("shadow" in region_param)) {
        let callChain = `.shadow(${regionParameter(region_param)})${region(region_param.shadow, false)}`
        return first_call ? `.region(TargetPath${callChain})` : callChain
    } else {
        return `.region(${regionParameter(region_param)})`
    }
}

function ignoreRegions(arr) {
    return arr.reduce((acc, val) => `${acc}.ignore(${regionParameter(val)})`, '')
}
function layoutRegions(arr){
    return arr.reduce((acc, val) => `${acc}.layout(${regionParameter(val)})`, '')
}
function layoutBreakpoints(arg){
    if (Array.isArray(arg)) {
        return python`.layout_breakpoints(*${arg})`
    } else {
        return python`.layout_breakpoints(${arg})`
    }
}
function floatingRegions(arr) {
    return arr.reduce((acc, val) => `${acc}.floating(${floating(val)})`, ``)
}

function floating(floating) {
    let string
    string = regionParameter(floating.region)
    string += `, ${floating.maxUpOffset}, ${floating.maxDownOffset}, ${floating.maxLeftOffset}, ${floating.maxRightOffset}`
    return string
}

function accessibilityRegions(arr) {
    return arr.reduce((acc, val) => `${acc}.accessibility(${accessibility(val)})`, ``)
}

function accessibility(val) {
    return `${regionParameter(val.region)}, AccessibilityRegionType.${capitalizeFirstLetter(val.type)}`
}

function regionParameter(region) {
    let string
    switch (typeof region) {
        case 'string':
            string = `${JSON.stringify(region)}`
            break;
        case "object":
            string = parseObject(region.type ? region : (region.shadow ? region : {value: region, type:'Region'}))
            break;
        case "undefined":
            string = 'None'
            break;
        case "function":
            string = region.isRef ? region.ref() : region()
            break;
    }
    return string
}

// General functions

function python(chunks, ...values) {
    const commands = []
    let code = ''
    values.forEach((value, index) => {
        if (typeof value === 'function' && !value.isRef) {
            code += chunks[index]
            commands.push(code, value)
            code = ''
        } else {
            code += chunks[index] + serialize(value)
        }
    })
    code += chunks[chunks.length - 1]
    commands.push(code)
    return commands
}

function serialize(value) {
    let stringified = ''
    if (value && value.isRef) {
        stringified = value.ref()
    } else if (value === null) {
        throw Error(`Null shouldn't be passed to the python code. \n ${value}`)
    } else if (typeof value === 'object') {
        stringified = parseObject(value)
    } else if (typeof value === 'function') {
        stringified = value.toString()
    } else if (typeof value === 'undefined') {
        stringified = 'None'
    } else if (typeof value === 'boolean') {
        stringified = value ? 'True' : 'False'
    } else {
        stringified = JSON.stringify(value)
    }
    return stringified
}

function parseObject(object) {
    if (object.selector) {
        if (object.type !== undefined) return selectors[object.type](JSON.stringify(object.selector))
        else return '"' + object.selector + '"'
    } else if (object.type) {
        const typeBuilder = types[object.type]
        if (typeBuilder) {
            if(typeBuilder.isGeneric) {
                return typeBuilder.constructor(object.value, object.generic)
            } else {
                return typeBuilder.constructor(object.value)
            }
        } else throw new Error(`Constructor wasn't implemented for the type: ${object.type}`)
    } else return JSON.stringify(object)
}

function getter({target, key, type}) {
    if (typeof type === 'undefined') return `${target}.${key}`
    else if (types[type.name]) return types[type.name].get(target, key)
    else throw new Error(`Haven't implement type ${JSON.stringify(type)}`)
}

function mapTypes(type) {
    let mapped
    try {
        mapped = type ? types[type.name].name(type) : types.Element.name()
    } catch (e) {
        throw Error(`SDK haven't implemented support for the ${JSON.stringify(type)} \nWith error: ${e.message} \nStack:${e.stack}`)
    }
    return mapped
}
function wrapSelector(selector) {
    selector = selector.toString()
    selector = selector.replace(/"/g, "")
	selector = selector.replace(/'/g, "")
	selector = selector.replace(/\[/g, "")
	selector = selector.replace(/\]/g, "")
	selector = selector.replace('name=', "")
	selector = '"' + selector + '"'
	return selector   
    return val
}
function printSelector(val) {
    return serialize(val)
}
const variable = ({name, value, type}) => `${name} = ${value}`
const call = ({target, args}) => {
    return args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}()`
}
const returnSyntax = ({value}) => {
    return `return ${value};`
}
function handleHooks(hooks) {
    if ("beforeCaptureScreenshot" in hooks) return '.before_render_screenshot_hook(\"' + `${hooks.beforeCaptureScreenshot}` + '\")'
}

module.exports = {
    checkSettingsParser: checkSettings,
    python: python,
    getter: getter,
    variable: variable,
    call: call,
    returnSyntax: returnSyntax,
    wrapSelector: wrapSelector,
    framesClassic: framesClassic,
    parseSelector: parseSelector,
    parseSelectorByType: parseSelectorByType,
    regionParameter: regionParameter,
}
