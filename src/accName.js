/* accName.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('accName', false);
debug.flag = false;

/* Exports */

import {
  getNodeContents,
} from './namefrom';

export {
  getAccessibleName
};

/**
 *   @fuction getAccessibleName
 *
 *   @desc Returns the accessible name for an heading or landmark
 *
 *   @paramn {Object}   dom      - Document of the current element
 *   @param  {node}     element  - DOM element node for either a heading or
 *                               landmark
 *   @param  {Boolean}  fromContent  - if true will compute name from content
 * 
 *   @return {String} The accessible name for the landmark or heading element
 */

function getAccessibleName (doc, element, fromContent=false) {
  let accName = '';

  accName = nameFromRefs(doc, element, 'ariaLabelledByElements');

  if (accName === '' && element.hasAttribute('aria-label')) {
    accName =  element.getAttribute('aria-label').trim();
  }

  if (accName === '' && fromContent) {
    accName =  getNodeContents(element);
  }

  if (accName === '' && element.title.trim() !== '') {
    accName = element.title.trim();
  }

  return accName;
}

/*
*   @function nameFromRefs
*
*   @desc Get the value of attrName on element (a space-
*         separated list of IDREFs), visit each referenced element in the order it
*         appears in the list and obtain its accessible name (skipping recursive
*         aria-labelledby or aria-describedby calculations), and return an object
*         with name property set to a string that is a space-separated concatena-
*         tion of those results if any, otherwise return empty string.
*
*   @param {Object}  doc       -  Browser document object
*   @param {Object}  element   -  DOM element node
*   @param {String}  property  -  Property name (e.g. "ariaLabelledByElements",
*                                 "ariaDescribedByElements", or "ariaErrorMessageElements")
*
*   @returns {String} see @desc 
*/
function nameFromRefs (doc, element, property) {
  const arr = [];

  if (element[property] && element[property].length) {

    element[property].forEach ((elem) => {
      const accName = getNodeContents(elem);
      console.log(`[accName]: ${accName}`);
      if (accName && accName.length) arr.push(accName);
    });
  }

  if (arr.length) {
    return arr.join(' ');
  }

  return '';
}
