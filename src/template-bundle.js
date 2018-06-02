/* @flow weak */
'use strict'

const utils = require('./utils');

class TemplateBundle {

  constructor(opts) {
    this.name         = opts.name;
    this.label        = opts.label;
    this.description  = opts.description;
    this.debug        = opts.debug;

    this.meta = {};
    this.templates = {};
    opts.templates.forEach(Template => {
      this.meta[Template.templateId] = Template.meta
      this.templates[Template.templateId] = Template
    })
  }

  getSettings(templateId) {
    return (this.meta[templateId] && this.meta[templateId].settings) ? JSON.parse(JSON.stringify(this.meta[templateId].settings)) : {};
  }

  parseOptions(opts) {

    if (!opts) {
      throw new Error(`[template-bundle] invalid parameters`)
    }

    if (typeof opts.saveRecord !== 'function') {
      throw new Error(`[template-bundle] missing callback 'saveRecord' in ${JSON.stringify(opts, null, 2)}`)
    }

    if (typeof opts.deleteRecord !== 'function') {
      throw new Error(`[template-bundle] missing callback 'deleteRecord' in ${JSON.stringify(opts, null, 2)}`)
    }

    if (typeof opts.templateId !== 'string' || opts.templateId === '') {
      throw new Error(`[template-bundle] invalid templateId`)
    }

    if (typeof opts.sourceId !== 'string' || opts.sourceId === '') {
      throw new Error(`[template-bundle] invalid sourceId`)
    }

    if (typeof opts.sourceName !== 'string' || opts.sourceName === '') {
      throw new Error(`[template-bundle] invalid sourceName`)
    }

    if (typeof opts.isActive !== 'boolean') {
      throw new Error(`[template-bundle] option isActive isn't a boolean`)
    }

    if (!opts.settings) {
      throw new Error(`[template-bundle] invalid settings`)
    }

    if (!this.meta[opts.templateId]) {
      throw new Error(`[template-bundle] ${this.name} doesn't have ${JSON.stringify(opts.templateId, null, 2)}`)
    }
    // console.log("this.meta[opts.templateId]="+JSON.stringify(this.meta[opts.templateId].settings, null, 2))

    if (typeof this.meta[opts.templateId].settings === 'undefined') {
      throw new Error(`[template-bundle] ${JSON.stringify(this.meta[opts.templateId], null, 2)} doesn't have a 'settings' field`)
    }

    // console.log("[template-bundle] getting default settings..")

    const defaultSettings = this.getSettings(opts.templateId)

    // console.log("[template-bundle] defaultSettings="+JSON.stringify(defaultSettings, null, 2))

    const results = {
      bundleId     : opts.bundleId,
      templateId   : opts.templateId,
      sourceId     : opts.sourceId,
      sourceName   : opts.sourceName,
      isActive     : opts.isActive,
      settings     : opts.settings,
      defaults     : defaultSettings,
      saveRecord   : opts.saveRecord,
      deleteRecord : opts.deleteRecord,
      errors: utils.validate(defaultSettings, opts.settings)
    }

    if (!(Array.isArray(results.errors) && results.errors.length)) {
      results.errors = []
    }
    return results
  }

  getInstance(config) {
    config = this.parseOptions(config);
    if (!config) {
      throw new Error(`${this.name} couldn't get instance config`)
    }
    if (Array.isArray(config.errors) && config.errors.length > 0) {
      throw new Error(`${this.name} invalid settings:\n ${config.errors.map(e => ' - '+e).join('\n')}`)
    }

    const Template = this.templates[config.templateId];
    if (!Template) {
      throw new Error(`${this.name} doesn't support ${JSON.stringify(config.templateId, null, 2)}`)
    }
    return new Template({ config: config })
  }
}

module.exports = TemplateBundle;
