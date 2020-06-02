'use strict'

/**
 * Represents a TagRenderer.
 * @constructor
 * @param {Object} options - Options for TagRenderer.
 * Valid options:
 * - pretty - defines if rendering is pretty or not
 */
function TagRenderer (options = {}) {
  this.pretty = (options.pretty === undefined) ? false : options.pretty
  this.ending = (this.pretty) ? '\n' : ''
}

/**
 * Renders a given tag.
 * @memberof TagRenderer
 * @param {Tag} tag - Tag to be rendered.
 * @param {number} padding - Padding (number of spaces before tag)
 * @returns {string} Rendered tag.
 */
TagRenderer.prototype.render = function (tag, padding = 0) {
  const [tagPadding, textPadding] = this._getPadding(padding)

  const openingTag = this._renderOpeningTag(tag, tagPadding)
  const tagText = this._renderTagText(tag, textPadding)
  const closingTag = this._renderClosingTag(tag, tagPadding)

  return `${openingTag}${tagText}${closingTag}`
}

TagRenderer.prototype._getPadding = function (padding) {
  if (this.pretty === true) {
    return ['  '.repeat(padding), '  '.repeat(padding + 1)]
  }
  return ['', '']
}

TagRenderer.prototype._renderOpeningTag = function (tag, tagPadding) {
  let openingTag = `${tagPadding}<${tag.name}`
  if (tag.params.attrs !== null) {
    openingTag = openingTag + ' ' + tag.params.attrs
  }
  openingTag += `>${this.ending}`
  return openingTag
}

TagRenderer.prototype._renderTagText = function (tag, textPadding) {
  let tagText = ''
  if (tag.params.text !== null) {
    tagText += tag.params.text.split('\n')
      .map(item => {
        return `${textPadding}${item}${this.ending}`
      })
      .join('')
  }
  return tagText
}

TagRenderer.prototype._renderClosingTag = function (tag, tagPadding) {
  let closingTag = ''
  if (tag.params.needsClose) {
    closingTag += `${tagPadding}</${tag.name}>${this.ending}`
  }
  // TODO: ^^^ Don't add new line if open/closed tag without text
  return closingTag
}

/**
 * Represents a TreeRenderer.
 * @constructor
 * @param {Object} options - Options for TreeRenderer.
 * Valid options:
 * - pretty - defines if rendering is pretty or not
 */
function TreeRenderer (options = {}) {
  this.pretty = (options.pretty === undefined) ? false : options.pretty
  this.ending = (this.pretty) ? '\n' : ''
  this.pad = (this.pretty) ? '  ' : ''
  this.tagRenderer = new TagRenderer({ pretty: this.pretty })
}

/**
 * Renders a given tree.
 * @memberof TreeRenderer
 * @param {Node} node - Start Node to render from.
 * @returns {string} Rendered tree.
 */
TreeRenderer.prototype.renderTree = function (node) {
  if (node.children.length === 0) {
    return this.tagRenderer.render(node.data, node.level)
  }
  const data = []
  for (let i = 0; i < node.children.length; i++) {
    const tag = this.renderTree(node.children[i])
    data.push(tag)
  }
  return (
    `${this.pad.repeat(node.level)}${node.data.openingTag}${this.ending}` +
    `${data.join('')}` +
    `${this.pad.repeat(node.level)}${node.data.closingTag}${this.ending}`
  )
}

module.exports = {
  TagRenderer: TagRenderer,
  TreeRenderer: TreeRenderer
}
