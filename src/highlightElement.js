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

const adjustYOffset = 30;
const adjustXOffset = 50;

/*
 *   @function highlightElement
 *
 *   @desc  Highlights the element with the id on a page
 *
 *   @param {Object} config : configuration options
 *   @param {String} id     : id of the element to highlight
 */
function highlightElement(config, id) {
  const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  const isReduced = !mediaQuery || mediaQuery.matches;
  const node = queryDOMForSkipToId(id);

  if (config.highlightEnabled) {
    if (lastHighlightElement) {
      lastHighlightElement.remove();
    }
    lastHighlightElement = addOverlayElement(node);
    const rect = node.getBoundingClientRect();
    if (rect.top > (window.pageYOffset + window.innerHeight - adjustYOffset) ||
        rect.top < (window.pageYOffset + adjustYOffset) ||
        rect.left > (window.pageXOffset + window.innerWidth - adjustXOffset) ||
        rect.left < (window.pageXOffset + adjustXOffset)) {
      if (!isReduced && config.highlightScrollEnabled) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
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
  overlayElem.id = 'id-skip-to-highlight';

  if (rect.left > offset) {
    overlayElem.style.left   = Math.round(rect.left - offset + window.scrollX) + 'px';
    overlayElem.style.width  = Math.max(rect.width  + offset * 2, minWidth)  + 'px';
  }
  else {
    overlayElem.style.left   = Math.round(rect.left + window.scrollX) + 'px';
    overlayElem.style.width  = Math.max(rect.width, minWidth)  + 'px';
  }

  if (rect.top > offset) {
    overlayElem.style.top    = Math.round(rect.top  - offset + window.scrollY) + 'px';
    overlayElem.style.height = Math.max(rect.height + offset * 2, minHeight) + 'px';
  }
  else {
    overlayElem.style.top    = Math.round(rect.top + window.scrollY) + 'px';
    overlayElem.style.height = Math.max(rect.height, minHeight) + 'px';
  }

  console.log(`left: ${overlayElem.style.left}`);
  console.log(`top: ${overlayElem.style.top}`);

  console.log(`width: ${overlayElem.style.width}`);
  console.log(`height: ${overlayElem.style.height}`);

  document.body.appendChild(overlayElem);

  return overlayElem;
}

