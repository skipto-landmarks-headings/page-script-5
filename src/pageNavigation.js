/* pageNavigation.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isSkipableElement,
  isSlotElement,
  isCustomElement
} from './landmarksHeadings.js';

/* Constants */
const debug = new DebugLogging('landmarksHeadings', false);
debug.flag = false;


/*Exports */
export {
  monitorKeyboardFocus,
  navigateContent
};

let hasFocusBeenSet = false;

/**
 * @function monitorKeyboardFocus
 *
 * @desc Sets a data attribute on the element with current focus
 */
function monitorKeyboardFocus () {

  document.addEventListener('focusin', (event) => {
    event.relatedTarget && console.log(`[monitorKeyboardFocus][relatedTarget]: ${event.relatedTarget.tagName}`);
    if (event.relatedTarget) {
      event.relatedTarget.removeAttribute('data-skip-to-focus');
      hasFocusBeenSet = true;
    }
    event.target.setAttribute('data-skip-to-focus', '');

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

  console.log(`[navigateContent][A]: ${target} ${direction}`);

  const elem = queryDOMForSkipToNavigation(target, direction);

  if (elem) {
    elem.tabIndex = elem.tabIndex ? elem.tabIndex : 1;
    elem.focus();
    console.log(`[navigateContent][B][elem]: ${elem} ${elem.getAttribute('data-skip-to-info')}`);
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
  return transverseDOMForElement(document.body);
}

