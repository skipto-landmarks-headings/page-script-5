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

let lastHighlightElement = false;

/* Constants */
const debug = new DebugLogging('highlight', false);
debug.flag = false;

const minWidth = 68;
const minHeight = 27;
const offset = 5;
const radius = 3;

/*
 *   @function highlightElement
 *
 *   @desc  Highlights the element with the id on a page
 *
 *   @param {String}. id : id of the element to highlight
 */
function highlightElement(id) {
  const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  const isReduced = !mediaQuery || mediaQuery.matches;
  const node = queryDOMForSkipToId(id);
  console.log(`[${node}]: ${node.getAttribute('data-skip-to-id')} isReduced: ${isReduced}`);

  if (!isReduced) {
    if (lastHighlightElement) {
      lastHighlightElement.remove();
    }
    lastHighlightElement = addOverlayElement(node);
    console.log(`Highlight content: ${lastHighlightElement}`);
    node.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

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
  if (lastHighlightElement) {
    lastHighlightElement.remove();
  }}

/*
 *  @function  addOverlayElement
 *
 *  @desc  Create an overlay element and set its position on the page.
 *
 *  @param  {Object}  element          -  DOM element node to highlight
 *
 *  @returns {Object} DOM node element used for the Overlay
 */

function addOverlayElement (element) {

  const rect = element.getBoundingClientRect();
  const overlayElem = document.createElement('div');

  overlayElem.style.setProperty('position', 'absolute');
  overlayElem.style.setProperty('border-radius', radius + 'px');
  overlayElem.style.setProperty('border', 'solid red 2px');
  overlayElem.style.setProperty('z-index', '10000');

  overlayElem.style.left   = Math.round(rect.left - offset + window.scrollX) + 'px';
  overlayElem.style.top    = Math.round(rect.top  - offset + window.scrollY) + 'px';

  overlayElem.style.width  = Math.max(rect.width  + offset * 2, minWidth)  + 'px';
  overlayElem.style.height = Math.max(rect.height + offset * 2, minHeight) + 'px';

  document.body.appendChild(overlayElem);

  return overlayElem;
}

