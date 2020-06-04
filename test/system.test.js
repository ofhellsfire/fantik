'use strict'

/*
Test Cases:
1. default invocation +
2. wrong plugin +
  - missing plugin +
3. custom config (many cases per config section)
  - invalid custom config +
  - ...
4. wrong custom config +
5. no access input +
6. no access out +
7. ??? how to test watch
8. list subcommand
9. positive invocation
  - custom config +
  
*/

const child_process = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const tmpDir = os.tmpdir()
const inputPath = path.join('test', 'assets', 'system_tests', 'slides.tmd')
const systemTestsPath = path.join('test', 'assets', 'system_tests')

describe('System Test Suite', () => {

  test('default configuration', () => {
    const outFilename = 'default-config-slides.html'
    const outPath = path.join(tmpDir, outFilename)
    const expectedPath = path.join(systemTestsPath, outFilename)
    const output = child_process.execSync(
      `node index.js build --out ${outPath} ${inputPath}`,
      { cwd: '.', encoding: 'utf8' }
    )
    const expected = fs.readFileSync(expectedPath, { encoding: 'utf8' })
    const actual = fs.readFileSync(outPath, { encoding: 'utf8' })
    expect(actual).toStrictEqual(expected)
    expect(output).toStrictEqual(
      `HTML file '${outPath}' has been successfully created\n`
    )
  })

  test('missing plugin', () => {
    const pluginName = 'invalid'
    const output = child_process.spawnSync(
      'node',
      ['index.js', 'build', '--plugin', 'invalid', inputPath],
      { cwd: '.', shell: true, encoding: 'utf8' }
    )
    const expected = `Unable to read config file: ` +
                     `ENOENT: no such file or directory, open ` +
                     `'${path.join(
                         __dirname,
                         '..',
                         'plugins',
                         pluginName,
                         'layout.config.yaml'
                      )}'\n`
    expect(output.stderr).toStrictEqual(expected)
  })

  test('custom configuration: positive', () => {
    const outFilename = 'custom-config-slides.html'
    const outPath = path.join(tmpDir, outFilename)
    const expectedPath = path.join(systemTestsPath, outFilename)
    const customConfigPath = path.join(
      systemTestsPath, 'custom-config-fine.yaml'
    )
    const output = child_process.execSync(
      `node index.js build --config ${customConfigPath} ` +
      `--out ${outPath} ${inputPath}`,
      { cwd: '.', encoding: 'utf8' }
    )
    const expected = fs.readFileSync(expectedPath, { encoding: 'utf8' })
    const actual = fs.readFileSync(outPath, { encoding: 'utf8' })
    expect(actual).toStrictEqual(expected)
    expect(output).toStrictEqual(
      `HTML file '${outPath}' has been successfully created\n`
    )
  })

  test('custom configuration: invalid', () => {
    const outFilename = 'custom-invalid-config-slides.html'
    const outPath = path.join(tmpDir, outFilename)
    const customConfigPath = path.join(
      systemTestsPath, 'custom-config-invalid.yaml'
    )
    const output = child_process.spawnSync(
      'node',
      ['index.js', 'build',
       '--config', customConfigPath,
       '--out', outPath, inputPath],
      { cwd: '.', shell: true, encoding: 'utf8' }
    )
    const expected = expect.stringMatching(
      `Unable to parse config file '${customConfigPath}':`
    )
    expect(output.stderr).toEqual(expected)
  })

  test('custom configuration: not existing', () => {
    const outFilename = 'custom-nonexisting-config-slides.html'
    const outPath = path.join(tmpDir, outFilename)
    const customConfigPath = path.join(
      '/not-existing-path', 'not-existing.yaml'
    )
    const output = child_process.spawnSync(
      'node',
      ['index.js', 'build',
       '--config', customConfigPath,
       '--out', outPath, inputPath],
      { cwd: '.', shell: true, encoding: 'utf8' }
    )
    const expected = expect.stringMatching(
      `Unable to read config file: ENOENT: no such file or directory, ` +
      `open '${customConfigPath}'`
    )
    expect(output.stderr).toEqual(expected)
  })

  test('not existing output path', () => {
    const outFilename = 'not-existing-slides.html'
    const outPath = path.join('/not-existing-path', outFilename)
    const output = child_process.spawnSync(
      'node',
      ['index.js', 'build',
       '--out', outPath, inputPath],
      { cwd: '.', shell: true, encoding: 'utf8' }
    )
    const expected = expect.stringMatching(
      `Unable to write rendered data to file '${outPath}' due to`
    )
    expect(output.stderr).toEqual(expected)
  })

  test('not existing input path', () => {
    const inputFilename = 'not-existing-slides.tmd'
    const inputPath = path.join('/not-existing-path', inputFilename)
    const output = child_process.spawnSync(
      'node',
      ['index.js', 'build', inputPath],
      { cwd: '.', shell: true, encoding: 'utf8' }
    )
    const expected = expect.stringMatching(
      `Unable to read input file '${inputPath}' due to`
    )
    expect(output.stderr).toEqual(expected)
  })

})