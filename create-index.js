'use strict'

require('@babel/register')
require('@babel/polyfill')
require('dotenv').config()

var fs = require('fs')
var _ = require('lodash')

var excludes = ['index.js', 'create-index.js', 'node_modules', 'dist', 'logs', 'locales', 'routers', 'config', 'migrations', 'tmp']
var capital = []
var directorys = []

var makeIndex = function (dir) {
  var indexes = []
  fs.readdirSync(dir).forEach(file => {
    if (/^\..+/.test(file) || excludes.includes(file)) return
    file = file.replace(/\.js/, '')
    var tail = _.last(dir.split('/'))
    var key = _.camelCase(file)
    if (capital.includes(tail)) {
      key = `${key.slice(0, 1).toUpperCase()}${key.slice(1)}`
    }
    indexes.push({ file, key })
  })

  if (!indexes.length) return

  var importList = []
  var exportList = []
  var moduleList = []

  indexes.forEach(function ({ file, key }) {
    importList.push(`import ${key} from './${file}'`)
    exportList.push(key)
    moduleList.push(`  ${key}`)
  })

  fs.writeFileSync(`${dir}/index.js`, `// @create-index this file is created by create-index.js.\n${importList.join('\n')}\n\nexport { ${exportList.join(', ')} }\n\nconst moduleList = {\n${moduleList.join(`,\n`)}\n}\n\nexport default moduleList\n`)
}

var fetchDirectory = function (dir) {
  fs.readdirSync(dir).forEach(file => {
    if (/^\..+/.test(file) || excludes.includes(file)) return
    file = `${dir}/${file}`
    if (fs.lstatSync(file).isDirectory()) {
      directorys.push(file)
      fetchDirectory(file)
    }
  })
}

fetchDirectory(__dirname)

directorys.forEach(function (dir) {
  makeIndex(dir)
})

// 建立 config index.js
var configs = require('./config/configs').default
var keys = Object.keys(configs)
keys = keys.map(k => /^(npm|node)/.test(k) ? null : k)
keys = _.compact(keys)
var vars = keys.map((v) => {
  return `var ${v} = myconfigs.${v}`
})

vars = _.compact(vars)
fs.writeFileSync(`./config/index.js`, `
import myconfigs from './configs'\n
${vars.join('\n')}\n
export { ${keys.join(', ')} }\n
const moduleList = {\n  ${keys.join(`,\n  `)}\n}\n
export default moduleList
`)
