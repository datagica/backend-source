/* @flow weak */
'use strict'

const BasicTemplate = require('./basic-template');

class PollingTemplate extends BasicTemplate {

  start () {
    super.start()
    this.poll()
  }

  poll(){

    if (!this.isRunning) {
      return
    }

    const minInterval = (((this.config.settings.parameters || {}).value || {}).interval || {}).value || 10000
    const errorInterval = 5000 // 5 sec in case of error

    this.sync().then(done => {
      console.log(`[polling-template] sync succeded, will sync again in ${Math.round(minInterval / 1000)} sec..`);
      setTimeout(() => { this.poll() }, minInterval)
    }).catch(err => {
      console.log(`[polling-template] sync failed: ${err}`)
      console.log(`[polling-template] will retry sync in ${Math.round(errorInterval / 1000)} sec..`);
      setTimeout(() => { this.poll() }, errorInterval)
    })
  }

  sync(){
    return Promise.resolve(true)
  }
}
module.exports = PollingTemplate
