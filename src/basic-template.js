/* @flow weak */
'use strict'

const utils = require('./utils')

class BasicTemplate {
  constructor (opts) {
    this.isRunning = false
    this.update(opts.config)
  }

  update(config) {
    this.config = config
    if (this.config) {
      this.start()
    } else {
      this.stop()
    }
  }

  hash (obj) {
    return utils.hash(JSON.stringify(obj))
  }

  start () {
    if (this.isRunning || !this.config.isActive) {
      console.log('cannot start source (not active)');
      return false
    }
    this.isRunning = true
    return true
  }

  stop() {
    if (!this.isRunning) {
      return false
    }
    this.isRunning = false
    return true
  }
}

module.exports = BasicTemplate
