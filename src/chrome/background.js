/* background.js */

import {
  getOptions,
  optionsToParams
} from './storage.js';

const debug = true;

let myParams = '';
/*
*. Initialize myParams
*/
chrome.runtime.onInstalled.addListener(() => {
  getOptions().then(getOptions().then( (options) => {
    myParams = optionsToParams(options);
    debug && console.log(`[onInstalled][myParams]: ${myParams}`);
  }));

});

/*
*  Send myParams to content script when it asks for it
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.skiptoMessage === "get-options") {
      debug && console.log(`[onMessage][myParams]: ${myParams}`);
      sendResponse(myParams);
    }
  }
);





