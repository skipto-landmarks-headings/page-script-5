/* shortcuts.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  BOOKMARKLET_ELEMENT_NAME,
  EXTENSION_ELEMENT_NAME,
  SKIP_TO_ID
} from './constants.js';

import {
  isVisible
} from './utils.js';

import {
  isSkipableElement,
  isSlotElement,
  isCustomElement
} from './landmarksHeadings.js';

/*Exports */
export {
  getFocusElement,
  monitorKeyboardFocus,
  navigateContent
};

/* Constants */
const debug = new DebugLogging('shortcuts', false);
debug.flag = false;


/**
 * @function monitorKeyboardFocus
 *
 * @desc Removes highlighting when keyboard focus changes
 */
function monitorKeyboardFocus () {
  document.addEventListener('focusin', () => {
    const skipToContentElem = document.querySelector(EXTENSION_ELEMENT_NAME) || document.querySelector(BOOKMARKLET_ELEMENT_NAME);
    if (skipToContentElem) {
      skipToContentElem.buttonSkipTo.removeHighlight();
    }
  });
}

/**
 * @function navigateContent
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  target         - Feature to navigate (e.g. heading, landmark)
 * @param {String}  direction      - 'next' or 'previous'
 * @param {boolean} useFirst       - if item not found use first
 * @param {boolean} nameRequired   - if true, item must have accessible name
 */

function navigateContent (target, direction, msgHeadingLevel, useFirst=false, nameRequired=false) {

  let lastFocusElem = getFocusElement();
  let elem = lastFocusElem;
  let lastElem;
  let count = 0;

  // Note: The counter is used as a safety mechanism for any endless loops
  do {
    lastElem = elem;
    elem = queryDOMForSkipToNavigation(target, direction, elem, useFirst, nameRequired);
    if (elem) {
      elem.tabIndex = elem.tabIndex >= 0 ? elem.tabIndex : -1;
      elem.focus();
    }
    count += 1;
  }
  while (elem && (count < 100) && (lastElem !== elem) && (lastFocusElem === getFocusElement()));

  // Set highlight
  if (elem) {

    let info = elem.hasAttribute('data-skip-to-info') ?
               elem.getAttribute('data-skip-to-info').replace('heading', '').replace('landmark', '').trim() :
              'unknown';

    if (elem.getAttribute('data-skip-to-info').includes('heading')) {
      info = msgHeadingLevel.replace('#', info.substring(1));
    }

    if (elem.hasAttribute('data-skip-to-acc-name')) {
      const name = elem.getAttribute('data-skip-to-acc-name').trim();
      if (name) {
        info += `: ${name}`;
      }
    }

    const skipToContentElem = document.querySelector(EXTENSION_ELEMENT_NAME) || document.querySelector(BOOKMARKLET_ELEMENT_NAME);
    if (skipToContentElem) {
      skipToContentElem.buttonSkipTo.highlight(elem, 'instant', info, true);  // force highlight
    }

  }

  return elem;
}

/**
 * @function queryDOMForSkipToNavigation
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  target       - Feature to navigate (e.g. heading, landmark)
 * @param {String}  direction    - 'next' or 'previous'
 * @param {Object}  elem         - Element the search needs to pass, if null used focused element
 * @param {boolean} useFirst     - if true, if item not found use first
 * @param {boolean} nameRequired - if true, accessible name is required to include in navigation
 *
 * @returns {Object} @desc
 */
function queryDOMForSkipToNavigation (target, direction, elem, useFirst=false, nameRequired=false) {

  let lastNode = false;
  let firstNode = false;
  let passFound = false;

  const passElem = elem ? elem : getFocusElement();

  function transverseDOMForElement(startingNode) {

    function checkForTarget (node) {

      if (node.hasAttribute('data-skip-to-info') &&
          node.getAttribute('data-skip-to-info').includes(target) &&
          ( !nameRequired || (nameRequired &&
            node.hasAttribute('data-skip-to-acc-name') &&
            node.getAttribute('data-skip-to-acc-name').trim().length > 0))) {

        if (target.includes('heading'))

        if (!firstNode &&
            isVisible(node)) {
          firstNode = node;
        }

        if ((node !== passElem) &&
            isVisible(node)) {
          lastNode = node;
        }

        if (passFound &&
           (direction === 'next') &&
            isVisible(node)) {
          return node;
        }
      }

      if (node === passElem) {
        passFound = true;
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

  passFound = (passElem === document.body) ||
              (passElem.parentNode && (passElem.parentNode.id === SKIP_TO_ID));
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


