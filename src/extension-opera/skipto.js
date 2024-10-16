/* ========================================================================
 * Version: 5.6.3
 * Copyright (c) 2022, 2023, 2024 Jon Gunderson; Licensed BSD
 * Copyright (c) 2021 PayPal Accessibility Team and University of Illinois; Licensed BSD
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of PayPal or any of its subsidiaries or affiliates, nor the name of the University of Illinois, nor the names of any other contributors contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * CDN: https://skipto-landmarks-headings.github.io/page-script-5/dist/skipto.min.js
 * Documentation: https://skipto-landmarks-headings.github.io/page-script-5
 * Code: https://github.com/skipto-landmarks-headings/page-script-5
 * Report Issues: https://github.com/skipto-landmarks-headings/page-script-5/issues
 * ======================================================================== */

(function () {
  'use strict';

  /* colorThemes */

  const colorThemes = {
    'default': {

      fontFamily: 'inherit',
      fontSize: 'inherit',
      positionLeft: '46%',
      smallBreakPoint: '576',
      mediumBreakPoint: '992',
      buttonTextColor: '#13294b',
      buttonBackgroundColor: '#dddddd',
      focusBorderColor: '#c5050c',
      menuTextColor: '#13294b',
      menuBackgroundColor: '#dddddd',
      menuitemFocusTextColor: '#dddddd',
      menuitemFocusBackgroundColor: '#13294b',
      zIndex: '2000000',
      zHighlight: '1999900',
      displayOption: 'fixed'
    },
    'aria': {
      hostnameSelector: 'w3.org',
      pathnameSelector: 'ARIA/apg',
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
      hostnameSelector: 'illinois.edu',
      menuTextColor: '#00132c',
      menuBackgroundColor: '#cad9ef',
      menuitemFocusTextColor: '#eeeeee',
      menuitemFocusBackgroundColor: '#00132c',
      focusBorderColor: '#ff552e',
      buttonTextColor: '#444444',
      buttonBackgroundColor: '#dddede',
      highlightTarget: 'disabled'
    },
    'openweba11y': {
      hostnameSelector: 'openweba11y.com',
      buttonTextColor: '#13294B',
      buttonBackgroundColor: '#dddddd',
      focusBorderColor: '#C5050C',
      menuTextColor: '#13294B',
      menuBackgroundColor: '#dddddd',
      menuitemFocusTextColor: '#dddddd',
      menuitemFocusBackgroundColor: '#13294B',
      fontSize: '90%'
    },
    'skipto': {
      hostnameSelector: 'skipto-landmarks-headings.github.io',
      positionLeft: '25%',
      fontSize: '14px',
      menuTextColor: '#00132c',
      menuBackgroundColor: '#cad9ef',
      menuitemFocusTextColor: '#eeeeee',
      menuitemFocusBackgroundColor: '#00132c',
      focusBorderColor: '#ff552e',
      buttonTextColor: '#444444',
      buttonBackgroundColor: '#dddede',
    },
    'uic': {
      hostnameSelector: 'uic.edu',
      menuTextColor: '#001e62',
      menuBackgroundColor: '#f8f8f8',
      menuitemFocusTextColor: '#ffffff',
      menuitemFocusBackgroundColor: '#001e62',
      focusBorderColor: '#d50032',
      buttonTextColor: '#ffffff',
      buttonBackgroundColor: '#001e62',
    },
    'uillinois': {
      hostnameSelector: 'uillinois.edu',
      menuTextColor: '#001e62',
      menuBackgroundColor: '#e8e9ea',
      menuitemFocusTextColor: '#f8f8f8',
      menuitemFocusBackgroundColor: '#13294b',
      focusBorderColor: '#dd3403',
      buttonTextColor: '#e8e9ea',
      buttonBackgroundColor: '#13294b',
      highlightTarget: 'disabled'
    },
    'uis': {
      hostnameSelector: 'uis.edu',
      menuTextColor: '#036',
      menuBackgroundColor: '#fff',
      menuitemFocusTextColor: '#fff',
      menuitemFocusBackgroundColor: '#036',
      focusBorderColor: '#dd3444',
      buttonTextColor: '#fff',
      buttonBackgroundColor: '#036',
    },
    'walmart': {
      hostnameSelector: 'walmart.com',
      buttonTextColor: '#ffffff',
      buttonBackgroundColor: '#00419a',
      focusBorderColor: '#ffc220',
      menuTextColor: '#ffffff',
      menuBackgroundColor: '#0071dc',
      menuitemFocusTextColor: '#00419a',
      menuitemFocusBackgroundColor: '#ffffff',
    }
  };

  /*
  *   debug.js
  *
  *   Usage
  *     import DebugLogging from './debug.js';
  *     const debug = new DebugLogging('myLabel', true); // e.g. 'myModule'
  *     ...
  *     if (debug.flag) debug.log('myMessage');
  *
  *   Notes
  *     new DebugLogging() - calling the constructor with no arguments results
  *                   in debug.flag set to false and debug.label set to 'debug';
  *                   constructor accepts 0, 1 or 2 arguments in any order
  *                   @param flag [optional] {boolean} - sets debug.flag
  *                   @param label [optional] {string} - sets debug.label
  *   Properties
  *     debug.flag    {boolean} allows you to switch debug logging on or off;
  *                   default value is false
  *     debug.label   {string} rendered as a prefix to each log message;
  *                   default value is 'debug'
  *   Methods
  *     debug.log        calls console.log with label prefix and message
  *                      @param message {object} - console.log calls toString()
  *                      @param spaceAbove [optional] {boolean}
  *
  *     debug.tag        outputs tagName and textContent of DOM element
  *                      @param node {DOM node reference} - usually an HTMLElement
  *                      @param spaceAbove [optional] {boolean}
  *
  *     debug.separator  outputs only debug.label and a series of hyphens
  *                      @param spaceAbove [optional] {boolean}
  */

  class DebugLogging {
    constructor (...args) {
      // Default values for cases where fewer than two arguments are provided
      this._flag = false;
      this._label = 'debug';

      // The constructor may be called with zero, one or two arguments. If two
      // arguments, they can be in any order: one is assumed to be the boolean
      // value for '_flag' and the other one the string value for '_label'.
      for (const [index, arg] of args.entries()) {
        if (index < 2) {
          switch (typeof arg) {
            case 'boolean':
              this._flag = arg;
              break;
            case 'string':
              this._label = arg;
              break;
          }
        }
      }
    }

    get flag () { return this._flag; }

    set flag (value) {
      if (typeof value === 'boolean') {
        this._flag = value;
      }
    }

    get label () { return this._label; }

    set label (value) {
      if (typeof value === 'string') {
        this._label = value;
      }
    }

    log (message, spaceAbove) {
      const newline = spaceAbove ? '\n' : '';
      console.log(`${newline}[${this._label}] ${message}`);
    }

    tag (node, spaceAbove) {
      if (node && node.tagName) {
        const text = node.textContent.trim().replace(/\s+/g, ' ');
        this.log(`[${node.tagName}]: ${text.substring(0, 40)}`, spaceAbove);
      }
    }

    separator (spaceAbove) {
      this.log('-----------------------------', spaceAbove);
    }

  }

  /* style.js */

  /* Constants */
  const debug$8 = new DebugLogging('style', false);
  debug$8.flag = false;

  const cssMenuTemplate = document.createElement('template');
  cssMenuTemplate.textContent = `
$skipToId.popup {
  top: -36px;
  transition: top 0.35s ease;
}

$skipToId.popup.show-border {
  top: -28px;
  transition: top 0.35s ease;
}

$skipToId button .skipto-text {
  padding: 6px 8px 6px 8px;
  display: inline-block;
}

$skipToId button .skipto-small {
  padding: 6px 8px 6px 8px;
  display: none;
}

$skipToId button .skipto-medium {
  padding: 6px 8px 6px 8px;
  display: none;
}

$skipToId,
$skipToId.popup.focus,
$skipToId.popup:hover {
  position: fixed;
  top: 0;
  left: $positionLeft;
  font-family: $fontFamily;
  font-size: $fontSize;
  display: block;
  border: none;
  margin-bottom: 4px;
  transition: left 1s ease;
  z-index: $zIndex !important;
  user-select: none;
  touch-action: none;
}

$skipToId button {
  position: sticky;
  margin: 0;
  padding: 0;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-radius: 0px 0px 6px 6px;
  border-color: $buttonBackgroundColor;
  color: $buttonTextColor;
  background-color: $buttonBackgroundColor;
  z-index: 100000 !important;
  font-family: $fontFamily;
  font-size: $fontSize;
  z-index: $zIndex !important;
  touch-action: none;
}

@media screen and (max-width: $smallBreakPointpx) {
  $skipToId:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: inline-block;
  }

  $skipToId:not(.popup) button .skipto-text,
  $skipToId:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }

  $skipToId:not(.popup).focus button .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  $skipToId:not(.popup).focus button .skipto-small,
  $skipToId:not(.popup).focus button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

@media screen and (min-width: $smallBreakPointpx) and (max-width: $mediumBreakPointpx) {
  $skipToId:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: inline-block;
  }

  $skipToId:not(.popup) button .skipto-text,
  $skipToId:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: none;
  }

  $skipToId:not(.popup).focus button .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  $skipToId:not(.popup).focus button .skipto-small,
  $skipToId:not(.popup).focus button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

$skipToId.static {
  position: absolute !important;
}


$skipToId [role="menu"] {
  position: absolute;
  min-width: 17em;
  display: none;
  margin: 0;
  padding: 0.25rem;
  background-color: $menuBackgroundColor;
  border-width: 2px;
  border-style: solid;
  border-color: $focusBorderColor;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: $zIndex !important;
  touch-action: none;
}

$skipToId [role="group"] {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

$skipToId [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

$skipToId [role="menuitem"] {
  padding: 3px;
  width: auto;
  border-width: 0px;
  border-style: solid;
  color: $menuTextColor;
  background-color: $menuBackgroundColor;
  display: grid;
  overflow-y: clip;
  grid-template-columns: repeat(6, 1.2rem) 1fr;
  grid-column-gap: 2px;
  font-size: 1em;
  z-index: $zIndex !important;  
}

$skipToId [role="menuitem"] .level,
$skipToId [role="menuitem"] .label {
  font-size: 100%;
  font-weight: normal;
  color: $menuTextColor;
  background-color: $menuBackgroundColor;
  display: inline-block;
  line-height: inherit;
  display: inline-block;
  white-space: nowrap;
  border: none;
}

$skipToId [role="menuitem"] .level {
  text-align: right;
  padding-right: 4px;
}

$skipToId [role="menuitem"] .label {
  text-align: left;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

$skipToId [role="menuitem"] .level:first-letter,
$skipToId [role="menuitem"] .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}


$skipToId [role="menuitem"].skip-to-h1 .level { grid-column: 1; }
$skipToId [role="menuitem"].skip-to-h2 .level { grid-column: 2; }
$skipToId [role="menuitem"].skip-to-h3 .level { grid-column: 3; }
$skipToId [role="menuitem"].skip-to-h4 .level { grid-column: 4; }
$skipToId [role="menuitem"].skip-to-h5 .level { grid-column: 5; }
$skipToId [role="menuitem"].skip-to-h6 .level { grid-column: 6;}

$skipToId [role="menuitem"].skip-to-h1 .label { grid-column: 2 / 8; }
$skipToId [role="menuitem"].skip-to-h2 .label { grid-column: 3 / 8; }
$skipToId [role="menuitem"].skip-to-h3 .label { grid-column: 4 / 8; }
$skipToId [role="menuitem"].skip-to-h4 .label { grid-column: 5 / 8; }
$skipToId [role="menuitem"].skip-to-h5 .label { grid-column: 6 / 8; }
$skipToId [role="menuitem"].skip-to-h6 .label { grid-column: 7 / 8;}

$skipToId [role="menuitem"].skip-to-h1.no-level .label { grid-column: 1 / 8; }
$skipToId [role="menuitem"].skip-to-h2.no-level .label { grid-column: 2 / 8; }
$skipToId [role="menuitem"].skip-to-h3.no-level .label { grid-column: 3 / 8; }
$skipToId [role="menuitem"].skip-to-h4.no-level .label { grid-column: 4 / 8; }
$skipToId [role="menuitem"].skip-to-h5.no-level .label { grid-column: 5 / 8; }
$skipToId [role="menuitem"].skip-to-h6.no-level .label { grid-column: 6 / 8; }

$skipToId [role="menuitem"].skip-to-nesting-level-1 .nesting { grid-column: 1; }
$skipToId [role="menuitem"].skip-to-nesting-level-2 .nesting { grid-column: 2; }
$skipToId [role="menuitem"].skip-to-nesting-level-3 .nesting { grid-column: 3; }

$skipToId [role="menuitem"].skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
$skipToId [role="menuitem"].skip-to-nesting-level-1 .label { grid-column: 2 / 8; }
$skipToId [role="menuitem"].skip-to-nesting-level-2 .label { grid-column: 3 / 8; }
$skipToId [role="menuitem"].skip-to-nesting-level-3 .label { grid-column: 4 / 8; }

$skipToId [role="menuitem"].no-items .label,
$skipToId [role="menuitem"].action .label {
  grid-column: 1 / 8;
}

$skipToId [role="separator"] {
  margin: 1px 0px 1px 0px;
  padding: 3px;
  display: block;
  width: auto;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: $menuTextColor;
  background-color: $menuBackgroundColor;
  color: $menuTextColor;
  z-index: $zIndex !important;
}

$skipToId [role="separator"] .mofn {
  font-weight: normal;
  font-size: 85%;
}

$skipToId [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

$skipToId [role="menuitem"].last {
  border-radius: 0 0 5px 5px;
}

/* focus styling */

$skipToId.focus {
  display: block;
}

$skipToId button:focus,
$skipToId button:hover {
  background-color: $menuBackgroundColor;
  color: $menuTextColor;
  outline: none;
  border-width: 0px 2px 2px 2px;
  border-color: $focusBorderColor;
}


$skipToId button:focus .skipto-text,
$skipToId button:hover .skipto-text,
$skipToId button:focus .skipto-small,
$skipToId button:hover .skipto-small,
$skipToId button:focus .skipto-medium,
$skipToId button:hover .skipto-medium {
  padding: 6px 7px 5px 7px;
}

$skipToId [role="menuitem"]:focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  border-color: $focusBorderColor;
  outline: none;
}

$skipToId [role="menuitem"].hover,
$skipToId [role="menuitem"].hover .level,
$skipToId [role="menuitem"].hover .label {
  background-color: $menuitemFocusBackgroundColor;
  color: $menuitemFocusTextColor;
}
`;

  const cssHighlightTemplate = document.createElement('template');
  cssHighlightTemplate.textContent = `
$skipToId-overlay {
  margin: 0;
  padding: 0;
  position: absolute;
  border-radius: 3px;
  border: 4px solid $buttonBackgroundColor;
  box-sizing: border-box;
}

$skipToId-overlay div.overlay-border {
  margin: 0;
  padding: 0;
  position: relative;
  top: -2px;
  left: -2px;
  border-radius: 3px;
  border: 2px solid $focusBorderColor;
  z-index: $zHighlight;
  box-sizing: border-box;
}
`;

  /*
   *   @function getTheme
   *
   *   @desc Returns
   *
   *   @param  {String}  colorTheme   -  A string identifying a color theme  
   *
   *   @returns {Object}  see @desc
   */
  function getTheme(colorTheme) {
    if (typeof colorThemes[colorTheme] === 'object') {
      return colorThemes[colorTheme];
    }
    // if no theme defined, use urlSelectors
    let hostnameMatch = '';
    let pathnameMatch = '';
    let hostandpathnameMatch = '';

    const locationURL = new URL(location.href);
    const hostname = locationURL.hostname;
    const pathname = location.pathname;

    for (let item in colorThemes) {
      const hostnameSelector = colorThemes[item].hostnameSelector;
      const pathnameSelector = colorThemes[item].pathnameSelector;
      let hostnameFlag = false; 
      let pathnameFlag = false; 

      if (hostnameSelector) {
        if (hostname.indexOf(hostnameSelector) >= 0) {
          if (!hostnameMatch || 
              (colorThemes[hostnameMatch].hostnameSelector.length < hostnameSelector.length)) {
            hostnameMatch = item;
            hostnameFlag = true; 
            pathnameMatch = '';
          }
          else {
            // if the same hostname is used in another theme, set the hostnameFlas in case the pathname
            // matches
            if (colorThemes[hostnameMatch].hostnameSelector.length === hostnameSelector.length) {
              hostnameFlag = true;
            }
          }
        }
      }

      if (pathnameSelector) {
        if (pathname.indexOf(pathnameSelector) >= 0) {
          if (!pathnameMatch || 
              (colorThemes[pathnameMatch].pathnameSelector.length < pathnameSelector.length)) {
            pathnameMatch = item;
            pathnameFlag = true; 
          }
        }
      }

      if (hostnameFlag && pathnameFlag) {
        hostandpathnameMatch = item;
      }
    }

    if (hostandpathnameMatch) {
      return colorThemes[hostandpathnameMatch];      
    }
    else {
      if (hostnameMatch) {
        return colorThemes[hostnameMatch];      
      } else {
        if (pathnameMatch) {
          return colorThemes[pathnameMatch];      
        }
      }
    }

    // if no other theme is found use default theme
    return colorThemes['default'];
  }

  /*
   *   @function updateStyle
   *
   *   @desc  
   *
   *   @param 
   *
   *   @returns 
   */
  function updateStyle(cssContent, stylePlaceholder, configValue, themeValue, defaultValue) {
    let value = defaultValue;
    if (typeof configValue === 'string' && configValue) {
      value = configValue;
    } else {
      if (typeof themeValue === 'string' && themeValue) {
        value = themeValue;
      }
    }

    let index1 = cssContent.indexOf(stylePlaceholder);
    let index2 = index1 + stylePlaceholder.length;
    while (index1 >= 0 && index2 < cssContent.length) {
      cssContent = cssContent.substring(0, index1) + value + cssContent.substring(index2);
      index1 = cssContent.indexOf(stylePlaceholder, index2);
      index2 = index1 + stylePlaceholder.length;
    }
    return cssContent;
  }

  /*
   * @function addCSSColors
   *
   * @desc Updates the styling for the menu and highlight information
   *       and returns the updated strings
   *
   * @param  {String}  cssMenu       -  CSS template for the button and menu
   * @param  {String}  cssHighlight  -  CSS template for the highlighting
   * @param  {Object}  config        -  SkipTo.js configuration information object
   *
   * @returns. see @desc
   */
  function addCSSColors (cssMenu, cssHighlight, config) {
    const theme = getTheme(config.colorTheme);
    const defaultTheme = getTheme('default');

    // Check for display option in theme
    if ((typeof config.displayOption === 'string') &&
        (['popup-border', 'fixed', 'popup', 'static'].includes(config.displayOption.toLowerCase()) < 0)) {

      if ((typeof theme.displayOption === 'string') &&
          (['popup-border', 'fixed', 'popup', 'static'].includes(theme.displayOption.toLowerCase())>= 0)) {
        config.displayOption = theme.displayOption;
      }
      else {
        config.displayOption = defaultTheme.displayOption;
      }
    }

    cssMenu = updateStyle(cssMenu, '$fontFamily', config.fontFamily, theme.fontFamily, defaultTheme.fontFamily);
    cssMenu = updateStyle(cssMenu, '$fontSize', config.fontSize, theme.fontSize, defaultTheme.fontSize);

    cssMenu = updateStyle(cssMenu, '$positionLeft', config.positionLeft, theme.positionLeft, defaultTheme.positionLeft);
    cssMenu = updateStyle(cssMenu, '$smallBreakPoint', config.smallBreakPoint, theme.smallBreakPoint, defaultTheme.smallBreakPoint);
    cssMenu = updateStyle(cssMenu, '$mediumBreakPoint', config.mediumBreakPoint, theme.mediumBreakPoint, defaultTheme.mediumBreakPoint);

    cssMenu = updateStyle(cssMenu, '$menuTextColor', config.menuTextColor, theme.menuTextColor, defaultTheme.menuTextColor);
    cssMenu = updateStyle(cssMenu, '$menuBackgroundColor', config.menuBackgroundColor, theme.menuBackgroundColor, defaultTheme.menuBackgroundColor);

    cssMenu = updateStyle(cssMenu, '$menuitemFocusTextColor', config.menuitemFocusTextColor, theme.menuitemFocusTextColor, defaultTheme.menuitemFocusTextColor);
    cssMenu = updateStyle(cssMenu, '$menuitemFocusBackgroundColor', config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor, defaultTheme.menuitemFocusBackgroundColor);

    cssMenu = updateStyle(cssMenu, '$focusBorderColor', config.focusBorderColor, theme.focusBorderColor, defaultTheme.focusBorderColor);

    cssMenu = updateStyle(cssMenu, '$buttonTextColor', config.buttonTextColor, theme.buttonTextColor, defaultTheme.buttonTextColor);
    cssMenu = updateStyle(cssMenu, '$buttonBackgroundColor', config.buttonBackgroundColor, theme.buttonBackgroundColor, defaultTheme.buttonBackgroundColor);

    cssMenu = updateStyle(cssMenu, '$zIndex', config.zIndex, theme.zIndex, defaultTheme.zIndex);

    cssHighlight = updateStyle(cssHighlight, '$zHighlight', config.zHighlight, theme.zHighlight, defaultTheme.zHighlight);
    cssHighlight = updateStyle(cssHighlight, '$buttonBackgroundColor', config.buttonBackgroundColor, theme.buttonBackgroundColor, defaultTheme.buttonBackgroundColor);
    cssHighlight = updateStyle(cssHighlight, '$focusBorderColor', config.focusBorderColor, theme.focusBorderColor, defaultTheme.focusBorderColor);

    // Special case for theme configuration used in Illinois theme
    if (typeof theme.highlightTarget === 'string') {
      config.highlightTarget = theme.highlightTarget;
    }

    return [cssMenu, cssHighlight];

  }

  /*
   *   @function renderStyleElement
   *
   *   @desc  Updates the style sheet template and then attaches it to the document
   *
   * @param {Object}  attachNode      - DOM element node to attach button and menu container element
   * @param  {Object}  config          -  Configuration information object
   * @param  {String}  skipYToStyleId  -  Id used for the skipto container element
   */
  function renderStyleElement (attachNode, config, skipToId) {
    let cssMenu = cssMenuTemplate.textContent.slice(0);
    cssMenu = cssMenu.replaceAll('$skipToId', '#' + skipToId);

    let cssHighlight = cssHighlightTemplate.textContent.slice(0);
    cssHighlight = cssHighlight.replaceAll('$skipToId', '#' + skipToId);

    [cssMenu, cssHighlight] = addCSSColors(cssMenu, cssHighlight, config);


    let styleNode = attachNode.querySelector('#id-skip-to-style');
    if (!styleNode) {
      styleNode = document.createElement('style');
      attachNode.appendChild(styleNode);
      styleNode.setAttribute('id', 'id-skip-to-style');
    }
    styleNode.textContent = cssMenu;

    const headNode = document.querySelector('head');
    if (headNode) {
      let highlightStyleNode = headNode.querySelector('#id-skip-to-highlight');
      if (!highlightStyleNode) {
        highlightStyleNode = document.createElement('style');
        headNode.appendChild(highlightStyleNode);
        highlightStyleNode.setAttribute('id', 'id-skip-to-highlight');
      }
      highlightStyleNode.textContent = cssHighlight;
    }

  }

  /* utils.js */

  /* Constants */
  const debug$7 = new DebugLogging('Utils', false);
  debug$7.flag = false;


  /*
   * @function getAttributeValue
   * 
   * @desc Return attribute value if present on element,
   *       otherwise return empty string.
   *
   * @returns {String} see @desc
   */
  function getAttributeValue (element, attribute) {
    let value = element.getAttribute(attribute);
    return (value === null) ? '' : normalize(value);
  }

  /*
   * @function normalize
   *
   * @desc Trim leading and trailing whitespace and condense all
   *       internal sequences of whitespace to a single space. Adapted from
   *       Mozilla documentation on String.prototype.trim polyfill. Handles
   *       BOM and NBSP characters.
   *
   * @return {String}  see @desc
   */
  function normalize (s) {
    let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return s.replace(rtrim, '').replace(/\s+/g, ' ');
  }

  /**
   * @fuction isNotEmptyString
   *
   * @desc Returns true if the string has content, otherwise false
   *
   * @param {Boolean}  see @desc
   */
  function isNotEmptyString (str) {
    return (typeof str === 'string') && str.length && str.trim() && str !== "&nbsp;";
  }

  /**
   * @fuction isVisible
   *
   * @desc Returns true if the element is visible in the graphical rendering 
   *
   * @param {node}  elem  - DOM element node of a labelable element
   */
  function isVisible (element) {

    function isDisplayNone(el) {
      if (!el || (el.nodeType !== Node.ELEMENT_NODE)) {
        return false;
      }

      if (el.hasAttribute('hidden')) {
        return true;
      }

      const style = window.getComputedStyle(el, null);
      const display = style.getPropertyValue("display");
      if (display === 'none') { 
        return true;
      }

      // check ancestors for display none
      if (el.parentNode) {
        return isDisplayNone(el.parentNode);
      }

      return false;
    }

    const computedStyle = window.getComputedStyle(element);
    let visibility = computedStyle.getPropertyValue('visibility');
    if ((visibility === 'hidden') || (visibility === 'collapse')) {
      return false;
    }

    return !isDisplayNone(element);
  }

  /*
  *   namefrom.js
  */

  /* constants */

  const debug$6 = new DebugLogging('nameFrom', false);
  debug$6.flag = false;

  //
  // LOW-LEVEL HELPER FUNCTIONS (NOT EXPORTED)

  /*
  *   @function  isDisplayNone 
  *
  *   @desc Returns true if the element or parent element has set the CSS
  *         display property to none or has the hidden attribute,
  *         otherwise false
  *
  *   @param  {Object}  node  - a DOM node
  *
  *   @returns  {Boolean} see @desc 
  */

  function isDisplayNone (node) {

    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {

      if (node.hasAttribute('hidden')) {
        return true;
      }

      // aria-hidden attribute with the value "true" is an same as 
      // setting the hidden attribute for name calcuation
      if (node.hasAttribute('aria-hidden')) {
        if (node.getAttribute('aria-hidden').toLowerCase()  === 'true') {
          return true;
        }
      }

      const style = window.getComputedStyle(node, null);

      const display = style.getPropertyValue("display");

      if (display) {
        return display === 'none';
      }
    }
    return false;
  }

  /*
  *   @function isVisibilityHidden 
  *   
  *   @desc Returns true if the node (or it's parrent) has the CSS visibility 
  *         property set to "hidden" or "collapse", otherwise false
  *
  *   @param  {Object}   node  -  DOM node
  *
  *   @return  see @desc
  */

  function isVisibilityHidden(node) {

    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const style = window.getComputedStyle(node, null);

      const visibility = style.getPropertyValue("visibility");
      if (visibility) {
        return (visibility === 'hidden') || (visibility === 'collapse');
      }
    }
    return false;
  }

  /*
  *   @function isAriaHiddenFalse 
  *   
  *   @desc Returns true if the node has the aria-hidden property set to
  *         "false", otherwise false.  
  *         NOTE: This function is important in the accessible namce 
  *               calculation, since content hidden with a CSS technique 
  *               can be included in the accessible name calculation when 
  *               aria-hidden is set to false
  *
  *   @param  {Object}   node  -  DOM node
  *
  *   @return  see @desc
  */

  function isAriaHIddenFalse(node) {

    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return (node.hasAttribute('aria-hidden') && 
          (node.getAttribute('aria-hidden').toLowerCase() === 'false'));
    }

    return false;
  }

  /*
  *   @function includeContentInName 
  *   
  *   @desc Checks the CSS display and hidden properties, and
  *         the aria-hidden property to see if the content
  *         should be included in the accessible name
  *        calculation.  Returns true if it should be 
  *         included, otherwise false
  *
  *   @param  {Object}   node  -  DOM node
  *
  *   @return  see @desc
  */

  function includeContentInName(node) {
    const flag = isAriaHIddenFalse(node) || 
      (!isVisibilityHidden(node) && 
      !isDisplayNone(node));
    return flag;
  }

  /*
  *   @function getNodeContents
  *
  *   @desc  Recursively process element and text nodes by aggregating
  *          their text values for an ARIA accessible name or description
  *          calculation.
  *
  *          NOTE: This includes special handling of elements with 'alt' 
  *                text and embedded controls.
  *  
  *  @param {Object}  node  - A DOM node
  * 
  *  @return {String}  The text content for an accessible name or description
  */
  function getNodeContents (node) {
    let contents = '';
    let nc;
    let arr = [];

    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        // If aria-label is present, node recursion stops and
        // aria-label value is returned
        if (node.hasAttribute('aria-label')) {
          if (includeContentInName(node)) {
            contents = node.getAttribute('aria-label');
          }
        }
        else {
          if (node instanceof HTMLSlotElement) {
            // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ? node.assignedNodes() : node.assignedNodes({ flatten: true });
            assignedNodes.forEach( assignedNode => {
              nc = getNodeContents(assignedNode);
              if (nc.length) arr.push(nc);
            });
            contents = (arr.length) ? arr.join(' ') : '';
          } else {
            if (couldHaveAltText(node) && includeContentInName(node)) {
              contents = getAttributeValue(node, 'alt');
            }
            else {
              if (node.hasChildNodes()) {
                let children = Array.from(node.childNodes);
                children.forEach( child => {
                  nc = getNodeContents(child);
                  if (nc.length) arr.push(nc);
                });
                contents = (arr.length) ? arr.join(' ') : '';
              }
            }
            // For all branches of the ELEMENT_NODE case...
          }
        }
        contents = addCssGeneratedContent(node, contents);
        break;

      case Node.TEXT_NODE:
        if (includeContentInName(node)) {
          contents = normalize(node.textContent);
        }
        break;
    }

    return contents;
  }

  /*
  *   @function couldHaveAltText
  *   
  *   @desc  Based on HTML5 specification, returns true if 
  *          the element could have an 'alt' attribute,
  *          otherwise false.
  * 
  *   @param  {Object}  element  - DOM eleemnt node
  *
  *   @return {Boolean}  see @desc
  */
  function couldHaveAltText (element) {
    let tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'img':
      case 'area':
        return true;
      case 'input':
        return (element.type && element.type === 'image');
    }

    return false;
  }

  /*
  *   @function addCssGeneratedContent
  *
  *   @desc Adds CSS-generated content for pseudo-elements
  *         :before and :after. According to the CSS spec, test that content 
  *         value is other than the default computed value of 'none'.
  * 
  *         Note: Even if an author specifies content: 'none', because browsers 
  *               add the double-quote character to the beginning and end of 
  *               computed string values, the result cannot and will not be 
  *               equal to 'none'.
  *
  *
  *   @param {Object}  element   - DOM node element
  *   @param {String}  contents  - Text content for DOM node
  *
  *   @returns  {String}  see @desc
  *
  */
  function addCssGeneratedContent (element, contents) {

    let result = contents,
        prefix = getComputedStyle(element, ':before').content,
        suffix = getComputedStyle(element, ':after').content;

    if ((prefix[0] === '"') && !prefix.toLowerCase().includes('moz-')) {
      result = prefix.substring(1, (prefix.length-1)) + result;
    }

    if ((suffix[0] === '"') && !suffix.toLowerCase().includes('moz-')) {
      result = result + suffix.substring(1, (suffix.length-1)) ;
    }

    return result;
  }

  /* accName.js */

  /* Constants */
  const debug$5 = new DebugLogging('accName', false);
  debug$5.flag = false;

  /**
   *   @fuction getAccessibleName
   *
   *   @desc Returns the accessible name for an heading or landamrk 
   *
   *   @paramn {Object}   dom      - Document of the current element
   *   @param  {node}     element  - DOM element node for either a heading or
   *                               landmark
   *   @param  {Boolean}  fromContent  - if true will compute name from content
   * 
   *   @return {String} The accessible name for the landmark or heading element
   */

  function getAccessibleName (doc, element, fromContent=false) {
    let accName = '';

    accName = nameFromAttributeIdRefs(doc, element, 'aria-labelledby');

    if (accName === '' && element.hasAttribute('aria-label')) {
      accName =  element.getAttribute('aria-label').trim();
    }

    if (accName === '' && fromContent) {
      accName =  getNodeContents(element);
    }

    if (accName === '' && element.title.trim() !== '') {
      accName = element.title.trim();
    }

    return accName;
  }

  /*
  *   @function nameFromAttributeIdRefs
  *
  *   @desc Get the value of attrName on element (a space-
  *         separated list of IDREFs), visit each referenced element in the order it
  *         appears in the list and obtain its accessible name (skipping recursive
  *         aria-labelledby or aria-describedby calculations), and return an object
  *         with name property set to a string that is a space-separated concatena-
  *         tion of those results if any, otherwise return empty string.
  *
  *   @param {Object}  doc       -  Browser document object
  *   @param {Object}  element   -  DOM element node
  *   @param {String}  attribute -  Attribute name (e.g. "aria-labelledby", "aria-describedby",
  *                                 or "aria-errormessage")
  *
  *   @returns {String} see @desc 
  */
  function nameFromAttributeIdRefs (doc, element, attribute) {
    const value = getAttributeValue(element, attribute);
    const arr = [];

    if (value.length) {
      const idRefs = value.split(' ');

      for (let i = 0; i < idRefs.length; i++) {
        const refElement = doc.getElementById(idRefs[i]);
        if (refElement) {
          const accName = getNodeContents(refElement);
          if (accName && accName.length) arr.push(accName);
        }
      }
    }

    if (arr.length) {
      return arr.join(' ');
    }

    return '';
  }

  /* landmarksHeadings.js */

  /* Constants */
  const debug$4 = new DebugLogging('landmarksHeadings', false);
  debug$4.flag = false;

  const skipableElements = [
    'base',
    'content',
    'frame',
    'iframe',
    'input[type=hidden]',
    'link',
    'meta',
    'noscript',
    'script',
    'style',
    'template',
    'shadow',
    'title',
    'skip-to-content'
  ];

  const allowedLandmarkSelectors = [
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search'
  ];

  const higherLevelElements = [
  'article',
  'aside',
  'footer',
  'header',
  'main',
  'nav',
  'region',
  'section'
  ];


  let idIndex = 0;

  /*
   *   @function getSkipToIdIndex
   *
   *   @desc  Returns the current skipto index used for generating
   *          id for target elements
   *
   *   @returns  {Number} see @desc
   */ 
  function getSkipToIdIndex () {
    return idIndex;
  }

  /*
   *   @function incSkipToIdIndex
   *
   *   @desc  Adds one to the skipto index
   */ 
  function incSkipToIdIndex () {
    idIndex += 1;
  }

  /*
   *   @function isSkipableElement
   *
   *   @desc Returns true if the element is skipable, otherwise false
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isSkipableElement(element) {
      const tagName = element.tagName.toLowerCase();
      const type    = element.hasAttribute('type') ? element.getAttribute('type') : '';
      const elemSelector = (tagName === 'input') && type.length ? 
                              `${tagName}[type=${type}]` :
                              tagName;
      return skipableElements.includes(elemSelector);
  }

  /*
   *   @function isCustomElement
   *
   *   @desc  Reuturns true if the element is a custom element, otherwise
   *          false
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isCustomElement(element) {
    return element.tagName.indexOf('-') >= 0;
  }

  /*
   *   @function sSlotElement
   *
   *   @desc  Reuturns true if the element is a slot element, otherwise
   *          false
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isSlotElement(node) {
    return (node instanceof HTMLSlotElement);
  }

  /**
  *   @function isTopLevel
  *
  *   @desc Tests the node to see if it is in the content of any other
  *         elements with default landmark roles or is the descendant
  *         of an element with a defined landmark role
  *
  *   @param  {Object}  node  - Element node from a berowser DOM
  * 
  *   @reutrn {Boolean} Returns true if top level landmark, otherwise false
  */

  function isTopLevel (node) {
    node = node && node.parentNode;
    while (node && (node.nodeType === Node.ELEMENT_NODE)) {
      const tagName = node.tagName.toLowerCase();
      let role = node.getAttribute('role');
      if (role) {
        role = role.toLowerCase();
      }

      if (higherLevelElements.includes(tagName) ||
          allowedLandmarkSelectors.includes(role)) {
        return false;
      }
      node = node.parentNode;
    }
    return true;
  }  

  /*
   *   @function checkForLandmark
   *
   *   @desc  Re=trns the lamdnark name if a landmark, otherwise an
   *          empty string
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {String}  see @desc
   */ 
  function checkForLandmark (element) {
    if (element.hasAttribute('role')) {
      const role = element.getAttribute('role').toLowerCase();
      if (allowedLandmarkSelectors.indexOf(role) >= 0) {
        return role;
      }
    } else {
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case 'aside':
          return 'complementary';

        case 'main':
          return 'main';

        case 'nav':
          return 'navigation';

        case 'header':
          if (isTopLevel(element)) {
            return 'banner';
          }
          break;

        case 'footer':
          if (isTopLevel(element)) {
            return 'contentinfo';
          }
          break;

        case 'section':
          // Sections need an accessible name for be considered a "region" landmark
          if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
            return 'region';
          }
          break;
      }
    }
    return '';
  }


  /**
   * @function queryDOMForSkipToId
   *
   * @desc Returns DOM node associated with the id, if id not found returns null
   *
   * @param {String}  targetId  - dom node element to attach button and menu
   * 
   * @returns (Object) @desc
   */
  function queryDOMForSkipToId (targetId) {
    function transverseDOMForSkipToId(startingNode) {
      var targetNode = null;
      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.getAttribute('data-skip-to-id') === targetId) {
            return node;
          }
          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const assignedNodes = node.assignedNodes().length ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                  if (assignedNode.getAttribute('data-skip-to-id') === targetId) {
                    return assignedNode;
                  }
                  targetNode = transverseDOMForSkipToId(assignedNode);                    
                  if (targetNode) {
                    return targetNode;
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  targetNode = transverseDOMForSkipToId(node.shadowRoot);
                  if (targetNode) {
                    return targetNode;
                  }
                }
                else {
                  targetNode = transverseDOMForSkipToId(node);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              } else {
                targetNode = transverseDOMForSkipToId(node);
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          }
        } // end if
      } // end for
      return false;
    } // end function
    return transverseDOMForSkipToId(document.body);
  }

  /**
   * @function findVisibleElement
   *
   * @desc Returns the first visible descendant DOM node that matches a set of element tag names
   * 
   * @param {node}   startingNode  - dom node to start search for element
   * @param {Array}  tagNames      - Array of tag names
   * 
   * @returns (node} Returns first descendant element, if not found returns false
   */
  function findVisibleElement (startingNode, tagNames) {

    function transverseDOMForVisibleElement(startingNode, targetTagName) {
      var targetNode = null;
      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const assignedNodes = node.assignedNodes().length ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                  const tagName = assignedNode.tagName.toLowerCase();
                  if (tagName === targetTagName){
                    if (isVisible(assignedNode)) {
                      return assignedNode;
                    }
                  }
                  targetNode = transverseDOMForVisibleElement(assignedNode, targetTagName);  
                  if (targetNode) {
                    return targetNode;
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  targetNode = transverseDOMForVisibleElement(node.shadowRoot, targetTagName);
                  if (targetNode) {
                    return targetNode;
                  }
                }
                else {
                  targetNode = transverseDOMForVisibleElement(node, targetTagName);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              } else {
                const tagName = node.tagName.toLowerCase();
                if (tagName === targetTagName){
                  if (isVisible(node)) {
                    return node;
                  }
                }
                targetNode = transverseDOMForVisibleElement(node, targetTagName);
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          }
        } // end if
      } // end for
      return false;
    } // end function
    let targetNode = false;

    // Go through the tag names one at a time
    for (let i = 0; i < tagNames.length; i += 1) {
      targetNode = transverseDOMForVisibleElement(startingNode, tagNames[i]);
      if (targetNode) {
        break;
      }
    }
    return targetNode ? targetNode : startingNode;
  }

  /*
   *   @function skipToElement
   *
   *   @desc Moves focus to the element identified by the memu item
   *
   *   @param {Object}  menutim  -  DOM element in the menu identifying the target element.
   */ 
  function skipToElement(menuitem) {

    let focusNode = false;
    let scrollNode = false;
    let elem;

    const searchSelectors = ['input', 'button', 'a'];
    const navigationSelectors = ['a', 'input', 'button'];
    const landmarkSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'p', 'li', 'a'];

    const isLandmark = menuitem.classList.contains('landmark');
    const isSearch = menuitem.classList.contains('skip-to-search');
    const isNav = menuitem.classList.contains('skip-to-nav');

    elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));

    if (elem) {
      if (isSearch) {
        focusNode = findVisibleElement(elem, searchSelectors);
      }
      if (isNav) {
        focusNode = findVisibleElement(elem, navigationSelectors);
      }
      if (focusNode && isVisible(focusNode)) {
        if (focusNode.tabIndex >= 0) {
          focusNode.focus();
        } else {
          focusNode.tabIndex = 0;
          focusNode.focus();
          focusNode.tabIndex = -1;
        }
        focusNode.scrollIntoView({block: 'center'});
      }
      else {
        if (isLandmark) {
          scrollNode = findVisibleElement(elem, landmarkSelectors);
          if (scrollNode) {
            elem = scrollNode;
          }
        }
        if (elem.tabIndex >= 0) {
          elem.focus();
        } else {
          elem.tabIndex = 0;
          elem.focus();
          elem.tabIndex = -1;
        }
        elem.scrollIntoView({block: 'center'});
      }
    }
  }

  /*
   *   @function getHeadingTargets
   *
   *   @desc  Returns an array of heading tag names to include in menu
   *          NOTE: It uses "includes" method to maximimze compatibility with
   *          previous versions of SkipTo which used CSS selectors for 
   *          identifying targets.
   *
   *   @param {String}  targets  -  A space with the heading tags to inclucde
   *
   *   @returns {Array}  Array of heading element tag names to include in menu
   */ 
  function getHeadingTargets(targets) {
    let targetHeadings = [];
    ['h1','h2','h3','h4','h5','h6'].forEach( h => {
      if (targets.includes(h)) {
        targetHeadings.push(h);
      }
    });
    return targetHeadings;
  }

  /*
   *   @function isMain
   *
   *   @desc  Returns true if the element is a main landamrk
   *
   *   @param  {Object}  element  -  DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isMain (element) {
    const tagName = element.tagName.toLowerCase();
    const role = element.hasAttribute('role') ? element.getAttribute('role').toLowerCase() : '';
    return (tagName === 'main') || (role === 'main');
  }

  /*
   *   @function queryDOMForLandmarksAndHeadings
   *
   *   @desc  Recursive function to return two arrays, one an array of the DOM element nodes for 
   *          landmarks and the other an array of DOM element ndoes for headings  
   *
   *   @param  {Array}   landamrkTargets  -  An array of strings representing landmark regions
   *   @param  {Array}   headingTargets  -  An array of strings representing headings
   *   @param  {String}  skiptoId        -  An array of strings representing headings
   *
   *   @returns {Array}  @see @desc
   */ 
  function queryDOMForLandmarksAndHeadings (landmarkTargets, headingTargets, skiptoId) {
    let headingInfo = [];
    let landmarkInfo = [];
    let targetLandmarks = getLandmarkTargets(landmarkTargets.toLowerCase());
    let targetHeadings  = getHeadingTargets(headingTargets.toLowerCase());
    let onlyInMain = headingTargets.includes('main') || headingTargets.includes('main-only');

    function transverseDOM(startingNode, doc, parentDoc=null, inMain = false) {
      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          if ((targetLandmarks.indexOf(checkForLandmark(node)) >= 0) &&
              (node.id !== skiptoId)) {
            landmarkInfo.push({ node: node, name: getAccessibleName(doc, node)});
          }
          if (targetHeadings.indexOf(tagName) >= 0) {
            if (!onlyInMain || inMain) {
              headingInfo.push({ node: node, name: getAccessibleName(doc, node, true)});
            }
          }

          if (isMain(node)) {
            inMain = true;
          }

          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const slotContent   = node.assignedNodes().length > 0;
              const assignedNodes = slotContent ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              const nameDoc = slotContent ?
                              parentDoc :
                              doc;
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                  const tagName = assignedNodes[i].tagName.toLowerCase();
                  if (targetLandmarks.indexOf(checkForLandmark(assignedNode)) >= 0) {
                    landmarkInfo.push({ node: assignedNode, name: getAccessibleName(nameDoc, assignedNode)});
                  }

                  if (targetHeadings.indexOf(tagName) >= 0) {
                    if (!onlyInMain || inMain) {
                      headingInfo.push({ node: assignedNode, name: getAccessibleName(nameDoc, assignedNode, true)});
                    }
                  }
                  if (slotContent) {
                    transverseDOM(assignedNode, parentDoc, null, inMain);
                  } else {
                    transverseDOM(assignedNode, doc, parentDoc, inMain);                  
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  transverseDOM(node.shadowRoot, node.shadowRoot, doc, inMain);
                }
                else {
                  transverseDOM(node, doc, parentDoc, inMain);
                }
              } else {
                transverseDOM(node, doc, parentDoc, inMain);
              }
            }
          }
        } // end if
      } // end for
    } // end function

    transverseDOM(document.body, document);

    // If no elements found when onlyInMain is set, try 
    // to find any headings
    if ((headingInfo.length === 0) && onlyInMain) {
      onlyInMain = false;
      landmarkInfo = [];
      transverseDOM(document.body, document);
      if (headingInfo.length === 0) {
         console.warn(`[skipTo.js]: no headings found on page`);
      }
      else {
        console.warn(`[skipTo.js]: no headings found in main landmark, but ${headingInfo.length} found in page.`);
      }
    }

    if (landmarkInfo.length === 0) {
       console.warn(`[skipTo.js]: no landmarks found on page`);
    }


    return [landmarkInfo, headingInfo];
  }

  /*
   * @function getLandmarksAndHeadings
   *
   * @desc Returns two arrays of of DOM node elements with, one for landmark regions 
   *       the other for headings with additional information needed to create
   *       menuitems
   *
   * @param {Object} config  - Object with configuration information
   *
   * @return see @desc
   */

  function getLandmarksAndHeadings (config, skiptoId) {

    let landmarkTargets = config.landmarks;
    if (typeof landmarkTargets !== 'string') {
      console.warn(`[skipto.js]: Error in landmark configuration`);
      landmarkTargets = 'main search navigation';
    }

    let headingTargets = config.headings;
    // If targets undefined, use default settings
    if (typeof headingTargets !== 'string') {
      console.warn(`[skipto.js]: Error in heading configuration`);
      headingTargets = 'main-only h1 h2';
    }

    const [landmarks, headings] = queryDOMForLandmarksAndHeadings(landmarkTargets, headingTargets, skiptoId);

    return [getLandmarks(config, landmarks), getHeadings(config, headings)];
  }

  /*
   * @function getHeadings
   *
   * @desc Returns an array of heading menu elements
   *
   * @param {Object} config  - Object with configuration information
   * @param {Object} headings - Array of dome node elements that are headings
   *
   * @returns see @desc
   */
  function getHeadings (config, headings) {
    let dataId, level;
    let headingElementsArr = [];

    for (let i = 0, len = headings.length; i < len; i += 1) {
      let heading = headings[i];
      let role = heading.node.getAttribute('role');
      if ((typeof role === 'string') && (role === 'presentation')) continue;
      if (isVisible(heading.node) && isNotEmptyString(heading.node.textContent)) {
        if (heading.node.hasAttribute('data-skip-to-id')) {
          dataId = heading.node.getAttribute('data-skip-to-id');
        } else {
          dataId = getSkipToIdIndex();
          heading.node.setAttribute('data-skip-to-id', dataId);
        }
        level = heading.node.tagName.substring(1);
        const headingItem = {};
        headingItem.dataId = dataId.toString();
        headingItem.class = 'heading';
        headingItem.name = heading.name;
        headingItem.ariaLabel = headingItem.name + ', ';
        headingItem.ariaLabel += config.headingLevelLabel + ' ' + level;
        headingItem.tagName = heading.node.tagName.toLowerCase();
        headingItem.role = 'heading';
        headingItem.level = level;
        headingElementsArr.push(headingItem);
        incSkipToIdIndex();
      }
    }
    return headingElementsArr;
  }

  /*
   * @function getLocalizedLandmarkName
   *
   * @desc Localizes a landmark name and adds accessible name if defined
   *
   * @param {Object} config  - Object with configuration information
   * @param {String} tagName - String with landamrk and/or tag names
   * @param {String} AccName - Accessible name for therlandmark, maybe an empty string
   *
   * @returns {String}  A localized string for a landmark name
   */
  function getLocalizedLandmarkName (config, tagName, accName) {
    let n;
    switch (tagName) {
      case 'aside':
        n = config.asideLabel;
        break;
      case 'footer':
        n = config.footerLabel;
        break;
      case 'form':
        n = config.formLabel;
        break;
      case 'header':
        n = config.headerLabel;
        break;
      case 'main':
        n = config.mainLabel;
        break;
      case 'nav':
        n = config.navLabel;
        break;
      case 'section':
      case 'region':
        n = config.regionLabel;
        break;
      case 'search':
        n = config.searchLabel;
        break;
        // When an ID is used as a selector, assume for main content
      default:
        n = tagName;
        break;
    }
    if (isNotEmptyString(accName)) {
      n += ': ' + accName;
    }
    return n;
  }

  /*
   * @function getLandmarkTargets
   *
   * @desc Analyzes a configuration string for landmark and tag names
   *       NOTE: This function is included to maximize compatibility
   *             with configuration strings that use CSS selectors
   *             in previous versions of SkipTo
   *
   * @param {String} targets - String with landmark and/or tag names
   *
   * @returns {Array}  A normalized array of landmark names based on target configuration
   */
  function getLandmarkTargets (targets) {
    let targetLandmarks = [];
    targets = targets.toLowerCase();
    if (targets.includes('main')) {
      targetLandmarks.push('main');
    }
    if (targets.includes('search')) {
      targetLandmarks.push('search');
    }
    if (targets.includes('nav')) {
      targetLandmarks.push('navigation');
    }
    if (targets.includes('complementary') || 
        targets.includes('aside')) {
      targetLandmarks.push('complementary');
    }
    if (targets.includes('banner') || 
        targets.includes('header')) {
      targetLandmarks.push('banner');
    }
    if (targets.includes('contentinfo') || 
        targets.includes('footer')) {
      targetLandmarks.push('contentinfo');
    }
    if (targets.includes('region') || 
        targets.includes('section')) {
      targetLandmarks.push('region');
    }
    return targetLandmarks;
  }


  /*
   * @function getLandmarks
   *
   * @desc Returns an array of objects with information to build the 
   *       the landmarks menu, ordering in the array by the type of landmark
   *       region 
   *
   * @param {Object} config     - Object with configuration information
   * @param {Array}  landmarks  - Array of objects containing the DOM node and 
   *                              accessible name for landmarks
   *
   * @returns {Array}  see @desc
   */
  function getLandmarks(config, landmarks) {
    let allElements = [];
    let mainElements = [];
    let searchElements = [];
    let navElements = [];
    let asideElements = [];
    let footerElements = [];
    let regionElements = [];
    let otherElements = [];
    let dataId = '';
    for (let i = 0, len = landmarks.length; i < len; i += 1) {
      let landmark = landmarks[i];
      if (landmark.node.id === 'id-skip-to') {
         continue;
      }
      let role = landmark.node.getAttribute('role');
      let tagName = landmark.node.tagName.toLowerCase();
      if ((typeof role === 'string') && (role === 'presentation')) continue;
      if (isVisible(landmark.node)) {
        if (!role) role = tagName;
        // normalize tagNames
        switch (role) {
          case 'banner':
            tagName = 'header';
            break;
          case 'complementary':
            tagName = 'aside';
            break;
          case 'contentinfo':
            tagName = 'footer';
            break;
          case 'form':
            tagName = 'form';
            break;
          case 'main':
            tagName = 'main';
            break;
          case 'navigation':
            tagName = 'nav';
            break;
          case 'region':
            tagName = 'section';
            break;
          case 'search':
            tagName = 'search';
            break;
        }
        // if using ID for selectQuery give tagName as main
        if (['aside', 'footer', 'form', 'header', 'main', 'nav', 'section', 'search'].indexOf(tagName) < 0) {
          tagName = 'main';
        }
        if (landmark.node.hasAttribute('aria-roledescription')) {
          tagName = landmark.node.getAttribute('aria-roledescription').trim().replace(' ', '-');
        }
        if (landmark.node.hasAttribute('data-skip-to-id')) {
          dataId = landmark.node.getAttribute('data-skip-to-id');
        } else {
          dataId =  getSkipToIdIndex();
          landmark.node.setAttribute('data-skip-to-id', dataId);
        }
        const landmarkItem = {};
        landmarkItem.dataId = dataId.toString();
        landmarkItem.class = 'landmark';
        landmarkItem.hasName = landmark.name.length > 0;
        landmarkItem.name = getLocalizedLandmarkName(config, tagName, landmark.name);
        landmarkItem.tagName = tagName;
        landmarkItem.nestingLevel = 0;
        incSkipToIdIndex();

        allElements.push(landmarkItem);

        // For sorting landmarks into groups
        switch (tagName) {
          case 'main':
            mainElements.push(landmarkItem);
            break;
          case 'search':
            searchElements.push(landmarkItem);
            break;
          case 'nav':
            navElements.push(landmarkItem);
            break;
          case 'aside':
            asideElements.push(landmarkItem);
            break;
          case 'footer':
            footerElements.push(landmarkItem);
            break;
          case 'section':
            // Regions must have accessible name to be included
            if (landmarkItem.hasName) {
              regionElements.push(landmarkItem);
            }
            break;
          default:
            otherElements.push(landmarkItem);
            break;
        }
      }
    }
    if (config.landmarks.includes('doc-order')) {
      return allElements;
    }
    return [].concat(mainElements, searchElements, navElements, asideElements, regionElements, footerElements, otherElements);
  }

  /* highlight.js */

  /* Constants */
  const debug$3 = new DebugLogging('highlight', false);
  debug$3.flag = false;

  const minWidth = 68;
  const minHeight = 27;
  const offset = 6;
  const borderWidth = 2;

  const overlayId = 'id-skip-to-overlay';

  /*
   *   @function getOverlayElement
   *
   *   @desc  Returns DOM node for the overlay element
   *
   *   @returns {Object} see @desc
   */

  function getOverlayElement() {

    let overlayElem = document.getElementById(overlayId);

    if (overlayElem === null) {
      overlayElem = document.createElement('div');
      overlayElem.style.display = 'none';
      overlayElem.id = overlayId;
      document.body.appendChild(overlayElem);

      const overlayElemChild = document.createElement('div');
      overlayElemChild.className = 'overlay-border';
      overlayElem.appendChild(overlayElemChild);
    }

    return overlayElem;
  }

  /*
   *   @function isElementInViewport
   *
   *   @desc  Returns true if element is already visible in view port,
   *          otheriwse false
   *
   *   @param {Object} element : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  function isElementInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= window.screenY &&
        rect.left >= window.screenX &&
        rect.bottom <= ((window.screenY + window.innerHeight) || 
                        (window.screenY + document.documentElement.clientHeight)) &&
        rect.right <= ((window.screenX + window.innerWidth) || 
                       (window.screenX + document.documentElement.clientWidth))
    );
  }

  /*
   *   @function isElementStartInViewport
   *
   *   @desc  Returns true if start of the element is already visible in view port,
   *          otheriwse false
   *
   *   @param {Object} element : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  function isElementStartInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= window.screenY &&
        rect.top <= ((window.screenY + window.innerHeight) || 
                     (window.screenY + document.documentElement.clientHeight)) &&
        rect.left >= window.screenX &&
        rect.left <= ((window.screenX + window.innerWidth) || 
                     (window.screenX + document.documentElement.clientWidth))
    );
  }


  /*
   *   @function isElementHeightLarge
   *
   *   @desc  Returns true if element client height is larger than clientHeight,
   *          otheriwse false
   *
   *   @param {Object} element : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  function isElementInHeightLarge(element) {
    var rect = element.getBoundingClientRect();
    return (1.2 * rect.height) > (window.innerHeight || document.documentElement.clientHeight);
  }

  /*
   *   @function highlightElement
   *
   *   @desc  Highlights the element with the id on a page when highlighting
   *          is enabled (NOTE: Highlight is enabled by default)
   *
   *   @param {String} id               : id of the element to highlight
   *   @param {String} ihighlightTarget : value of highlight target
   */
  function highlightElement(id, highlightTarget) {
    const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const isReduced = !mediaQuery || mediaQuery.matches;
    const element = queryDOMForSkipToId(id);

    if (element && highlightTarget) {

      if (isElementInHeightLarge(element)) {
        if (!isElementStartInViewport(element)  && !isReduced) {
          element.scrollIntoView({ behavior: highlightTarget, block: 'start', inline: 'nearest' });
        }
      }
      else {
        if (!isElementInViewport(element)  && !isReduced) {
          element.scrollIntoView({ behavior: highlightTarget, block: 'start', inline: 'nearest' });
        }
      }

      const overlayElement = getOverlayElement();
      updateOverlayElement(overlayElement, element);
    }
  }

  /*
   *   @function removeHighlight
   *
   *   @desc  Hides the highlight element on the page
   */
  function removeHighlight() {
    const overlayElement = getOverlayElement();
    overlayElement.style.display = 'none';
  }

  /*
   *  @function  updateOverlayElement
   *
   *  @desc  Create an overlay element and set its position on the page.
   *
   *  @param  {Object}  overlayElem      -  DOM element for overlay
   *  @param  {Object}  element          -  DOM element node to highlight
   *
   */

  function updateOverlayElement (overlayElem, element) {

    const childElem = overlayElem.firstElementChild;

    const rect = element.getBoundingClientRect();

    const left   = rect.left > offset ?
                    Math.round(rect.left - offset + window.scrollX) :
                    Math.round(rect.left + window.scrollX);

    const width  = rect.left > offset ?
                    Math.max(rect.width  + offset * 2, minWidth) :
                    Math.max(rect.width, minWidth);

    const top    = rect.top > offset ?
                    Math.round(rect.top  - offset + window.scrollY) :
                    Math.round(rect.top + window.scrollY);

    const height = rect.top > offset ?
                    Math.max(rect.height + offset * 2, minHeight) :
                    Math.max(rect.height, minHeight);

    overlayElem.style.left   = left   + 'px';
    overlayElem.style.width  = width  + 'px';
    overlayElem.style.top    = top    + 'px';
    overlayElem.style.height = height + 'px';

    childElem.style.width  = (width  - 2 * borderWidth) + 'px';
    childElem.style.height = (height - 2 * borderWidth) + 'px';


    overlayElem.style.display = 'block';
  }

  /* skiptoMenuButton.js */

  /* Constants */
  const debug$2 = new DebugLogging('SkipToButton', false);
  debug$2.flag = false;

  /**
   * @class SkiptoMenuButton
   *
   * @desc Constructor for creating a button to open a menu of headings and landmarks on 
   *       a web page
   *
   * @param {Object}  skipToContentElem  -  The skip-to-content objecy
   * 
   * @returns {Object}  DOM element node that is the container for the button and the menu
   */
  class SkiptoMenuButton {

      constructor (skipToContentElem) {
        this.skipToContentElem = skipToContentElem;
        this.config     = skipToContentElem.config;
        this.skiptoId   = skipToContentElem.skipToId;

        // check for 'nav' element, if not use 'div' element
        const ce = this.config.containerElement.toLowerCase().trim() === 'nav' ? 'nav' : 'div';

        this.containerNode = document.createElement(ce);
        skipToContentElem.shadowRoot.appendChild(this.containerNode);

        this.containerNode.id = this.skiptoId;
        if (ce === 'nav') {
          this.containerNode.setAttribute('aria-label', this.config.buttonLabel);
        }
        if (isNotEmptyString(this.config.customClass)) {
          this.containerNode.classList.add(this.config.customClass);
        }

        this.setDisplayOption(this.config.displayOption);

        // Create button

        const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(this.config);

        this.buttonNode = document.createElement('button');
        this.buttonNode.setAttribute('aria-haspopup', 'menu');
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
        this.buttonNode.setAttribute('aria-controls', 'id-skip-to-menu');
        this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
        this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
        this.containerNode.appendChild(this.buttonNode);

        this.textButtonNode = document.createElement('span');
        this.buttonNode.appendChild(this.textButtonNode);
        this.textButtonNode.classList.add('skipto-text');
        this.textButtonNode.textContent = buttonVisibleLabel;

        this.smallButtonNode = document.createElement('span');
        this.buttonNode.appendChild(this.smallButtonNode);
        this.smallButtonNode.classList.add('skipto-small');
        this.smallButtonNode.textContent = this.config.smallButtonLabel;

        this.mediumButtonNode = document.createElement('span');
        this.buttonNode.appendChild(this.mediumButtonNode);
        this.mediumButtonNode.classList.add('skipto-medium');
        this.mediumButtonNode.textContent = this.config.buttonLabel;

        // Create menu container
        this.menuitemNodes = [];

        this.menuNode   = document.createElement('div');
        this.menuNode.setAttribute('id', 'id-skip-to-menu');
        this.menuNode.setAttribute('role', 'menu');
        this.menuNode.setAttribute('aria-label', this.config.menuLabel);
        this.containerNode.appendChild(this.menuNode);

        this.landmarkGroupLabelNode = document.createElement('div');
        this.landmarkGroupLabelNode.setAttribute('id', 'id-skip-to-menu-landmark-group-label');
        this.landmarkGroupLabelNode.setAttribute('role', 'separator');
        this.landmarkGroupLabelNode.textContent = this.config.landmarkGroupLabel;
        this.menuNode.appendChild(this.landmarkGroupLabelNode);

        this.landmarkGroupNode = document.createElement('div');
        this.landmarkGroupNode.setAttribute('id', 'id-skip-to-menu-landmark-group');
        this.landmarkGroupNode.setAttribute('role', 'group');
        this.landmarkGroupNode.setAttribute('aria-labelledby', 'id-skip-to-menu-landmark-group-label');
        this.menuNode.appendChild(this.landmarkGroupNode);

        this.headingGroupLabelNode = document.createElement('div');
        this.headingGroupLabelNode.setAttribute('id', 'id-skip-to-menu-heading-group-label');
        this.headingGroupLabelNode.setAttribute('role', 'separator');
        this.headingGroupLabelNode.textContent = this.config.headingGroupLabel;
        this.menuNode.appendChild(this.headingGroupLabelNode);

        this.headingGroupNode = document.createElement('div');
        this.headingGroupNode.setAttribute('id', 'id-skip-to-menu-heading-group');
        this.headingGroupNode.setAttribute('role', 'group');
        this.headingGroupNode.setAttribute('aria-labelledby', 'id-skip-to-menu-heading-group-label');
        this.menuNode.appendChild(this.headingGroupNode);

        this.containerNode.addEventListener('focusin', this.handleFocusin.bind(this));
        this.containerNode.addEventListener('focusout', this.handleFocusout.bind(this));
        this.containerNode.addEventListener('pointerdown', this.handleContinerPointerdown.bind(this), true);
        document.documentElement.addEventListener('pointerdown', this.handleBodyPointerdown.bind(this), true);

        if (this.usesAltKey || this.usesOptionKey) {
          document.addEventListener(
            'keydown',
            this.handleDocumentKeydown.bind(this)
          );
        }

        skipToContentElem.shadowRoot.appendChild(this.containerNode);

        this.focusMenuitem = null;
      }

      /*
       * @get highlightTarget
       *
       * @desc Returns normalized value for the highlightTarget option
       */
      get highlightTarget () {
        let value = this.config.highlightTarget.trim().toLowerCase();

        if ('enabled smooth'.includes(value)) {
          return 'smooth';
        }

        if (value === 'instant') {
          return 'instant';
        }

        return '';
      }

      /*
       * @method focusButton
       *
       * @desc Sets keyboard focus on the menu button
       */
      focusButton() {
        this.buttonNode.focus();
        this.skipToContentElem.setAttribute('focus', 'button');
      }


      /*
       * @method updateLabels
       *
       * @desc Updates labels, important for configuration changes in browser
       *       add-ons and extensions
       */
      updateLabels(config) {
        if (this.containerNode.hasAttribute('aria-label')) {
          this.containerNode.setAttribute('aria-label', config.buttonLabel);
        }

        const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(config);
        this.buttonNode.setAttribute('aria-label', buttonAriaLabel);

        this.textButtonNode.textContent = buttonVisibleLabel;
        this.smallButtonNode.textContent = config.smallButtonLabel;
        this.mediumButtonNode.textContent = config.buttonLabel;

        this.menuNode.setAttribute('aria-label', config.menuLabel);
        this.landmarkGroupLabelNode.textContent = config.landmarkGroupLabel;
        this.headingGroupLabelNode.textContent = config.headingGroupLabel;
      }

      /*
       * @method getBrowserSpecificShortcut
       *
       * @desc Identifies the operating system and updates labels for 
       *       shortcut key to use either the "alt" or the "option"
       *       label  
       *
       * @param {Object}  - SkipTp configure object
       *
       * @return {Array}  - An array of two strings used for the button label
       */
      getBrowserSpecificShortcut (config) {
        const platform =  navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();

        const hasWin    = platform.indexOf('win') >= 0;
        const hasMac    = platform.indexOf('mac') >= 0;
        const hasLinux  = platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;
        const hasAndroid = userAgent.indexOf('android') >= 0;

        this.usesAltKey = hasWin || (hasLinux && !hasAndroid);
        this.usesOptionKey = hasMac;

        let label = config.buttonLabel;
        let ariaLabel = config.buttonLabel;
        let buttonShortcut;

        // Check to make sure a shortcut key is defined
        if (config.altShortcut && config.optionShortcut) {
          if (this.usesAltKey || this.usesOptionKey) {
            buttonShortcut = config.buttonShortcut.replace(
              '$key',
              config.altShortcut
            );
          }
          if (this.usesAltKey) {
            buttonShortcut = buttonShortcut.replace(
              '$modifier',
              config.altLabel
            );
            label = label + buttonShortcut;
            ariaLabel = config.buttonAriaLabel.replace('$key', config.altShortcut);
            ariaLabel = ariaLabel.replace('$buttonLabel', config.buttonLabel);
            ariaLabel = ariaLabel.replace('$modifierLabel', config.altLabel);
            ariaLabel = ariaLabel.replace('$shortcutLabel', config.shortcutLabel);
          }

          if (this.usesOptionKey) {
            buttonShortcut = buttonShortcut.replace(
              '$modifier',
              config.optionLabel
            );
            label = label + buttonShortcut;
            ariaLabel = config.buttonAriaLabel.replace('$key', config.altShortcut);
            ariaLabel = ariaLabel.replace('$buttonLabel', config.buttonLabel);
            ariaLabel = ariaLabel.replace('$modifierLabel', config.optionLabel);
            ariaLabel = ariaLabel.replace('$shortcutLabel', config.shortcutLabel);
          }
        }
        return [label, ariaLabel];
      }

      /*
       * @method getFirstChar
       *
       * @desc Gets the first character in a menuitem to use as a shortcut key
       * 
       * @param  {Object}  menuitem  - DOM element node
       *
       * @returns {String} see @desc
       */
      getFirstChar(menuitem) {
        const label = menuitem.querySelector('.label');
        if (label && isNotEmptyString(label.textContent)) {
          return label.textContent.trim()[0].toLowerCase();
        }
        return '';
      }

      /*
       * @method getHeadingLevelFromAttribute
       *
       * @desc Returns the the heading level of the menu item
       * 
       * @param  {Object}  menuitem  - DOM element node
       *
       * @returns {String} see @desc
       */
      getHeadingLevelFromAttribute(menuitem) {
        if (menuitem.hasAttribute('data-level')) {
          return menuitem.getAttribute('data-level');
        }
        return '';
      }

      /*
       * @method updateKeyboardShortCuts
       *
       * @desc Updates the keyboard short cuts for the curent menu items
       */
      updateKeyboardShortCuts () {
        let mi;
        this.firstChars = [];
        this.headingLevels = [];

        for(let i = 0; i < this.menuitemNodes.length; i += 1) {
          mi = this.menuitemNodes[i];
          this.firstChars.push(this.getFirstChar(mi));
          this.headingLevels.push(this.getHeadingLevelFromAttribute(mi));
        }
      }

      /*
       * @method updateMenuitems
       *
       * @desc  Updates the menu information with the current menu items
       *        used for menu navigation commands
       */
      updateMenuitems () {
        let menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

        this.menuitemNodes = [];
        for(let i = 0; i < menuitemNodes.length; i += 1) {
          this.menuitemNodes.push(menuitemNodes[i]);
        }

        this.firstMenuitem = this.menuitemNodes[0];
        this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length-1];
        this.lastMenuitem.classList.add('last');
        this.updateKeyboardShortCuts();
      }

      /*
       * @method renderMenuitemToGroup
       *
       * @desc Renders a menuitem using an information object about the menuitem
       *
       * @param  {Object}  groupNode  -  DOM element node for the menu group
       * @param  {Object}  mi         - object with menuitem information
       */
      renderMenuitemToGroup (groupNode, mi) {
        let tagNode, tagNodeChild, labelNode, nestingNode;

        let menuitemNode = document.createElement('div');
        menuitemNode.setAttribute('role', 'menuitem');
        menuitemNode.classList.add(mi.class);
        if (isNotEmptyString(mi.tagName)) {
          menuitemNode.classList.add('skip-to-' + mi.tagName.toLowerCase());
        }
        menuitemNode.setAttribute('data-id', mi.dataId);
        menuitemNode.tabIndex = -1;
        if (isNotEmptyString(mi.ariaLabel)) {
          menuitemNode.setAttribute('aria-label', mi.ariaLabel);
        }

        // add event handlers
        menuitemNode.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
        menuitemNode.addEventListener('click', this.handleMenuitemClick.bind(this));
        menuitemNode.addEventListener('pointerenter', this.handleMenuitemPointerenter.bind(this));
        menuitemNode.addEventListener('pointerleave', this.handleMenuitemPointerleave.bind(this));
        menuitemNode.addEventListener('pointerover', this.handleMenuitemPointerover.bind(this));
        groupNode.appendChild(menuitemNode);

        // add heading level and label
        if (mi.class.includes('heading')) {
          if (this.config.enableHeadingLevelShortcuts) {
            tagNode = document.createElement('span');
            tagNodeChild = document.createElement('span');
            tagNodeChild.appendChild(document.createTextNode(mi.level));
            tagNode.append(tagNodeChild);
            tagNode.appendChild(document.createTextNode(')'));
            tagNode.classList.add('level');
            menuitemNode.append(tagNode);
          } else {
            menuitemNode.classList.add('no-level');
          }
          menuitemNode.setAttribute('data-level', mi.level);
          if (isNotEmptyString(mi.tagName)) {
            menuitemNode.classList.add('skip-to-' + mi.tagName);
          }
        }

        // add nesting level for landmarks
        if (mi.class.includes('landmark')) {
          menuitemNode.setAttribute('data-nesting', mi.nestingLevel);
          menuitemNode.classList.add('skip-to-nesting-level-' + mi.nestingLevel);

          if (mi.nestingLevel > 0 && (mi.nestingLevel > this.lastNestingLevel)) {
            nestingNode = document.createElement('span');
            nestingNode.classList.add('nesting');
            menuitemNode.append(nestingNode);
          }
          this.lastNestingLevel = mi.nestingLevel;
        }

        labelNode = document.createElement('span');
        labelNode.appendChild(document.createTextNode(mi.name));
        labelNode.classList.add('label');
        menuitemNode.append(labelNode);

        return menuitemNode;
      }

      /*
       * @method renderMenuitemsToGroup
       *
       * @desc Renders either the landmark region or headings menu group
       * 
       * @param  {Object}  groupNode       -  DOM element node for the menu group
       * @param  {Array}   menuitems       -  Array of objects with menu item information
       * @param  {String}  msgNoItesmFound -  Message to render if there are no menu items
       */
      renderMenuitemsToGroup(groupNode, menuitems, msgNoItemsFound) {
        // remove all child nodes
        while (groupNode.firstChild) {
          groupNode.removeChild(groupNode.firstChild);
        }

        this.lastNestingLevel = 0;

        if (menuitems.length === 0) {
          const item = {};
          item.name = msgNoItemsFound;
          item.tagName = '';
          item.class = 'no-items';
          item.dataId = '';
          this.renderMenuitemToGroup(groupNode, item);
        }
        else {
          for (let i = 0; i < menuitems.length; i += 1) {
              this.renderMenuitemToGroup(groupNode, menuitems[i]);
          }
        }
      }

      /*
       * @method renderMenu
       *
       * @desc 
       */
      renderMenu(config, skipToId) {
        // remove landmark menu items
        while (this.landmarkGroupNode.lastElementChild) {
          this.landmarkGroupNode.removeChild(this.landmarkGroupNode.lastElementChild);
        }
        // remove heading menu items
        while (this.headingGroupNode.lastElementChild) {
          this.headingGroupNode.removeChild(this.headingGroupNode.lastElementChild);
        }

        // Create landmarks group
        const [landmarkElements, headingElements] = getLandmarksAndHeadings(config, skipToId);

        this.renderMenuitemsToGroup(this.landmarkGroupNode, landmarkElements, config.msgNoLandmarksFound);
        this.renderMenuitemsToGroup(this.headingGroupNode,  headingElements, config.msgNoHeadingsFound);

        // Update list of menuitems
        this.updateMenuitems();
      }

  //
  // Menu scripting helper functions and event handlers
  //

      /*
       * @method setFocusToMenuitem
       *
       * @desc Moves focus to menu item
       *
       * @param {Object}  menuItem  - DOM element node used as a menu item
       */
      setFocusToMenuitem(menuitem) {
        if (menuitem) {
          this.removeHoverClass(menuitem);
          menuitem.classList.add('hover');
          menuitem.focus();
          this.skipToContentElem.setAttribute('focus', 'menu');
          this.focusMenuitem = menuitem;
          highlightElement(menuitem.getAttribute('data-id'), this.highlightTarget);
        }
      }

      /*
       * @method setFocusToFirstMenuitem
       *
       * @desc Moves focus to first menu item
       */
      setFocusToFirstMenuitem() {
        this.setFocusToMenuitem(this.firstMenuitem);
      }

      /*
       * @method setFocusToLastMenuitem
       *
       * @desc Moves focus to last menu item
       */
      setFocusToLastMenuitem() {
        this.setFocusToMenuitem(this.lastMenuitem);
      }

      /*
       * @method setFocusToPreviousMenuitem
       *
       * @desc Moves focus to previous menu item
       *
       * @param {Object}  menuItem  - DOM element node 
       */
      setFocusToPreviousMenuitem(menuitem) {
        let newMenuitem, index;
        if (menuitem === this.firstMenuitem) {
          newMenuitem = this.lastMenuitem;
        } else {
          index = this.menuitemNodes.indexOf(menuitem);
          newMenuitem = this.menuitemNodes[index - 1];
        }
        this.setFocusToMenuitem(newMenuitem);
        return newMenuitem;
      }

      /*
       * @method setFocusToNextMenuitem
       *
       * @desc Moves focus to next menu item
       *
       * @param {Object}  menuItem  - DOM element node 
       */
      setFocusToNextMenuitem(menuitem) {
        let newMenuitem, index;
        if (menuitem === this.lastMenuitem) {
          newMenuitem = this.firstMenuitem;
        } else {
          index = this.menuitemNodes.indexOf(menuitem);
          newMenuitem = this.menuitemNodes[index + 1];
        }
        this.setFocusToMenuitem(newMenuitem);
        return newMenuitem;
      }

      /*
       * @method setFocusByFirstCharacter
       *
       * @desc Moves focus to next menu item based on shortcut key
       *
       * @param {Object}  menuItem  - Starting DOM element node 
       * @param {String}  char      - Shortcut key to identify the
       *                              next menu item  
       */
      setFocusByFirstCharacter(menuitem, char) {
        let start, index;
        if (char.length > 1) {
          return;
        }
        char = char.toLowerCase();

        // Get start index for search based on position of currentItem
        start = this.menuitemNodes.indexOf(menuitem) + 1;
        if (start >= this.menuitemNodes.length) {
          start = 0;
        }

        // Check remaining items in the menu
        index = this.firstChars.indexOf(char, start);

        // If not found in remaining items, check headings
        if (index === -1) {
          index = this.headingLevels.indexOf(char, start);
        }

        // If not found in remaining items, check from beginning
        if (index === -1) {
          index = this.firstChars.indexOf(char, 0);
        }

        // If not found in remaining items, check headings from beginning
        if (index === -1) {
          index = this.headingLevels.indexOf(char, 0);
        }

        // If match was found...
        if (index > -1) {
          this.setFocusToMenuitem(this.menuitemNodes[index]);
        }
      }

      /*
       * @method getIndexFirstChars
       *
       * @desc  
       *
       * @returns {Number} 
       */
      getIndexFirstChars(startIndex, char) {
        for (let i = startIndex; i < this.firstChars.length; i += 1) {
          if (char === this.firstChars[i]) {
            return i;
          }
        }
        return -1;
      }

      /*
       * @method openPopup
       *
       * @desc Opens the menu of landmark regions and headings
       */
      openPopup() {
        debug$2.flag && debug$2.log(`[openPopup]`);
        this.menuNode.setAttribute('aria-busy', 'true');
        const h = (80 * window.innerHeight) / 100;
        this.menuNode.style.maxHeight = h + 'px';
        this.renderMenu(this.config, this.skipToId);
        this.menuNode.style.display = 'block';
        const buttonRect = this.buttonNode.getBoundingClientRect();
        const menuRect = this.menuNode.getBoundingClientRect();
        const diff = window.innerWidth - buttonRect.left - menuRect.width - 8;
        if (diff < 0) {
          if (buttonRect.left + diff < 0) {
            this.menuNode.style.left = (8 - buttonRect.left) + 'px';
          } else {
            this.menuNode.style.left = diff + 'px';
          }
        }
        this.menuNode.removeAttribute('aria-busy');
        this.buttonNode.setAttribute('aria-expanded', 'true');
        this.skipToContentElem.setAttribute('focus', 'menu');
      }

      /*
       * @method closePopup
       *
       * @desc Closes the memu of landmark regions and headings
       */
      closePopup() {
        debug$2.flag && debug$2.log(`[closePopup]`);
        if (this.isOpen()) {
          this.buttonNode.setAttribute('aria-expanded', 'false');
          this.menuNode.style.display = 'none';
          removeHighlight();
        }
      }

      /*
       * @method isOpen
       *
       * @desc Returns true if menu is open, otherwise false
       *
       * @returns {Boolean}  see @desc
       */
      isOpen() {
        return this.buttonNode.getAttribute('aria-expanded') === 'true';
      }

      /*
       * @method removeHoverClass
       *
       * @desc Removes hover class for menuitems
       */
      removeHoverClass(target=null) {
        this.menuitemNodes.forEach( node => {
          if (node !== target) {
            node.classList.remove('hover');
          }
        });
      }

      /*
       * @method getMenuitem
       *
       * @desc Returns menuitem dom node if pointer is over it
       *
       * @param {Number}   x: client x coordinator of pointer
       * @param {Number}   y: client y coordinator of pointer
       *
       * @return {object}  see @desc
       */
      getMenuitem(x, y) {
        for (let i = 0; i < this.menuitemNodes.length; i += 1) {
          const node = this.menuitemNodes[i];
          const rect = node.getBoundingClientRect();

          if ((rect.left <= x) &&
              (rect.right >= x) &&
              (rect.top <= y) &&
              (rect.bottom >= y)) {
                return node;
              }
        }
        return false;
      }

      /*
       * @method isOverButton
       *
       * @desc Returns true if pointer over button
       *
       * @param {Number}   x: client x coordinator of pointer
       * @param {Number}   y: client y coordinator of pointer
       *
       * @return {object}  see @desc
       */
      isOverButton(x, y) {
        const node = this.buttonNode;
        const rect = node.getBoundingClientRect();

        return (rect.left <= x) &&
               (rect.right >= x) &&
               (rect.top <= y) &&
               (rect.bottom >= y);
      }

      /*
       * @method isOverMenu
       *
       * @desc Returns true if pointer over the menu
       *
       * @param {Number}   x: client x coordinator of pointer
       * @param {Number}   y: client y coordinator of pointer
       *
       * @return {object}  see @desc
       */
      isOverMenu(x, y) {
        const node = this.menuNode;
        const rect = node.getBoundingClientRect();

        return (rect.left <= x) &&
               (rect.right >= x) &&
               (rect.top <= y) &&
               (rect.bottom >= y);
      }    

      /*
       * @method setDisplayOption
       *
       * @desc Set display option for button visibility wehn it does not
       *       have focus
       *
       * @param  {String}  value - String with configuration information
       */
      setDisplayOption(value) {

        if (typeof value === 'string') {
          value = value.trim().toLowerCase();
          if (value.length && this.containerNode) {

            this.containerNode.classList.remove('static');
            this.containerNode.classList.remove('popup');
            this.containerNode.classList.remove('show-border');

            switch (value) {
              case 'static':
                this.containerNode.classList.add('static');
                break;
              case 'onfocus':  // Legacy option
              case 'popup':
                this.containerNode.classList.add('popup');
                break;
              case 'popup-border':
                this.containerNode.classList.add('popup');
                this.containerNode.classList.add('show-border');
                break;
            }
          }
        }
      }


      // Menu event handlers
      
      handleFocusin() {
        this.containerNode.classList.add('focus');
        this.skipToContentElem.setAttribute('focus', 'button');
      }
      
      handleFocusout() {
        this.containerNode.classList.remove('focus');
        this.skipToContentElem.setAttribute('focus', 'none');
      }
      
      handleButtonKeydown(event) {
        let key = event.key,
          flag = false;
        switch (key) {
          case ' ':
          case 'Enter':
          case 'ArrowDown':
          case 'Down':
            this.openPopup();
            this.setFocusToFirstMenuitem();
            flag = true;
            break;
          case 'Esc':
          case 'Escape':
            this.closePopup();
            this.buttonNode.focus();
            this.skipToContentElem.setAttribute('focus', 'button');
            flag = true;
            break;
          case 'Up':
          case 'ArrowUp':
            this.openPopup();
            this.setFocusToLastMenuitem();
            flag = true;
            break;
        }
        if (flag) {
          event.stopPropagation();
          event.preventDefault();
        }
      }

      handleButtonClick(event) {
        debug$2.flag && debug$2.log(`[handleButtonClick]`);
        if (this.isOpen()) {
          this.closePopup();
          this.buttonNode.focus();
          this.skipToContentElem.setAttribute('focus', 'button');
        } else {
          this.openPopup();
          this.setFocusToFirstMenuitem();
        }
        event.stopPropagation();
        event.preventDefault();
      }

      handleDocumentKeydown (event) {

        const enabledInputTypes = [
          'button',
          'checkbox',
          'color',
          'file',
          'image',
          'radio',
          'range',
          'reset',
          'submit'
        ];

        const target = event.target;
        const tagName = target.tagName ? target.tagName.toLowerCase() : '';
        const type = tagName === 'input' ? target.type.toLowerCase() : '';

        if ((tagName !== 'textarea') &&
            ((tagName !== 'input') ||
             ((tagName === 'input') && enabledInputTypes.includes(type))
            )) {

          const altPressed =
            this.usesAltKey &&
            event.altKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.metaKey;

          const optionPressed =
            this.usesOptionKey &&
            event.altKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.metaKey;

          if ((optionPressed && this.config.optionShortcut === event.key) ||
              (altPressed && this.config.altShortcut === event.key) ||
              ((optionPressed || altPressed) && (48 === event.keyCode))
          ) {
            this.openPopup();
            this.setFocusToFirstMenuitem();
            event.stopPropagation();
            event.preventDefault();
          }
        }
      }    

      handleMenuitemAction(tgt) {
        switch (tgt.getAttribute('data-id')) {
          case '':
            // this means there were no headings or landmarks in the list
            break;

          default:
            this.closePopup();
            skipToElement(tgt);
            break;
        }
      }

      handleMenuitemKeydown(event) {
        let tgt = event.currentTarget,
          key = event.key,
          flag = false;

        function isPrintableCharacter(str) {
          return str.length === 1 && str.match(/\S/);
        }
        if (event.ctrlKey || event.altKey || event.metaKey) {
          return;
        }
        if (event.shiftKey) {
          if (isPrintableCharacter(key)) {
            this.setFocusByFirstCharacter(tgt, key);
            flag = true;
          }
          if (event.key === 'Tab') {
            this.closePopup();
            this.buttonNode.focus();
            this.skipToContentElem.setAttribute('focus', 'button');
            flag = true;
          }
        } else {
          switch (key) {
            case 'Enter':
            case ' ':
              this.handleMenuitemAction(tgt);
              flag = true;
              break;
            case 'Esc':
            case 'Escape':
              this.closePopup();
              this.buttonNode.focus();
              this.skipToContentElem.setAttribute('focus', 'button');
              flag = true;
              break;
            case 'Up':
            case 'ArrowUp':
              this.setFocusToPreviousMenuitem(tgt);
              flag = true;
              break;
            case 'ArrowDown':
            case 'Down':
              this.setFocusToNextMenuitem(tgt);
              flag = true;
              break;
            case 'Home':
            case 'PageUp':
              this.setFocusToFirstMenuitem();
              flag = true;
              break;
            case 'End':
            case 'PageDown':
              this.setFocusToLastMenuitem();
              flag = true;
              break;
            case 'Tab':
              this.closePopup();
              break;
            default:
              if (isPrintableCharacter(key)) {
                this.setFocusByFirstCharacter(tgt, key);
                flag = true;
              }
              break;
          }
        }
        if (flag) {
          event.stopPropagation();
          event.preventDefault();
        }
      }

      handleMenuitemClick(event) {
        this.handleMenuitemAction(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
      }

      handleMenuitemPointerenter(event) {
        debug$2.flag && debug$2.log(`[enter]`);
        let tgt = event.currentTarget;
        tgt.classList.add('hover');
        highlightElement(tgt.getAttribute('data-id'), this.highlightTarget);
        event.stopPropagation();
        event.preventDefault();
      }

     handleMenuitemPointerover(event) {
        debug$2.flag && debug$2.log(`[over]`);
        let tgt = event.currentTarget;
        highlightElement(tgt.getAttribute('data-id'), this.highlightTarget);
        event.stopPropagation();
        event.preventDefault();
      }

      handleMenuitemPointerleave(event) {
        debug$2.flag && debug$2.log(`[leave]`);
        let tgt = event.currentTarget;
        tgt.classList.remove('hover');
        event.stopPropagation();
        event.preventDefault();
      }

      handleContinerPointerdown(event) {
        debug$2.flag && debug$2.log(`[down]: target: ${event.pointerId}`);

        if (this.isOverButton(event.clientX, event.clientY)) {
          this.containerNode.releasePointerCapture(event.pointerId);
        }
        else {
          this.containerNode.setPointerCapture(event.pointerId);
          this.containerNode.addEventListener('pointermove', this.handleContinerPointermove.bind(this));
          this.containerNode.addEventListener('pointerup', this.handleContinerPointerup.bind(this));

          if (this.containerNode.contains(event.target)) {
            if (this.isOpen()) {
              if (!this.isOverMenu(event.clientX, event.clientY)) {
                debug$2.flag && debug$2.log(`[down][close]`);
                this.closePopup();
                this.buttonNode.focus();
                this.skipToContentElem.setAttribute('focus', 'button');
              }
            }
            else {
              debug$2.flag && debug$2.log(`[down][open]`);
              this.openPopup();          
              this.setFocusToFirstMenuitem();
            }

          }
        }

        event.stopPropagation();
        event.preventDefault();
      }

      handleContinerPointermove(event) {
        const mi = this.getMenuitem(event.clientX, event.clientY);
        if (mi) {
          this.removeHoverClass(mi);
          mi.classList.add('hover');
          highlightElement(mi.getAttribute('data-id'), this.highlightTarget);
        }

        event.stopPropagation();
        event.preventDefault();
      }

      handleContinerPointerup(event) {

        this.containerNode.releasePointerCapture(event.pointerId);
        this.containerNode.removeEventListener('pointermove', this.handleContinerPointermove);
        this.containerNode.removeEventListener('pointerup', this.handleContinerPointerup);

        const mi = this.getMenuitem(event.clientX, event.clientY);
        const omb = this.isOverButton(event.clientX, event.clientY);
        debug$2.flag && debug$2.log(`[up] isOverButton: ${omb} getMenuitem: ${mi} id: ${event.pointerId}`);

        if (mi) {
          this.handleMenuitemAction(mi);          
        }
        else {
          if (!omb) {
            debug$2.flag && debug$2.log(`[up] not over button `);
            if (this.isOpen()) {
              debug$2.flag && debug$2.log(`[up] close `);
              this.closePopup();
              this.buttonNode.focus();
              this.skipToContentElem.setAttribute('focus', 'button');
            }        
          }
        }

        event.stopPropagation();
        event.preventDefault();
      }

      handleBodyPointerdown(event) {
        debug$2.flag && debug$2.log(`[handleBodyPointerdown]: target: ${event.pointerId}`);

        if (!this.isOverButton(event.clientX, event.clientY) &&
            !this.isOverMenu(event.clientX, event.clientY)) {
          this.closePopup();
        }
      }


  }

  /* skiptoContent.js */

  /* constants */
  const debug$1 = new DebugLogging('skiptoContent', false);
  debug$1.flag = false;


  class SkipToContent extends HTMLElement {

    constructor() {
      // Always call super first in constructor
      super();
      this.attachShadow({ mode: 'open' });
      this.skipToId = 'id-skip-to';
      this.version = "5.6.3";
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
        headings: 'main-only h1 h2',

        // Highlight options
        highlightTarget: 'instant', // options: 'instant' (default), 'smooth' and 'auto'

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
        "setfocus"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data-skipto') {
        this.config = this.setupConfigFromDataAttribute(this.config, newValue);
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
        renderStyleElement(this.shadowRoot, this.config, this.skipToId);
        this.buttonSkipTo = new SkiptoMenuButton(this);
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


  }

  /* skipto.js */

  /* constants */
  const debug = new DebugLogging('skipto', false);
  debug.flag = false;

  (function() {

    /*
    *  @function removeLegacySkipToJS
    *
    *  @desc Removes legacy and duplicate versions of SkipTo.js
    */

    function removeLegacySkipToJS(skipToContentElem = null) {
      const node = document.getElementById('id-skip-to');
      debug.flag && debug.log(`[removeLegacySkipToJS]: ${node}`);
      if (node !== null) {
        // remove legacy SkipTo.js
        node.remove();
        const cssNode = document.getElementById('id-skip-to-css');
        if (cssNode) {
          cssNode.remove();
        }
        console.warn('[skipTo.js] legacy version removed, using SkipTo.js extension');
      }
      const nodes = document.querySelectorAll('skip-to-content');
      if (nodes && nodes.length > 1) {
        debug.flag && debug.log(`[removeLegacySkipToJS][${nodes.length}]: Removing duplicate copy of SkipTo.js`);
        for (let i = 0; i <nodes.length; i += 1) {
          const stcNode = nodes[i];
          if (stcNode !== skipToContentElem) {
            stcNode.remove();
            console.warn('[skipTo.js] duplicate version removed');
          }
        }
      }
    }

    /*
    *. @function getSkipToContentElement
    *
    * @desc  Creates and add a skip-to-content element in the page
    *
    * @returns  Returns dom node of new element or false if the page
    *           has a legacy SkipTo.js
    */
    function getSkipToContentElement() {

      if (document.getElementById('id-skip-to')) {
        removeLegacySkipToJS();
      }

      let skipToContentElem = document.querySelector(`skip-to-content`);

      if (!skipToContentElem) {
        window.customElements.define("skip-to-content", SkipToContent);
        skipToContentElem = document.createElement('skip-to-content');
        skipToContentElem.setAttribute('version', skipToContentElem.version);
        // always attach SkipToContent element to body
        if (document.body) {
          document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
        }
      }
      return skipToContentElem;
    }

    // Check for SkipTo.js bookmarklet script, if it is initialize it immediately
    if (document.getElementById(`id-skip-to-bookmarklet`)) {
      debug.flag && debug.log(`[bookmarklet]`);
      const skipToContentElem = getSkipToContentElement();
      if (skipToContentElem) {
        skipToContentElem.init();
        skipToContentElem.buttonSkipTo.openPopup();
        skipToContentElem.buttonSkipTo.setFocusToFirstMenuitem();
      }
    }
    else {
      if (document.getElementById(`id-skip-to-extension`)) {
        debug.flag && debug.log(`[extension]`);
        const skipToContentElem = getSkipToContentElement();
        if (skipToContentElem) {
          skipToContentElem.init();
          window.addEventListener('load', function() {
            debug.flag && debug.log(`[onload][extension][elem]: ${skipToContentElem}`);
            removeLegacySkipToJS(skipToContentElem);
          });
        }
      }
      else {
        // Initialize SkipTo.js menu button with onload event
        window.addEventListener('load', function() {
          debug.flag && debug.log(`[onload][script]`);
          const skipToContentElem = getSkipToContentElement();
          if (skipToContentElem) {
            debug.flag && debug.log(`[onload][script][elem]: ${skipToContentElem}`);
            skipToContentElem.init(window.SkipToConfig);
          }
        });
      }
    }
  })();

})();
