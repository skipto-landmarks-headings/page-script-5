/* style.js */

/* Imports */
import {colorThemes} from './colorThemes.js';
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('style', false);
debug.flag = false;

const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = `
<style type="text/css" id="id-skip-to-css">
$skipToId.popup {
  top: -30px;
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

  $skipToId.popup {
    top: -26px;
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

  $skipToId.popup {
    top: -28px;
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
$skipToId [role="menuitem"].skip-to-h6 .level { grid-column: 8;}

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

$skipToId-highlight {
  position: absolute;
  border-radius: 3px;
  border: 4px solid $buttonBackgroundColor;
}

$skipToId-highlight div {
  position: relative;
  top: -3px;
  left: -3px;
  border-radius: 3px;
  border: 2px dashed $focusBorderColor;
  z-index: $zHighlight;
}

</style>
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

    debug.log(`${hostname} ${hostnameSelector} ${hostname.indexOf(hostnameSelector)}`);

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
function updateStyle(stylePlaceholder, configValue, themeValue, defaultValue) {
  let value = defaultValue;
  if (typeof configValue === 'string' && configValue) {
    value = configValue;
  } else {
    if (typeof themeValue === 'string' && themeValue) {
      value = themeValue;
    }
  }

  let cssContent = styleTemplate.innerHTML;
  let index1 = cssContent.indexOf(stylePlaceholder);
  let index2 = index1 + stylePlaceholder.length;
  while (index1 >= 0 && index2 < cssContent.length) {
    cssContent = cssContent.substring(0, index1) + value + cssContent.substring(index2);
    index1 = cssContent.indexOf(stylePlaceholder, index2);
    index2 = index1 + stylePlaceholder.length;
  }
  styleTemplate.innerHTML = cssContent;
}

/*
 * @function addCSSColors
 *
 * @desc Updates the styling information in the attached
 *       stylesheet to use the configured or default colors  
 *
 * @param  {Object}  config      -  Configuration information object
 */
function addCSSColors (config) {
  const theme = getTheme(config.colorTheme);
  const defaultTheme = getTheme('default');

  // Check for display option in theme
  if ((typeof theme.displayOption === 'string') && 
      ('fixed popup static'.indexOf(theme.displayOption.toLowerCase())>= 0)) {
    config.displayOption = theme.displayOption;
  }

  updateStyle('$fontFamily', config.fontFamily, theme.fontFamily, defaultTheme.fontFamily);
  updateStyle('$fontSize', config.fontSize, theme.fontSize, defaultTheme.fontSize);

  updateStyle('$positionLeft', config.positionLeft, theme.positionLeft, defaultTheme.positionLeft);
  updateStyle('$smallBreakPoint', config.smallBreakPoint, theme.smallBreakPoint, defaultTheme.smallBreakPoint);
  updateStyle('$mediumBreakPoint', config.mediumBreakPoint, theme.mediumBreakPoint, defaultTheme.mediumBreakPoint);

  updateStyle('$menuTextColor', config.menuTextColor, theme.menuTextColor, defaultTheme.menuTextColor);
  updateStyle('$menuBackgroundColor', config.menuBackgroundColor, theme.menuBackgroundColor, defaultTheme.menuBackgroundColor);

  updateStyle('$menuitemFocusTextColor', config.menuitemFocusTextColor, theme.menuitemFocusTextColor, defaultTheme.menuitemFocusTextColor);
  updateStyle('$menuitemFocusBackgroundColor', config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor, defaultTheme.menuitemFocusBackgroundColor);

  updateStyle('$focusBorderColor', config.focusBorderColor, theme.focusBorderColor, defaultTheme.focusBorderColor);

  updateStyle('$buttonTextColor', config.buttonTextColor, theme.buttonTextColor, defaultTheme.buttonTextColor);
  updateStyle('$buttonBackgroundColor', config.buttonBackgroundColor, theme.buttonBackgroundColor, defaultTheme.buttonBackgroundColor);

  updateStyle('$zIndex', config.zIndex, theme.zIndex, defaultTheme.zIndex);

  updateStyle('$zHighlight', config.zHighlight, theme.zHighlight, defaultTheme.zHighlight);

}

/*
 *   @function enderStyleElement
 *
 *   @desc  Updates the style sheet template and then attaches it to the document
 *
 * @param  {Object}  config          -  Configuration information object
 * @param  {String}  skipYToStyleId  -  Id used for the skipto container element
 */
export default function renderStyleElement (config, skipToId) {
  styleTemplate.innerHTML = styleTemplate.innerHTML.replaceAll('$skipToId', '#' + skipToId);
  addCSSColors(config);
  const styleNode = styleTemplate.content.cloneNode(true);
  styleNode.id = `${skipToId}-style`;
  const headNode = document.getElementsByTagName('head')[0];
  headNode.appendChild(styleNode);
}
