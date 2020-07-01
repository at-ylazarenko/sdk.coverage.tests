'use strict'

function checkSettings(cs) {
    let ruby = `Applitools::Selenium::Target`
    if(cs === undefined){
        return ruby + '.window'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.window'
    else {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) element += region(cs.region)
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions)
    if(cs.isFully) options += '.fully'
    return ruby + element + options
}

function frames(arr) {
    return arr.reduce((acc, val) => acc + `.frame(css: \'${val}\')`, '')
}

function region(region) {
    return `.region(${regionParameter(region)})`
}

function ignoreRegions(arr) {
    return arr.reduce((acc, val) => acc + ignore(val), '')
}

function ignore(region){
    return `.ignore(${regionParameter(region)})`
}

function regionParameter (region) {
    let string
    switch (typeof region) {
        case 'string':
            string = `css: \'${region}\'`
            break;
        case "object":
            string = `Applitools::Region.new(${region.left}, ${region.top}, ${region.width}, ${region.height})`
    }
    return string
}

function ruby(chunks, ...values) {
    let code = ''
    values.forEach((value, index) => {
        let stringified = ''
        if (value && value.isRef) {
            stringified = value.resolve()
        } else if (typeof value === 'function') {
            stringified = value.toString()
        } else if (typeof value === 'undefined' || value === null){
            stringified = 'nil'
        } else {
            stringified = JSON.stringify(value)
        }
        code += chunks[index] + stringified
    })
    return code + chunks[chunks.length - 1]
}

module.exports = {
    checkSettingsParser: checkSettings,
    ruby: ruby
}