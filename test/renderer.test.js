'use strict'

const fs = require('fs')

const { Node } = require('../lib/treenode')
const { TagRenderer, TreeRenderer } = require('../lib/renderers')
const { Tag } = require('../lib/tag.js')

describe('Rendering Test Suite', () => {

  describe('Tag rendering tests', () => {

    test.each([
      [ { pretty: true }, '<div>\n' ],
      [ { pretty: false }, '<div>' ]
    ])('open tag only with (%j, %j)', (options, expected) => {
      const tagRenderer = new TagRenderer(options)
      const tag = new Tag('div', { needsClose: false })
      expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })
  
    test.each([
      [ { pretty: true }, '<div>\n</div>\n' ],
      [ { pretty: false }, '<div></div>' ]
    ])('open/close tag only (%j, %j)', (options, expected) => {
      const tagRenderer = new TagRenderer(options)
      const tag = new Tag('div')
      expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })
  
    test.each([
      [ { pretty: true }, '<div class="uno dos tres">\n' ],
      [ { pretty: false }, '<div class="uno dos tres">' ]
    ])('open tag only with 1 attribute (%j, %j)', (options, expected) => {
      const tagRenderer = new TagRenderer(options)
      const tag = new Tag(
        'div',
        { attrs: 'class="uno dos tres"', needsClose: false }
      )
      expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })
  
    test.each([
      [ { pretty: true }, '<div class="uno dos tres" id="custom">\n</div>\n' ],
      [ { pretty: false }, '<div class="uno dos tres" id="custom"></div>' ]
    ])('open/closed tag with several attributes (%j, %j)',
      (options, expected) => {
        const tagRenderer = new TagRenderer(options)
        const tag = new Tag(
          'div',
          { attrs: 'class="uno dos tres" id="custom"' }
        )
        expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })
  
    test.each([
      [ { pretty: true }, '<div>\n  this is some text\n</div>\n' ],
      [ { pretty: false }, '<div>this is some text</div>' ]
    ])('tag with text only (%j, %j)', (options, expected) => {
      const tagRenderer = new TagRenderer(options)
      const tag = new Tag('div', { text: 'this is some text' })
      expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })
  
    test.each([
      [
        { pretty: true },
        '<div attr1="uno" attr3="tres">\n  this is some text\n</div>\n'
      ],
      [
        { pretty: false },
        '<div attr1="uno" attr3="tres">this is some text</div>'
      ]
    ])('tag with attributes and text (%j, %j)', (options, expected) => {
      const tagRenderer = new TagRenderer(options)
      const tag = new Tag(
        'div',
        { attrs: 'attr1="uno" attr3="tres"', text: 'this is some text' }
      )
      expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })
  
    test.each([
      [ { pretty: true }, '<div>\n  this is some text\n</div>\n' ],
      [ { }, '<div>this is some text</div>' ]
    ])('force tag closing if text (%j, %j)', (options, expected) => {
      const tagRenderer = new TagRenderer(options)
      const tag = new Tag(
        'div', 
        { text: 'this is some text', needsClose: false }
      )
      expect(tagRenderer.render(tag)).toStrictEqual(expected)
    })

    test('create default tag renderer', () => {
      const tagRenderer = new TagRenderer()
      const tag = new Tag(
        'span',
        { attrs: 'style="style1:value1"', text: 'olalu' }
      )
      expect(tagRenderer.render(tag)).toStrictEqual(
        '<span style="style1:value1">olalu</span>'
      )
    })

  })

  describe('Tree rendering tests', () => {

    test('Render simple tree', () => {
      const html = new Node('html', new Tag('html'))
      const head = new Node('head', new Tag('head'))
      const body = new Node('body', new Tag('body'))
      html.addChild(head)
      html.addChild(body)
      const style = new Node(
        'style', Tag.fromString(
          '<link rel="stylesheet" href="#">', { needsClose: false }
        )
      )
      head.addChild(style)
      const div = new Node('div', new Tag('div'))
      body.addChild(div)
      const span = new Node(
        'span',
        Tag.fromString('<span>First line\nSecond line\nThird line</span>')
      )
      div.addChild(span)
      const divText = new Node('div', Tag.fromString('<div>Simple text</div>'))
      body.addChild(divText)

      const expected = fs.readFileSync(
        'test/assets/render/simple_tree.html', { encoding: 'utf8' }
      )

      const renderer = new TreeRenderer({ pretty: true })
      const tree = renderer.renderTree(html)
      expect(tree).toStrictEqual(expected)
    })

    test('Non pretty simple tree', () => {
      const html = new Node('html', new Tag('html'))
      const head = new Node('head', new Tag('head'))
      const body = new Node('body', new Tag('body'))
      html.addChild(head)
      html.addChild(body)
      const title = new Node(
        'title', new Tag('title', { text: 'Title' })
      )
      head.addChild(title)
      const div = new Node('div', new Tag('div', { text: 'Test text' }))
      body.addChild(div)

      const expected = fs.readFileSync(
        'test/assets/render/non_pretty.html', { encoding: 'utf8' }
      )
      
      const renderer = new TreeRenderer({ pretty: false })
      const tree = renderer.renderTree(html)
      expect(tree).toStrictEqual(expected)
    })

    test('Default renderer', () => {
      const html = new Node('html', new Tag('html'))
      const head = new Node('head', new Tag('head'))
      const body = new Node('body', new Tag('body'))
      html.addChild(head)
      html.addChild(body)
      const title = new Node(
        'title', new Tag('title', { text: 'Title' })
      )
      head.addChild(title)
      const div = new Node('div', new Tag('div', { text: 'Test text' }))
      body.addChild(div)

      const expected = fs.readFileSync(
        'test/assets/render/non_pretty.html', { encoding: 'utf8' }
      )
      
      const renderer = new TreeRenderer()
      const tree = renderer.renderTree(html)
      expect(tree).toStrictEqual(expected)
    })

    test('Set treenode level', () => {
      const body = new Node('body', new Tag('body'))
      const div1 = new Node('div1', new Tag('div'))
      div1.level = 1
      body.addChild(div1)
      const div2 = new Node('div2', new Tag('div'))
      div2.level = 2
      div1.addChild(div2)
      const div3 = new Node('div3', new Tag('div', { text: 'Alala' }))
      div3.level = 3
      div2.addChild(div3)

      const expected = fs.readFileSync(
        'test/assets/render/treenode_level.html', { encoding: 'utf8' }
      )
      
      const renderer = new TreeRenderer({ pretty: true })
      const tree = renderer.renderTree(body)
      expect(tree).toStrictEqual(expected)
    })

  })

})
