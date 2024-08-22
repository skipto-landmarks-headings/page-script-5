/* options.js */

const debug = true;

import {
  getOptions,
  saveOptions,
  optionsToParams,
  resetDefaultOptions
} from './storage.js';

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    debug && console.log(chrome.runtime.lastError.message);
    return false;
  }
}

class OptionsContent {

  constructor() {

    const form = {};

    form.landmarksNavInput = document.getElementById('landmarks-nav');
    form.landmarksSearchInput = document.getElementById('landmarks-search');
    form.landmarksComplementaryInput = document.getElementById('landmarks-complementary');
    form.landmarksContentinfoInput = document.getElementById('landmarks-contentinfo');
    form.landmarksBannerInput = document.getElementById('landmarks-banner');

    form.headings2Input = document.getElementById('headings-2');
    form.headings3Input = document.getElementById('headings-3');
    form.headings4Input = document.getElementById('headings-4');
    form.headings5Input = document.getElementById('headings-5');
    form.headings6Input = document.getElementById('headings-6');
    form.headingsMainOnlyInput = document.getElementById('headings-main-only');

    this.form = form;
  }

  updateOptions () {
    const form = this.form;

    getOptions().then( (options) => {
      form.landmarksNavInput.checked = options.landmarks.includes('nav');
      form.landmarksSearchInput.checked = options.landmarks.includes('search');
      form.landmarksComplementaryInput.checked = options.landmarks.includes('complementary');
      form.landmarksContentinfoInput.checked = options.landmarks.includes('contentinfo');
      form.landmarksBannerInput.checked = options.landmarks.includes('banner');

      form.headings2Input.checked = options.headings.includes('h2');
      form.headings3Input.checked = options.headings.includes('h3');
      form.headings4Input.checked = options.headings.includes('h4');
      form.headings5Input.checked = options.headings.includes('h5');
      form.headings6Input.checked = options.headings.includes('h6');

      form.headingsMainOnlyInput.checked = options.headings.includes('main-only');

      this.syncOptionsWithSkipToScript (options);
    });
  }

  syncOptionsWithSkipToScript (options) {
    async function sendOptionsToTabs (options) {
      debug && console.log(`[syncOptoinsWithSkipToScript]: ${options}`);
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, {skiptoParams: optionsToParams(options)})
          .then((response) => {
              debug && console.info("Options received response from tab with title '%s' and url %s",
                  response.title, response.url)
          })
          .catch((error) => {
                  debug && console.warn("Options could not send message to tab %d", tab.id, error)
              })
      }
    }

    sendOptionsToTabs(options);
  }

  saveOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.landmarks = 'main';

      if (form.landmarksNavInput.checked) {
        options.landmarks += ' nav';
      }

      if (form.landmarksSearchInput.checked) {
        options.landmarks += ' search';
      }

      if (form.landmarksComplementaryInput.checked) {
        options.landmarks += ' complementary';
      }

      if (form.landmarksContentinfoInput.checked) {
        options.landmarks += ' contentinfo';
      }

      if (form.landmarksBannerInput.checked) {
        options.landmarks += ' banner';
      }

      options.headings = form.headingsMainOnlyInput.checked ? "main-only h1" : "h1";

      if (form.headings2Input.checked) {
        options.headings += " h2";
      }

      if (form.headings3Input.checked) {
        options.headings += " h2 h3";
      }

      if (form.headings4Input.checked) {
        options.headings += " h2 h3 h4";
      }

      if (form.headings5Input.checked) {
        options.headings += " h2 h3 h4 h5";
      }

      if (form.headings6Input.checked) {
        options.headings += " h2 h3 h4 h5 h6";
      }

      saveOptions(options).then(sendOptionsToTabs(options));
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const optionsContent = new OptionsContent();
  optionsContent.updateOptions();

  document.getElementById('id-save').addEventListener('click', optionsContent.saveOptions.bind(optionsContent));
  document.getElementById('id-reset-defaults').addEventListener('click', () => {
    resetDefaultOptions().then(optionsContent.updateOptions.bind(optionsContent));
  });

});

