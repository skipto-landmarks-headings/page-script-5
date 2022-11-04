/* ========================================================================
* Copyright (c) <2022> (ver 5.x) Jon Gunderson
* Copyright (c) <2021> (ver 4.x) University of Illinois and PayPal
* All rights reserved.
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of PayPal or any of its subsidiaries or affiliates, nor the name of the University of Illinois, nor the names of any other contributors contributors may be used to endorse or promote products derived from this software without specific prior written permission.
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

import renderStyleElement from './style.js';
import SkiptoMenuButton from './skiptoMenuButton.js';

(function() {
  'use strict';

  const SkipTo = {
    skipToId: 'id-skip-to-js-50',
    skipToMenuId: 'id-skip-to-menu-50',
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
      attachElement: 'header',
      displayOption: 'static', // options: static (default), popup
      // container element, use containerClass for custom styling
      containerElement: 'div',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      buttonLabel: 'Skip To Content',
      altLabel: 'Alt',
      optionLabel: 'Option',
      buttonShortcut: ' ($modifier+$key)',
      altButtonAriaLabel: 'Skip To Content, shortcut Alt plus $key',
      optionButtonAriaLabel: 'Skip To Content, shortcut Option plus $key',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkGroupLabel: 'Landmarks',
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
      headings: 'main h1 h2 h3',

      // Custom CSS position and colors
      colorTheme: '',
      fontFamily: '',
      fontSize: '',
      positionLeft: '',
      mediaBreakPoint: '540',
      menuTextColor: '',
      menuBackgroundColor: '',
      menuitemFocusTextColor: '',
      menuitemFocusBackgroundColor: '',
      focusBorderColor: '',
      buttonTextColor: '',
      buttonBackgroundColor: '',

      // Deprecated configuration options, that are ignored during initialization
      // These are included for compatibility with older configuration objects
      // They are included so an error is not thrown during initialization
      buttonTitle: '',
      buttonTitleWithAccesskey: '',
      enableActions: false,
      actionGroupLabel: '',
      actionShowHeadingsHelp: '',
      actionShowSelectedHeadingsLabel: '',
      actionShowAllHeadingsLabel: '',
      actionShowLandmarksHelp: '',
      actionShowSelectedLandmarksLabel: '',
      actionShowAllLandmarksLabel: '',
      actionShowSelectedHeadingsAriaLabel: '',
      actionShowAllHeadingsAriaLabel: '',
      actionShowSelectedLandmarksAriaLabel: '',
      actionShowAllLandmarksAriaLabel: '',
    },
    colorThemes: {
      'default': {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        positionLeft: '46%',
        menuTextColor: '#1a1a1a',
        menuBackgroundColor: '#dcdcdc',
        menuitemFocusTextColor: '#eeeeee',
        menuitemFocusBackgroundColor: '#1a1a1a',
        focusBorderColor: '#1a1a1a',
        buttonTextColor: '#1a1a1a',
        buttonBackgroundColor: '#eeeeee',
      },
      'aria': {
        fontFamily: 'sans-serif',
        fontSize: '10pt',
        positionLeft: '7%',
        menuTextColor: '#000',
        menuBackgroundColor: '#def',
        menuitemFocusTextColor: '#fff',
        menuitemFocusBackgroundColor: '#005a9c',
        focusBorderColor: '#005a9c',
        buttonTextColor: '#005a9c',
        buttonBackgroundColor: '#ddd',
      },
      'illinois': {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        positionLeft: '46%',
        menuTextColor: '#00132c',
        menuBackgroundColor: '#cad9ef',
        menuitemFocusTextColor: '#eeeeee',
        menuitemFocusBackgroundColor: '#00132c',
        focusBorderColor: '#ff552e',
        buttonTextColor: '#444444',
        buttonBackgroundColor: '#dddede',
      }
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
    init: function(config) {
      let node;

      // Check if skipto is already loaded
      if (document.querySelector('style#' + this.skipToId)) {
        return;
      }

      let attachElement = document.body;
      if (config) {
        this.setupConfig(config);
      }
      if (typeof this.config.attachElement === 'string') {
        node = document.querySelector(this.config.attachElement);
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          attachElement = node;
        }
      }
      // Add skipto style sheet to document
      renderStyleElement(this.colorThemes, this.config, this.skipToId);

      new SkiptoMenuButton(attachElement, this.config);


    },

    /*
     * @method setupConfig
     *
     * @desc Get configuration information from user configuration to change 
     *       default settings 
     *
     * @param  {object}  appConfig - Javascript object with configuration information
     */
    setupConfig: function(appConfig) {
      let appConfigSettings;
      // Support version 4.1 configuration object structure 
      // If found use it
      if ((typeof appConfig.settings === 'object') && 
          (typeof appConfig.settings.skipTo === 'object')) {
        appConfigSettings = appConfig.settings.skipTo;
      }
      else {
        // Version 5.0 removes the requirement for the "settings" and "skipto" properties
        // to reduce the complexity of configuring skipto
        if ((typeof appConfig === 'undefined') || 
             (typeof appConfig !== 'object')) {
          appConfigSettings = {};
        }
        else {
          appConfigSettings = appConfig;
        }
      }

      for (const name in appConfigSettings) {
        //overwrite values of our local config, based on the external config
        if ((typeof this.config[name] !== 'undefined') &&
           ((typeof appConfigSettings[name] === 'string') &&
            (appConfigSettings[name].length > 0 ) ||
           typeof appConfigSettings[name] === 'boolean')
          ) {
          this.config[name] = appConfigSettings[name];
        } else {
          console.warn('[SkipTo]: Unsuported or deprecated configuration option "' + name + '".');
        }
      }
    }
  };

  // Initialize skipto menu button with onload event
  window.addEventListener('load', function() {
    SkipTo.init(window.SkipToConfig ||
                ((typeof window.Joomla === 'object' && typeof window.Joomla.getOptions === 'function') ? window.Joomla.getOptions('skipto-settings', {}) : {})
                );
  });
})();
