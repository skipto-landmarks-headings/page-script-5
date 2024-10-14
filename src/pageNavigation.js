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
const debug = new DebugLogging('pageNavigation', false);
debug.flag = false;


/*Exports */
export {
  monitorKeyboardFocus,
  navigateContent
};

let hasFocusBeenSet = false;
let lastElemWithFocus = false;

/**
 * @function monitorKeyboardFocus
 *
 * @desc Sets a data attribute on the element with current focus
 */
function monitorKeyboardFocus () {

  document.addEventListener('focusin', (event) => {
    removeHighlight();
    event.relatedTarget && console.log(`[monitorKeyboardFocus][relatedTarget]: ${event.relatedTarget.tagName}`);
    if (event.relatedTarget) {
      event.relatedTarget.removeAttribute('data-skip-to-focus');
      console.log(`[focus][remove]: ${event.relatedTarget.tagName}`);
    }
    if (lastElemWithFocus) {
      lastElemWithFocus.removeAttribute('data-skip-to-focus');
      lastElemWithFocus = false;
    }
    event.target.setAttribute('data-skip-to-focus', '');
    console.log(`[focus][add]: ${event.target.tagName}`);
    lastElemWithFocus = event.target;
    hasFocusBeenSet = true;
  });

}

/**
 * @function navigateContent
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  target     - Feature to navigate (e.g. heading, landmark)
 * @param {String}  direction  - 'next' or 'previous'
 */

function navigateContent (target, direction) {

  const elem = queryDOMForSkipToNavigation(target, direction);


  if (elem) {

    let info = elem.hasAttribute('data-skip-to-info') ?
               elem.getAttribute('data-skip-to-info').replace('heading', '').replace('landmark', '').trim() :
              'unknown';

    if (elem.hasAttribute('data-skip-to-name')) {
      const name = elem.getAttribute('data-skip-to-name').trim();
      if (name) {
        info += `: ${name}`;
      }
    }

    elem.tabIndex = elem.tabIndex ? elem.tabIndex : -1;
    elem.focus();
    highlightElement(elem, 'instant', info, true);  // force highligt since navigation
  }
}

/**
 * @function queryDOMForSkipToNavigation
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  target     - Feature to navigate (e.g. heading, landmark)
 * @param {String}  direction  - 'next' or 'previous'
 *
 * @returns (Object) @desc
 */
function queryDOMForSkipToNavigation (target, direction) {

  let focusFound = false;
  let lastNode = false;

  function transverseDOMForElement(startingNode) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {

        debug.flag && debug.log(`[transverseDOMForElement][node]: ${node.tagName} ${node.hasAttribute('data-skip-to-focus')}`);

        if (debug.flag && node.hasAttribute('data-skip-to-info')) {
          debug.log(`[transverseDOMForElement][focusFound]: ${focusFound}`);
          debug.log(`[transverseDOMForElement][  lastNode]: ${lastNode ? lastNode.getAttribute('data-skip-to-info') : 'none'}`);
          debug.log(`[transverseDOMForElement][      data]: ${node.getAttribute('data-skip-to-info')}`);
        }

        if (node.hasAttribute('data-skip-to-info') &&
            node.getAttribute('data-skip-to-info').includes(target)) {
          if (!node.hasAttribute('data-skip-to-focus')) {
            if (!node.hasAttribute('data-skip-to-focus')) {
              lastNode = node;
            }
          }
          if (!hasFocusBeenSet || (focusFound) &&
               (direction === 'next')) {
            return node;
          }
        }

        if (node.hasAttribute('data-skip-to-focus')) {
          debug.log(`[transverseDOMForElement][focusFound]: ${node.tagName}`);
          focusFound = true;
          if (direction === 'previous') {
            return lastNode;
          }
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

                if (assignedNode.hasAttribute('data-skip-to-info') &&
                    assignedNode.getAttribute('data-skip-to-info').includes(target)) {
                  if (!assignedNode.hasAttribute('data-skip-to-focus')) {
                    lastNode = node;
                  }
                  if (!hasFocusBeenSet || (focusFound) &&
                       (direction === 'next')) {
                    return node;
                  }
                }

                if (assignedNode.hasAttribute('data-skip-to-focus')) {
                  debug && debug.log(`[transverseDOMForElement][focusFound]: ${assignedNode.tagName}`);

                  focusFound = true;
                  if (direction === 'previous') {
                    return lastNode;
                  }
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

  debug.flag && debug.log(`\n\n[start]: ${focusFound} ${lastNode}`);
  return transverseDOMForElement(document.body);
}

/**
 * @function removeFocusInfo
 *
 * @desc Removes data-skip-to-focus attribute from DOM
function removeFocusInfo () {

  function transverseDOMForElement(startingNode) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {

        debug.flag && debug.log(`[removeFocusInfo][transverseDOMForElement][node]: ${node.tagName} ${node.hasAttribute('data-skip-to-focus')}`);

        if (node.hasAttribute('data-skip-to-focus')) {
          node.removeAttribute('data-skip-to-focus');
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

                if (assignedNode.hasAttribute('data-skip-to-focus')) {
                  assignedNode.removeAttribute('data-skip-to-focus');
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

  return transverseDOMForElement(document.body);
}
 */

