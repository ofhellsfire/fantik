'use strict'

const Tag = require('../lib/tag.js').Tag

describe('Tag Test Suite', () => {

  describe('Tag creation & update', () => {

    test('set text tag', () => {
      const tagText = 'test text'
      const expected = new Tag(
        'span',
        { attrs: 'style="padding: 0px"', text: 'test text' }
      )
      const tag = new Tag('span', { attrs: 'style="padding: 0px"' })
      tag.text = tagText
      expect(tag.text).toStrictEqual(tagText)
      expect(tag).toStrictEqual(expected)
    })

  })

  describe('Create tag from string tests', () => {

    test('tag only', () => {
      const expected = new Tag(
        'section',
        { attrs: null, text: null, needsClose: false }
      )
      const tag = Tag.fromString('<section>', { needsClose: false })
      expect(tag).toStrictEqual(expected)
    })
  
    test('tag only with closed', () => {
      const expected = new Tag(
        'div',
        { attrs: null, text: null, needsClose: true }
      )
      const tag = Tag.fromString('<div>')
      expect(tag).toStrictEqual(expected)
    })
  
    test('invalid string', () => {
      expect(() => {
        Tag.fromString('invalid tag')
      }).toThrowError()
    })
  
    test('open/closed tag', () => {
      const expected = new Tag(
        'div',
        { attrs: null, text: null, needsClose: true }
      )
      const tag = Tag.fromString('<div></div>')
      expect(tag).toStrictEqual(expected)
    })

    test('force closing tag', () => {
      const expected = new Tag(
        'div',
        { attrs: null, text: null, needsClose: true }
      )
      const tag = Tag.fromString('<div></div>', { needsClose: false })
      expect(tag).toStrictEqual(expected)
    })

    test('tag only with single attr', () => {
      const expected = new Tag(
        'div',
        { attrs: 'class="reveal"', text: null }
      )
      const tag = Tag.fromString('<div class="reveal">')
      expect(tag).toStrictEqual(expected)
    })
  
    test('open/closed tag with single attr', () => {
      const expected = new Tag(
        'script',
        { attrs: 'src="http://url"', text: null }
      )
      const tag = Tag.fromString('<script src="http://url"></script>')
      expect(tag).toStrictEqual(expected)
    })
  
    test('tag only with multiple attrs', () => {
      const expected = new Tag(
        'link',
        { attrs: 'rel="stylesheet" href="#"', text: null, needsClose: false }
      )
      const tag = Tag.fromString(
        '<link rel="stylesheet" href="#">', { needsClose: false }
      )
      expect(tag).toStrictEqual(expected)
    })

    test('tag with text', () => {
      const expected = new Tag(
        'div',
        { attrs: null, text: 'some text', needsClose: true }
      )
      const tag = Tag.fromString('<div>some text</div>')
      expect(tag).toStrictEqual(expected)
    })

    test('force closing text if text is present', () => {
      const expected = new Tag(
        'div',
        { attrs: null, text: 'some text', needsClose: true }
      )
      const tag = Tag.fromString('<div>some text</div>', { needsClose: false })
      expect(tag).toStrictEqual(expected)
    })

    test('tag with multiline text', () => {
      const expected = new Tag(
        'div',
        { 
          attrs: null,
          text: 'some text\nmore text\neven more text'
        }
      )
      const tag = Tag.fromString(
        '<div>some text\nmore text\neven more text</div>'
      )
      expect(tag).toStrictEqual(expected)
    })
  
    test('tag with single attr and text', () => {
      const expected = new Tag(
        'textarea',
        { 
          attrs: 'data-template',
          text: 'some text with attr'
        }
      )
      const tag = Tag.fromString(
        '<textarea data-template>some text with attr</textarea>'
      )
      expect(tag).toStrictEqual(expected)
    })

  })

  describe('Opening/closing tags', () => {

    test('simple tag without attribues', () => {
      const tag = Tag.fromString('<span></span>')
      expect(tag.openingTag).toStrictEqual('<span>')
      expect(tag.closingTag).toStrictEqual('</span>')
    })

    test('tag with attributes', () => {
      const tag = Tag.fromString('<span class="foo" style="bar: baz"></span>')
      expect(tag.openingTag).toStrictEqual(
        '<span class="foo" style="bar: baz">'
      )
      expect(tag.closingTag).toStrictEqual('</span>')
    })

  })

})
