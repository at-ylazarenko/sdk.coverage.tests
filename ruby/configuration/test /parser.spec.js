'use strict'
const assert = require('assert')
const {checkSettings} = require('../parser')

describe('Check settings parser tests', () => {

    it('Window', () => {
        assert.deepStrictEqual(checkSettings(undefined), `Applitools::Selenium::Target.window`)
    })

    it('Window fully', () => {
        assert.deepStrictEqual(checkSettings({isFully:true}), `Applitools::Selenium::Target.window.fully`)
    })

    it('Region element', () => {
        assert.deepStrictEqual(checkSettings({region:'#name'}), `Applitools::Selenium::Target.region(css: '#name')`)
    })

    it('Region rectangle', () => {
        assert.deepStrictEqual(checkSettings({region: {left: 10, top: 20, width: 30, height: 40}}), `Applitools::Selenium::Target.region(Applitools::Region.new(10, 20, 30, 40)`)
    })

    it('Frames 1', () => {
        assert.deepStrictEqual(checkSettings({frames: ['[name="frame1"]']}), `Applitools::Selenium::Target.frame(css: '[name="frame1"]')`)
    })

    it('Frames 2', () => {
        assert.deepStrictEqual(checkSettings({frames: ['[name="frame1"]', '[name="frame2"]']}), `Applitools::Selenium::Target.frame(css: '[name="frame1"]').frame(css: '[name="frame2"]')`)
    })

})