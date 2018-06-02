const util = require('util')
const backendSource = require("./index")
const TemplateBundle = backendSource.TemplateBundle
const BasicTemplate  = backendSource.BasicTemplate
class TestTemplate extends BasicTemplate {
  start () { console.log("hello world") }
}

// we have to do it this way, until 'static' syntax is supported in standard NodeJS
TestTemplate.templateId = 'testTemplate'
TestTemplate.templateLabel = 'Test Template'
TestTemplate.templateDescription = 'Test'
TestTemplate.settings = { foo: "bar" }
TestTemplate.meta = {
  templateId: TestTemplate.templateId,
  templateLabel: TestTemplate.templateLabel,
  templateDescription: TestTemplate.templateDescription,
  settings: TestTemplate.settings,
}

class TestBundle extends TemplateBundle {
  constructor(){
    super({
      name: "TestSourceModule",
      label: { en: "Test Source Module" },
      templates: [ TestTemplate ],
    })
  }
}

const saveRecord = async () => {
  console.log("mock api: saveRecord")
  return true
}
const deleteRecord = async () => {
  console.log("mock api: deleteRecord")
  return true
}

test('should work with valid data', () => {  
  const testBundle = new TestBundle()  
  const testTemplateSettings = testBundle.getSettings("testTemplate");  
  const parsedConfig = testBundle.parseOptions({
    bundleId     : "testModule",
    templateId   : "testTemplate",
    sourceId     : "testSource",
    sourceName   : "testSource",
    isActive     : true,
    settings     : testTemplateSettings,
    saveRecord   : saveRecord,
    deleteRecord : deleteRecord,
  })
  expect(parsedConfig).toEqual({
    bundleId     : "testModule",
    templateId   : "testTemplate",
    sourceId     : "testSource",
    sourceName   : "testSource",
    isActive     : true,
    settings     : { "foo": "bar" },
    defaults     : { "foo": "bar" },
    saveRecord   : saveRecord,
    deleteRecord : deleteRecord,
    errors       : [],
  })
})

test('should return errors with invalid data', () => {
  const testBundle = new TestBundle()  
  const testTemplateSettings = testBundle.getSettings("testTemplate")
  delete testTemplateSettings.foo
  const parsedConfig = testBundle.parseOptions({
    bundleId: "testModule",
    templateId: "testTemplate",
    sourceId: "testSource",
    sourceName: "testSource",
    isActive: true,
    settings: testTemplateSettings,
    saveRecord: saveRecord,
    deleteRecord: deleteRecord,
  })
  expect(parsedConfig).toEqual({
    bundleId: "testModule",
    templateId: "testTemplate",
    sourceId: "testSource",
    sourceName: "testSource",
    isActive: true,
    settings: {},
    defaults: { "foo": "bar" },
    saveRecord: saveRecord,
    deleteRecord: deleteRecord,
    errors: [ "expected a string and found \"undefined\" instead" ],
  })
})
