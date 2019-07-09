#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-p, --port <port>', 'port', 80)
  .parse(process.argv)

if (!program.port) {
  console.error('error: port is not specified')
  process.exit(255)
}

require('@microverse-network/core/node')

const config = require('@microverse-network/core/config')
config.network.transport.options.subtransports.websocket.options.port = program.port

config.plugins = config.plugins.concat([
  require('@microverse-network/core/key-exchange'),
  require('../webrtcnegotiator'),
  require('../index'),
])

const Tracker = require('../index')
global.tracker = new Tracker()

process.on('unhandledRejection', err => {
  throw err
})
