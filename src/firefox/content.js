/* content.js */

const debug = false;

// Define browser specific APIs for Opera, Firefox and Chrome

const runtime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

// Add SkipTo.js script to page
const scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.id = 'id-skip-to-extension';
scriptNode.setAttribute('data-skipto', 'displayOption: popup');
scriptNode.src = runtime.getURL('skipto.js');
document.body.appendChild(scriptNode);

// Get options from SkipTo.js Extension
window.addEventListener('load', function() {
  debug && console.log('[load]: Sending hello to background');

  runtime.sendMessage({skiptoMessage: "get-options"}, (params) => {
    debug && console.log(`[load][params]: ${params}`);
    const skipToContentElem = document.querySelector('skip-to-content');
    debug && console.log(`[load][skipToContentElem]: ${skipToContentElem}`);
    if (skipToContentElem) {
      skipToContentElem.setAttribute('data-skipto', params);
    }
  })
});

// Update configuration from user changes in options page
runtime.onMessage.addListener(
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

