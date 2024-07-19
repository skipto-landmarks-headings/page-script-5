import renderStyleElement from './style.js';
import SkiptoMenuButton from './skiptoMenuButton.js';

import DebugLogging  from './debug.js';

/* constants */
const debug = new DebugLogging('skipto', false);
debug.flag = true;

(function() {
  'use strict';

  const SkipTo = {
    skipToId: 'id-skip-to',
    domNode: null,
    buttonNode: null,
    menuNode: null,
    menuitemNodes: [],
    firstMenuitem: false,
    lastMenuitem: false,
    firstChars: [],
    headingLevels: [],
    skipToIdIndex: 1,
    // Default configuration values
    config: {
      // Feature switches
      enableHeadingLevelShortcuts: true,

      // Customization of button and menu
      altShortcut: '0', // default shortcut key is the number zero
      optionShortcut: 'º', // default shortcut key character associated with option+0 on mac 
      attachElement: 'body',
      displayOption: 'fixed', // options: static, popup, fixed (default)
      // container element, use containerClass for custom styling
      containerElement: 'nav',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      buttonLabel: 'Skip To Content',
      smallButtonLabel: 'SkipTo',
      altLabel: 'Alt',
      optionLabel: 'Option',
      buttonShortcut: ' ($modifier+$key)',
      altButtonAriaLabel: 'Skip To Content, shortcut Alt plus $key',
      optionButtonAriaLabel: 'Skip To Content, shortcut Option plus $key',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkGroupLabel: 'Landmark Regions',
      headingGroupLabel: 'Headings',
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
      headings: 'main h1 h2',

      // Highlight options
      highlightTarget: 'enabled', // options: 'enabled' (default) and 'disabled'

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
    },

    /*
     * @method init
     *
     * @desc Initializes the skipto button and menu with default and user 
     *       defined options
     *
     * @param  {object} config - Reference to configuration object
     *                           can be undefined
     */
    init: function(globalConfig) {
      let node;

      // Check if skipto is already loaded
      if (document.skipToHasBeenLoaded) {
        console.warn('[skipTo.js] Skipto is already loaded!');
        return;
      }

      document.skipToHasBeenLoaded = true;

      let attachElement = document.body;

      if (globalConfig) {
        this.config = this.setupConfigFromGlobal(this.config, globalConfig);
      }

      this.config = this.setupConfigFromDataAttribute(this.config);

      if (typeof this.config.attachElement === 'string') {
        node = document.querySelector(this.config.attachElement);
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          attachElement = node;
        }
      }
      // Add skipto style sheet to document
      renderStyleElement(this.config, this.skipToId);

      new SkiptoMenuButton(attachElement, this.config, this.skipToId);
    },

    /*
     * @method setupConfigFromGlobal
     *
     * @desc Get configuration information from author configuration to change
     *       default settings 
     *
     * @param  {object}  config       - Javascript object with default configuration information
     * @param  {object}  globalConfig - Javascript object with configuration information oin a global variable
     */
    setupConfigFromGlobal: function(config, globalConfig) {
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
    },

    /*
     * @method setupConfigFromDataAttribute
     *
     * @desc Get configuration information from author configuration to change
     *       default settings
     *
     * @param  {object}  config - Javascript object with default configuration information
     */
    setupConfigFromDataAttribute: function(config) {
      let dataConfig = {};

      // Check for data-skipto attribute values for configuration
      const configElem = document.querySelector('[data-skipto]');
      if (configElem) {
        const dataSkiptoValue = configElem.getAttribute('data-skipto');
        if (dataSkiptoValue) {
          const values = dataSkiptoValue.split(';');
          values.forEach( v => {
            let [prop, value] = v.split(':');
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
      return config;

    }
  };

  // Check for SkipTo.js bookmarklet script, if it is initialize it immediately
  if (document.getElementById(`id-skip-to-bookmarklet`)) {
    SkipTo.init(window.SkipToConfig);
  }
  else {
    // Initialize skipto menu button with onload event
    window.addEventListener('load', function() {
      SkipTo.init(window.SkipToConfig);
    });
  }

})();
