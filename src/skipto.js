/* skipto.js */

import SkipToContent from './skiptoContent.js';
import DebugLogging  from './debug.js';

/* constants */
const debug = new DebugLogging('skipto', false);
debug.flag = false;

(function() {

  /*
  *  @function removeLegacySkipToJS
  *
  *  @desc Removes legacy and duplicate versions of SkipTo.js
  */

  function removeLegacySkipToJS(skipToContentElem = null) {
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
    const nodes = document.querySelectorAll('skip-to-content');
    if (nodes && nodes.length > 1) {
      debug.flag && debug.log(`[removeLegacySkipToJS][${nodes.length}]: Removing duplicate copy of SkipTo.js`);
      for (let i = 0; i <nodes.length; i += 1) {
        const stcNode = nodes[i];
        if (stcNode !== skipToContentElem) {
          stcNode.remove();
          console.warn('[skipTo.js] duplicate version removed');
        }
      }
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

    let skipToContentElem = document.querySelector(`skip-to-content`);

    if (!skipToContentElem) {
      window.customElements.define("skip-to-content", SkipToContent);
      skipToContentElem = document.createElement('skip-to-content');
      skipToContentElem.setAttribute('version', skipToContentElem.version);
      skipToContentElem.setAttribute('type', type);
      // always attach SkipToContent element to body
      if (document.body) {
        document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
      }
    }
    return skipToContentElem;
  }

  // Check for SkipTo.js bookmarklet script, if it is initialize it immediately
  if (document.getElementById(`id-skip-to-bookmarklet`)) {
    debug.flag && debug.log(`[bookmarklet]`);
    const skipToContentElem = getSkipToContentElement('bookmarklet');
    if (skipToContentElem) {
      skipToContentElem.init();
      skipToContentElem.buttonSkipTo.openPopup();
      skipToContentElem.buttonSkipTo.setFocusToFirstMenuitem();
    }
  }
  else {
    // Check for SkipTo.js extension script, if it is initialize it immediately
    if (document.getElementById(`id-skip-to-extension`)) {
      debug.flag && debug.log(`[extension]`);
      const skipToContentElem = getSkipToContentElement('extension');
      if (skipToContentElem) {
        skipToContentElem.init();
        window.addEventListener('load', function() {
          debug.flag && debug.log(`[onload][extension][elem]: ${skipToContentElem}`);
          removeLegacySkipToJS(skipToContentElem);
        });
      }
    }
    else {
      // Initialize SkipTo.js menu button with onload event
      window.addEventListener('load', function() {
        debug.flag && debug.log(`[onload][script]`);
        const skipToContentElem = getSkipToContentElement();
        if (skipToContentElem) {
          debug.flag && debug.log(`[onload][script][elem]: ${skipToContentElem}`);
          skipToContentElem.init(window.SkipToConfig);
        }
      });
    }
  }
})();
