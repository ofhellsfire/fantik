'use strict'

const { tagParserUtils } = require('./tag-parser-utils')

const DEFAULTOPTS = { attrs: null, text: null, needsClose: true }

/**
 * Represents a Tag.
 * @constructor
 * @param {string} name - The tag name.
 * @param {object} params - The tag parameters. Known parameters are:
 *   attrs - tag attributes,
 *   text - tag text,
 *   needsClose - defines if the tag has closing tag or not
 */
function Tag (name, params = {}) {
  this.name = name
  this.params = Object.assign({}, DEFAULTOPTS, params)
  if (this.params.needsClose === false && this.params.text !== null) {
    this.params.needsClose = true
  }
}

/**
 * Creates new tag from string.
 * @memberof Tag
 * @static
 * @function
 * @param {string} string - String to be parsed for tag creation.
 * @param {object} options - Options. Known options are:
 *   needsClose - defines if the tag should have closing tag or not
 * @returns {object<Tag>} New tag object.
 */
Tag.fromString = function (string, options = { needsClose: true }) {
  const opts = options

  const tagName = tagParserUtils.extractTagName(string)
  opts.attrs = tagParserUtils.extractAttrs(string)
  opts.text = tagParserUtils.extractText(string)

  // force closing tag if text or closing tag is present
  if (opts.needsClose === false &&
        (opts.text !== null || string.includes('</'))) {
    opts.needsClose = true
  }

  return new Tag(tagName, opts)
}

Tag.prototype = {

  /**
  * Get opening tag
  * @memberof Tag
  * @type {string}
  */
  get openingTag () {
    let tag = `<${this.name}`
    if (this.params.attrs !== null) {
      tag = `${tag} ${this.params.attrs}`
    }
    tag = `${tag}>`
    return tag
  },

  /**
  * Get closing tag
  * @memberof Tag
  * @type {string}
  */
  get closingTag () {
    return `</${this.name}>`
  },

  /**
  * Get text tag
  * @memberof Tag
  * @type {string}
  */
  get text () {
    return this.params.text
  },

  /**
  * Set tag text
  * @memberof Tag
  * @param {string} text - Text to be set for tag.
  */
  set text (text) {
    this.params.text = text
  }

}

module.exports = {
  Tag: Tag
}
