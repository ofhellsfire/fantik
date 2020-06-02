'use strict'

const fs = require('fs')
const path = require('path')

const { Builder } = require('./builder')
const { Config } = require('./config')
const { TreeRenderer } = require('./renderers')

/**
 * Represents a Fantik.
 * @constructor
 * @param {string} input - Input file path to covert slides from.
 * @param {Object} options - Options
 * Valid options:
 * - config - ???
 * - plugin - ???
 * - out - ???
 */
function Fantik (input, options) {
  // ...
  this.input = input
  this.config = new Config({
    customConfigPath: options.config,
    plugin: options.plugin
  }).get()
  this.options = options // TODO: move it to config
  this.renderer = new TreeRenderer({ pretty: true })
  this.builder = new Builder(this.config)
  this.outputPath = this.options.out
  if (this.outputPath === undefined) {
    this.outputPath = path.join(
      path.dirname(this.input),
      path.basename(this.input, path.extname(this.input)) + '.html'
    )
  }
}

/**
* Builds slides and renders slides to the file.
* @memberof Fantik
* @method
*/
Fantik.prototype.build = function () {
  const sections = read(this.input, this.config)
  this.builder.buildTree(sections)
  const tree = this.renderer.renderTree(this.builder.html)
  try {
    fs.writeFileSync(this.outputPath, `${this.config.top}\n${tree}`)
  } catch (err) {
    console.error(`Unable to write rendered data to file ` +
                  `'${this.outputPath}' due to: ${err.message}`)
    throw (err)
  }
  // console.log(`${this.config.top}\n${tree}`)  // TODO: remove it when done
}

/**
 * Builds and renders slides from given agruments.
 * @memberof Fantik
 * @static
 * @method
 * @param {string} input - Input file path to covert slides from.
 * @param {Object} options - Options. Known options are:
 *   plugin - plugin name to be used
 *   config - custom configuration filepath
 *   out - output file path
 *   watch - keep watching for input file changes
 */
Fantik.buildWithArgs = function (input, options) {
  try {
    Fantik._buildWithArgs(input, options)
  } catch (err) {
    process.exit(1)
  }
}

Fantik._buildWithArgs = function (input, options) {
  if (options.watch) { // TODO: clean here
    console.log(`Listen to changes for file: ${input}`)
    console.log('')
    console.log('Press Ctrl+C to exit from --watch mode.')
    console.log('')
    // TODO: change watchFile to alternative - too slow
    fs.watchFile(input, (curr, prev) => {
      let fantik = null
      fantik = new Fantik(input, options)
      fantik.build()
      const bytesDiff = curr.size - prev.size
      console.log(`${bytesDiff} bytes have been added`)
      process.on('SIGINT', () => {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        console.log(`All changes have been saved to HTML file: ` +
                    `'${fantik.outputPath}'`)
        process.exit(0)
      })
    })
  } else {
    const fantik = new Fantik(input, options)
    fantik.build()
    console.log(`HTML file '${fantik.outputPath}' ` +
                `has been successfully created`)
  }
}

/**
 * Reads and parses markdown slides.
 * @param {string} input - Input file path with markdown slides.
 * @param {Object} config - Slides configuration.
 * @returns {Array.<{tag: string, text: string}>} Parsed slides.
 */
function read (input, config) { // TODO: try to rework
  let lines
  try {
    lines = fs.readFileSync(input, { encoding: 'utf8' }).split('\n')
  } catch (err) {
    console.error(`Unable to read input file ` +
                  `'${input}' due to: ${err.message}`)
    throw (err)
  }
  let slideBuffer = []
  let isCurrentSlideSet = false
  const sections = []

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(config.markers.slidegroup)) {
      if (slideBuffer.length !== 0 && isCurrentSlideSet) {
        sections.push({ tag: 'slide', text: slideBuffer.join('\n').trim() })
        isCurrentSlideSet = false
      }
      slideBuffer = []
      sections.push({ tag: 'slidegroup' })
    } else if (lines[i].startsWith(config.markers.slide)) {
      if (slideBuffer.length !== 0 && isCurrentSlideSet) {
        sections.push({ tag: 'slide', text: slideBuffer.join('\n').trim() })
        isCurrentSlideSet = false
      }
      slideBuffer = []
      isCurrentSlideSet = true
      // flush current slide buffer
      // create a new slidegroup tag
    } else if (lines.length - 1 === i) {
      sections.push({ tag: 'slide', text: slideBuffer.join('\n').trim() })
      slideBuffer = []
    } else {
      // append to buffer
      slideBuffer.push(lines[i])
    }
  }

  return sections
}

module.exports = {
  Fantik: Fantik
}
