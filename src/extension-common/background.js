/* background.js */

import {
  getOptions,
  optionsToParams
} from './storage.js';

const debug = true;

// Define browser specific APIs for Opera, Firefox and Chrome

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const browserAction = typeof browser === 'object' ?
              browser.browserAction :
              chrome.action;

const browserScripting = typeof browser === 'object' ?
              browser.scripting :
              chrome.scripting;


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
browserRuntime.onMessage.addListener((request, sender, sendResponse) => {
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

  if (request.skiptoMessage === "color-theme-dark") {
      debug && console.log(`[onMessage][color-theme-dark]`);
      setIcons('dark');
  }

  if (request.skiptoMessage === "color-theme-light") {
      debug && console.log(`[onMessage][color-theme-light]`);
      setIcons('light');
  }

});


browserAction.onClicked.addListener((tab) => {
  debug && console.log(`[action][onclick]: ${tab.id}`);
  browserScripting.executeScript({
    target: {tabId: tab.id},
    files: ['toggle.js']
  });
});



// Set SkipTo.js toolbar icons for light or dark color theme
function setIcons(scheme='light') {
  debug.flag && debug.log(`[setIcons]: ${scheme}`)
  if (['light', 'dark'].includes(scheme)) {
    browserAction.setIcon({
      path: {
        32: `icons/${scheme}-skipto-32.png`,
        48: `icons/${scheme}-skipto-48.png`,
        64: `icons/${scheme}-skipto-64.png`,
        128: `icons/${scheme}-skipto-128.png`
      },
    });
  }
}


