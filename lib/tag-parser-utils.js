'use strict'

/**
 * Extracts tag name from given string.
 * @param {string} string - String from where to extract a tag name.
 * @throws {Error} Given string must be a valid tag.
 * @returns {string} Extracted tag name.
 */
function extractTagName (string) {
  const match = string.match(/<(\w+)/)
  if (match === null) {
    throw new Error('Cannot extract tag name from string')
  }
  return match[1]
}

/**
 * Extracts tag attributes from given string.
 * @param {string} string - String from where to extract tag attributes.
 * @returns {(string|null)} Extracted attributes or null.
 */
function extractAttrs (string) {
  const match = string.match(/<\w+ (.*?)>/)
  if (match !== null) {
    return match[1]
  }
  return null
}

/**
 * Extracts tag text from given string.
 * @param {string} string - String from where to extract tag text.
 * @returns {(string|null)} Extracted text or null.
 */
function extractText (string) {
  const match = string.match(/<\w+\s?.*?>((?:.*\n?)*)<\//)
  if (match !== null && match[1] !== '') {
    return match[1]
  }
  return null
}

module.exports = {
  tagParserUtils: {
    extractTagName: extractTagName,
    extractAttrs: extractAttrs,
    extractText: extractText
  }
}
