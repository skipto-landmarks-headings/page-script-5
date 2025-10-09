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
  getHighlightInfo,
  hslToHex,
  isEmptyString,
  isNotEmptyString,
  isVisible,
  isSmallOrOffScreen
};

/*
 * @function getHighlightInfo
 *
 * @desc Returns an array of sizes and fonts for highlighting elements
 *
 * @param   {String}   size  : Highlight border size 'small', 'medium', 'large' or 'x-large'
 *
 * @returns [borderWidth, shadowWidth, offset, fontSize]
 */
function getHighlightInfo (size) {

  let borderWidth, shadowWidth, offset, fontSize;

  const highlightBorderSize =  size ?
                               size :
                               'small';

  switch (highlightBorderSize) {
    case 'small':
      borderWidth = 2;
      shadowWidth = 1;
      offset = 4;
      fontSize = '12pt';
      break;

    case 'medium':
      borderWidth = 3;
      shadowWidth = 2;
      offset = 4;
      fontSize = '13pt';
      break;

    case 'large':
      borderWidth = 4;
      shadowWidth = 3;
      offset = 6;
      fontSize = '14pt';
     break;

    case 'x-large':
      borderWidth = 6;
      shadowWidth = 3;
      offset = 8;
      fontSize = '16pt';
      break;

    default:
      borderWidth = 2;
      shadowWidth = 1;
      offset = 4;
      fontSize = '12pt';
      break;
  }
  return [borderWidth, shadowWidth, offset, fontSize];
}

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

/**
 * @fuction isSmallOrOffScreen
 *
 * @desc Returns true if the element is not very high or wide, or is
 *       positioned outside the graphical rendering
 *
 * @param {node}  elementNode  - DOM element node of a labelable element
 */
function isSmallOrOffScreen(elementNode) {

  function isSmall(style) {
    const height = parseFloat(style.getPropertyValue("height"));
    const width  = parseFloat(style.getPropertyValue("width"));
    const overflow = style.getPropertyValue("overflow");
    return ((height <= 3) || (width <= 3)) && (overflow === 'hidden');
  }

  function isOffScreen(style) {
    const top = parseFloat(style.getPropertyValue("top"));
    const left  = parseFloat(style.getPropertyValue("left"));
    const position = style.getPropertyValue("position");
    return ((top < -5) || (left < -5)) && (position === 'absolute');
  }

  let style = window.getComputedStyle(elementNode, null);

  return isSmall(style) || isOffScreen(style);
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {String}  value   The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {String}          The RGB representation
 */
  function hslToHex(value) {

    function getNumber(str) {
      let num = '';
      for(let i = 0; i < str.length; i += 1) {
        const c = str[i];
        if ('0123456789'.includes(c)) {
          num += c;
        }
      }
      return parseInt(num);
    }

    const parts = value.split(',');

    let h = getNumber(parts[0]); // hue
    let s = getNumber(parts[1]); // Saturation
    let l = getNumber(parts[2]); // lightness

    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return hex;
  }

