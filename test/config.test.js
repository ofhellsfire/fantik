'use strict'

const fs = require('fs')

const yaml = require('js-yaml')

const Config = require('../lib/config.js').Config

describe('Config Test Suite', () => {

  test('load default config', () => {
    const configLoader = new Config({})
    const config = configLoader.get()
    const expected = JSON.parse(
      fs.readFileSync(
        './test/assets/default-config.json',
        { encoding: 'utf8' }
      )
    )
    expect(config).toStrictEqual(expected)
  })

  test('load broken config', () => {
    expect(() => {
      console.log('before')
      new Config({ customConfigPath: './test/assets/broken-config.yaml' })
      console.log('after')
    }).toThrowError(yaml.YAMLException)
  })

  test('load not existing config', () => {
    expect(() => {
      new Config({ customConfigPath: './not-existing/path/config.yaml' })
    }).toThrowError(/ENOENT/)
  })

  test.each([
    [
      './test/assets/custom-config-override.yaml',
      './test/assets/custom-config-override.json'
    ],
    [
      './test/assets/custom-config-append.yaml',
      './test/assets/custom-config-append.json'
    ],
    [
      './test/assets/custom-config-simple.yaml',
      './test/assets/custom-config-simple.json'
    ],
  ])('load custom config with (%j, %j)',
      (customConfigPath, expectedConfigPath) => {
    const configLoader = new Config({ customConfigPath: customConfigPath })
    const config = configLoader.get()
    const expected = JSON.parse(
      fs.readFileSync(expectedConfigPath, { encoding: 'utf8' })
    )
    expect(config).toStrictEqual(expected)
  })

  test('load empty custom config', () => {
    const configLoader = new Config(
      { customConfigPath: './test/assets/custom-config-empty.yaml' }
    )
    const config = configLoader.get()
    const expected = JSON.parse(
      fs.readFileSync(
        './test/assets/default-config.json',
        { encoding: 'utf8' }
      )
    )
    expect(config).toStrictEqual(expected)
  })

})
