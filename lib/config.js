'use strict'

const fs = require('fs')
const joinPath = require('path').join
const yaml = require('js-yaml')

const CORE_PATH = joinPath('.', 'core', 'default.config.yaml')
const PLUGINS_PATH = joinPath('.', 'plugins')
const DEFAULT_PLUGIN_NAME = 'reveal.js'
const LAYOUT_FILENAME = 'layout.config.yaml'
const SCRIPT_FILENAME = 'script.config.yaml'
const STYLE_FILENAME = 'style.config.yaml'

/**
 * Represents a SettingsSection.
 * @constructor
 * @param {string} path - Path to section configuration.
 */
function SettingsSection (path) {
  this._path = path
  this._config = (path !== null) ? _loadConfig(path) : {}
}

SettingsSection.prototype = {

  /**
  * Get SettingSection configuration
  * @memberof SettingsSection
  * @type {Object}
  */
  get config () {
    return this._config
  }

}

/**
 * Appends data to sub-section.
 * @memberof SettingsSection
 * @param {string[]} data - Array of tag data to be appended.
 * @param {string} subSection - Sub-section name to append the data.
 */
SettingsSection.prototype.append = function (data, subSection) {
  this._config[subSection] = this._config[subSection].concat(data)
}

/**
 * Overwrites sub-section data.
 * @memberof SettingsSection
 * @param {string[]} data - Array of tag data to overwrite.
 * @param {string} subSection - Sub-section name to append the data.
 */
SettingsSection.prototype.override = function (data, subSection) {
  this._config[subSection] = data
}

/**
 * Represents a Fantik configuration.
 * @constructor
 * @param {Object} settings - Configuration settings.
 */
function Config (settings) {
  this._pluginsPath = PLUGINS_PATH
  this._pluginName = settings.plugin || DEFAULT_PLUGIN_NAME
  this._customConfigPath = settings.customConfigPath || null
  this._pluginDir = joinPath(this._pluginsPath, this._pluginName)

  this.core = {}
  this.plugin = { layout: {}, scripts: {}, styles: {} }
  this.custom = {}

  this._load()
}

/**
 * Returns processed configuration.
 * @memberof Config
 * @returns {Object} Processed configuration.
 */
Config.prototype.get = function () {
  return Object.assign(
    {},
    this.core.config,
    this.plugin.layout.config,
    this.plugin.scripts.config,
    this.plugin.styles.config,
    this.custom.config
  )
}

Config.prototype._load = function () {
  this.core = new SettingsSection(CORE_PATH)
  this.plugin = {
    layout: new SettingsSection(joinPath(this._pluginDir, LAYOUT_FILENAME)),
    scripts: new SettingsSection(joinPath(this._pluginDir, SCRIPT_FILENAME)),
    styles: new SettingsSection(joinPath(this._pluginDir, STYLE_FILENAME))
  }
  this.custom = new SettingsSection(this._customConfigPath)
  this._processCustomConfig()
}

Config.prototype._processCustomConfig = function () {
  if (JSON.stringify(this.custom.config) === '{}') {
    return
  }
  ['styles', 'scripts'].forEach(item => {
    this._processCustomConfigSection(item)
  })
}

Config.prototype._processCustomConfigSection = function (target) {
  if (this.custom.config[`${target}Append`] !== undefined) {
    this.plugin[target].append(this.custom.config[`${target}Append`], target)
    delete this.custom.config[`${target}Append`]
  } else if (this.custom.config[`${target}Override`] !== undefined) {
    this.plugin[target].override(
      this.custom.config[`${target}Override`], target
    )
    delete this.custom.config[`${target}Override`]
  }
}

function _loadConfig (path) {
  try {
    return yaml.safeLoad(fs.readFileSync(path, { encoding: 'utf8' }))
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EACCES') {
      console.error(`Unable to read config file: ${err.message}`)
    } else if (err.name === 'YAMLException') {
      console.error(`Unable to parse config file '${path}': ${err.message}`)
    }
    throw (err)
  }
}

module.exports = {
  Config: Config
}
