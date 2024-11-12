/* pageNavigation.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isSkipableElement,
  isSlotElement,
  isCustomElement
} from './landmarksHeadings.js';

import {
  highlightElement,
  removeHighlight
} from './highlightElement.js';

/* Constants */
const debug = new DebugLogging('pageNav', false);
debug.flag = true;


/*Exports */
export {
  monitorKeyboardFocus,
  navigateContent
};

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

  debug.flag && debug.log(`[navigateContent][   target]: ${target}`);
  debug.flag && debug.log(`[navigateContent][direction]: ${direction}`);
  debug.flag && debug.log(`[navigateContent][ useFirst]: ${useFirst}`);

  const elem = queryDOMForSkipToNavigation(target, direction, useFirst);

  debug.flag && debug.log(`[navigateContent][   return]: ${elem}`);

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

    elem.tabIndex = elem.tabIndex ? elem.tabIndex : -1;
    elem.focus();
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
 * @param {boolean} useFirst   - if item not found use first
 *
 * @returns {Object} @desc
 */
function queryDOMForSkipToNavigation (target, direction, useFirst=false) {

  let focusFound = false;
  let lastNode = false;
  let firstNode = false;
  const focusElem = getFocusElement();

  function transverseDOMForElement(startingNode) {

    function checkForTarget (node) {

      if (node.hasAttribute('data-skip-to-info')) {
        debug.log(`[traverse][${node.tagName}]: found:${focusFound}`);
      }
      else {
        debug.log(`[traverse][${node.tagName}]`);
      }

      if (node.hasAttribute('data-skip-to-info') &&
          node.getAttribute('data-skip-to-info').includes(target)) {

        debug.log(`[traverse][found]`);

        if (!firstNode) {
          firstNode = node;
        }

        if (node !== focusElem) {
          lastNode = node;
        }

        if (focusFound &&
           (direction === 'next')) {
          return node;
        }
      }

      if (node === focusElem) {
        focusFound = true;
        if (direction === 'previous') {
          return lastNode;
        }
      }
      return false;
    }

    let targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE && node.checkVisibility()) {

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


