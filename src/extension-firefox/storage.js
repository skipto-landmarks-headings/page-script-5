 /* storage.js */

const debug = false;

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const browserStorage = typeof browser === 'object' ?
    browser.storage.local :
    chrome.storage.sync;

const browserI18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;

const defaultButtonOptions = {
  displayOption: 'popup',
  focusOption: 'button'
};

const defaultShortcutOptions = {
  shortcutHeadingNext:     browserI18n.getMessage('init_shortcut_next_heading'),
  shortcutHeadingPrevious: browserI18n.getMessage('init_shortcut_previous_heading'),
  shortcutHeadingH1:       browserI18n.getMessage('init_shortcut_h1_headings'),
  shortcutHeadingH2:       browserI18n.getMessage('init_shortcut_h2_headings'),
  shortcutHeadingH3:       browserI18n.getMessage('init_shortcut_h3_headings'),
  shortcutHeadingH4:       browserI18n.getMessage('init_shortcut_h4_headings'),
  shortcutHeadingH5:       browserI18n.getMessage('init_shortcut_h5_headings'),
  shortcutHeadingH6:       browserI18n.getMessage('init_shortcut_h6_headings'),

  shortcutRegionNext:          browserI18n.getMessage('init_shortcut_next_region'),
  shortcutRegionPrevious:      browserI18n.getMessage('init_shortcut_previous_region'),
  shortcutRegionMain:          browserI18n.getMessage('init_shortcut_main_regions'),
  shortcutRegionNavigation:    browserI18n.getMessage('init_shortcut_navigation_regions'),
  shortcutRegionComplementary: browserI18n.getMessage('init_shortcut_complemntary_regions'),

};

const defaultMenuOptions = {
  headings: 'h1 h2',
  landmarks: 'main search navigation complementary',
  excludeSmallHeadings: true,
  excludeLandmarksWithoutNames: true
};

const defaultHighlightOptions = {
  highlightTarget: 'instant',
  highlightBorderSize: 'small',
  highlightBorderStyle: 'solid'
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
  menuitemFocusBackgroundColor: '#13294b',
};

const i18nOptions = {
  // Button labels and messages
  buttonLabel:      browserI18n.getMessage('init_button_label'),
  smallButtonLabel: browserI18n.getMessage('init_small_button_label'),
  altLabel:         browserI18n.getMessage('init_alt_label'),
  optionLabel:      browserI18n.getMessage('init_option_label'),
  shortcutLabel:    browserI18n.getMessage('init_shortcut_label'),

  // Menu labels and messages
  menuLabel:                browserI18n.getMessage('init_menu_label'),
  landmarkGroupLabel:       browserI18n.getMessage('init_landmark_group_label'),
  landmarkOneGroupLabel:    browserI18n.getMessage('init_landmark_one_group_label'),
  headingGroupLabel:        browserI18n.getMessage('init_heading_group_label'),
  headingOneGroupLabel:     browserI18n.getMessage('init_heading_one_group_label'),
  headingMainGroupLabel:    browserI18n.getMessage('init_heading_main_group_label'),
  headingOneMainGroupLabel: browserI18n.getMessage('init_heading_one_main_group_label'),
  headingLevelLabel:        browserI18n.getMessage('init_heading_level_label'),

  // Landmark names
  mainLabel:   browserI18n.getMessage('init_main_label'),
  searchLabel: browserI18n.getMessage('init_search_label'),
  navLabel:    browserI18n.getMessage('init_navigation_label'),
  regionLabel: browserI18n.getMessage('init_region_label'),
  asideLabel:  browserI18n.getMessage('init_aside_label'),
  headerLabel: browserI18n.getMessage('init_header_label'),
  footerLabel: browserI18n.getMessage('init_footer_label'),
  formLabel:   browserI18n.getMessage('init_form_label'),
  msgNoLandmarksFound: browserI18n.getMessage('init_msg_no_landmarks_found'),
  msgNoHeadingsFound:  browserI18n.getMessage('init_msg_no_headings_found'),

  // Shortcuts
  shortcutsGroupEnabledLabel:  browserI18n.getMessage('init_shortcuts_group_enabled_label'),
  shortcutsGroupDisabledLabel: browserI18n.getMessage('init_shortcuts_group_disabled_label'),
  shortcutsToggleEnableLabel:  browserI18n.getMessage('init_shortcuts_toggle_enable_label'),
  shortcutsToggleDisableLabel: browserI18n.getMessage('init_shortcuts_toggle_disable_label'),
  shortcutsInfoLabel:          browserI18n.getMessage('init_shortcuts_info_label'),

  msgHeadingLevel:    browserI18n.getMessage('init_msg_heading_level'),
  msgNextRegion:      browserI18n.getMessage('init_msg_next_region'),
  msgPreviousRegion:  browserI18n.getMessage('init_msg_previous_region'),
  msgNextHeading:     browserI18n.getMessage('init_msg_next_heading'),
  msgPreviousHeading: browserI18n.getMessage('init_msg_previous_heading'),
  msgHeadingIsHidden: browserI18n.getMessage('init_msg_heading_is_hidden'),

  msgMainRegions:          browserI18n.getMessage('init_msg_main_regions'),
  msgNavigationRegions:    browserI18n.getMessage('init_msg_navigation_regions'),
  msgComplementaryRegions: browserI18n.getMessage('init_msg_complementary_regions'),

  msgH1Headings: browserI18n.getMessage('init_msg_h1_headings'),
  msgH2Headings: browserI18n.getMessage('init_msg_h2_headings'),
  msgH3Headings: browserI18n.getMessage('init_msg_h3_headings'),
  msgH4Headings: browserI18n.getMessage('init_msg_h4_headings'),
  msgH5Headings: browserI18n.getMessage('init_msg_h5_headings'),
  msgH6Headings: browserI18n.getMessage('init_msg_h6_headings'),

  closeLabel:     browserI18n.getMessage('init_close_label'),
  moreInfoLabel:  browserI18n.getMessage('init_more_info_label'),
  msgKey:         browserI18n.getMessage('init_msg_key'),
  msgDescription: browserI18n.getMessage('init_msg_description'),

  msgNoMoreRegions:   browserI18n.getMessage('init_msg_no_more_regions'),
  msgNoRegionsFound:  browserI18n.getMessage('init_msg_no_regions_found'),
  msgNoMoreHeadings:  browserI18n.getMessage('init_msg_no_more_headings'),
  msgNoHeadingsLevelFound: browserI18n.getMessage('init_msg_no_headings_of_level_found'),

};

const defaultOptions = Object.assign({}, defaultButtonOptions, defaultHighlightOptions, defaultMenuOptions, defaultStyleOptions, i18nOptions, defaultShortcutOptions);

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
** resetDefaultHighlightOptions
*/
export function resetDefaultHighlightOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(defaultHighlightOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetDefaultShortcutOptions
*/
export function resetDefaultShortcutOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(defaultShortcutOptions, function () {
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
