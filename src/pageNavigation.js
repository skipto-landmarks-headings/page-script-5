/* pageNavigation.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isVisible
} from './utils.js';

import {
  isSkipableElement,
  isSlotElement,
  isCustomElement
} from './landmarksHeadings.js';

import {
  highlightElement,
  removeHighlight
} from './highlightElement.js';

/*Exports */
export {
  getFocusElement,
  monitorKeyboardFocus,
  navigateContent
};

/* Constants */
const debug = new DebugLogging('pageNav', false);
debug.flag = true;


/**
 * @function monitorKeyboardFocus
 *
 * @desc Removes highlighting when keyboard focus changes
 */
function monitorKeyboardFocus () {
  document.addEventListener('focusin', () => {
    removeHighlight();
  });
}

/**
 * @function navigateContent
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  target     - Feature to navigate (e.g. heading, landmark)
 * @param {String}  direction  - 'next' or 'previous'
 * @param {boolean} useFirst   - if item not found use first
 */

function navigateContent (target, direction, useFirst=false) {

  debug.flag && debug.log(`\n[navigateContent][   target]: ${target}`);
  debug.flag && debug.log(`[navigateContent][direction]: ${direction}`);
  debug.flag && debug.log(`[navigateContent][ useFirst]: ${useFirst}`);

  const lastFocusElem = getFocusElement();
  let elem = lastFocusElem;
  let count = 1;  // never do more than 5

  do {
    elem = queryDOMForSkipToNavigation(target, direction, elem, useFirst);
    debug.flag && debug.log(`[${count}][navigateContent][     elem]: ${elem}`);
    if (elem) {
      elem.tabIndex = elem.tabIndex >= 0 ? elem.tabIndex : -1;
      elem.focus();
      debug.flag && debug.log(`[${count}][navigateContent][focus][   last]: ${lastFocusElem.tagName}`);
      debug.flag && debug.log(`[${count}[navigateContent][focus][current]: ${getFocusElement().tagName} (${lastFocusElem === getFocusElement})`);
    }
    count += 1;
  }
  while ((count < 5) && elem && (lastFocusElem === getFocusElement()));

  // Set highlight
  if (elem) {

    let info = elem.hasAttribute('data-skip-to-info') ?
               elem.getAttribute('data-skip-to-info').replace('heading', '').replace('landmark', '').trim() :
              'unknown';

    if (elem.hasAttribute('data-skip-to-acc-name')) {
      const name = elem.getAttribute('data-skip-to-acc-name').trim();
      if (name) {
        info += `: ${name}`;
      }
    }

    highlightElement(elem, 'instant', info, true);  // force highlight since navigation
  }

  return elem;
}

/**
 * @function queryDOMForSkipToNavigation
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  target     - Feature to navigate (e.g. heading, landmark)
 * @param {String}  direction  - 'next' or 'previous'
 * @param {Object}  elem       - Element the search needs to pass, if null used focused element
 * @param {boolean} useFirst   - if item not found use first
 *
 * @returns {Object} @desc
 */
function queryDOMForSkipToNavigation (target, direction, elem, useFirst=false) {

  let lastNode = false;
  let firstNode = false;
  let passFound = false;

  const passElem = elem ? elem : getFocusElement();

  function transverseDOMForElement(startingNode) {

    function checkForTarget (node) {

      if (node.hasAttribute('data-skip-to-info') &&
          node.getAttribute('data-skip-to-info').includes(target)) {

        debug.flag && debug.log(`[checkForTarget][${node.tagName}]: ${node.textContent.trim().substring(0, 10)} (vis:${isVisible(node)} pf:${passFound})`);

        if (!firstNode &&
            isVisible(node)) {
          debug.flag && debug.log(`[checkForTarget][firstNode]`);
          firstNode = node;
        }

        if ((node !== passElem) &&
            isVisible(node)) {
          debug.flag && debug.log(`[checkForTarget][lastNode]`);
          lastNode = node;
        }

        if (passFound &&
           (direction === 'next') &&
            isVisible(node)) {
          debug.flag && debug.log(`[checkForTarget][found]`);
          return node;
        }
      }

      if (node === passElem) {
        passFound = true;
        debug.flag && debug.log(`[checkForTarget][passFound]: ${node.tagName}`);
        if (direction === 'previous') {
          return lastNode;
        }
      }

      return false;
    }

    let targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {

        targetNode = checkForTarget(node);
        if (targetNode) {
          return targetNode;
        }

        if (!isSkipableElement(node)) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {

                targetNode = checkForTarget(assignedNode);
                if (targetNode) {
                  return targetNode;
                }

                targetNode = transverseDOMForElement(assignedNode);
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(node)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForElement(node.shadowRoot);
                if (targetNode) {
                  return targetNode;
                }
              }
              else {
                targetNode = transverseDOMForElement(node);
                if (targetNode) {
                  return targetNode;
                }
              }
            } else {
              targetNode = transverseDOMForElement(node);
              if (targetNode) {
                return targetNode;
              }
            }
          }
        }
      } // end if
    } // end for
    return false;
  } // end function

  passFound = passElem === document.body;
  let node = transverseDOMForElement(document.body);

  if (!node && useFirst && firstNode) {
    node = firstNode;
  }

  return node;
}

/**
 * @function getFocusElement
 *
 * @desc Returns DOM element node that has focus, if no DOM node
 *       has focus returns null
 *
 * @returns {Object} @desc
 */
function getFocusElement() {

  let elem = document.activeElement;

  while (elem.shadowRoot && elem.shadowRoot.activeElement) {
    elem = elem.shadowRoot.activeElement;
  }
  return elem;
}


