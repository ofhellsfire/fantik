# Fantik [![Build Status](https://travis-ci.com/ofhellsfire/fantik.svg?branch=master)](https://travis-ci.com/ofhellsfire/fantik) ![Node.js 8+](https://img.shields.io/badge/node.js-%3E%3D%208.0.0-brightgreen)

**Create Presentation Slides From Markdown**

**Fantik** is a simple wrapper that allows you to create presentation slides from Markdown.

Plugins are supported (only [reveal.js](https://github.com/hakimel/reveal.js) for now).

Configurable.

Subsection slides support.

Enable `--watch` feature, edit your slides in your favorite IDE and let **Fantik** rebuild HTML slides upon saving.

## Installation

### NPM

```
npm install fantik
# or globally
npm install -g fantik
```

## Usage

```
$ ./fantik --help
Usage: fantik [options] [command]

Build presentations from Markdown

Options:
  -V, --version            output the version number
  -h, --help               output usage information

Commands:
  build [options] <input>  builds html presentation from markdown
  list                     list available plugins

$ ./fantik build --help
Usage: fantik build [options] <input>

builds html presentation from markdown

Options:
  --plugin <plugin>  which plugin to use (default: "reveal.js")
  --config <config>  custom configuration (yaml) to use
  --out <output>     output path (default: input name as inputname.html)
  --watch            keep watching for presentation and build output as soon as presentation is changed (default: false)
  -h, --help         output usage information
```

## Configuration

TODO

## Example

```
# Creating slides
$ cat <<EOF | tee slides.tmd

>>>slide

# Presentation Name

>>>slide

# Agenda

>>>slidegroup
>>>slide

### Slide 1

>>>slide

### Slide 2

$ ./fantik build slides.tmd

# Open slides.html in your favorite browser
```

## Motivation

Got tired of making presentation lectures in plain HTML (despite using [reveal.js](https://github.com/hakimel/reveal.js) and its markdown support) copying layout structure over and over again. Hopefully it helps making presentation faster, lighter and transferring styling from lecture to lecture easier.

## TODO

1. Other presentation engines support (like impress.js, eagle.js)
1. PDF export
1. Markdown to HTML (for frameworks that don't support Markdown)
1. Additional arguments support for slidegroup and slide classes (to be able to style per slidegroup/slide)
1. Autodetection of the latest Reveal.js version
1. Offline slides (downloads slides framework locally and links it)
1. Use more efficient `watch` alternative

## License

MIT
