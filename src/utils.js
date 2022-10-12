/* utils.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('Utils', false);
debug.flag(false);

/* Exports */

export {
  normalizeName,
  getTextContent,
  getAccessibleName,
  isEmptyString,
  isNotEmptyString,
  isVisible
};

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
 * @fuction getTextContent
 *
 * @desc Returns the text content of a OOM element
 *
 * @param {node}  elem  - DOM element node
 */

function getTextContent (elem) {
  function getText(e, strings) {
    // If text node get the text and return
    if (e.nodeType === Node.TEXT_NODE) {
      strings.push(e.data);
    } else {
      // if an element for through all the children elements looking for text
      if (e.nodeType === Node.ELEMENT_NODE) {
        // check to see if IMG or AREA element and to use ALT content if defined
        let tagName = e.tagName.toLowerCase();
        if ((tagName === 'img') || (tagName === 'area')) {
          if (e.alt) {
            strings.push(e.alt);
          }
        } else {
          let c = e.firstChild;
          while (c) {
            getText(c, strings);
            c = c.nextSibling;
          } // end loop
        }
      }
    }
  } // end function getStrings
  // Create return object
  let str = "Test",
    strings = [];
  getText(elem, strings);
  if (strings.length) str = strings.join(" ");
  return str;
}

/**
 * @fuction getAccessibleName
 *
 * @desc Returns the accessible name for an instractive element
 *
 * @param {node}  elem  - DOM element node of a labelable element
 */

function getAccessibleName (elem) {
  let labelledbyIds = elem.getAttribute('aria-labelledby'),
    label = elem.getAttribute('aria-label'),
    title = elem.getAttribute('title'),
    name = "";
  if (labelledbyIds && labelledbyIds.length) {
    let str,
      strings = [],
      ids = labelledbyIds.split(' ');
    if (!ids.length) ids = [labelledbyIds];
    for (let i = 0, l = ids.length; i < l; i += 1) {
      let e = document.getElementById(ids[i]);
      if (e) str = this.getTextContent(e);
      if (str && str.length) strings.push(str);
    }
    name = strings.join(" ");
  } else {
    if (this.isNotEmptyString(label)) {
      name = label;
    } else {
      if (this.isNotEmptyString(title)) {
        name = title;
      }
    }
  }
  return name;
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



