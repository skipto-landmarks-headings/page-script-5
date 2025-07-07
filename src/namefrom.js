/*
*   namefrom.js
*/

import {
  normalize,
  getAttributeValue
} from './utils.js';

export {
  nameFromAttribute,
  nameFromAltAttribute,
  getNodeContents
};

import DebugLogging  from './debug.js';

/* constants */

const debug = new DebugLogging('nameFrom', false);
debug.flag = false;

/*
*   @function nameFromAttribute
*
*   @desc  If defined, returns the value of an attribute,
*          otheriwse the empty string
*
*   @param {Object}  element    - DOM element node
*   @param {String}  attribute  - String identifying the attribute
*
*   @returns {String}  see @desc 
*/
function nameFromAttribute (element, attribute) {
  let name;

  name = getAttributeValue(element, attribute);
  if (name.length) {
    return name;
  }

  return '';
}

/*
*   @function nameFromAltAttribute
* 
*   @desc Returns the conten of the alt attribute, if not defined
*         returns an empty string
*
*   @oaram  {Object}  element -  DOM element node
*
*   @return  {String}  see @desc
*/
function nameFromAltAttribute (element) {
  let name = element.getAttribute('alt');

  // Attribute is present
  if (name !== null) {
    name = normalize(name);
    return name;
  }

  // Attribute not present
  return '';
}

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

    default:
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

  function isVisible (style) {

    let flag = true;

    const display = style.getPropertyValue("display");
    if (display) {
      flag = flag && display !== 'none';
    }

    const visibility = style.getPropertyValue("visibility");
    if (visibility) {
      flag = flag && (visibility !== 'hidden') && (visibility !== 'collapse');
    }
    return flag;
  }

  let result = contents;
  const styleBefore = getComputedStyle(element, ':before');
  const styleAfter  = getComputedStyle(element, ':after');

  const beforeVisible = isVisible(styleBefore);
  const afterVisible  = isVisible(styleAfter);

  const prefix = beforeVisible ?
                 styleBefore.content :
                 '';

  const suffix = afterVisible ?
                 styleAfter.content :
                 '';

  if ((prefix[0] === '"') && !prefix.toLowerCase().includes('moz-')) {
    result = prefix.substring(1, (prefix.length-1)) + result;
  }

  if ((suffix[0] === '"') && !suffix.toLowerCase().includes('moz-')) {
    result = result + suffix.substring(1, (suffix.length-1)) ;
  }

  return result;
}

