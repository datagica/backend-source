const murmurhash = require("murmurhash-v3");

function isObject(value){
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

function validate(expected, actual) {
  /*console.log("VALIDATE:" + JSON.stringify({
    expected: expected,
    actual: actual
  }, null, 2))*/
  try {
    if (typeof expected === "string") {
      if (typeof actual !== "string") {
        return [`expected a string and found "${typeof actual}" instead`]
      }
    } else if (typeof expected === "number") {
      if (typeof actual !== "number") {
        return [`expected a number and found "${typeof actual}" instead`]
      }
    } else if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) {
        return [`expected array of length ${expected.length} and found "${actual}" instead`]
      }
      let errors = [];
      for (var i = 0; i < expected.length; i++) {
        errors = errors.concat(validate(expected[i], actual[i]))
      }
      return errors;
    } else if (isObject(expected)) {
      if (!isObject(actual)) {
        return [`expected object and found "${actual}" instead`]
      }
      let errors = [];
      Object.keys(expected).map(key => {
        errors = errors.concat(validate(expected[key], actual[key]))
      })
      return errors;
    } else {
      return [`expected "${expected}" and found "${actual}" instead`]
    }
  } catch(err) {
    return [`unsupported validation error: ${err}`]
  }
  return []
}


module.exports = {
  isObject: isObject,
  validate: validate,
  hash: murmurhash
}
