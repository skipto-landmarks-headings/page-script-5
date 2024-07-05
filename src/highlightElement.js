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

const minWidth = 68;
const minHeight = 27;
const offset = 5;

const overlayElement = document.createElement('div');
overlayElement.id = 'id-skip-to-highlight';
document.body.appendChild(overlayElement);
overlayElement.style.display = 'none';


/*
 *   @function isElementInViewport
 *
 *   @desc  Returns true if element is already visible in view port,
*           otheriwse false
 *
 *   @param {Object} element : DOM node of element to highlight
 *
 *   @returns see @desc
 */

function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/*
 *   @function highlightElement
 *
 *   @desc  Highlights the element with the id on a page when highlighting
 *          is enabled (NOTE: Highlight is enabled by default)
 *
 *   @param {Object} config : SkipTo.js configuration options
 *   @param {String} id     : id of the element to highlight
 */
function highlightElement(config, id) {
  const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  const isReduced = !mediaQuery || mediaQuery.matches;
  const highlightEnabled = (typeof config.highlightTarget === 'string') ?
                        config.highlightTarget.trim().toLowerCase() === 'enabled' :
                        false;
  const element = queryDOMForSkipToId(id);

  console.log(`[A]: ${element.getAttribute('data-skip-to-id')} (${highlightEnabled}) (${isElementInViewport(element)})`);

  if (element && highlightEnabled) {
    updateOverlayElement(overlayElement, element);
    if (!isElementInViewport(element)  && !isReduced) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }
}

/*
 *   @function removeHighlight
 *
 *   @desc  Hides the highlight element on the page
 */
function removeHighlight() {
  console.log(`[removeHighlight]`);
  overlayElement.style.display = 'none';
}

/*
 *  @function  updateOverlayElement
 *
 *  @desc  Create an overlay element and set its position on the page.
 *
 *  @param  {Object}  overlay  -  DOM element for overlay
 *  @param  {Object}  element  -  DOM element node to highlight
 *
 */

function updateOverlayElement (overlayElem, element) {

  const rect = element.getBoundingClientRect();

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

  console.log(`[Rect]: ${overlayElem.style.left} ${overlayElem.style.width} ${overlayElem.style.height} display: "${overlayElem.style.display}"`);

  overlayElem.style.display = 'block';
}

