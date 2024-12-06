/* skiptoContent.js */

import renderStyleElement from './style.js';
import SkiptoMenuButton from './skiptoMenuButton.js';

import DebugLogging  from './debug.js';

import {
  getLandmarksAndHeadings
} from './landmarksHeadings.js';

import {
  monitorKeyboardFocus
} from './shortcuts.js';

/* constants */
const debug = new DebugLogging('skiptoContent', false);
debug.flag = false;


export default class SkipToContent extends HTMLElement {

  constructor() {
    // Always call super first in constructor
    super();
    this.attachShadow({ mode: 'open' });
    this.skipToId = 'id-skip-to';
    this.version = "5.7";
    this.buttonSkipTo = false;
    this.initialized = false;

    // Default configuration values
    this.config = {
      // Feature switches
      enableHeadingLevelShortcuts: true,

      focusOption: 'none',  // used by extensions only

      // Customization of button and menu
      altShortcut: '0', // default shortcut key is the number zero
      optionShortcut: 'º', // default shortcut key character associated with option+0 on mac
      displayOption: '', // options: static, popup, fixed (default)
      // container element, use containerClass for custom styling
      containerElement: 'nav',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      buttonLabel: 'Skip To Content',
      smallButtonLabel: 'SkipTo',
      altLabel: 'Alt',
      optionLabel: 'Option',
      shortcutLabel: 'shortcut',
      buttonShortcut: ' ($modifier+$key)',
      buttonAriaLabel: '$buttonLabel, $shortcutLabel $modifierLabel + $key',

      // Page navigation flag and keys
      shortcutsSupported: 'true', // options: true or false
      shortcuts: 'enabled',  // options: disabled and enabled
      shortcutHeadingNext: 'h',
      shortcutHeadingPrevious: 'g',
      shortcutHeadingH1: '1',
      shortcutHeadingH2: '2',
      shortcutHeadingH3: '3',
      shortcutHeadingH4: '4',
      shortcutHeadingH5: '5',
      shortcutHeadingH6: '6',

      shortcutRegionNext: 'r',
      shortcutRegionPrevious: 'e',
      shortcutRegionMain: 'm',
      shortcutRegionNavigation: 'n',
      shortcutRegionComplementary: 'c',

      shortcutsGroupEnabledLabel:  'Navigation Shortcuts: Enabled',
      shortcutsGroupDisabledLabel: 'Navigation Shortcuts: Disabled',
      shortcutsToggleEnableLabel:  'Enable shortcuts',
      shortcutsToggleDisableLabel: 'Disable shortcuts',
      shortcutsInfoLabel:          'Shortcut Information',

      msgClose: 'Close',
      msgKey: 'Key',
      msgDescription: 'Description',
      msgMoreInfo: 'More Information',

      msgNextRegion: 'Next region',
      msgPreviousRegion: 'Previous region',
      msgNextHeading: 'Next heading',
      msgPreviousHeading: 'Previous heading',

      msgMainRegions: 'Main regions',
      msgNavigationRegions: 'Navigation regions',
      msgComplementaryRegions: 'Complementary regions',

      msgHeadingLevel: 'Level #',
      msgH1Headings: 'Level 1 headings',
      msgH2Headings: 'Level 2 headings',
      msgH3Headings: 'Level 3 headings',
      msgH4Headings: 'Level 4 headings',
      msgH5Headings: 'Level 5 headings',
      msgH6Headings: 'Level 6 headings',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkGroupLabel: 'Landmark Regions',
      headingGroupLabel: 'Headings',
      headingMainGroupLabel: 'Headings in Main Region',
      headingLevelLabel: 'Heading level',
      mainLabel: 'main',
      searchLabel: 'search',
      navLabel: 'navigation',
      regionLabel: 'region',
      asideLabel: 'complementary',
      footerLabel: 'contentinfo',
      headerLabel: 'banner',
      formLabel: 'form',
      msgNoLandmarksFound: 'No landmarks found',
      msgNoHeadingsFound: 'No headings found',

      // Selectors for landmark and headings sections
      landmarks: 'main search navigation complementary',
      headings: 'main-only h1 h2',

      // Highlight options
      highlightTarget: 'instant', // options: 'instant' (default), 'smooth' and 'auto'

      // Hidden heading when highlighting
      msgHidden: 'Heading is hidden',
      hiddenHeadingColor: '#000000',
      hiddenHeadingBackgroundColor: '#ffcc00',

      // Place holders for configuration
      colorTheme: '',
      fontFamily: '',
      fontSize: '',
      positionLeft: '',
      smallBreakPoint: '',
      mediumBreakPoint: '',
      menuTextColor: '',
      menuBackgroundColor: '',
      menuitemFocusTextColor: '',
      menuitemFocusBackgroundColor: '',
      focusBorderColor: '',
      buttonTextColor: '',
      buttonBackgroundColor: '',
      zIndex: '',
      zHighlight: ''
    };
  }

  static get observedAttributes() {
    return [
      "data-skipto",
      "setfocus",
      "type",
      "shortcuts"
      ];
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'data-skipto') {
      this.config = this.setupConfigFromDataAttribute(this.config, newValue);
    }

    if (name === 'type') {
      if (newValue === 'extension') {
        this.config.shortcuts = 'enabled';
      }
    }

    if (name === 'shortcuts') {
      if (newValue.trim().toLowerCase() === 'enable') {
        this.config.shortcuts = 'enabled';
      }
      else {
        this.config.shortcuts = 'disabled';
      }
    }

    if (name === 'setfocus') {
        switch(newValue) {
          case 'button':
            this.buttonSkipTo.closePopup();
            this.buttonSkipTo.buttonNode.focus();
            break;

          case 'menu':
            this.buttonSkipTo.openPopup();
            this.buttonSkipTo.setFocusToFirstMenuitem();
            break;

          case 'none':
            this.buttonSkipTo.closePopup();
            document.body.focus();
            break;
        }
    }
  }

  /*
   * @method init
   *
   * @desc Initializes the skipto button and menu with default and user
   *       defined options
   *
   * @param  {object} globalConfig - Reference to configuration object
   *                                 can be undefined
   */
  init(globalConfig=false) {
    if (!this.initialized) {
      this.initialized = true;
      if (globalConfig) {
        this.config = this.setupConfigFromGlobal(this.config, globalConfig);
      }

      // Check for data-skipto attribute values for configuration
      const configElem = document.querySelector('[data-skipto]');
      if (configElem) {
        const params = configElem.getAttribute('data-skipto');
        this.config  = this.setupConfigFromDataAttribute(this.config, params);
      }

      // Add skipto style sheet to document
      renderStyleElement(this.shadowRoot, this.config, this.skipToId, globalConfig);
      this.buttonSkipTo = new SkiptoMenuButton(this);

      // Add landmark and heading info to DOM elements for keyboard navigation
      // if using bookmarklet or extension
      if (!globalConfig) {
        getLandmarksAndHeadings(this.config, this.skipToId);
        monitorKeyboardFocus();
      }

    }

    this.setAttribute('focus', 'none');
  }

 /*
   * @method setupConfigFromGlobal
   *
   * @desc Get configuration information from author configuration to change
   *       default settings
   *
   * @param  {object}  config       - Javascript object with default configuration information
   * @param  {object}  globalConfig - Javascript object with configuration information oin a global variable
   */
  setupConfigFromGlobal(config, globalConfig) {
    let authorConfig = {};
    // Support version 4.1 configuration object structure
    // If found use it
    if ((typeof globalConfig.settings === 'object') &&
        (typeof globalConfig.settings.skipTo === 'object')) {
      authorConfig = globalConfig.settings.skipTo;
    }
    else {
      // Version 5.0 removes the requirement for the "settings" and "skipto" properties
      // to reduce the complexity of configuring skipto
      if (typeof globalConfig === 'object') {
        authorConfig = globalConfig;
      }
    }

    for (const name in authorConfig) {
      //overwrite values of our local config, based on the external config
      if ((typeof config[name] !== 'undefined') &&
         ((typeof authorConfig[name] === 'string') &&
          (authorConfig[name].length > 0 ) ||
         typeof authorConfig[name] === 'boolean')
        ) {
        config[name] = authorConfig[name];
      } else {
        console.warn('[SkipTo]: Unsupported or deprecated configuration option in global configuration object: ' + name);
      }
    }

    return config;
  }

  /*
   * @method setupConfigFromDataAttribute
   *
   * @desc Update configuration information from author configuration to change
   *       default settings
   *
   * @param  {Object}  config - Object with SkipTo.js configuration information
   * @param  {String}  params - String with configuration information
   */
  setupConfigFromDataAttribute(config, params) {
    let dataConfig = {};

    if (params) {
      const values = params.split(';');
      values.forEach( v => {
        const index = v.indexOf(':');
        let prop  = v.substring(0,index);
        let value = v.substring(index+1);
        if (prop) {
          prop = prop.trim();
        }
        if (value) {
          value = value.trim();
        }
        if (prop && value) {
          dataConfig[prop] = value;
        }
      });
    }

    for (const name in dataConfig) {
      //overwrite values of our local config, based on the external config
      if ((typeof config[name] !== 'undefined') &&
         ((typeof dataConfig[name] === 'string') &&
          (dataConfig[name].length > 0 ) ||
         typeof dataConfig[name] === 'boolean')
        ) {
        config[name] = dataConfig[name];
      } else {
        console.warn('[SkipTo]: Unsupported or deprecated configuration option in data-skipto attribute: ' + name);
      }
    }

    renderStyleElement(this.shadowRoot, config, this.skipToId);
    if (this.buttonSkipTo) {
      this.buttonSkipTo.updateLabels(config);
      this.buttonSkipTo.setDisplayOption(config['displayOption']);
    }

    return config;
  }

    /*
   * @method supportShortcuts
   *
   * @desc  Set suuportShortcuts configuration property
   *
   * @param  {Boolean}  value - If true support keyboard shortcuts, otherwise disable
   */
  supportShortcuts(value) {
    if (value) {
      this.config.shortcutsSupported = 'true';
      this.config.shortcuts = 'enabled';
    }
    else {
      this.config.shortcutsSupported = 'false';
      this.config.shortcuts = 'disabled';
    }
  }

}
