/* skipto.js */

/* The code in this section is to manage the use of SkipTo.js as
 * a page script, bookmarklet and extension.
 * There can only be one instance of SkipTo.js loaded on a page at
 * any one time.
 *
 * If a page version of SkipTo.js is loaded, any attempts to load
 * additional copies of the SkipTo.js  will be ignored.
 *
 * If the bookmarklet version of SkipTo.js is loaded it will unload any
 * existing copies of page script version of SkipTo.js.  The bookmarlet
 * version will be prevented from loading if the SkipTo.js extension
 * version has been loaded.
 *
 * If the extension version of SkipTo.js is loaded any other version
 * of SkipTo.js will be removed and any attempts to load them from the
 * page or a bookmarlet will be ignored.
 */

import SkipToContent570 from './skiptoContent.js';
import DebugLogging  from './debug.js';

/* constants */
const debug = new DebugLogging('skipto', false);
debug.flag = false;

(function() {

const SkipToPageElmName        = 'skip-to-content';
const SkipToBookmarkletElmName = 'skip-to-content-bookmarklet';
const SkipToExtensionElmName   = 'skip-to-content-extension';

  /*
  *  @function removeLegacySkipToJS
  *
  *  @desc Removes legacy and duplicate versions of SkipTo.js
  */
  function removeLegacySkipToJS() {
    const node = document.getElementById('id-skip-to');
    debug.flag && debug.log(`[removeLegacySkipToJS]: ${node}`);
    if (node !== null) {
      // remove legacy SkipTo.js
      node.remove();
      const cssNode = document.getElementById('id-skip-to-css');
      if (cssNode) {
        cssNode.remove();
      }
      console.warn('[skipTo.js] legacy version removed, using SkipTo.js extension');
    }
  }

  /*
  *  @function removePageSkipTo
  *
  *  @desc Removes duplicate versions of SkipTo.js
  */
  function removePageSkipTo() {
    const nodes = document.querySelectorAll(SkipToPageElmName);
    debug.flag && debug.log(`[removePageSkipTo]: ${nodes.length}`);
    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].remove();
      console.warn(`[SkipTo.js]: Removing ${nodes[i].tagName}`);
    }
  }

  /*
  *  @function removeBookmarkletSkipTo
  *
  *  @desc Removes duplicate versions of SkipTo.js
  */
  function removeBookmarkletSkipTo() {
    const nodes = document.querySelectorAll(SkipToBookmarkletElmName);
    debug.flag && debug.log(`[removeBookmarkletSkipTo]: ${nodes.length}`);
    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].remove();
      console.warn(`[SkipTo.js]: Removing ${nodes[i].tagName}`);
    }
  }


  /*
  *. @function getSkipToContentElement
  *
  * @desc  Creates and add a skip-to-content element in the page
  *
  * @returns  Returns dom node of new element or false if the page
  *           has a legacy SkipTo.js
  */
  function getSkipToContentElement(type="pagescript") {

    if (document.getElementById('id-skip-to')) {
      removeLegacySkipToJS();
    }

    const isExtensionLoaded   = document.querySelector(SkipToExtensionElmName);
    const isBookmarkletLoaded = document.querySelector(SkipToBookmarkletElmName);
    const isPageLoaded        = document.querySelector(SkipToPageElmName);

    let skipToContentElem = false;

    switch (type) {
      case 'bookmarklet':
        if (!isExtensionLoaded) {
          if (!isBookmarkletLoaded) {
            removePageSkipTo();
            window.customElements.define(SkipToBookmarkletElmName, SkipToContent570);
            skipToContentElem = document.createElement(SkipToBookmarkletElmName);
            skipToContentElem.setAttribute('version', skipToContentElem.version);
            skipToContentElem.setAttribute('type', type);
            // always attach SkipToContent element to body
            if (document.body) {
              document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
            }
          }
        }
        break;

      case 'extension':
        if (!isExtensionLoaded) {
          removePageSkipTo();
          removeBookmarkletSkipTo();
          window.customElements.define(SkipToExtensionElmName, SkipToContent570);
          skipToContentElem = document.createElement(SkipToExtensionElmName);
          skipToContentElem.setAttribute('version', skipToContentElem.version);
          skipToContentElem.setAttribute('type', type);
          // always attach SkipToContent element to body
          if (document.body) {
            document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
          }
        }
        break;

      default:
        if (!isPageLoaded && !isBookmarkletLoaded && !isExtensionLoaded) {
          window.customElements.define(SkipToPageElmName, SkipToContent570);
          skipToContentElem = document.createElement(SkipToPageElmName);
          skipToContentElem.setAttribute('version', skipToContentElem.version);
          skipToContentElem.setAttribute('type', type);
          // always attach SkipToContent element to body
          if (document.body) {
            document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
          }
        }
        break;
    }

    return skipToContentElem;
  }

  // Check for SkipTo.js bookmarklet script, if it is initialize it immediately
  if (document.getElementById(`id-skip-to-bookmarklet`)) {
    debug.flag && debug.log(`[bookmarklet]`);
    const skipToContentBookmarkletElem = getSkipToContentElement('bookmarklet');
    if (skipToContentBookmarkletElem) {
      skipToContentBookmarkletElem.init();
      skipToContentBookmarkletElem.buttonSkipTo.openPopup();
      skipToContentBookmarkletElem.buttonSkipTo.setFocusToFirstMenuitem();
    }
  }
  else {
    // Check for SkipTo.js extension script, if it is initialize it immediately
    if (document.getElementById(`id-skip-to-extension`)) {
      debug.flag && debug.log(`[extension]`);
      const skipToContentExtensionElem = getSkipToContentElement('extension');
      if (skipToContentExtensionElem) {
        skipToContentExtensionElem.init();
        window.addEventListener('load', function() {
          debug.flag && debug.log(`[onload][extension][elem]: ${skipToContentExtensionElem}`);
          removeLegacySkipToJS();
          removePageSkipTo();
        });
      }
    }
    else {
      // Initialize SkipTo.js menu button with onload event
      window.addEventListener('load', function() {
        debug.flag && debug.log(`[onload][script]`);
        const skipToContentPageElem = getSkipToContentElement();
        if (skipToContentPageElem) {
          skipToContentPageElem.supportShortcuts(false);
          debug.flag && debug.log(`[onload][script][elem]: ${skipToContentPageElem}`);
          const initInfo = window.SkipToConfig ? window.SkipToConfig : {};
          skipToContentPageElem.init(initInfo);
        }
      });
    }
  }
})();
