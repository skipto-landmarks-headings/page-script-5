/* options.js */

import {
  getOptions,
  saveOptions,
  optionsToParams
} from './storage.js';

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

function initForm () {
  const landmarksNavInput = document.getElementById('landmarks-nav');
  const landmarksSearchInput = document.getElementById('landmarks-search');
  const landmarksComplementaryInput = document.getElementById('landmarks-complementary');
  const landmarksContentinfoInput = document.getElementById('landmarks-contentinfo');
  const landmarksBannerInput = document.getElementById('landmarks-banner');

  const headings2Input = document.getElementById('headings-2');
  const headings3Input = document.getElementById('headings-3');
  const headings4Input = document.getElementById('headings-4');
  const headings5Input = document.getElementById('headings-5');
  const headings6Input = document.getElementById('headings-6');
  const headingsMainOnlyInput = document.getElementById('headings-main-only');

  getOptions().then( (options) => {
    landmarksNavInput.checked = options.landmarks.includes('nav');
    landmarksSearchInput.checked = options.landmarks.includes('search');
    landmarksComplementaryInput.checked = options.landmarks.includes('complementary');
    landmarksContentinfoInput.checked = options.landmarks.includes('contentinfo');
    landmarksBannerInput.checked = options.landmarks.includes('banner');

    headings2Input.checked = options.headings.includes('h2');
    headings3Input.checked = options.headings.includes('h3');
    headings4Input.checked = options.headings.includes('h4');
    headings5Input.checked = options.headings.includes('h5');
    headings6Input.checked = options.headings.includes('h6');

    headingsMainOnlyInput.checked = options.headings.includes('main-only');

  });
}

async function sendOptionsToTabs (options) {
  console.log("---------");
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    // Note: sensitive tab properties such as tab.title or tab.url can only be accessed for
    // URLs in the host_permissions section of manifest.json
      chrome.tabs.sendMessage(tab.id, {skiptoParams: optionsToParams(options)})
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
  const options = {
    landmarks: 'main',
    headings: 'h1'
  }

  const landmarksNavInput = document.getElementById('landmarks-nav');
  const landmarksSearchInput = document.getElementById('landmarks-search');
  const landmarksComplementaryInput = document.getElementById('landmarks-complementary');
  const landmarksContentinfoInput = document.getElementById('landmarks-contentinfo');
  const landmarksBannerInput = document.getElementById('landmarks-banner');

  const headings2Input = document.getElementById('headings-2');
  const headings3Input = document.getElementById('headings-3');
  const headings4Input = document.getElementById('headings-4');
  const headings5Input = document.getElementById('headings-5');
  const headings6Input = document.getElementById('headings-6');
  const headingsMainOnlyInput = document.getElementById('headings-main-only');

  if (landmarksNavInput.checked) {
    options.landmarks += ' nav';
  }

  if (landmarksSearchInput.checked) {
    options.landmarks += ' search';
  }

  if (landmarksComplementaryInput.checked) {
    options.landmarks += ' complementary';
  }

  if (landmarksContentinfoInput.checked) {
    options.landmarks += ' contentinfo';
  }

  if (landmarksBannerInput.checked) {
    options.landmarks += ' banner';
  }

  if (headingsMainOnlyInput.checked) {
    options.headings = "main-only h1";
  }

  if (headings2Input.checked) {
    options.headings += " h2";
  }

  if (headings3Input.checked) {
    options.headings += " h2 h3";
  }

  if (headings4Input.checked) {
    options.headings += " h2 h3 h4";
  }

  if (headings5Input.checked) {
    options.headings += " h2 h3 h4 h5";
  }

  if (headings6Input.checked) {
    options.headings += " h2 h3 h4 h5 h6";
  }

  saveOptions(options).then(sendOptionsToTabs(options));
}

document.addEventListener('DOMContentLoaded', initForm);
document.getElementById('id-save').addEventListener('click', saveForm);
