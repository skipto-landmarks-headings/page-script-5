/* style.js */

/* Imports */
import {colorThemes} from './colorThemes.js';
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('style', false);
debug.flag = false;

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

$skipToId [role="separator"].shortcuts-disabled,
$skipToId [role="menuitem"].shortcuts-disabled {
  display: none;
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
  pointer-events:none;
}

$skipToId-overlay .overlay-border {
  margin: 0;
  padding: 0;
  position: relative;
  top: -2px;
  left: -2px;
  border-radius: 3px 3px 3px 3px;
  border: 2px solid $focusBorderColor;
  z-index: $zHighlight;
  box-sizing: border-box;
  pointer-events:none;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

$skipToId-overlay .overlay-border.skip-to-hidden {
  background-color: $hiddenHeadingBackgroundColor;
  color: $hiddenHeadingColor;
  font-style: italic;
  font-weight: bold;
  font-size: 0.9em;
  text-align: center;
  padding: .25em;
  animation: fadeIn 1.5s;
}

$skipToId-overlay .overlay-border.hasInfoBottom {
  border-radius: 3px 3px 3px 0;
}

$skipToId-overlay .overlay-border.hasInfoTop {
  border-radius: 0 3px 3px 3px;
}

$skipToId-overlay .overlay-info {
  position: relative;
  text-align: left;
  left: -2px;
  padding: 1px 4px;
  border: 2px solid $focusBorderColor;
  background-color: $menuitemFocusBackgroundColor;
  color: $menuitemFocusTextColor;
  z-index: $zHighlight;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events:none;
}

$skipToId-overlay .overlay-info.hasInfoTop {
  border-radius: 3px 3px 0 0;
}

$skipToId-overlay .overlay-info.hasInfoBottom {
  border-radius: 0 0 3px 3px;
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
 * @param  {Boolean} useURLTheme   -  When true use the theme associated with the URL
 *
 * @returns. see @desc
 */
function addCSSColors (cssMenu, cssHighlight, config, useURLTheme=false) {
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
  cssHighlight = updateStyle(cssHighlight, '$menuitemFocusTextColor', config.menuitemFocusTextColor, theme.menuitemFocusTextColor, defaultTheme.menuitemFocusTextColor);
  cssHighlight = updateStyle(cssHighlight, '$menuitemFocusBackgroundColor', config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor, defaultTheme.menuitemFocusBackgroundColor);
  cssHighlight = updateStyle(cssHighlight, '$hiddenHeadingColor', config.hiddenHeadingColor, theme.hiddenHeadingColor, defaultTheme.hiddenHeadingColor);
  cssHighlight = updateStyle(cssHighlight, '$hiddenHeadingBackgroundColor', config.hiddenHeadingBackgroundColor, theme.hiddenHeadingBackgroundColor, defaultTheme.hiddenHeadingBackgroundColor);

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
 * @param  {Object}  attachNode      - DOM element node to attach button and menu container element
 * @param  {Object}  config          -  Configuration information object
 * @param  {String}  skipYToStyleId  -  Id used for the skipto container element
 * @param  {Boolean} useURLTheme     - When true use the theme associated with the URL
 */
export default function renderStyleElement (attachNode, config, skipToId, useURLTheme=false) {
  let cssMenu = cssMenuTemplate.textContent.slice(0);
  cssMenu = cssMenu.replaceAll('$skipToId', '#' + skipToId);

  let cssHighlight = cssHighlightTemplate.textContent.slice(0);
  cssHighlight = cssHighlight.replaceAll('$skipToId', '#' + skipToId);

  [cssMenu, cssHighlight] = addCSSColors(cssMenu, cssHighlight, config, useURLTheme);


  let styleNode = attachNode.querySelector('#id-skip-to-style');
  if (!styleNode) {
    styleNode = document.createElement('style');
    attachNode.appendChild(styleNode);
    styleNode.setAttribute('id', 'id-skip-to-style');
  }
  styleNode.textContent = cssMenu;

  const headNode = document.querySelector('head');
  if (headNode) {
    let highlightStyleNode = headNode.querySelector('#id-skip-to-highlight-style');
    if (!highlightStyleNode) {
      highlightStyleNode = document.createElement('style');
      headNode.appendChild(highlightStyleNode);
      highlightStyleNode.setAttribute('id', 'id-skip-to-highlight-style');
    }
    highlightStyleNode.textContent = cssHighlight;
  }

}
