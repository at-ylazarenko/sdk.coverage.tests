'use strict'

function checkSettings(cs) {
    let java = `Target`
    if(cs === undefined){
        return java + '.window()'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.window()'
    else {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) element += region(cs.region)
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions)
    if(cs.scrollRootElement) options += `.scrollRootElement(By.cssSelector(${JSON.stringify(cs.scrollRootElement)}))`
    if(cs.isFully) options += '.fully()'
    return java + element + options
}

function frames(arr) {
    return arr.reduce((acc, val) => acc + `.frame(By.cssSelector(${JSON.stringify(val)}))`, '')
}

function region(region) {
    return `.region(${regionParameter(region)})`
}

function ignoreRegions(arr) {
    let params = arr.reduce((acc, val, index) => acc + regionParameter(val, index), '')
    return `.ignore(${params})`
}

function regionParameter (region, index = 0) {
    let string
    switch (typeof region) {
        case 'string':
            string = `By.cssSelector(${JSON.stringify(region)})`
            break;
        case "object":
            string = `new Region(${region.left}, ${region.top}, ${region.width}, ${region.height})`
    }
    if(index > 0) string = ', ' + string
    return string
}

module.exports = {
    checkSettingsParser: checkSettings
}