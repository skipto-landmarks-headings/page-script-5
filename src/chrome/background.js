/* background.js */

import {
  getOptions,
  optionsToParams
} from './storage.js';

const debug = false;

// Define browser specific APIs for Opera, Firefox and Chrome

const runtime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

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
runtime.onMessage.addListener((request, sender, sendResponse) => {
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


