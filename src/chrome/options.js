/* options.js */

import { getOptions, saveOptions } from './storage.js';

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

function initForm () {
  const headingsInput  = document.getElementById('id-headings');
  console.log(`[headingsInput]: ${headingsInput}`);
  const landmarksInput = document.getElementById('id-landmarks');
  console.log(`[landmarksInput]: ${landmarksInput}`);
  getOptions().then( (options) => {
    headingsInput.value  = options.headers;
    landmarksInput.value = options.landmarks;
  });
}


async function sendOptionsToTabs (options) {
  console.log("---------");
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    // Note: sensitive tab properties such as tab.title or tab.url can only be accessed for
    // URLs in the host_permissions section of manifest.json
      chrome.tabs.sendMessage(tab.id, {skiptoConfig: options})
      .then((response) => {
          console.info("Options received response from tab with title '%s' and url %s",
              response.title, response.url)
      })
      .catch((error) => {
              console.warn("Options could not send message to tab %d", tab.id, error)
          })
  }
}

function saveForm () {
  const options = {};
  options.headers   = document.getElementById('id-headings').value;
  options.landmarks = document.getElementById('id-landmarks').value;

  saveOptions(options).then(sendOptionsToTabs(options));
}

document.addEventListener('DOMContentLoaded', initForm);
document.getElementById('id-save').addEventListener('click', saveForm);
