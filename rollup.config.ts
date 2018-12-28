import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import minifyLiterals from 'rollup-plugin-minifyliterals'
const pkg = require('./package.json')

const files = ['podeem']

const libraryName = 'podeem'
const plugins = [
  // Allow json resolution
  json(),
  minifyLiterals(),

  // Compile TypeScript files
  typescript({ useTsconfigDeclarationDir: true }),

  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),
  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  resolve({
    module: true,
    jsnext: true,
    browser: true,
  }),

  // Resolve source maps to the original source
  sourceMaps(),

  terser()
]

export default files.map(file => ({
  input: `src/${file}.ts`,
  output: {
    file: `dist/${file}.min.js`,
    format: 'cjs',
    name: libraryName,
    sourcemap: false,
    extend: true
  },

  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins
}))
