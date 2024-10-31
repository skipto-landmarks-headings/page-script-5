/* storage.js */

const debug = false;

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const browserStorage = typeof browser === 'object' ?
    browser.storage.local :
    chrome.storage.sync;

const defaultButtonOptions = {
  displayOption: 'popup',
  focusOption: 'button'
};

const defaultPageNavigationOptions = {
  pageNavigation: 'enabled',
  pageNextHeader: 'h',
  pagePreviousHeader: 'g',
  pageNextH1: '1',
  pageNextH2: '2',
  pageNextH3: '3',
  pageNextH4: '4',
  pageNextH5: '5',
  pageNextH6: '6',

  pageNextRegion: 'r',
  pagePreviousRegion: 'e',
  pageNextMainRegion: 'm',
  pageNextNavigationRegion: 'n'
};

const defaultMenuOptions = {
  headings: 'main-only h1 h2',
  landmarks: 'main search nav complementary',
  highlightTarget: 'instant'
};

const defaultStyleOptions = {
  fontFamily: 'sans-serif',
  fontSize: '12pt',
  buttonTextColor: '#13294b',
  buttonBackgroundColor: '#dddddd',
  focusBorderColor: '#c5050c',
  menuTextColor: '#13294b',
  menuBackgroundColor: '#dddddd',
  menuitemFocusTextColor: '#dddddd',
  menuitemFocusBackgroundColor: '#13294b'
};

const i18nOptions = {
  // Button labels and messages
  buttonLabel: 'Skip To Content',
  smallButtonLabel: 'SkipTo',
  altLabel: 'Alt',
  optionLabel: 'Option',
  shortcutLabel: 'shortcut',

  // Menu labels and messages
  menuLabel: 'Landmarks and Headings',
  landmarkGroupLabel: 'Landmark Regions',
  headingGroupLabel: 'Headings',
  headingLevelLabel: 'Heading level',

  // Landmark names
  mainLabel: 'main',
  searchLabel: 'search',
  navLabel: 'navigation',
  regionLabel: 'region',
  asideLabel: 'complementary',
  footerLabel: 'contentinfo',
  headerLabel: 'banner',
  formLabel: 'form',
  msgNoLandmarksFound: 'No landmarks found',
  msgNoHeadingsFound: 'No headings found'
};

const defaultOptions = Object.assign({}, defaultButtonOptions, defaultMenuOptions, defaultStyleOptions, i18nOptions, defaultPageNavigationOptions);

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
    browserStorage.get(function (options) {
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
    browserStorage.set(options, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultOptions
*/
export function resetDefaultOptions () {
  return new Promise (function (resolve, reject) {
    browsersStorage.set(defaultOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultButtonOptions
*/
export function resetDefaultButtonOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(defaultButtonOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}


/*
** resetDefaultMenuOptions
*/
export function resetDefaultMenuOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(defaultMenuOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultStyleOptions
*/
export function resetDefaultStyleOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(defaultStyleOptions, function () {
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
  browserStorage.clear();
}

// Generic error handler
function notLastError () {
  if (!browserRuntime.lastError) { return true; }
  else {
    console.log(browserRuntime.lastError.message);
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
    debug && console.log(`[optionsToParams][${item}]: ${options[item]}`);
    str += item + ':' + options[item] + ';';
  }
  return str;
}
