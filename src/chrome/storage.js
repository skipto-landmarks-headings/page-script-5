/* storage.js */

const defaultMenuOptions = {
  headings: 'main-only h1 h2 h3',
  landmarks: 'main search nav complementary',
};

const defaultColorOptions = {
  buttonTextColor: '#13294b',
  buttonBackgroundColor: '#dddddd',
  focusBorderColor: '#c5050c',
  menuTextColor: '#13294b',
  menuBackgroundColor: '#dddddd',
  menuitemFocusTextColor: '#dddddd',
  menuitemFocusBackgroundColor: '#13294b'
};

const defaultOptions = Object.assign({}, defaultMenuOptions, defaultColorOptions);

function hasAllProperties (refObj, srcObj) {
  for (const key of Object.keys(refObj)) {
    if (!srcObj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function isComplete (obj) {
  const numOptions = Object.keys(defaultOptions).length;
  if (Object.keys(obj).length !== numOptions) {
    return false;
  }
  return hasAllProperties(defaultOptions, obj);
}

function addDefaultValues (options) {
  const copy = Object.assign({}, defaultOptions);
  for (let [key, value] of Object.entries(options)) {
    if (copy.hasOwnProperty(key)) {
      copy[key] = value;
    }
  }
  return copy;
}

/*
**  getOptions
*/
export function getOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.get(function (options) {
      if (notLastError()) {
        if (isComplete(options)) {
          resolve(options);
        }
        else {
          const optionsWithDefaults = addDefaultValues(options);
          saveOptions(optionsWithDefaults);
          resolve(optionsWithDefaults);
        }
      }
    });
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultOptions
*/
export function resetDefaultOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(defaultOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultMenuOptions
*/
export function resetDefaultMenuOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(defaultMenuOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultColorOptions
*/
export function resetDefaultColorOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(defaultColorOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
**  logOptions
*/
export function logOptions (context, objName, obj) {
  let output = [];
  for (const prop in obj) {
    output.push(`${prop}: '${obj[prop]}'`);
  }
  console.log(`${context} > ${objName} > ${output.join(', ')}`);
}

/*
**  clearStorage: Used for testing
*/
export function clearStorage () {
  chrome.storage.sync.clear();
}

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

/*
** @function optionsToParams
**
** @desc  Converts options in to a param sting compatible with
**        data-params attribute for SkipTo.js
**
** @param  {Object} options : Object with name values for params
**
** @returns. {String} see @desc
*/
export function optionsToParams(options) {
  let str = '';
  for(const item in options) {
    str += item + ':' + options[item] + ';';
  }
  return str;
}
