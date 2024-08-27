/* content.js */

const debug = true;

// Add SkipTo.js script to page
const scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.id = 'id-skip-to-extension';
scriptNode.setAttribute('data-skipto', 'displayOption: popup');
scriptNode.src = chrome.runtime.getURL('skipto.js');
document.body.appendChild(scriptNode);

// Get options from SkipTo.js Extension
window.addEventListener('load', function() {
  (async () => {
    debug && console.log('[load]: Sending hello to background');
    const params = await chrome.runtime.sendMessage({skiptoMessage: "get-options"});
    // do something with response here, not outside the function
    debug && console.log(`[load][params]: ${params}`);
    const skipToContentElem = document.querySelector('skip-to-content');
    debug && console.log(`[load][skipToContentElem]: ${skipToContentElem}`);
    if (skipToContentElem) {
      skipToContentElem.setAttribute('data-skipto', params);
    }
  })();
});

// Update configuration from user changes in options page
chrome.runtime.onMessage.addListener(
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
