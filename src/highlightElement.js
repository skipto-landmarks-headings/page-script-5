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
const offset = 6;
const borderWidth = 2;

const overlayElement = document.createElement('div');
overlayElement.id = 'id-skip-to-highlight';
document.body.appendChild(overlayElement);
overlayElement.style.display = 'none';

const overlayElementChild = document.createElement('div');
overlayElement.appendChild(overlayElementChild);


/*
 *   @function isElementInViewport
 *
 *   @desc  Returns true if element is already visible in view port,
 *          otheriwse false
 *
 *   @param {Object} element : DOM node of element to highlight
 *
 *   @returns see @desc
 */

function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
      rect.top >= window.screenY &&
      rect.left >= window.screenX &&
      rect.bottom <= ((window.screenY + window.innerHeight) || 
                      (window.screenY + document.documentElement.clientHeight)) &&
      rect.right <= ((window.screenX + window.innerWidth) || 
                     (window.screenX + document.documentElement.clientWidth))
  );
}

/*
 *   @function isElementStartInViewport
 *
 *   @desc  Returns true if start of the element is already visible in view port,
 *          otheriwse false
 *
 *   @param {Object} element : DOM node of element to highlight
 *
 *   @returns see @desc
 */

function isElementStartInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
      rect.top >= window.screenY &&
      rect.top <= ((window.screenY + window.innerHeight) || 
                   (window.screenY + document.documentElement.clientHeight)) &&
      rect.left >= window.screenX &&
      rect.left <= ((window.screenX + window.innerWidth) || 
                   (window.screenX + document.documentElement.clientWidth))
  );
}


/*
 *   @function isElementHeightLarge
 *
 *   @desc  Returns true if element client height is larger than clientHeight,
 *          otheriwse false
 *
 *   @param {Object} element : DOM node of element to highlight
 *
 *   @returns see @desc
 */

function isElementInHeightLarge(element) {
  var rect = element.getBoundingClientRect();
  return (1.2 * rect.height) > (window.innerHeight || document.documentElement.clientHeight);
}

/*
 *   @function highlightElement
 *
 *   @desc  Highlights the element with the id on a page when highlighting
 *          is enabled (NOTE: Highlight is enabled by default)
 *
 *   @param {String} id     : id of the element to highlight
 */
function highlightElement(id) {
  const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  const isReduced = !mediaQuery || mediaQuery.matches;
  const element = queryDOMForSkipToId(id);

  if (element) {
    updateOverlayElement(overlayElement, element);
    if (isElementInHeightLarge(element)) {
      if (!isElementStartInViewport(element)  && !isReduced) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
    else {
      if (!isElementInViewport(element)  && !isReduced) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }
}

/*
 *   @function removeHighlight
 *
 *   @desc  Hides the highlight element on the page
 */
function removeHighlight() {
  overlayElement.style.display = 'none';
}

/*
 *  @function  updateOverlayElement
 *
 *  @desc  Create an overlay element and set its position on the page.
 *
 *  @param  {Object}  overlayElem      -  DOM element for overlay
 *  @param  {Object}  element          -  DOM element node to highlight
 *
 */

function updateOverlayElement (overlayElem, element) {

  const childElem = overlayElem.firstElementChild;

  const rect = element.getBoundingClientRect();

  const left   = rect.left > offset ?
                  Math.round(rect.left - offset + window.scrollX) :
                  Math.round(rect.left + window.scrollX);

  const width  = rect.left > offset ?
                  Math.max(rect.width  + offset * 2, minWidth) :
                  Math.max(rect.width, minWidth);

  const top    = rect.top > offset ?
                  Math.round(rect.top  - offset + window.scrollY) :
                  Math.round(rect.top + window.scrollY);

  const height = rect.top > offset ?
                  Math.max(rect.height + offset * 2, minHeight) :
                  Math.max(rect.height, minHeight);

  overlayElem.style.left   = left   + 'px';
  overlayElem.style.width  = width  + 'px';
  overlayElem.style.top    = top    + 'px';
  overlayElem.style.height = height + 'px';

  childElem.style.width  = (width  - 2 * borderWidth) + 'px';
  childElem.style.height = (height - 2 * borderWidth) + 'px';


  overlayElem.style.display = 'block';
}

