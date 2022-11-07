/* style.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('style', false);
debug.flag = false;

const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = `
<style type="text/css">
nav#id-skip-to.popup {
  position: absolute;
  top: -34px;
  transition: top 0.35s ease;
}

nav#id-skip-to button .text {
  padding: 6px 8px 6px 8px;
  display: inline-block;
}

nav#id-skip-to button img {
  height: 24px;
  padding: 2px 4px 2px 4px;
  display: none;
  background-color: #e8e9ea;
}

nav#id-skip-to,
nav#id-skip-to.popup.focus,
nav#id-skip-to.popup:hover {
  position: absolute;
  top: 0;
  left: $positionLeft;
  font-family: $fontFamily;
  font-size: $fontSize;
  display: block;
  border: none;
  margin-bottom: 4px;
  transition: left 1s ease;
}

nav#id-skip-to button {
  position: relative;
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
}

@media screen and (max-width: $mediaBreakPointpx) {
  nav#id-skip-to,
  nav#id-skip-to.popup.focus {
    left: 24px;
    transition: left 1s ease;
  }
}  

@media screen and (max-width: $mediaBreakPointpx) {
  nav#id-skip-to button img {
    display: block;
  }

  nav#id-skip-to button {
    border-color: #e8e9ea;
  }

  nav#id-skip-to button .text {
    display: none;
  }
}

nav#id-skip-to.fixed {
  position: fixed;
}


nav#id-skip-to [role="menu"] {
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
  z-index: 100000 !important;
  overflow-x: hidden;
}

nav#id-skip-to [role="group"] {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

nav#id-skip-to [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

nav#id-skip-to [role="menuitem"] {
  padding: 3px;
  width: auto;
  border-width: 0px;
  border-style: solid;
  color: $menuTextColor;
  background-color: $menuBackgroundColor;
  z-index: 100000 !important;
  display: grid;
  overflow-y: clip;
  grid-template-columns: repeat(6, 1.2rem) 1fr;
  grid-column-gap: 2px;
  font-size: 1em;
}

nav#id-skip-to [role="menuitem"] .level,
nav#id-skip-to [role="menuitem"] .label {
  font-size: 100%;
  font-weight: normal;
  color: $menuTextColor;
  display: inline-block;
  background-color: $menuBackgroundColor;
  line-height: inherit;
  display: inline-block;
}

nav#id-skip-to [role="menuitem"] .level {
  text-align: right;
  padding-right: 4px;
}

nav#id-skip-to [role="menuitem"] .label {
  text-align: left;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

nav#id-skip-to [role="menuitem"] .level:first-letter,
nav#id-skip-to [role="menuitem"] .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}


nav#id-skip-to [role="menuitem"].skip-to-h1 .level { grid-column: 1; }
nav#id-skip-to [role="menuitem"].skip-to-h2 .level { grid-column: 2; }
nav#id-skip-to [role="menuitem"].skip-to-h3 .level { grid-column: 3; }
nav#id-skip-to [role="menuitem"].skip-to-h4 .level { grid-column: 4; }
nav#id-skip-to [role="menuitem"].skip-to-h5 .level { grid-column: 5; }
nav#id-skip-to [role="menuitem"].skip-to-h6 .level { grid-column: 8;}

nav#id-skip-to [role="menuitem"].skip-to-h1 .label { grid-column: 2 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h2 .label { grid-column: 3 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h3 .label { grid-column: 4 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h4 .label { grid-column: 5 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h5 .label { grid-column: 6 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h6 .label { grid-column: 7 / 8;}

nav#id-skip-to [role="menuitem"].skip-to-h1.no-level .label { grid-column: 1 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h2.no-level .label { grid-column: 2 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h3.no-level .label { grid-column: 3 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h4.no-level .label { grid-column: 4 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h5.no-level .label { grid-column: 5 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-h6.no-level .label { grid-column: 6 / 8; }

nav#id-skip-to [role="menuitem"].skip-to-nesting-level-1 .nesting { grid-column: 1; }
nav#id-skip-to [role="menuitem"].skip-to-nesting-level-2 .nesting { grid-column: 2; }
nav#id-skip-to [role="menuitem"].skip-to-nesting-level-3 .nesting { grid-column: 3; }

nav#id-skip-to [role="menuitem"].skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-nesting-level-1 .label { grid-column: 2 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-nesting-level-2 .label { grid-column: 3 / 8; }
nav#id-skip-to [role="menuitem"].skip-to-nesting-level-3 .label { grid-column: 4 / 8; }

nav#id-skip-to [role="menuitem"].no-items .label,
nav#id-skip-to [role="menuitem"].action .label {
  grid-column: 1 / 8;
}

nav#id-skip-to [role="separator"] {
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
  z-index: 100000 !important;
}

nav#id-skip-to [role="separator"] .mofn {
  font-weight: normal;
  font-size: 85%;
}

nav#id-skip-to [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

nav#id-skip-to [role="menuitem"].last {
  border-radius: 0 0 5px 5px;
}

/* focus styling */

nav#id-skip-to.focus {
  display: block;
}

nav#id-skip-to button:focus,
nav#id-skip-to button:hover {
  background-color: $menuBackgroundColor;
  color: $menuTextColor;
  outline: none;
}

nav#id-skip-to button:focus,
nav#id-skip-to button:hover {
  border-width: 0px 2px 2px 2px;
  border-color: $focusBorderColor;
}

nav#id-skip-to button:focus .text,
nav#id-skip-to button:hover .text {
  padding: 6px 7px 5px 7px;
}

nav#id-skip-to button:focus img,
nav#id-skip-to button:hover img {
  padding: 2px 3px 4px 3px;
}


nav#id-skip-to [role="menuitem"]:focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  border-color: $focusBorderColor;
  background-color: $menuitemFocusBackgroundColor;
  color: $menuitemFocusTextColor;
  outline: none;
}

nav#id-skip-to [role="menuitem"]:focus .level,
nav#id-skip-to [role="menuitem"]:focus .label {
  background-color: $menuitemFocusBackgroundColor;
  color: $menuitemFocusTextColor;
}
</style>
`;

/*
 *   @function getTheme
 *
 *   @desc Returns
 *
 *   @param  {Object}  colorThemes  -  Javascript object with keyed color themes
 *   @param  {String}  colorTheme   -  A string identifying a color theme  
 *
 *   @returns {Object}  see @desc
 */
function getTheme(colorThemes, colorTheme) {
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
 *   @function 
 *
 *   @desc  
 *
 *   @param 
 *
 *   @returns 
 */
function updateStyle(stylePlaceholder, value, defaultValue) {
  if (typeof value !== 'string' || value.length === 0) {
    value = defaultValue;
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
 *       stylesheet to use the configured colors  
 *
 *   @param 
 *
 *   @returns 
 */
function addCSSColors (colorThemes, config) {
  const theme = getTheme(colorThemes, config.colorTheme);

  // Check for display option in theme
  if ((typeof theme.displayOption === 'string') && 
      ('fixed popup static'.indexOf(theme.displayOption.toLowerCase())>= 0)) {
    config.displayOption = theme.displayOption;
  }

  updateStyle('$fontFamily', config.fontFamily, theme.fontFamily);
  updateStyle('$fontSize', config.fontSize, theme.fontSize);

  updateStyle('$positionLeft', config.positionLeft, theme.positionLeft);
  updateStyle('$mediaBreakPoint', config.mediaBreakPoint, theme.mediaBreakPoint);

  updateStyle('$menuTextColor', config.menuTextColor, theme.menuTextColor);
  updateStyle('$menuBackgroundColor', config.menuBackgroundColor, theme.menuBackgroundColor);

  updateStyle('$menuitemFocusTextColor', config.menuitemFocusTextColor, theme.menuitemFocusTextColor);
  updateStyle('$menuitemFocusBackgroundColor', config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor);

  updateStyle('$focusBorderColor', config.focusBorderColor, theme.focusBorderColor);

  updateStyle('$buttonTextColor', config.buttonTextColor, theme.buttonTextColor);
  updateStyle('$buttonBackgroundColor', config.buttonBackgroundColor, theme.buttonBackgroundColor);
}

/*
 *   @function 
 *
 *   @desc  
 *
 *   @param 
 *
 *   @returns 
 */
export default function renderStyleElement (colorThemes, config, skipToId) {
  addCSSColors(colorThemes, config);
  const styleNode = styleTemplate.content.cloneNode(true);
  const headNode = document.getElementsByTagName('head')[0];
  headNode.appendChild(styleNode);
  styleNode.id = skipToId;
}
