const RPC = require('@microverse-network/core/rpc')
const Database = require('@microverse-network/database')

module.exports = class Tracker extends RPC {
  constructor(options = {}) {
    super(options)
    this.db = new Database({ discoverable: false })
    this.descriptions = this.db.get('descriptions', { discoverable: false })
  }

  handleConnectionClose(connection) {
    super.handleConnectionClose(connection)
    this.remove(connection.peer)
  }

  add(description) {
    this.debug('add %s on %s', description.module.label, description.node.id)
    const { id } = description.module
    this.descriptions.update({ id }, description, { upsert: true })
    // this.remotes.forEach(client => {
    //   if (client.$nodeId === description.node.id) return
    //   this.debug(
    //     'offer %s on %s to %s',
    //     description.module.label,
    //     description.node.id,
    //     client.$nodeId,
    //   )
    //   client.offer(description)
    // })
  }

  remove(nodeId) {
    this.descriptions.remove({ 'node.id': nodeId }, { multi: true })
  }

  query(selector = {}, options = {}) {
    return this.descriptions.find(selector, options)
  }

  getProtocol(methods = {}) {
    methods.add = (...args) => this.add(...args)
    methods.query = (...args) => this.query(...args)
    return super.getProtocol(methods)
  }
}
