/* style.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('style', false);

const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = `
<style type="text/css">
.skip-to.popup {
  position: absolute;
  top: -30em;
  left: 0;
}

.skip-to,
.skip-to.popup.focus {
  position: absolute;
  top: 0;
  left: $positionLeft;
  font-family: $fontFamily;
  font-size: $fontSize;
}

.skip-to.fixed {
  position: fixed;
}

.skip-to button {
  position: relative;
  margin: 0;
  padding: 6px 8px 6px 8px;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-radius: 0px 0px 6px 6px;
  border-color: $buttonBackgroundColor;
  color: $menuTextColor;
  background-color: $buttonBackgroundColor;
  z-index: 100000 !important;
  font-family: $fontFamily;
  font-size: $fontSize;
}

.skip-to [role="menu"] {
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

.skip-to [role="group"] {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

.skip-to [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

.skip-to [role="menuitem"] {
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

.skip-to [role="menuitem"] .level,
.skip-to [role="menuitem"] .label {
  font-size: 100%;
  font-weight: normal;
  color: $menuTextColor;
  display: inline-block;
  background-color: $menuBackgroundColor;
  line-height: inherit;
  display: inline-block;
}

.skip-to [role="menuitem"] .level {
  text-align: right;
  padding-right: 4px;
}

.skip-to [role="menuitem"] .label {
  text-align: left;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skip-to [role="menuitem"] .level:first-letter,
.skip-to [role="menuitem"] .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}


.skip-to [role="menuitem"].skip-to-h1 .level { grid-column: 1; }
.skip-to [role="menuitem"].skip-to-h2 .level { grid-column: 2; }
.skip-to [role="menuitem"].skip-to-h3 .level { grid-column: 3; }
.skip-to [role="menuitem"].skip-to-h4 .level { grid-column: 4; }
.skip-to [role="menuitem"].skip-to-h5 .level { grid-column: 5; }
.skip-to [role="menuitem"].skip-to-h6 .level { grid-column: 8;}

.skip-to [role="menuitem"].skip-to-h1 .label { grid-column: 2 / 8; }
.skip-to [role="menuitem"].skip-to-h2 .label { grid-column: 3 / 8; }
.skip-to [role="menuitem"].skip-to-h3 .label { grid-column: 4 / 8; }
.skip-to [role="menuitem"].skip-to-h4 .label { grid-column: 5 / 8; }
.skip-to [role="menuitem"].skip-to-h5 .label { grid-column: 6 / 8; }
.skip-to [role="menuitem"].skip-to-h6 .label { grid-column: 7 / 8;}

.skip-to [role="menuitem"].skip-to-h1.no-level .label { grid-column: 1 / 8; }
.skip-to [role="menuitem"].skip-to-h2.no-level .label { grid-column: 2 / 8; }
.skip-to [role="menuitem"].skip-to-h3.no-level .label { grid-column: 3 / 8; }
.skip-to [role="menuitem"].skip-to-h4.no-level .label { grid-column: 4 / 8; }
.skip-to [role="menuitem"].skip-to-h5.no-level .label { grid-column: 5 / 8; }
.skip-to [role="menuitem"].skip-to-h6.no-level .label { grid-column: 6 / 8; }

.skip-to [role="menuitem"].skip-to-nesting-level-1 .nesting { grid-column: 1; }
.skip-to [role="menuitem"].skip-to-nesting-level-2 .nesting { grid-column: 2; }
.skip-to [role="menuitem"].skip-to-nesting-level-3 .nesting { grid-column: 3; }

.skip-to [role="menuitem"].skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
.skip-to [role="menuitem"].skip-to-nesting-level-1 .label { grid-column: 2 / 8; }
.skip-to [role="menuitem"].skip-to-nesting-level-2 .label { grid-column: 3 / 8; }
.skip-to [role="menuitem"].skip-to-nesting-level-3 .label { grid-column: 4 / 8; }

.skip-to [role="menuitem"].no-items .label,
.skip-to [role="menuitem"].action .label {
  grid-column: 1 / 8;
}

.skip-to [role="separator"] {
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

.skip-to [role="separator"] .mofn {
  font-weight: normal;
  font-size: 85%;
}

.skip-to [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

.skip-to [role="menuitem"].last {
  border-radius: 0 0 5px 5px;
}

/* focus styling */

.skip-to.focus {
  display: block;
}

.skip-to button:focus,
.skip-to button:hover {
  background-color: $menuBackgroundColor;
  color: $menuTextColor;
  outline: none;
}

.skip-to button:focus {
  padding: 6px 7px 5px 7px;
  border-width: 0px 2px 2px 2px;
  border-color: $focusBorderColor;
}

.skip-to [role="menuitem"]:focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  border-color: $focusBorderColor;
  background-color: $menuitemFocusBackgroundColor;
  color: $menuitemFocusTextColor;
  outline: none;
}

.skip-to [role="menuitem"]:focus .level,
.skip-to [role="menuitem"]:focus .label {
  background-color: $menuitemFocusBackgroundColor;
  color: $menuitemFocusTextColor;
}
</style>
`;

function getTheme(colorThemes, config) {
  if (typeof colorThemes[config.colorTheme] === 'object') {
    return colorThemes[config.colorTheme];
  }
  return colorThemes['default'];
}

function updateStyle(stylePlaceholder, value, defaultValue) {
  debug.flag && debug.log(`[updateStyle]: ${stylePlaceholder} ${value} ${defaultValue}`);
  if (typeof value !== 'string' || value.length === 0) {
    value = defaultValue;
  }
  let cssContent = styleTemplate.innerHTML;
  let index1 = cssContent.indexOf(stylePlaceholder);
  let index2 = index1 + stylePlaceholder.length;
  debug.flag && debug.log(`[updateStyle]: ${index1} ${index2}`);
  while (index1 >= 0 && index2 < cssContent.length) {
    cssContent = cssContent.substring(0, index1) + value + cssContent.substring(index2);
    index1 = cssContent.indexOf(stylePlaceholder, index2);
    index2 = index1 + stylePlaceholder.length;
  }
  styleTemplate.innerHTML = cssContent;
  debug.flag && debug.log(`[updateStyle]: ${styleTemplate.innerHTML}`);
}

/*
 * @function addCSSColors
 *
 * @desc Updates the styling information in the attached
 *       stylesheet to use the configured colors  
 */
function addCSSColors (colorThemes, config) {
  const theme = getTheme(colorThemes, config);

  updateStyle('$fontFamily', config.fontFamily, theme.fontFamily);
  updateStyle('$fontSize', config.fontSize, theme.fontSize);

  updateStyle('$positionLeft', config.positionLeft, theme.positionLeft);

  updateStyle('$menuTextColor', config.menuTextColor, theme.menuTextColor);
  updateStyle('$menuBackgroundColor', config.menuBackgroundColor, theme.menuBackgroundColor);

  updateStyle('$menuitemFocusTextColor', config.menuitemFocusTextColor, theme.menuitemFocusTextColor);
  updateStyle('$menuitemFocusBackgroundColor', config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor);

  updateStyle('$focusBorderColor', config.focusBorderColor, theme.focusBorderColor);

  updateStyle('$buttonTextColor', config.buttonTextColor, theme.buttonTextColor);
  updateStyle('$buttonBackgroundColor', config.buttonBackgroundColor, theme.buttonBackgroundColor);
}

export default function renderStyleElement (colorThemes, config, skipToId) {
  debug.flag && debug.log(`[renderStyleElement]`);
  addCSSColors(colorThemes, config);
  const styleNode = styleTemplate.content.cloneNode(true);
  const headNode = document.getElementsByTagName('head')[0];
  headNode.appendChild(styleNode);
  styleNode.id = skipToId;
}
