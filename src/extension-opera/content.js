/* content.js */

const debug = false;

// Define browser specific APIs for Opera, Firefox and Chrome

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const browserAction = typeof browser === 'object' ?
              browser.browserAction :
              chrome.action;

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


window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    console.log(`[color scheme change]: ${event.matches}`);
    const newColorScheme = event.matches ? "color-theme-dark" : "color-theme-light";
    browserRuntime.sendMessage({skiptoMessage: newColorScheme});
});

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ?
                    "color-theme-dark" :
                    "color-theme-light";

browserRuntime.sendMessage({skiptoMessage: colorScheme});

