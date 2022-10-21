/*
*   namefrom.js
*/

import {
  normalize,
  getAttributeValue
} from './utils.js';

export {
  isHeadingElement,
  nameFromAttribute,
  nameFromAltAttribute,
  getElementContents
};

import DebugLogging  from './debug.js';

/* constants */

const debug = new DebugLogging('nameFrom', false);
debug.flag = false;

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

/*
*   nameFromAltAttribute
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

    default:
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

