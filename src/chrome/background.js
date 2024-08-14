/* background.js */

import { getOptions, optionsToParams } from './storage.js';

let myOptions = {};


chrome.runtime.onInstalled.addListener(() => {
  function consoleOptions (options) {
    myOptions = options;

    for (let item in options) {
      console.log(`[${item}][${options[item]}]`);
    }
  }

  getOptions().then(consoleOptions);

});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.skiptoMessage === "get-options")
      console.log(`Received hello from content`);
      sendResponse(optionsToParams(myOptions));
  }
);





