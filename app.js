'use strict'

require('@babel/register')
require('@babel/polyfill')
require('dotenv').config()
require('module').Module._initPaths()

require('start').default()
