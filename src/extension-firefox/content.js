/* content.js */

const debug = true;

// Define browser specific APIs for Opera, Firefox and Chrome

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

// Add SkipTo.js script to page
const scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.id = 'id-skip-to-extension';
scriptNode.setAttribute('data-skipto', 'displayOption: popup');
scriptNode.src = browserRuntime.getURL('skipto.js');
document.body.appendChild(scriptNode);

// Get options from SkipTo.js Extension
window.addEventListener('load', function() {
  debug && console.log('[load]: Sending hello to background');

  browserRuntime.sendMessage({skiptoMessage: "get-options"}, (params) => {
    debug && console.log(`[load][params]: ${params}`);
    const skipToContentElem = document.querySelector('skip-to-content');
    debug && console.log(`[load][skipToContentElem]: ${skipToContentElem}`);
    if (skipToContentElem) {
      skipToContentElem.setAttribute('data-skipto', params);
      skipToContentElem.setAttribute('setfocus', getFocusOption(params));
    }
  })
});

// Update configuration from user changes in options page
browserRuntime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.skiptoParams !== undefined) {
      debug && console.log(`[onMessage][params]: ${request.skiptoParams}`);
      const skipToContentElem = document.querySelector('skip-to-content');
      if (skipToContentElem) {
        skipToContentElem.setAttribute('data-skipto', request.skiptoParams);
      }
    }
  }
);

// Respond to keyboard commands for landmark regions and headings

document.addEventListener('keydown', (event) => {

    let flag = false;

    debug && console.log(`[keydown][key]: ${event.key} ${isInteractiveElement(event.target)} ${noModifierPressed(event)} ${onlyShiftPressed(event)}`);

    if (!isInteractiveElement(event.target) &&
        (noModifierPressed(event) || onlyShiftPressed(event))) {

      const skipToContentElem = document.querySelector('skip-to-content');

      if (typeof skipToContentElem === 'object') {

        switch (event.key) {
          case 'h':
            skipToContentElem.setAttribute('navigate', 'nextHeading');
            flag = true;
            break;

          case 'g':
            skipToContentElem.setAttribute('navigate', 'previousHeading');
            flag = true;
            break;

          case 'r':
            skipToContentElem.setAttribute('navigate', 'nextLandmark');
            flag = true;
            break;

          case 'e':
            skipToContentElem.setAttribute('navigate', 'previousLandmark');
            flag = true;
            break;

          case 'm':
            skipToContentElem.setAttribute('navigate', 'nextMain');
            flag = true;
            break;

          case 'n':
            skipToContentElem.setAttribute('navigate', 'nextNavigation');
            flag = true;
            break;

          case '1':
            skipToContentElem.setAttribute('navigate', 'nextH1');
            flag = true;
            break;

          case '2':
            skipToContentElem.setAttribute('navigate', 'nextH2');
            flag = true;
            break;

          case '3':
            skipToContentElem.setAttribute('navigate', 'nextH3');
            flag = true;
            break;

          case '4':
            skipToContentElem.setAttribute('navigate', 'nextH4');
            flag = true;
            break;

          case '5':
            skipToContentElem.setAttribute('navigate', 'nextH5');
            flag = true;
            break;

          case '6':
            skipToContentElem.setAttribute('navigate', 'nextH6');
            flag = true;
            break;

          default:
            break;

        }

        if (flag) {
          event.stopPropagation();
          event.preventDefault();
        }

      }

      console.log(`[keydown]: ${event.key} ${flag}`);

    }
});


/*
 *   @function getFocusOption
 *
 *   @desc  Returns the value of the focusOption from a SkipTo.js parameter string
 *
 *   @param {Object} params :
 *
 *   @returns see @desc
 */

function getFocusOption(params) {
  let focusOption = 'none';

  const parts = params.split('focusOption:');
  if (parts.length === 2) {
    focusOption = parts[1].substring(0, parts[1].indexOf(';')).trim();
  }
  debug && console.log(`[getFocusOption]: ${focusOption}`);
  return focusOption;
}

/*
 * @method isInteractiveElement
 *
 * @desc  Returns true if the element can use key presses, otherwise false
 *
 * @param  {object} elem - DOM node element
 *
 * @returns {Boolean}  see @desc
 */

function isInteractiveElement (elem) {

  const tagName = elem.tagName ? elem.tagName.toLowerCase() : '';
  const type = tagName === 'input' ? elem.type.toLowerCase() : '';

  return (tagName === 'textarea') ||
        ((tagName === 'input') && enabledInputTypes.includes(type)) ||
        inContentEditable(elem);
}

/*
 * @function inContentEditable
 *
 * @desc Returns false if node is not in a content editable element,
 *       otherwise true if it does
 *
 * @param  {Object}  elem - DOM node
 *
 * @returns {Boolean} see @desc
 */
function inContentEditable (elem) {
  let n = elem;
  while (n.hasAttribute) {
    if (n.hasAttribute('contenteditable')) {
      return true;
    }
    n = n.parentNode;
  }
  return false;
}

/*
 * @function noModifierPressed
 *
 * @desc Returns true if no modifier key is pressed, other false
 *
 * @param  {Object}  event - Event object
 *
 * @returns {Boolean} see @desc
 */

function noModifierPressed (event) {
  return !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;
}

/*
 * @function onlyShiftPressed
 *
 * @desc Returns true if only the shift modifier key is pressed, other false
 *
 * @param  {Object}  event - Event object
 *
 * @returns {Boolean} see @desc
 */

function onlyShiftPressed (event) {
  return !event.altKey &&
        !event.ctrlKey &&
        event.shiftKey &&
        !event.metaKey;
}

