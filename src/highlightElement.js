/* highlight.js */

/* Imports */
import DebugLogging  from './debug.js';

import {colorThemes} from './colorThemes.js';

/* Constants */
const debug = new DebugLogging('highlight', false);
debug.flag = false;

const minWidth = 68;
const minHeight = 27;
const offset = 6;
const borderWidth = 2;

import {
  HIGHLIGHT_ID
} from './constants.js';

const defaultStyleOptions = colorThemes['default'];

const styleHighlightTemplate = document.createElement('template');
styleHighlightTemplate.textContent = `
:root {
  color-scheme: light dark;
}

#${HIGHLIGHT_ID} {
  margin: 0;
  padding: 0;
  position: absolute;
  border-radius: 3px;
  border: 4px solid light-dark($buttonBackgroundColor, $buttonBackgroundDarkColor);
  box-sizing: border-box;
  pointer-events:none;
}

#${HIGHLIGHT_ID} .overlay-border {
  margin: 0;
  padding: 0;
  position: relative;
  top: -2px;
  left: -2px;
  border-radius: 3px 3px 3px 3px;
  border: 2px solid light-dark($focusBorderColor, $focusBorderDarkColor);
  z-index: $zHighlight;
  box-sizing: border-box;
  pointer-events:none;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

#${HIGHLIGHT_ID} .overlay-border.skip-to-hidden {
  background-color: light-dark($hiddenHeadingBackgroundColor, $hiddenHeadingBackgroundDarkColor);
  color: light-dark($hiddenHeadingColor, $hiddenHeadingDarkColor);
  font-family: $fontFamily;
  font-size: $fontSize;
  font-style: italic;
  font-weight: bold;
  text-align: center;
  padding: .25em;
  animation: fadeIn 1.5s;
}

#${HIGHLIGHT_ID} .overlay-border.hasInfoBottom {
  border-radius: 3px 3px 3px 0;
}

#${HIGHLIGHT_ID} .overlay-border.hasInfoTop {
  border-radius: 0 3px 3px 3px;
}

#${HIGHLIGHT_ID} .overlay-info {
  position: relative;
  text-align: left;
  left: -2px;
  padding: 1px 4px;
  font-size: $fontSize;
  font-family: $fontFamily;
  border: 2px solid light-dark($focusBorderColor, $focusBorderDarkColor);
  background-color: light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  color: light-dark($menuTextColor, $menuTextDarkColor);
  z-index: $zHighlight;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events:none;
}

#${HIGHLIGHT_ID} .overlay-info.hasInfoTop {
  border-radius: 3px 3px 0 0;
}

#${HIGHLIGHT_ID} .overlay-info.hasInfoBottom {
  border-radius: 0 0 3px 3px;
}

@media (forced-colors: active) {

  #${HIGHLIGHT_ID} {
    border-color: ButtonBorder;
  }

  #${HIGHLIGHT_ID} .overlay-border {
    border-color: ButtonBorder;
  }

  #${HIGHLIGHT_ID} .overlay-border.skip-to-hidden {
    background-color: ButtonFace;
    color: ButtonText;
  }

  #${HIGHLIGHT_ID} .overlay-info {
    border-color: ButtonBorder;
    background-color: ButtonFace;
    color: ButtonText;
  }

}
`;

/*
 *   @class HighlightElement
 *
 */

export default class HighlightElement extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Get references

    this.overlayElem  = document.createElement('div');
    this.overlayElem.id = HIGHLIGHT_ID;
    this.shadowRoot.appendChild(this.overlayElem);
    this.overlayElem.style.display = 'none';

    this.borderElem = document.createElement('div');
    this.borderElem.className = 'overlay-border';
    this.overlayElem.appendChild(this.borderElem);

    this.infoElem = document.createElement('div');
    this.infoElem.className = 'overlay-info';
    this.overlayElem.appendChild(this.infoElem);

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

    function updateOption(style, option, configOption, defaultOption) {
      if (configOption) {
        return style.replaceAll(option, configOption);
      }
      else {
        return style.replaceAll(option, defaultOption);
      }
    }

    // make a copy of the template
    let style = styleHighlightTemplate.textContent.slice(0);

    style = updateOption(style,
                         '$fontFamily',
                         config.fontFamily,
                         defaultStyleOptions.fontFamily);

    style = updateOption(style,
                         '$fontSize',
                         config.fontSize,
                         defaultStyleOptions.fontSize);

    style = updateOption(style,
                         '$buttonBackgroundColor',
                         config.buttonBackgroundColor,
                         defaultStyleOptions.buttonBackgroundColor);

    style = updateOption(style,
                         '$buttonBackgroundDarkColor',
                         config.buttonBackgroundDarkColor,
                         defaultStyleOptions.buttonBackgroundDarkColor);

    style = updateOption(style,
                         '$focusBorderColor',
                         config.focusBorderColor,
                         defaultStyleOptions.focusBorderColor);

    style = updateOption(style,
                         '$focusBorderDarkColor',
                         config.focusBorderDarkColor,
                         defaultStyleOptions.focusBorderDarkColor);

    style = updateOption(style,
                         '$menuBackgroundColor',
                         config.menuBackgroundColor,
                         defaultStyleOptions.menuBackgroundColor);

    style = updateOption(style,
                         '$menuBackgroundDarkColor',
                         config.menuBackgroundDarkColor,
                         defaultStyleOptions.menuBackgroundDarkColor);

    style = updateOption(style,
                         '$menuTextColor',
                         config.menuTextColor,
                         defaultStyleOptions.menuTextColor);

    style = updateOption(style,
                         '$menuTextDarkColor',
                         config.menuTextDarkColor,
                         defaultStyleOptions.menuTextDarkColor);

    style = updateOption(style,
                         '$hiddenHeadingColor',
                         config.hiddenHeadingColor,
                         defaultStyleOptions.hiddenHeadingColor);

    style = updateOption(style,
                         '$hiddenHeadingDarkColor',
                         config.hiddenHeadingDarkColor,
                         defaultStyleOptions.hiddenHeadingDarkColor);

    style = updateOption(style,
                         '$hiddenHeadingBackgroundColor',
                         config.hiddenHeadingBackgroundColor,
                         defaultStyleOptions.hiddenHeadingBackgroundColor);

    style = updateOption(style,
                         '$hiddenHeadingBackgroundDarkColor',
                         config.hiddenHeadingBackgroundDarkColor,
                         defaultStyleOptions.hiddenHeadingBackgroundDarkColor);

    style = updateOption(style,
                         '$zHighlight',
                         config.zHighlight,
                         defaultStyleOptions.zHighlight);


    let styleNode = this.shadowRoot.querySelector('style');

    if (styleNode) {
      styleNode.remove();
    }

    styleNode = document.createElement('style');
    styleNode.textContent = style;
    this.shadowRoot.appendChild(styleNode);

  }

  /*
   *   @method isElementInViewport
   *
   *   @desc  Returns true if element is already visible in view port,
   *          otheriwse false
   *
   *   @param {Object} element : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
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
   *   @param {Object} element : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementStartInViewport(element) {
    const rect = element.getBoundingClientRect();
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
   *   @param {Object} element : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementInHeightLarge(element) {
    var rect = element.getBoundingClientRect();
    return (1.2 * rect.height) > (window.innerHeight || document.documentElement.clientHeight);
  }

  /*
   *   @method highlight
   *
   *   @desc  Highlights the element with the id on a page when highlighting
   *          is enabled (NOTE: Highlight is enabled by default)
   *
   *   @param {Object}  elem            : DOM node of element to highlight
   *   @param {String}  highlightTarget : value of highlight target
   *   @param {String}  info            : Information about target
   *   @param {Boolean} force           : If true override isRduced
   */

  highlight(elem, highlightTarget, info='', force=false) {
    const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const isReduced = !mediaQuery || mediaQuery.matches;

    if (elem && highlightTarget) {

      const scrollElement = this.updateHighlightElement(elem, info);

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
   *   @method removeHighlight
   *
   *   @desc  Hides the highlight element on the page
   */
  removeHighlight() {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'none';
    }
  }

  /*
   *  @method  updateHighlightElement
   *
   *  @desc  Create an overlay element and set its position on the page.
   *
   *  @param  {Object}  element          -  DOM element node to highlight
   *  @param  {String}  info             -  Description of the element
   *
   */

   updateHighlightElement (element, info) {

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

    this.overlayElem.style.left   = left   + 'px';
    this.overlayElem.style.top    = top    + 'px';

    if (isHidden) {
      this.borderElem.textContent = 'Heading is hidden';
      this.borderElem.classList.add('skip-to-hidden');
      this.overlayElem.style.width  = 'auto';
      this.overlayElem.style.height = 'auto';
      this.borderElem.style.width  = 'auto';
      this.borderElem.style.height = 'auto';
      height = this.borderElem.getBoundingClientRect().height;
      width  = this.borderElem.getBoundingClientRect().width;
      if (rect.top > offset) {
        height += offset + 2;
        width += offset + 2;
      }
    }
    else {
      this.borderElem.textContent = '';
      this.borderElem.classList.remove('skip-to-hidden');
      this.overlayElem.style.width  = width  + 'px';
      this.overlayElem.style.height = height + 'px';
      this.borderElem.style.width  = (width  - 2 * borderWidth) + 'px';
      this.borderElem.style.height = (height - 2 * borderWidth) + 'px';
    }

    this.overlayElem.style.display = 'block';

    if (info) {
      this.infoElem.style.display = 'inline-block';
      this.infoElem.textContent = info;
      if (top >= this.infoElem.getBoundingClientRect().height) {
        this.borderElem.classList.remove('hasInfoBottom');
        this.infoElem.classList.remove('hasInfoBottom');
        this.borderElem.classList.add('hasInfoTop');
        this.infoElem.classList.add('hasInfoTop');
        if (!isHidden) {
          this.infoElem.style.top = (-1 * (height + this.infoElem.getBoundingClientRect().height - 2 * borderWidth)) + 'px';
        }
        else {
          this.infoElem.style.top = (-1 * (this.infoElem.getBoundingClientRect().height + this.borderElem.getBoundingClientRect().height)) + 'px';
        }
      }
      else {
        this.borderElem.classList.remove('hasInfoTop');
        this.infoElem.classList.remove('hasInfoTop');
        this.borderElem.classList.add('hasInfoBottom');
        this.infoElem.classList.add('hasInfoBottom');
        this.infoElem.style.top = -2 + 'px';
      }
      return this.infoElem;
    }
    else {
      this.borderElem.classList.remove('hasInfo');
      this.infoElem.style.display = 'none';
      return this.overlayElem;
    }
  }
}
