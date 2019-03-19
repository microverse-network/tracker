const RPC = require('@microverse-network/core/rpc')

module.exports = class WebRTCNegotiator extends RPC {
  constructor(options = {}) {
    options.discoverable = false
    super(options)
  }

  dispatch(signal) {
    this.debug('dispatching a signal %s to %s', signal.id, signal.receiver)
    this.remotes.forEach(client => {
      if (client.$nodeId !== signal.receiver) return
      client.receive(signal)
    })
  }

  getProtocol(methods = {}) {
    methods.dispatch = (...args) => this.dispatch(...args)
    return super.getProtocol(methods)
  }
}
