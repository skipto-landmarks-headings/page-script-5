/* accName.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('accName', false);
debug.flag = true;

/* Exports */

import {
  getAttributeValue
} from './utils';

import {
  isHeadingElement,
  nameFromAttribute,
  getElementContents,
} from './namefrom';

export {
  getAccessibleName
};

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
    debug.flag && debug.log(`[getElementContents]: ${getElementContents(element)}`);
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
    debug.flag && debug.log(`[nameFromAttributeIdRefs][value]: ${value}`);
    const idRefs = value.split(' ');

    for (let i = 0; i < idRefs.length; i++) {
      const refElement = doc.getElementById(idRefs[i]);
      debug.flag && debug.log(`[nameFromAttributeIdRefs][refElement]: ${refElement}`);
      if (refElement) {
        const accName = getAccessibleName(doc, refElement, true);
        debug.flag && debug.log(`[nameFromAttributeIdRefs][accName]: ${accName}`);
        if (accName && accName.length) arr.push(accName);
      }
    }
  }

  if (arr.length) {
    return arr.join(' ');
  }

  return '';
}