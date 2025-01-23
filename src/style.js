/* style.js */

/* Imports */
import {colorThemes} from './colorThemes.js';
import DebugLogging  from './debug.js';

import {
  SKIP_TO_ID,
  SKIP_TO_MENU_STYLE_ID
} from './constants.js';

/* Constants */
const debug = new DebugLogging('style', false);
debug.flag = false;

const cssMenuTemplate = document.createElement('template');
cssMenuTemplate.textContent = `
:root {
  color-scheme: light dark;
}

#${SKIP_TO_ID}.popup {
  top: -36px;
  transition: top 0.35s ease;
}

#${SKIP_TO_ID}.popup.show-border {
  top: -28px;
  transition: top 0.35s ease;
}

#${SKIP_TO_ID} button .skipto-text {
  padding: 6px 8px 6px 8px;
  display: inline-block;
}

#${SKIP_TO_ID} button .skipto-small {
  padding: 6px 8px 6px 8px;
  display: none;
}

#${SKIP_TO_ID} button .skipto-medium {
  padding: 6px 8px 6px 8px;
  display: none;
}

#${SKIP_TO_ID},
#${SKIP_TO_ID}.popup.focus,
#${SKIP_TO_ID}.popup:hover {
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

#${SKIP_TO_ID} button {
  position: sticky;
  margin: 0;
  padding: 0;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-radius: 0px 0px 6px 6px;
  border-color: light-dark($buttonBackgroundColor, $buttonBackgroundDarkColor);
  color: light-dark($buttonTextColor, $buttonTextDarkColor);
  background-color: light-dark($buttonBackgroundColor, $buttonBackgroundDarkColor);
  z-index: 100000 !important;
  font-family: $fontFamily;
  font-size: $fontSize;
  z-index: $zIndex !important;
  touch-action: none;
}

@media screen and (max-width: $smallBreakPointpx) {
  #${SKIP_TO_ID}:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: inline-block;
  }

  #${SKIP_TO_ID}:not(.popup) button .skipto-text,
  #${SKIP_TO_ID}:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }

  #${SKIP_TO_ID}:not(.popup).focus button .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  #${SKIP_TO_ID}:not(.popup).focus button .skipto-small,
  #${SKIP_TO_ID}:not(.popup).focus button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

@media screen and (min-width: $smallBreakPointpx) and (max-width: $mediumBreakPointpx) {
  #${SKIP_TO_ID}:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: inline-block;
  }

  #${SKIP_TO_ID}:not(.popup) button .skipto-text,
  #${SKIP_TO_ID}:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: none;
  }

  #${SKIP_TO_ID}:not(.popup).focus button .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  #${SKIP_TO_ID}:not(.popup).focus button .skipto-small,
  #${SKIP_TO_ID}:not(.popup).focus button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

#${SKIP_TO_ID}.static {
  position: absolute !important;
}


#${SKIP_TO_ID} [role="menu"] {
  position: absolute;
  min-width: 16em;
  display: none;
  margin: 0;
  padding: 0.25rem;
  background-color: light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  border-width: 2px;
  border-style: solid;
  border-color: light-dark($focusBorderColor, $focusBorderDarkColor);
  border-radius: 5px;
  z-index: $zIndex !important;
  touch-action: none;
}

#${SKIP_TO_ID} [role="group"] {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

#${SKIP_TO_ID} [role="group"].overflow {
  overflow-x: hidden;
  overflow-y: scroll;
}

#${SKIP_TO_ID} [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

#${SKIP_TO_ID} [role="menuitem"] {
  padding: 3px;
  width: auto;
  border-width: 0px;
  border-style: solid;
  color: light-dark($menuTextColor, $menuTextDarkColor);
  background-color: light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  display: grid;
  overflow-y: clip;
  grid-template-columns: repeat(6, 1.2rem) 1fr;
  grid-column-gap: 2px;
  font-size: 1em;
  z-index: $zIndex !important;  
}

#${SKIP_TO_ID} [role="menuitem"] .level,
#${SKIP_TO_ID} [role="menuitem"] .label {
  font-size: 100%;
  font-weight: normal;
  color: light-dark($menuTextColor, $menuTextDarkColor);
  background-color: light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  display: inline-block;
  line-height: inherit;
  display: inline-block;
  white-space: nowrap;
  border: none;
}

#${SKIP_TO_ID} [role="menuitem"] .level {
  text-align: right;
  padding-right: 4px;
}

#${SKIP_TO_ID} [role="menuitem"] .label {
  text-align: left;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

#${SKIP_TO_ID} [role="menuitem"] .level:first-letter,
#${SKIP_TO_ID} [role="menuitem"] .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}


#${SKIP_TO_ID} [role="menuitem"].skip-to-h1 .level { grid-column: 1; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h2 .level { grid-column: 2; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h3 .level { grid-column: 3; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h4 .level { grid-column: 4; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h5 .level { grid-column: 5; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h6 .level { grid-column: 6;}

#${SKIP_TO_ID} [role="menuitem"].skip-to-h1 .label { grid-column: 2 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h2 .label { grid-column: 3 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h3 .label { grid-column: 4 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h4 .label { grid-column: 5 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h5 .label { grid-column: 6 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h6 .label { grid-column: 7 / 8;}

#${SKIP_TO_ID} [role="menuitem"].skip-to-h1.no-level .label { grid-column: 1 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h2.no-level .label { grid-column: 2 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h3.no-level .label { grid-column: 3 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h4.no-level .label { grid-column: 4 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h5.no-level .label { grid-column: 5 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-h6.no-level .label { grid-column: 6 / 8; }

#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-1 .nesting { grid-column: 1; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-2 .nesting { grid-column: 2; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-3 .nesting { grid-column: 3; }

#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-1 .label { grid-column: 2 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-2 .label { grid-column: 3 / 8; }
#${SKIP_TO_ID} [role="menuitem"].skip-to-nesting-level-3 .label { grid-column: 4 / 8; }

#${SKIP_TO_ID} [role="menuitem"].no-items .label,
#${SKIP_TO_ID} [role="menuitem"].action .label {
  grid-column: 1 / 8;
}

#${SKIP_TO_ID} [role="separator"] {
  margin: 1px 0px 1px 0px;
  padding: 3px;
  display: block;
  width: auto;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: light-dark($menuTextColor, $menuTextDarkColor);
  background-color: light-dark($menuBackgroundColor, $menuBackgroundColor);
  color: light-dark($menuTextColor, $menuTextDarkColor);
  z-index: $zIndex !important;
}

#${SKIP_TO_ID} [role="separator"] .mofn {
  font-weight: normal;
  font-size: 85%;
}

#${SKIP_TO_ID} [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

#${SKIP_TO_ID} [role="menuitem"].last {
  border-radius: 0 0 5px 5px;
}

/* focus styling */

#${SKIP_TO_ID}.focus {
  display: block;
}

#${SKIP_TO_ID} button:focus,
#${SKIP_TO_ID} button:hover {
  background-color: light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  color: light-dark($menuTextColor, $menuTextDarkColor);
  outline: none;
  border-width: 0px 2px 2px 2px;
  border-color: light-dark($focusBorderColor, $focusBorderDarkColor);
}


#${SKIP_TO_ID} button:focus .skipto-text,
#${SKIP_TO_ID} button:hover .skipto-text,
#${SKIP_TO_ID} button:focus .skipto-small,
#${SKIP_TO_ID} button:hover .skipto-small,
#${SKIP_TO_ID} button:focus .skipto-medium,
#${SKIP_TO_ID} button:hover .skipto-medium {
  padding: 6px 7px 5px 7px;
}

#${SKIP_TO_ID} [role="menuitem"]:focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  border-color: light-dark($focusBorderColor, $focusBorderDarkColor);
  outline: none;
}

#${SKIP_TO_ID} [role="menuitem"].hover,
#${SKIP_TO_ID} [role="menuitem"].hover .level,
#${SKIP_TO_ID} [role="menuitem"].hover .label {
  background-color: light-dark($menuitemFocusBackgroundColor, $menuitemFocusBackgroundDarkColor);
  color: light-dark($menuitemFocusTextColor, $menuitemFocusTextDarkColor);
}

#${SKIP_TO_ID} [role="separator"].shortcuts-disabled,
#${SKIP_TO_ID} [role="menuitem"].shortcuts-disabled {
  display: none;
}

@media (forced-colors: active) {

  #${SKIP_TO_ID} button {
    border-color: ButtonBorder;
    color: ButtonText;
    background-color: ButtonFace;
  }

  #${SKIP_TO_ID} [role="menu"] {
    background-color: ButtonFace;
    border-color: ButtonText;
  }

  #${SKIP_TO_ID} [role="menuitem"] {
    color: ButtonText;
    background-color: ButtonFace;
  }

  #${SKIP_TO_ID} [role="menuitem"] .level,
  #${SKIP_TO_ID} [role="menuitem"] .label {
    color: ButtonText;
    background-color: ButtonFace;
  }

  #${SKIP_TO_ID} [role="separator"] {
    border-bottom-color: ButtonBorder;
    background-color: ButtonFace;
    color: ButtonText;
    z-index: $zIndex !important;
  }

  #${SKIP_TO_ID} button:focus,
  #${SKIP_TO_ID} button:hover {
    background-color: ButtonFace;
    color: ButtonText;
    border-color: ButtonBorder;
  }

  #${SKIP_TO_ID} [role="menuitem"]:focus {
    background-color: ButtonText;
    color: ButtonFace;
    border-color: ButtonBorder;
  }

  #${SKIP_TO_ID} [role="menuitem"].hover,
  #${SKIP_TO_ID} [role="menuitem"].hover .level,
  #${SKIP_TO_ID} [role="menuitem"].hover .label {
    background-color: ButtonText;
    color: ButtonFace;
  }

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
 * @param  {Object}  config        -  SkipTo.js configuration information object
 * @param  {Boolean} useURLTheme   -  When true use the theme associated with the URL
 *
 * @returns. see @desc
 */
function addCSSColors (cssMenu, config, useURLTheme=false) {
  const theme = useURLTheme ? getTheme(config.colorTheme) : {};
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
  cssMenu = updateStyle(cssMenu, '$menuTextDarkColor', config.menuTextDarkColor, theme.menuTextDarkColor, defaultTheme.menuTextDarkColor);
  cssMenu = updateStyle(cssMenu, '$menuBackgroundColor', config.menuBackgroundColor, theme.menuBackgroundColor, defaultTheme.menuBackgroundColor);
  cssMenu = updateStyle(cssMenu, '$menuBackgroundDarkColor', config.menuBackgroundDarkColor, theme.menuBackgroundDarkColor, defaultTheme.menuBackgroundDarkColor);

  cssMenu = updateStyle(cssMenu, '$menuitemFocusTextColor', config.menuitemFocusTextColor, theme.menuitemFocusTextColor, defaultTheme.menuitemFocusTextColor);
  cssMenu = updateStyle(cssMenu, '$menuitemFocusTextDarkColor', config.menuitemFocusTextDarkColor, theme.menuitemFocusTextDarkColor, defaultTheme.menuitemFocusTextDarkColor);
  cssMenu = updateStyle(cssMenu, '$menuitemFocusBackgroundColor', config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor, defaultTheme.menuitemFocusBackgroundColor);
  cssMenu = updateStyle(cssMenu, '$menuitemFocusBackgroundDarkColor', config.menuitemFocusBackgroundDarkColor, theme.menuitemFocusBackgroundDarkColor, defaultTheme.menuitemFocusBackgroundDarkColor);

  cssMenu = updateStyle(cssMenu, '$focusBorderColor', config.focusBorderColor, theme.focusBorderColor, defaultTheme.focusBorderColor);
  cssMenu = updateStyle(cssMenu, '$focusBorderDarkColor', config.focusBorderDarkColor, theme.focusBorderDarkColor, defaultTheme.focusBorderDarkColor);

  cssMenu = updateStyle(cssMenu, '$buttonTextColor', config.buttonTextColor, theme.buttonTextColor, defaultTheme.buttonTextColor);
  cssMenu = updateStyle(cssMenu, '$buttonTextDarkColor', config.buttonTextDarkColor, theme.buttonTextDarkColor, defaultTheme.buttonTextDarkColor);
  cssMenu = updateStyle(cssMenu, '$buttonBackgroundColor', config.buttonBackgroundColor, theme.buttonBackgroundColor, defaultTheme.buttonBackgroundColor);
  cssMenu = updateStyle(cssMenu, '$buttonBackgroundDarkColor', config.buttonBackgroundDarkColor, theme.buttonBackgroundDarkColor, defaultTheme.buttonBackgroundDarkColor);

  cssMenu = updateStyle(cssMenu, '$zIndex', config.zIndex, theme.zIndex, defaultTheme.zIndex);

  // Special case for theme configuration used in Illinois theme
  if (typeof theme.highlightTarget === 'string') {
    config.highlightTarget = theme.highlightTarget;
  }

  return cssMenu;

}

/*
 *   @function renderStyleElement
 *
 *   @desc  Updates the style sheet template and then attaches it to the document
 *
 * @param  {Object}  attachNode      - DOM element node to attach button and menu container element
 * @param  {Object}  config          -  Configuration information object
 * @param  {String}  skipYToStyleId  -  Id used for the skipto container element
 * @param  {Boolean} useURLTheme     - When true use the theme associated with the URL
 */
export default function renderStyleElement (attachNode, config, skipToId, useURLTheme=false) {
  let cssMenu = cssMenuTemplate.textContent.slice(0);

  cssMenu = addCSSColors(cssMenu, config, useURLTheme);

  let styleNode = attachNode.querySelector(`#${SKIP_TO_MENU_STYLE_ID}`);
  if (!styleNode) {
    styleNode = document.createElement('style');
    attachNode.appendChild(styleNode);
    styleNode.setAttribute('id', `${SKIP_TO_MENU_STYLE_ID}`);
  }
  styleNode.textContent = cssMenu;

}
