/* highlight.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  queryDOMForSkipToId
} from './landmarksHeadings.js';

/*Exports */
export {
  highlightElement,
  removeHighlight
};

/* Constants */
const debug = new DebugLogging('highlight', false);
debug.flag = false;

/*
 *   @function highlightElement
 *
 *   @desc  Highlights the element with the id on a page
 *
 *   @param {String}. id : id of the element to highlight
 */
function highlightElement(id) {
  const node = queryDOMForSkipToId(id);
  console.log(`[${node}]: ${node.getAttribute('data-skip-to-id')}`);

}

/*
 *   @function removeHighlight
 *
 *   @desc  Removes all highlights from the page
 *
 *   @param {String}. id : id of the element to highlight
 */
function removeHighlight() {
  console.log(`[removeHighlight]`);
}

