/* highlight.js */

/* Imports */
import DebugLogging  from './debug.js';

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

const OVERLAY_ID = 'id-skip-to-overlay';

/*
 *   @function getOverlayElement
 *
 *   @desc  Returns DOM node for the overlay element
 *
 *   @returns {Object} see @desc
 */

function getOverlayElement() {

  let overlayElem = document.getElementById(OVERLAY_ID);

  if (!overlayElem) {
    overlayElem = document.createElement('div');
    overlayElem.style.display = 'none';
    overlayElem.id = OVERLAY_ID;
    document.body.appendChild(overlayElem);

    const overlayElemChild = document.createElement('div');
    overlayElemChild.className = 'overlay-border';
    overlayElem.appendChild(overlayElemChild);
  }

  const infoElem = overlayElem.querySelector('.overlay-info');

  if (infoElem === null) {
    const overlayInfoChild = document.createElement('div');
    overlayInfoChild.className = 'overlay-info';
    overlayElem.appendChild(overlayInfoChild);
  }

  return overlayElem;
}

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
 *          otherwise false
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
 *   @param {Object}  elem            : DOM node of element to highlight
 *   @param {String}  highlightTarget : value of highlight target
 *   @param {String}  info            : Information about target
 *   @param {Boolean} force           : If true override isRduced
 */
function highlightElement(elem, highlightTarget, info='', force=false) {
  const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  const isReduced = !mediaQuery || mediaQuery.matches;

  if (elem && highlightTarget) {

    const overlayElem = getOverlayElement();
    const scrollElement = updateOverlayElement(overlayElem, elem, info);

    if (isElementInHeightLarge(elem)) {
      if (!isElementStartInViewport(elem) && (!isReduced || force)) {
        scrollElement.scrollIntoView({ behavior: highlightTarget, block: 'start', inline: 'nearest' });
      }
    }
    else {
      if (!isElementInViewport(elem)  && (!isReduced || force)) {
        scrollElement.scrollIntoView({ behavior: highlightTarget, block: 'center', inline: 'nearest' });
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
  const overlayElement = getOverlayElement();
  if (overlayElement) {
    overlayElement.style.display = 'none';
  }
}

/*
 *  @function  updateOverlayElement
 *
 *  @desc  Create an overlay element and set its position on the page.
 *
 *  @param  {Object}  overlayElem      -  DOM element for overlay
 *  @param  {Object}  element          -  DOM element node to highlight
 *  @param  {String}  info             -  Description of the element
 *
 */

function updateOverlayElement (overlayElem, element, info) {

  const childElem = overlayElem.firstElementChild;
  const infoElem  = overlayElem.querySelector('.overlay-info');

  let rect  = element.getBoundingClientRect();

  let isHidden = false;


  const rectLeft  = rect.left > offset ?
                  Math.round(rect.left - offset + window.scrollX) :
                  Math.round(rect.left + window.scrollX);

  let left = rectLeft;

  const rectWidth  = rect.left > offset ?
                  Math.max(rect.width  + offset * 2, minWidth) :
                  Math.max(rect.width, minWidth);

  let width = rectWidth;

  const rectTop    = rect.top > offset ?
                  Math.round(rect.top  - offset + window.scrollY) :
                  Math.round(rect.top + window.scrollY);

  let top = rectTop;

  const rectHeight   = rect.top > offset ?
                  Math.max(rect.height + offset * 2, minHeight) :
                  Math.max(rect.height, minHeight);

  let height = rectHeight;

  if ((rect.height < 3) || (rect.width < 3)) {
    isHidden = true;
  }

  if ((rectTop < 0) || (rectLeft < 0)) {
    isHidden = true;
    if (element.parentNode) {
      const parentRect = element.parentNode.getBoundingClientRect();

      if ((parentRect.top > 0) && (parentRect.left > 0)) {
        top = parentRect.top > offset ?
                  Math.round(parentRect.top  - offset + window.scrollY) :
                  Math.round(parentRect.top + window.scrollY);
        left = parentRect.left > offset ?
                  Math.round(parentRect.left - offset + window.scrollX) :
                  Math.round(parentRect.left + window.scrollX);
      }
      else {
        left = offset;
        top = offset;
      }
    }
    else {
      left = offset;
      top = offset;
    }
  }

  overlayElem.style.left   = left   + 'px';
  overlayElem.style.top    = top    + 'px';

  if (isHidden) {
    childElem.textContent = 'Heading is hidden';
    childElem.classList.add('skip-to-hidden');
    overlayElem.style.width  = 'auto';
    overlayElem.style.height = 'auto';
    childElem.style.width  = 'auto';
    childElem.style.height = 'auto';
    height = childElem.getBoundingClientRect().height;
    width  = childElem.getBoundingClientRect().width;
    if (rect.top > offset) {
      height += offset + 2;
      width += offset + 2;
    }
  }
  else {
    childElem.textContent = '';
    childElem.classList.remove('skip-to-hidden');
    overlayElem.style.width  = width  + 'px';
    overlayElem.style.height = height + 'px';
    childElem.style.width  = (width  - 2 * borderWidth) + 'px';
    childElem.style.height = (height - 2 * borderWidth) + 'px';
  }

  overlayElem.style.display = 'block';

  if (info) {
    infoElem.style.display = 'inline-block';
    infoElem.textContent = info;
    if (top >= infoElem.getBoundingClientRect().height) {
      childElem.classList.remove('hasInfoBottom');
      infoElem.classList.remove('hasInfoBottom');
      childElem.classList.add('hasInfoTop');
      infoElem.classList.add('hasInfoTop');
      if (!isHidden) {
        infoElem.style.top = (-1 * (height + infoElem.getBoundingClientRect().height - 2 * borderWidth)) + 'px';
      }
      else {
        infoElem.style.top = (-1 * (infoElem.getBoundingClientRect().height + childElem.getBoundingClientRect().height)) + 'px';
      }
    }
    else {
      childElem.classList.remove('hasInfoTop');
      infoElem.classList.remove('hasInfoTop');
      childElem.classList.add('hasInfoBottom');
      infoElem.classList.add('hasInfoBottom');
      infoElem.style.top = -2 + 'px';
    }
    return infoElem;
  }
  else {
    childElem.classList.remove('hasInfo');
    infoElem.style.display = 'none';
    return overlayElem;
  }
}
