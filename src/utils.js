/* utils.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('Utils', false);
debug.flag = false;

/* Exports */

export {
  normalize,
  normalizeName,
  getAttributeValue,
  isEmptyString,
  isNotEmptyString,
  isVisible
};


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

function isEmptyString (str) {
  return (typeof str !== 'string') || str.length === 0 && !str.trim();
}

/**
 * @fuction normalizeName
 *
 * @desc 
 *
 * @param {String}  name  - N
 */

function normalizeName (name) {
  if (typeof name === 'string') return name.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  return "";
}

/**
 * @fuction isVisible
 *
 * @desc Returns true if the element is visible in the graphical rendering 
 *
 * @param {node}  elem  - DOM element node of a labelable element
 */

function isVisible (element) {
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



