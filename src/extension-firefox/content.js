/* content.js */

const debug = false;

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

// Respond to keyboard commands

document.addEventListener('keydown', (event) => {

    const enabledInputTypes = [
      'button',
      'checkbox',
      'color',
      'file',
      'image',
      'radio',
      'range',
      'reset',
      'submit'
    ];

    let flag = false;

    const target = event.target;
    const tagName = target.tagName ? target.tagName.toLowerCase() : '';
    const type = tagName === 'input' ? target.type.toLowerCase() : '';

    if ((tagName !== 'textarea') &&
        ((tagName !== 'input') ||
         ((tagName === 'input') && enabledInputTypes.includes(type))
        )) {

      const noModiferPressed =
        !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      const onlyShiftPressed =
        !event.altKey &&
        !event.ctrlKey &&
        event.shiftKey &&
        !event.metaKey;

      if (noModifierPressed || onlyShiftPressed) {

        switch (event.key) {
          case 'h':
            flag = true;
            break;

          case 'H':
            flag = true;
            break;

          case 'r':
            flag = true;
            break;

          case 'R':
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

      console.log(`[keydown]: ${event.key} ${noModifierPressed} ${onlyShiftPressed} ${flag}`);

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


