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
  *  @desc removes legacy versions of SkipTo.js
  */

  function removeLegacySkipToJS(skipToContentElem = null) {
    const node = document.getElementById('id-skip-to');
    debug.flag && debug.log(`[removeLegacySkipToJS]: ${node}`);
    if (node) {
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
      debug.fag && debug.log(`[removeLegacySkipToJS]: Removing duplicate copy of SkipTo.js`);
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
  function getSkipToContentElement() {

    if (document.getElementById('id-skip-to')) {
      removeLegacySkipToJS();
    }

    let skipToContentElem = document.querySelector(`skip-to-content`);

    if (!skipToContentElem) {
      window.customElements.define("skip-to-content", SkipToContent);
      skipToContentElem = document.createElement('skip-to-content');
      skipToContentElem.setAttribute('version', skipToContentElem.version);
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
    const skipToContentElem = getSkipToContentElement();
    // check for older version of SkipTo.js
    if (skipToContentElem) {
      skipToContentElem.init(skipToContentElem.shadowRoot);
      skipToContentElem.buttonSkipTo.openPopup();
      skipToContentElem.buttonSkipTo.setFocusToFirstMenuitem();
    }
  }
  else {
    if (document.getElementById(`id-skip-to-extension`)) {
      debug.flag && debug.log(`[extension]`);
      const skipToContentElem = getSkipToContentElement();
      // check for older version of SkipTo.js
      if (skipToContentElem) {
        skipToContentElem.init(skipToContentElem.shadowRoot);
        window.addEventListener('load', function() {
          debug.flag && debug.log(`[focus]`);
          removeLegacySkipToJS(skipToContentElem);
          skipToContentElem.buttonSkipTo.focus();
        });
      }
    }
    else {
      // Initialize SkipTo.js menu button with onload event
      window.addEventListener('load', function() {
        debug.flag && debug.log(`[load]`);
        const skipToContentElem = getSkipToContentElement();
        if (skipToContentElem) {
          debug.flag && debug.log(`[onload][skipToContent]: ${skipToContentElem}`);
          skipToContentElem.init(skipToContentElem.shadowRoot, window.SkipToConfig);
        }
      });
    }
  }
})();
