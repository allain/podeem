'use strict'

import fs from 'fs'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import minifyliterals from 'rollup-plugin-minifyliterals'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

export default [
  {
    // browser friendly umd
    input: `src/podeem.js`,
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'podeem',
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      minifyliterals(),
      babel({
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/podeem.js',
    external: [],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
]
