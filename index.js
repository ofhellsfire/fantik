#!/usr/bin/env node // eslint-disable-line node/shebang

'use strict'

const fs = require('fs')
const path = require('path')

const program = require('commander')

const { Fantik } = require('./lib/fantik')
const { description, name, version } = require('./package.json')

program
  .name(name)
  .version(version)
  .description(description)

program
  .command('build <input>')
  .description('builds html presentation from markdown')
  .option('--plugin <plugin>', 'which plugin to use', 'reveal.js')
  .option('--config <config>', 'custom configuration (yaml) to use')
  .option(
    '--out <output>',
    'output path (default: input name as inputname.html)')
  .option(
    '--watch',
    'keep watching for presentation and build output ' +
    'as soon as presentation is changed',
    false)
  .action(Fantik.buildWithArgs)

program
  .command('list')
  .description('list available plugins')
  .action(listPlugins)

program.parse(process.argv)

// pull functions into lib
function listPlugins () {
  const plugins = fs.readdirSync(path.join(__dirname, 'plugins'))
  console.log('Available Plugins')
  console.log('=================')
  plugins.forEach(plugin => {
    console.log(plugin)
  })
}
