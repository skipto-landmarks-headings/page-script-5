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
 * @fuction isEmptyString
 *
 * @desc Returns true if the string is empty, otherwise false
 *
 * @param {Boolean}  see @desc
 */
function isEmptyString (str) {
  return (typeof str !== 'string') || str.length === 0 && !str.trim();
}

/**
 * @fuction normalizeName
 *
 * @desc Removes extra spaces, linefeeds and cariage returns from a string
 *
 * @param {String}  see @desc
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



