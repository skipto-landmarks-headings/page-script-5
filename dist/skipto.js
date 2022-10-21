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
const debug$5 = new DebugLogging('style', false);

const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = `
<style type="text/css">
nav#id-skip-to.popup {
  position: absolute;
  top: -30em;
  left: 0;
}

nav#id-skip-to,
nav#id-skip-to.popup.focus {
  position: absolute;
  top: 0;
  left: $positionLeft;
  font-family: $fontFamily;
  font-size: $fontSize;
  display: block;
  borders: none;
}

nav#id-skip-to.fixed {
  position: fixed;
}

nav#id-skip-to button {
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
.skip-to button:hover {
  background-color: $menuBackgroundColor;
  color: $menuTextColor;
  outline: none;
}

nav#id-skip-to button:focus {
  padding: 6px 7px 5px 7px;
  border-width: 0px 2px 2px 2px;
  border-color: $focusBorderColor;
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

function getTheme(colorThemes, config) {
  if (typeof colorThemes[config.colorTheme] === 'object') {
    return colorThemes[config.colorTheme];
  }
  return colorThemes['default'];
}

function updateStyle(stylePlaceholder, value, defaultValue) {
  debug$5.flag && debug$5.log(`[updateStyle]: ${stylePlaceholder} ${value} ${defaultValue}`);
  if (typeof value !== 'string' || value.length === 0) {
    value = defaultValue;
  }
  let cssContent = styleTemplate.innerHTML;
  let index1 = cssContent.indexOf(stylePlaceholder);
  let index2 = index1 + stylePlaceholder.length;
  debug$5.flag && debug$5.log(`[updateStyle]: ${index1} ${index2}`);
  while (index1 >= 0 && index2 < cssContent.length) {
    cssContent = cssContent.substring(0, index1) + value + cssContent.substring(index2);
    index1 = cssContent.indexOf(stylePlaceholder, index2);
    index2 = index1 + stylePlaceholder.length;
  }
  styleTemplate.innerHTML = cssContent;
  debug$5.flag && debug$5.log(`[updateStyle]: ${styleTemplate.innerHTML}`);
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

function renderStyleElement (colorThemes, config, skipToId) {
  debug$5.flag && debug$5.log(`[renderStyleElement]`);
  addCSSColors(colorThemes, config);
  const styleNode = styleTemplate.content.cloneNode(true);
  const headNode = document.getElementsByTagName('head')[0];
  headNode.appendChild(styleNode);
  styleNode.id = skipToId;
}

/* utils.js */

/* Constants */
const debug$4 = new DebugLogging('Utils', false);
debug$4.flag = false;


/*
*   getAttributeValue: Return attribute value if present on element,
*   otherwise return empty string.
*/
function getAttributeValue (element, attribute) {
  let value = element.getAttribute(attribute);
  return (value === null) ? '' : normalize(value);
}

/*
*   normalize: Trim leading and trailing whitespace and condense all
*   internal sequences of whitespace to a single space. Adapted from
*   Mozilla documentation on String.prototype.trim polyfill. Handles
*   BOM and NBSP characters.
*/
function normalize (s) {
  let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  return s.replace(rtrim, '').replace(/\s+/g, ' ');
}

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

function isVisible$1 (element) {
  function isVisibleRec(el) {
    if (el.parentNode.nodeType !== 1 || 
        (el.parentNode.tagName === 'BODY')) {
      return true;
    }
    const computedStyle = window.getComputedStyle(el);
    const display = computedStyle.getPropertyValue('display');
    const visibility = computedStyle.getPropertyValue('visibility');
    const hidden = el.getAttribute('hidden');
    if ((display === 'none') ||
      (visibility === 'hidden') ||
      (hidden !== null)) {
      return false;
    }
    const isVis = isVisibleRec(el.parentNode);
    return isVis;
  }

  return isVisibleRec(element);
}

/*
*   namefrom.js
*/

/* constants */

const debug$3 = new DebugLogging('nameFrom', false);
debug$3.flag = false;

/*
* @function isHeadingElement
* 
* @desc  Is element a heading element
*
* @returns true if heading element, otherwsie is false  
*/
function isHeadingElement (element) {
  let tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return true;
    default:
      return false;
  }
}

/*
*   getElementContents: Construct the ARIA text alternative for element by
*   processing its element and text node descendants and then adding any CSS-
*   generated content if present.
*/
function getElementContents (element) {
  let result = '';
  if (isVisible(element)) {
    if (element.hasChildNodes()) {
      let children = element.childNodes,
          arrayOfStrings = [];

      for (let i = 0; i < children.length; i++) {
        let contents = getNodeContents(children[i]);
        if (contents.length) arrayOfStrings.push(contents);
      }

      result = (arrayOfStrings.length) ? arrayOfStrings.join(' ') : '';
    }
    return addCssGeneratedContent(element, result);
  }
  return '';
}

// HIGHER-LEVEL FUNCTIONS THAT RETURN AN OBJECT WITH SOURCE PROPERTY

/*
*   nameFromAttribute
*/
function nameFromAttribute (element, attribute) {
  let name;

  name = getAttributeValue(element, attribute);
  if (name.length) {
    return name;
  }

  return '';
}

//
// LOW-LEVEL HELPER FUNCTIONS (NOT EXPORTED)

/*
*   isHidden: Checks to see if the node or any of it's ancestor
*   are hidden for the purpose of accessible name calculation
*/

function isHidden (node) {

  if (!node) {
    return false;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    if ((node.nodeType === Node.TEXT_NODE) &&
        (node.parentNode.nodeType !== Node.ELEMENT_NODE)) {
      node = node.parentNode;
    }
    return false;
  }

  if (node.hasAttribute('hidden')) {
    return true;
  }

  if (node.hasAttribute('aria-hidden')) {
    return node.getAttribute('aria-hidden').toLowerCase() === 'true';
  }

  const style = window.getComputedStyle(node, null);

  const display = style.getPropertyValue("display");
  if (display === 'none') { 
    return true;
  }

  if (node.parentNode) {
    return isHidden(node.parentNode);
  }

  return false;
}

/*
*   isVisible: Checks to see if the node or any of it's ancestor
*   are visible for the purpose of accessible name calculation
*/

function isVisible (node) {
  return !isHidden(node);
}

/*
*   isHiddenCSSVisibilityProp: Checks to see if the node or any of it's ancestor
*   are visible based on CSS visibility property for the purpose of accessible name calculation
*/

function isHiddenCSSVisibilityProp(node) {

  if (!node) {
    return false;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    if ((node.nodeType === Node.TEXT_NODE) &&
        (node.parentNode.nodeType !== Node.ELEMENT_NODE)) {
      node = node.parentNode;
    }
    return false;
  }
  const style = window.getComputedStyle(node, null);

  const visibility = style.getPropertyValue("visibility");
  if (visibility) {
    return (visibility === 'hidden') || (visibility === 'collapse');
  }

  if (node.parentNode) {
    return isHidden(node.parentNode);
  }

  return false;
}

/*
*   getNodeContents: Recursively process element and text nodes by aggregating
*   their text values for an ARIA text equivalent calculation.
*   1. This includes special handling of elements with 'alt' text and embedded
*      controls.
*/
function getNodeContents (node) {
  let contents = '';
  let nc;
  let arr = [];

  if (isHidden(node)) {
    return '';
  } 

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      if (node instanceof HTMLSlotElement) {
        // if no slotted elements, check for default slotted content
        const assignedNodes = node.assignedNodes().length ? node.assignedNodes() : node.assignedNodes({ flatten: true });
        assignedNodes.forEach( assignedNode => {
          nc = getNodeContents(assignedNode);
          if (nc.length) arr.push(nc);
        });
        contents = (arr.length) ? arr.join(' ') : '';
      } else {
        if (couldHaveAltText(node)) {
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
      contents = addCssGeneratedContent(node, contents);
      break;

    case Node.TEXT_NODE:
      if (!isHiddenCSSVisibilityProp(node.parentNode)) {
        contents = normalize(node.textContent);
      }
      break;
  }

  return contents;
}

/*
*   couldHaveAltText: Based on HTML5 specification, determine whether
*   element could have an 'alt' attribute.
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
*   addCssGeneratedContent: Add CSS-generated content for pseudo-elements
*   :before and :after. According to the CSS spec, test that content value
*   is other than the default computed value of 'none'.
*
*   Note: Even if an author specifies content: 'none', because browsers add
*   the double-quote character to the beginning and end of computed string
*   values, the result cannot and will not be equal to 'none'.
*/
function addCssGeneratedContent (element, contents) {
  let result = contents,
      prefix = getComputedStyle(element, ':before').content,
      suffix = getComputedStyle(element, ':after').content;

  if (prefix !== 'none') result = prefix + result;
  if (suffix !== 'none') result = result + suffix;

  return result;
}

/* accName.js */

/* Constants */
const debug$2 = new DebugLogging('accName', false);
debug$2.flag = true;

/**
 * @fuction getAccessibleName
 *
 * @desc Returns the accessible name for an heading or landamrk 
 *
 * @paramn {Object}   dom      - Document of the current element
 * @param  {node}     element  - DOM element node for either a heading or
 *                               landmark
 * @param  {Boolean}  recFlag  - if traversing a aria-labelledbyby, do not restart
 *                                another recursion  
 * 
 * @return {String} The accessible name for the landmark or heading element
 */

function getAccessibleName (doc, element, recFlag=false) {
  let accName = '';

  if (!recFlag) {
    accName = nameFromAttributeIdRefs(doc, element, 'aria-labelledby');
  }
  if (accName === '') {
    accName = nameFromAttribute(element, 'aria-label');
  }
  if ((accName === '') && 
      (isHeadingElement(element)) || recFlag) {
    accName =  getElementContents(element);
    debug$2.flag && debug$2.log(`[getElementContents]: ${getElementContents(element)}`);
  }
  return accName;
}

/*
*   nameFromAttributeIdRefs: Get the value of attrName on element (a space-
*   separated list of IDREFs), visit each referenced element in the order it
*   appears in the list and obtain its accessible name (skipping recursive
*   aria-labelledby or aria-describedby calculations), and return an object
*   with name property set to a string that is a space-separated concatena-
*   tion of those results if any, otherwise return null.
*/
function nameFromAttributeIdRefs (doc, element, attribute) {
  const value = getAttributeValue(element, attribute);
  const arr = [];

  if (value.length) {
    debug$2.flag && debug$2.log(`[nameFromAttributeIdRefs][value]: ${value}`);
    const idRefs = value.split(' ');

    for (let i = 0; i < idRefs.length; i++) {
      const refElement = doc.getElementById(idRefs[i]);
      debug$2.flag && debug$2.log(`[nameFromAttributeIdRefs][refElement]: ${refElement}`);
      if (refElement) {
        const accName = getAccessibleName(doc, refElement, true);
        debug$2.flag && debug$2.log(`[nameFromAttributeIdRefs][accName]: ${accName}`);
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
const debug$1 = new DebugLogging('landmarksHeadings', false);
debug$1.flag = true;

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
  'title'
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

function getSkipToIdIndex () {
  return idIndex;
}

function incSkipToIdIndex () {
  idIndex += 1;
}

// Tests if a tag name can be skipped
function isSkipableElement(tagName, type) {
    const elemSelector = ((tagName === 'input') && (typeof type === 'string')) ? 
                            `${tagName}[type=${type}]` :
                            tagName;
    return skipableElements.includes(elemSelector);
}

// Tests if a tag name is a custom element
function isCustomElement(tagName) {
  return tagName.indexOf('-') >= 0;
}

// Tests if a node is a slot element
function isSlotElement(node) {
  return (node instanceof HTMLSlotElement);
}

/**
* @function isTopLevel
*
* @desc Tests the node to see if it is in the content of any other
*       elements with default landmark roles or is the descendant
*       of an element with a defined landmark role
*
* @param  {Object}  node        - Element node from a berowser DOM
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

// checks if an element node is a landmark
function checkForLandmark (node) {
  if (node.hasAttribute('role')) {
    const role = node.getAttribute('role').toLowerCase();
    if (allowedLandmarkSelectors.indexOf(role) >= 0) {
      return role;
    }
  } else {
    const tagName = node.tagName.toLowerCase();

    switch (tagName) {
      case 'aside':
        return 'complementary';

      case 'main':
        return 'main';

      case 'nav':
        return 'navigation';

      case 'header':
        if (isTopLevel(node)) {
          return 'banner';
        }
        break;

      case 'footer':
        if (isTopLevel(node)) {
          return 'contentinfo';
        }
        break;

      case 'section':
        // Sections need an accessible name for be considered a "region" landmark
        if (node.hasAttribute('aria-label') || node.hasAttribute('aria-labelledby')) {
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
 * @desc Returns DOM node associated with the id, if not found returns null
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
        const tagName = node.tagName.toLowerCase();
        if (node.getAttribute('data-skip-to-id') === targetId) {
          return node;
        }
        if (!isSkipableElement(tagName, node.getAttribute('type'))) {
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
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForSkipToId(node.shadowRoot);
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
 * @desc Returns the first DOM node that matches a set of element tag names
 * 
 * @param {node}   startingNode  - dom node to start search for element
 * @param {Array}  tagNames      - Array of tag names
 * 
 * @returns (node} Returns first element found ot elem if none found 
 */
function findVisibleElement (startingNode, tagNames) {

  function transverseDOMForVisibleElement(startingNode, targetTagName) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if ((tagName === targetTagName) && isVisible$1(node)) {
          return node;
        }
        if (!isSkipableElement(tagName, node.getAttribute('type'))) {

          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                if ((assignedNode.tagName.toLowerCase() === targetTagName) && 
                    isVisible$1(assignedNode)) {
                  return assignedNode;
                }                    
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForVisibleElement(node.shadowRoot, targetTagName);
                if (targetNode) {
                  return targetNode;
                }
              }
            } else {
              targetNode = transverseDOMForVisibleElement(node, targetTagName);
              if (targetNode) {
                return targetNode;
              }
            }
          }
        }
      } // end if
    } // end for
    return startingNode;
  } // end function
  let targetNode = startingNode;

  // Go through the tag names one at a time
  for (let i = 0; i < tagNames.length; i += 1) {
    targetNode = transverseDOMForVisibleElement(startingNode, tagNames[i]);
    if (targetNode !== startingNode) {
      break;
    }
  }
  return targetNode;
}

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
    if (focusNode && isVisible$1(focusNode)) {
      focusNode.focus();
      focusNode.scrollIntoView({block: 'nearest'});
    }
    else {
      if (isLandmark) {
        scrollNode = findVisibleElement(elem, landmarkSelectors);
        if (scrollNode) {
          elem = scrollNode;
        }
      }
      elem.tabIndex = -1;
      elem.focus();
      elem.scrollIntoView({block: 'center'});
    }
  }
}

function getHeadingTargets(targets) {
  let targetHeadings = [];
  ['h1','h2','h3','h4','h5','h6'].forEach( h => {
    if (targets.includes(h)) {
      targetHeadings.push(h);
    }
  });
  return targetHeadings;
}

function queryDOMForLandmarksAndHeadings (landmarkTargets, headingTargets) {
  let headingInfo = [];
  let landmarkInfo = [];
  let targetLandmarks = getLandmarkTargets(landmarkTargets.toLowerCase());
  let targetHeadings  = getHeadingTargets(headingTargets.toLowerCase());
  let onlyInMain = headingTargets.includes('main');

  function transverseDOM(startingNode, doc, inMain = false) {
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
          landmarkInfo.push({ node: node, name: getAccessibleName(doc, node)});
            debug$1.flag && debug$1.log(`[transverseDOM]: ${tagName}[role=${node.getAttribute('role')}][aria-labelledby=${node.getAttribute('aria-labelledby')}]`, 1);
            debug$1.flag && debug$1.log(`[transverseDOM][accName]: ${getAccessibleName(doc, node)}]`);
        }
        if (targetHeadings.indexOf(tagName) >= 0) {
          if (!onlyInMain || inMain) {
            headingInfo.push({ node: node, name: getAccessibleName(doc, node)});
          }
        }
        if ((tagName === 'main') || 
            (node.hasAttribute('role') && node.getAttribute('role').toLowerCase === 'role')) {
          inMain = true;
        }
        if (!isSkipableElement(tagName, node.getAttribute('type'))) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                const tagName = assignedNodes[i].tagName.toLowerCase();
                if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
                  landmarkInfo.push({ node: node, name: getAccessibleName(doc, node)});
                }

                if (targetHeadings.indexOf(tagName) >= 0) {
                  if (!onlyInMain || inMain) {
                    headingInfo.push({ node: assignedNode, name: getAccessibleName(doc, assignedNode)});
                  }
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                transverseDOM(node.shadowRoot, node.shadowRoot, inMain);
              }
            } else {
              transverseDOM(node, doc, inMain);
            }
          }
        }
      } // end if
    } // end for
  } // end function

  transverseDOM(document.body, document);

  // If no elements found when onlyInMain is set, try 
  // to find any headings
  if (headingInfo.length === 0 && onlyInMain) {
    onlyInMain = false;
    transverseDOM(document.body, document);
  }

  return [landmarkInfo, headingInfo];
}

/*
 * @function getLandmarksAndHeadings
 *
 * @desc 
 *
 * @param {Object} config - 
 *
 * @return {Array} 
 */

function getLandmarksAndHeadings (config) {

  let landmarkTargets = config.landmarks;
  if (typeof landmarkTargets !== 'string') {
    landmarkTargets = 'main search navigation';
  }

  let headingTargets = config.headings;
  // If targets undefined, use default settings
  if (typeof headingTargets !== 'string') {
    headingTargets = 'h1 h2';
  }

  const [landmarks, headings] = queryDOMForLandmarksAndHeadings(landmarkTargets, headingTargets);

  return [getLandmarks(config, landmarks), getHeadings(config, headings)];
}


function getHeadings (config, headings) {
  let dataId, level;
  let headingElementsArr = [];

  debug$1.flag && debug$1.log(`[getHeadings][headings]: ${headings.length}`);

  for (let i = 0, len = headings.length; i < len; i += 1) {
    let heading = headings[i];
    debug$1.flag && debug$1.log(`[getHeadings][${i}]: ${heading.node.tagName}: ${heading.name}`);
    let role = heading.node.getAttribute('role');
    if ((typeof role === 'string') && (role === 'presentation')) continue;
    if (isVisible$1(heading.node) && isNotEmptyString(heading.node.innerHTML)) {
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
 * @returns A localized string for a landmark name
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
 * @desc Analyzes a configuration string for landamrk and tag names
 *
 * @param {String} targets - String with landamrk and/or tag names
 *
 * @returns A normailized array of landmark names based on target configuration 
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
    targetLandmarks.push('complemntary');
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
 * @desc Traverses the DOM, including web compnents, for ARIA a set of landmarks
 *
 * @param {Object} config     - Object with configuration information
 * @param {Array}  landmarks  - Array of objects containing the DOM node and 
 *                              accessible name for landmarks
 *
 * @returns Array of dom nodes that are identified as landmarks
 */
function getLandmarks(config, landmarks) {
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
    if (isVisible$1(landmark.node)) {
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
  return [].concat(mainElements, searchElements, navElements, asideElements, regionElements, footerElements, otherElements);
}

/* skiptoMenuButton.js */

/* Constants */
const debug = new DebugLogging('SkipToButton', false);
debug.flag = false;

const menuButtonTemplate = document.createElement('template');
menuButtonTemplate.innerHTML = `
  <nav id="id-skip-to" arial0label-"Skip To Content">
    <button
      aria-label="Skip to content, shortcut alt plus zero"
      aria-haspopup="true"
      aria-expanded="false"
      aria-controls="id-skip-to-menu">
      Skip To Content (ALT+0)
    </button> 
    <div id="id-skip-to-menu" 
      role="menu"
      aria-label="Landmarks and Headings"
      aria-busy="false">
      
      <div id="id-skip-to-menu-landmark-group-label" 
        role="separator">
        Landmarks
      </div>
      
      <div id="id-skip-to-menu-landmark-group"
         role="group"
         aria-labelledby="id-skip-to-menu-landmark-group-label">
      </div>
      
      <div id="id-skip-to-menu-heading-group-label" 
        role="separator">
        Headings
      </div>
      
      <div id="id-skip-to-menu-heading-group"
         role="group"
         aria-labelledby="id-skip-to-menu-heading-label">
      </div>
    </div>
  </nav>
`;

/**
 * @class SkiptoMenuButton
 *
 * @desc Constructor for creating a button to open a menu of headings and landmarks on 
 *       a web page
 *
 * @param {node}  attachNode  - dom node element to attach button and menu
 */
class SkiptoMenuButton {

    constructor (attachNode, config) {
      this.config = config;
      const template = menuButtonTemplate.content.cloneNode(true);
      attachNode.appendChild(template);

      this.containerNode = attachNode.querySelector('nav');
      this.containerNode.setAttribute('aria-label', config.buttonLabel);

      if (isNotEmptyString(config.customClass)) {
        this.containerNode.classList.add(config.customClass);
      }

      let displayOption = config.displayOption;
      if (typeof displayOption === 'string') {
        displayOption = displayOption.trim().toLowerCase();
        if (displayOption.length) {
          switch (config.displayOption) {
            case 'fixed':
              this.containerNode.classList.add('fixed');
              break;
            case 'onfocus':  // Legacy option
            case 'popup':
              this.containerNode.classList.add('popup');
              break;
          }
        }
      }

      // Create button

      const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(config);

      this.buttonNode = this.containerNode.querySelector('button');
      this.buttonNode.textContent = buttonVisibleLabel;
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
      this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
      this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));


      // Create menu container

      this.menuNode   = this.containerNode.querySelector('[role=menu]');
      this.menuNode.setAttribute('aria-label', config.menuLabel);
      this.menuNode.setAttribute('aria-busy', 'true');

      this.menuNode.querySelector('#id-skip-to-menu-landmark-group-label').textContent = this.config.landmarkGroupLabel;
      this.menuNode.querySelector('#id-skip-to-menu-heading-group-label').textContent = this.config.headingGroupLabel;

      this.landmarkGroupNode = this.menuNode.querySelector('#id-skip-to-menu-landmark-group');
      this.headingGroupNode = this.menuNode.querySelector('#id-skip-to-menu-heading-group');

      this.containerNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.containerNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener('pointerdown', this.handleBackgroundPointerdown.bind(this), true);

      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }

      attachNode.appendChild(this.containerNode);

      return this.containerNode;

    }
      
    /*
     * @method getBrowserSpecificShortcut
     *
     * @desc Identifies the operating system and updates labels for 
     *       shortcut key to use either the "alt" or the "option"
     *       label  
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
          ariaLabel = config.altButtonAriaLabel.replace('$key', config.altShortcut);
        }

        if (this.usesOptionKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            config.optionLabel
          );
          label = label + buttonShortcut;
          ariaLabel = config.optionButtonAriaLabel.replace('$key', config.altShortcut);
        }
      }
      return [label, ariaLabel];
    }

    /*
     * @method getFirstChar
     *
     * @desc Gets the first character in a menuitem to use as a shortcut key
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
     * @desc 
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
     * @desc 
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
     * @desc  
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
     * @desc 
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
     * @desc 
     */
    renderMenuitemsToGroup(groupNode, menuitems, msgNoItemsFound) {
      groupNode.innerHTML = '';
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
    renderMenu() {
      // remove landmark menu items
      while (this.landmarkGroupNode.lastElementChild) {
        this.landmarkGroupNode.removeChild(this.landmarkGroupNode.lastElementChild);
      }
      // remove heading menu items
      while (this.headingGroupNode.lastElementChild) {
        this.headingGroupNode.removeChild(this.headingGroupNode.lastElementChild);
      }

      // Create landmarks group
      const [landmarkElements, headingElements] = getLandmarksAndHeadings(this.config);
      this.renderMenuitemsToGroup(this.landmarkGroupNode, landmarkElements, this.config.msgNoLandmarksFound);
      this.renderMenuitemsToGroup(this.headingGroupNode,  headingElements, this.config.msgNoHeadingsFound);

      // Update list of menuitems
      this.updateMenuitems();
    }

//
// Menu scripting helper functions and event handlers
//

    setFocusToMenuitem(menuitem) {
      if (menuitem) {
        menuitem.focus();
      }
    }

    setFocusToFirstMenuitem() {
      this.setFocusToMenuitem(this.firstMenuitem);
    }

    setFocusToLastMenuitem() {
      this.setFocusToMenuitem(this.lastMenuitem);
    }

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
     * @desc 
     */
    openPopup() {
      this.menuNode.setAttribute('aria-busy', 'true');
      const h = (80 * window.innerHeight) / 100;
      this.menuNode.style.maxHeight = h + 'px';
      this.renderMenu();
      this.menuNode.style.display = 'block';
      this.menuNode.removeAttribute('aria-busy');
      this.buttonNode.setAttribute('aria-expanded', 'true');
    }

    closePopup() {
      if (this.isOpen()) {
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.menuNode.style.display = 'none';
      }
    }

    isOpen() {
      return this.buttonNode.getAttribute('aria-expanded') === 'true';
    }
    
    // Menu event handlers
    
    handleFocusin() {
      this.containerNode.classList.add('focus');
    }
    
    handleFocusout() {
      this.containerNode.classList.remove('focus');
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
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
      } else {
        this.openPopup();
        this.setFocusToFirstMenuitem();
      }
      event.stopPropagation();
      event.preventDefault();
    }

    handleDocumentKeydown (event) {
      let key = event.key,
        flag = false;

      let altPressed =
        this.usesAltKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      let optionPressed =
        this.usesOptionKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      if (
        (optionPressed && this.config.optionShortcut === key) ||
        (altPressed && this.config.altShortcut === key)
      ) {
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
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
          this.buttonNode.focus();
          this.closePopup();
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
      let tgt = event.currentTarget;
      tgt.focus();
    }

    handleBackgroundPointerdown(event) {
      if (!this.containerNode.contains(event.target)) {
        if (this.isOpen()) {
          this.closePopup();
          this.buttonNode.focus();
        }
      }
    }
}

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

(function() {

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
