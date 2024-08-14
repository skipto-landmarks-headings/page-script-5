/* content.js */

const debug = true;

const scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.id = 'id-skip-to-extension';
scriptNode.setAttribute('data-skipto', 'displayOption: popup');
scriptNode.src = 'http://localhost/~jongunderson/page-script-5/docs/dist/skipto.js';
document.body.appendChild(scriptNode);

// Get options from SkipTo.js Extension
window.addEventListener('load', function() {
  (async () => {
    debug && console.log('Sending hello to background');
    const options = await chrome.runtime.sendMessage({skiptoMessage: "get-options"});
    // do something with response here, not outside the function
    debug && console.log(`[options]: ${options}`);
    const skipToContentElem = document.querySelector('skip-to-content');
    debug && console.log(`[skipToContentElem]: ${skipToContentElem}`);
    if (skipToContentElem) {
      skipToContentElem.setAttribute('data-skipto', options);
    }
  })();
});

// Update configuration from user changes in options page
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.skiptoParams !== undefined) {
      debug && console.log(`Received skiptoParams`);
      debug && console.log(request.skiptoParams);
      const skipToContentElem = document.querySelector('skip-to-content');
      debug && console.log(`[skipToContentElem]: ${skipToContentElem}`);
      if (skipToContentElem) {
        skipToContentElem.setAttribute('data-skipto', request.skiptoParams);
      }
    }
  }
);
