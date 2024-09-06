/* background.js */

import {
  getOptions,
  optionsToParams
} from './storage.js';

const debug = false;

let myParams = '';
/*
*. Initialize myParams
*/
getOptions().then( (options) => {
  myParams = optionsToParams(options);
  debug && console.log(`[onInstalled][myParams]: ${myParams}`);
});


/*
*  Send myParams to content script when page is initially loaded
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debug && console.log(`[onMessage][type]: ${request.type}`);

  if (request.skiptoMessage === "get-options") {
    debug && console.log(`[onMessage][myParams]: ${myParams}`);
    sendResponse(myParams);
  }

  if (request.type === 'updateMyParams') {
    getOptions().then( (options) => {
      myParams = optionsToParams(options);
      debug && console.log(`[onMessage][myParams]: ${myParams}`);
    });
  }

});


