'use strict'

const { Node } = require('./treenode')
const { Tag } = require('./tag')

/**
 * Represents a Builder.
 * @constructor
 * @param {Object} config - Configuration for Builder instance.
 */
function Builder (config) {
  this.config = config
  this.html = new Node('html', Tag.fromString(this.config.html))
  this._head = null
  this._body = null
  this._current = null
}

/**
 * Builds a tree.
 * @memberof Builder
 * @param {Array.<{tag: string, text: string}>} sections - Sections with slide
 *                                                         data.
 */
Builder.prototype.buildTree = function (sections) {
  this._addHead()
  this._addBody()
  this._addSlides(sections)
  this._addScripts()
}

Builder.prototype._addHead = function () {
  this._head = new Node('_head', Tag.fromString(this.config.head))
  this.html.addChild(this._head)
  this.config.styles.forEach(item => {
    const node = new Node(
      'style', Tag.fromString(item, { needsClose: false })
    )
    this._head.addChild(node)
  })
}

Builder.prototype._addBody = function () {
  this._body = new Node('_body', Tag.fromString(this.config.body))
  this.html.addChild(this._body)
  this._current = this._body
  this.config.wrapped.forEach(item => {
    const node = new Node('wrapped', Tag.fromString(item))
    this._current.addChild(node)
    this._current = node
  })
}

Builder.prototype._addSlides = function (sections) {
  // TODO: can it be refactored?
  let currentNode = this._current
  for (let i = 0; i < sections.length; i++) {
    let tag = null
    let node = null
    if (sections[i].tag === 'slidegroup') {
      currentNode = this._current
      tag = Tag.fromString(this.config[sections[i].tag][0])
      node = new Node('slidegroup', tag)
      currentNode.addChild(node)
      currentNode = node
    } else if (sections[i].tag === 'slide') {
      const outerTag = Tag.fromString(this.config[sections[i].tag][0])
      const outerNode = new Node('slideOuter', outerTag)
      currentNode.addChild(outerNode)
      tag = Tag.fromString(this.config[sections[i].tag][1])
      tag.text = sections[i].text
      node = new Node('slideInner', tag)
      outerNode.addChild(node)
    }
  }
}

Builder.prototype._addScripts = function () {
  this.config.scripts.forEach(item => {
    const node = new Node('script', Tag.fromString(item))
    this._body.addChild(node)
  })
}

module.exports = {
  Builder: Builder
}
