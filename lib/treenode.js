'use strict'

/**
 * Represents a tree node.
 * @constructor
 * @param {string} name - The node name.
 * @param {*} data - Data to be kept in the node.
 */
function Node (name, data) {
  this.name = name
  this.data = data
  this.level = null
  this.children = []
}

/**
* Adds child node.
* @memberof Node
* @function
* @param {Node} node - Add child node.
*/
Node.prototype.addChild = function (node) {
  if (this.level === null) {
    this.level = 0
  }
  if (node.level === null) {
    node.level = this.level + 1
  }
  this.children.push(node)
}

module.exports = {
  Node: Node
}
