/* highlight.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('highlight', false);
debug.flag = false;

const minWidth = 68;
const minHeight = 27;

import {
  HIDDEN_MESSAGE_ID,
  HIGHLIGHT_ID
} from './constants.js';

/*
 *   @class HighlightElement
 *
 */

export default class HighlightElement {

  constructor(attachElem) {

    // Get references

    this.overlayElem  = document.createElement('div');
    this.overlayElem.id = HIGHLIGHT_ID;
    attachElem.appendChild(this.overlayElem);
    this.overlayElem.style.display = 'none';

    this.borderElem = document.createElement('div');
    this.borderElem.className = 'overlay-border';
    this.overlayElem.appendChild(this.borderElem);

    this.infoElem = document.createElement('div');
    this.infoElem.className = 'overlay-info';
    this.overlayElem.appendChild(this.infoElem);

    this.hiddenElem = document.createElement('div');
    this.hiddenElem.id = HIDDEN_MESSAGE_ID;
    attachElem.appendChild(this.hiddenElem);
    this.hiddenElem.style.display = 'none';

    this.borderWidth    = 0;
    this.borderContrast = 0;
    this.offset         = 0;

    this.msgHeadingIsHidden = '';

    this.configureStyle();

  }

  /*
   *   @method configureStyle
   *
   *   @desc  Updates stylesheet for styling the highlight information
   *
   *   @param {Object} config : color and font information
   */

  configureStyle(config={}) {

    // Get i18n Messages

    this.msgHeadingIsHidden = typeof config.msgHeadingIsHidden === 'string' ?
                            config.msgHeadingIsHidden :
                            'Heading is hidden';

    this.msgRegionIsHidden = typeof config.msgRegionIsHidden === 'string' ?
                            config.msgRegionIsHidden :
                            'Region is hidden';

    this.msgElementIsHidden = typeof config.msgElementIsHidden === 'string' ?
                            config.msgElemenIsHidden :
                            'Element is hidden';


/*

    const highlightBorderSize =  config.highlightBorderSize ?
                                 config.highlightBorderSize :
                                 defaultStyleOptions.highlightBorderSize;

    switch (highlightBorderSize) {
      case 'small':
        this.borderWidth = 2;
        this.borderContrast = 1;
        this.offset = 4;
        this.fontSize = '12pt';
        break;

      case 'medium':
        this.borderWidth = 3;
        this.borderContrast = 2;
        this.offset = 4;
        this.fontSize = '13pt';
        break;

      case 'large':
        this.borderWidth = 4;
        this.borderContrast = 3;
        this.offset = 6;
         this.fontSize = '14pt';
       break;

      case 'x-large':
        this.borderWidth = 6;
        this.borderContrast = 3;
        this.offset = 8;
        this.fontSize = '16pt';
        break;

      default:
        this.borderWidth = 2;
        this.borderContrast = 1;
        this.offset = 4;
        this.fontSize = '12pt';
        break;
    }


    style = updateOption(style,
                         '$highlightOffset',
                         this.offset,
                         this.offset);

    style = updateOption(style,
                         '$overlayBorderWidth',
                         this.borderWidth,
                         this.borderWidth);

    style = updateOption(style,
                         '$shadowBorderWidth',
                         this.borderWidth + 2 * this.borderContrast,
                         this.borderWidth + 2 * this.borderContrast);

    style = updateOption(style,
                         '$infoBorderWidth',
                         this.borderWidth,
                         this.borderWidth);

*/

  }

  /*
   *   @method highlight
   *
   *   @desc  Highlights the element on the page when highlighting
   *          is enabled (NOTE: Highlight is enabled by default)
   *
   *   @param {Object}  elem            : DOM node of element to highlight
   *   @param {String}  highlightTarget : value of highlight target
   *   @param {String}  info            : Information about target
   *   @param {Boolean} force           : If true override isRduced
   */

  highlight(elem, highlightTarget, info='', force=false) {
    let scrollElement;
    const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const isReduced = !mediaQuery || mediaQuery.matches;

    if (elem && highlightTarget) {

      const rect = elem.getBoundingClientRect();

      // If target element is hidden create a visible element
      debug.flag && debug.log(`[    info]: ${info}`);
      debug.flag && debug.log(`[    rect]: Left: ${rect.left} Top: ${rect.top} Width: ${rect.width} height: ${rect.height}`);
      debug.flag && debug.log(`[isHidden]: ${this.isElementHidden(elem)}`);

      if (this.isElementHidden(elem)) {
        // If element is hidden make hidden element message visible
        // and use for highlighing
        this.hiddenElem.textContent = this.getHiddenMessage(elem);
        this.hiddenElem.style.display = 'block';

        const left = rect.left > 0 ? rect.left + window.scrollX : this.offset;
        const top  = rect.top > 0 ? rect.top + window.scrollY : this.offset;

        this.hiddenElem.style.left = left + 'px';
        this.hiddenElem.style.top = top + 'px';
        scrollElement = this.updateHighlightElement(this.hiddenElem,
                                                    info,
                                                    0,
                                                    this.borderWidth,
                                                    this.borderContrast);
      }
      else {
        this.hiddenElem.style.display = 'none';
        scrollElement = this.updateHighlightElement(elem,
                                                    info,
                                                    this.offset,
                                                    this.borderWidth,
                                                    this.borderContrast);
      }

      if (this.isElementInHeightLarge(elem)) {
        if (!this.isElementStartInViewport(elem) && (!isReduced || force)) {
          scrollElement.scrollIntoView({ behavior: highlightTarget, block: 'start', inline: 'nearest' });
        }
      }
      else {
        if (!this.isElementInViewport(elem)  && (!isReduced || force)) {
          scrollElement.scrollIntoView({ behavior: highlightTarget, block: 'center', inline: 'nearest' });
        }
      }
    }
  }

  /*
   *  @method  updateHighlightElement
   *
   *  @desc  Create an overlay element and set its position on the page.
   *
   *  @param  {Object}  elem          -  DOM element node to highlight
   *  @param  {String}  info          -  Description of the element
   *  @param  {Number}  offset        -  Number of pixels for offset
   *  @param  {Number}  borderWidth   -  Number of pixels for border width
   *  @param  {Number}  borderContrast  -  Number of pixels to provide border contrast
   *
   */

   updateHighlightElement (elem, info, offset, borderWidth, borderContrast) {

    const adjRect = this.getAdjustedRect(elem, offset, borderWidth, borderContrast);

    const borderElemOffset = -1 * (this.borderWidth + this.borderContrast);

    this.overlayElem.style.left   = adjRect.left   + 'px';
    this.overlayElem.style.top    = adjRect.top    + 'px';
    this.borderElem.style.left    = borderElemOffset + 'px';
    this.borderElem.style.top     = borderElemOffset + 'px';

    this.overlayElem.style.width  = adjRect.width  + 'px';
    this.overlayElem.style.height = adjRect.height + 'px';
    this.borderElem.style.width   = (adjRect.width - (2 * borderContrast)) + 'px';
    this.borderElem.style.height  = (adjRect.height - (2 * borderContrast)) + 'px';

    this.overlayElem.style.display = 'block';

    if (info) {

      this.infoElem.style.display = 'inline-block';
      this.infoElem.textContent   = info;

      const infoElemOffsetLeft = -1 * (borderWidth + 2 * borderContrast);
      this.infoElem.style.left = infoElemOffsetLeft + 'px';

      const infoElemRect    = this.infoElem.getBoundingClientRect();

      // Is info displayed above or below the highlighted element
      if (adjRect.top >= infoElemRect.height) {
        // Info is displayed above the highlighted element (e.g. most of the time)
        this.overlayElem.classList.remove('hasInfoBottom');
        this.borderElem.classList.remove('hasInfoBottom');
        this.infoElem.classList.remove('hasInfoBottom');
        this.overlayElem.classList.add('hasInfoTop');
        this.borderElem.classList.add('hasInfoTop');
        this.infoElem.classList.add('hasInfoTop');
        this.infoElem.style.top =  (-1 * (adjRect.height +
                                         infoElemRect.height +
                                         borderWidth))  + 'px';
      }
      else {
        // Info is displayed below the highlighted element when it is at the top of
        // the window

        const infoElemOffsetTop  = -1 * (borderWidth + borderContrast);

        this.overlayElem.classList.remove('hasInfoTop');
        this.borderElem.classList.remove('hasInfoTop');
        this.infoElem.classList.remove('hasInfoTop');
        this.overlayElem.classList.add('hasInfoBottom');
        this.borderElem.classList.add('hasInfoBottom');
        this.infoElem.classList.add('hasInfoBottom');
        this.infoElem.style.top  = infoElemOffsetTop + 'px';
      }
      return this.infoElem;
    }
    else {
      this.overlayElem.classList.remove('hasInfoTop');
      this.overlayElem.classList.remove('hasInfoBottom');
      this.borderElem.classList.remove('hasInfoTop');
      this.borderElem.classList.remove('hasInfoBottom');
      this.infoElem.style.display = 'none';
      return this.overlayElem;
    }
  }


  /*
   *   @method getAdjustedRect
   *
   *   @desc  Returns a object with dimensions adjusted for highlighting element
   *
   *  @param  {Object}  elem            -  DOM node of element to be highlighted
   *  @param  {Number}  offset          -  Number of pixels for offset
   *  @param  {Number}  borderWidth     -  Number of pixels for border width
   *  @param  {Number}  borderContrast  -  Number of pixels to provide border contrast
   *
   *   @returns see @desc
   */

   getAdjustedRect(elem, offset, borderWidth, borderContrast) {

    const rect  = elem.getBoundingClientRect();

    const adjRect = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };

    const offsetBorder = offset + borderWidth + 2 * borderContrast;

    adjRect.left    = rect.left > offset ?
                      Math.round(rect.left + (-1 * offsetBorder) + window.scrollX) :
                      Math.round(rect.left + window.scrollX);

    adjRect.width   = rect.left > offset ?
                      Math.max(rect.width  + (2 * offsetBorder), minWidth) :
                      Math.max(rect.width, minWidth);


    adjRect.top     = rect.top > offset ?
                      Math.round(rect.top  + (-1 * offsetBorder) + window.scrollY) :
                      Math.round(rect.top + window.scrollY);

    adjRect.height  = rect.top > offset ?
                      Math.max(rect.height + (2 * offsetBorder), minHeight) :
                      Math.max(rect.height, minHeight);

    if ((adjRect.top < 0) || (adjRect.left < 0)) {
    // Element is near top or left side of screen
      adjRect.left = this.offset;
      adjRect.top = this.offset;
    }

    return adjRect;
  }

  /*
   *   @method isElementInViewport
   *
   *   @desc  Returns true if element is already visible in view port,
   *          otheriwse false
   *
   *   @param {Object} elem : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementInViewport(elem) {
    const rect = elem.getBoundingClientRect();
    return (
      rect.top >= window.screenY &&
      rect.left >= window.screenX &&
      rect.bottom <= ((window.screenY + window.innerHeight) ||
                      (window.screenY + document.documentElement.clientHeight)) &&
      rect.right <= ((window.screenX + window.innerWidth) ||
                     (window.screenX + document.documentElement.clientWidth)));
  }

  /*
   *   @method isElementStartInViewport
   *
   *   @desc  Returns true if start of the element is already visible in view port,
   *          otherwise false
   *
   *   @param {Object} elem : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementStartInViewport(elem) {
    const rect = elem.getBoundingClientRect();
    return (
        rect.top >= window.screenY &&
        rect.top <= ((window.screenY + window.innerHeight) ||
                     (window.screenY + document.documentElement.clientHeight)) &&
        rect.left >= window.screenX &&
        rect.left <= ((window.screenX + window.innerWidth) ||
                     (window.screenX + document.documentElement.clientWidth)));
  }


  /*
   *   @method isElementHeightLarge
   *
   *   @desc  Returns true if element client height is larger than clientHeight,
   *          otheriwse false
   *
   *   @param {Object} elem : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementInHeightLarge(elem) {
    var rect = elem.getBoundingClientRect();
    return (1.2 * rect.height) > (window.innerHeight || document.documentElement.clientHeight);
  }

  /*
   *   @method isElementHidden
   *
   *   @desc  Returns true if the element is hidden on the
   *          graphical rendering
   *
   *   @param  {Object}  elem   : DOM node
   *
   *   @returns see @desc
   */
  isElementHidden(elem) {
    const rect = elem.getBoundingClientRect();
    return (rect.height < 3) ||
           (rect.width  < 3) ||
           ((rect.left + rect.width)  < (rect.width / 2)) ||
           ((rect.top  + rect.height) < (rect.height / 2));
  }

  /*
   *   @method getHiddenMessage
   *
   *   @desc  Returns string describing the hidden element
   *
   *   @param  {Object}  elem   : DOM node
   *
   *   @returns see @desc
   */
  getHiddenMessage(elem) {
    if (elem.hasAttribute('data-skip-to-info')) {
      const info = elem.getAttribute('data-skip-to-info');

      if (info.includes('heading')) {
        return this.msgHeadingIsHidden;
      }

      if (info.includes('landmark')) {
        return this.msgRegionIsHidden;
      }
    }

    return this.msgElementIsHidden;
  }

  /*
   *   @method removeHighlight
   *
   *   @desc  Hides the highlight element on the page
   */
  removeHighlight() {
    if (this.overlayElem) {
      this.overlayElem.style.display = 'none';
    }
    if (this.hiddenElem) {
      this.hiddenElem.style.display = 'none';
    }
  }

}
