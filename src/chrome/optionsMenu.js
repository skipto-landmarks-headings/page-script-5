/* optionsMenu.js */

const debug = false;

import {
  getOptions,
  saveOptions,
  optionsToParams,
  resetDefaultMenuOptions
} from './storage.js';

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    debug && console.log(chrome.runtime.lastError.message);
    return false;
  }
}

// Constants

const optionsMenuTemplate = document.createElement('template');
optionsMenuTemplate.innerHTML = `
  <form>
    <div>

      <fieldset>
        <legend id="landmarks-legend">
          Landmark Regions
         </legend>

        <label for="landmarks-navigation">
          <input type="checkbox" value="navigation" id="landmarks-navigation"/>
          <span id="landmarks-navigation-label">Navigation</span>
        </label>

        <label for="landmarks-search">
          <input type="checkbox" value="search" id="landmarks-search"/>
          <span id="landmarks-search-label">Search</span>
        </label>

        <label for="landmarks-complementary">
          <input type="checkbox" value="search" id="landmarks-complementary"/>
          <span id="landmarks-complementary-label">Complementary</span>
        </label>

        <label for="landmarks-contentinfo">
          <input type="checkbox" value="search" id="landmarks-contentinfo"/>
          <span id="landmarks-contentinfo-label">Contentinfo</span>
        </label>

        <label for="landmarks-banner">
          <input type="checkbox" value="search" id="landmarks-banner"/>
          <span id="landmarks-banner-label">Banner</span>
        </label>

      </fieldset>

      <fieldset>
        <legend id="headings-legend">
          Headings
         </legend>

        <label for="headings-2">
          <input type="radio" name="headings" value="h1 h2" id="headings-2"/>
          <span id="headings-2-label">h1, h2</span>
        </label>

        <label for="headings-3">
          <input type="radio" name="headings" value="h1 h2 h3" id="headings-3"/>
          <span id="headings-3-label">h1, h2, h3</span>
        </label>

        <label for="headings-4">
          <input type="radio" name="headings" value="h1 h2 h3 h4" id="headings-4"/>
          <span id="headings-4-label">h1, h2, h3, h4</span>
        </label>

        <label for="headings-5">
          <input type="radio" name="headings" value="h1 h2 h3 h4 h5" id="headings-5"/>
          <span id="headings-5-label">h1, h2, h3, h4, h5</span>
        </label>

        <label for="headings-6">
          <input type="radio" name="headings" value="h1 h2 h3 h4 h5 h6" id="headings-6"/>
          <span id="headings-6-label">h1, h2, h3, h4, h5, h6</span>
        </label>

        <label style="margin-top: 2em"  for="headings-main-only">
          <input type="checkbox" value="main-only" id="headings-main-only"/>
          <span id="headings-main-only-label">Only show headings in main landmark region</span>
        </label>

      </fieldset>

    </div>

    <button id="button-reset" type="reset">Reset Menu Content Defaults</button>

  </form>
`;


class OptionsMenu extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsMenu.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsMenu = this;

    const optionsMenuClone = optionsMenuTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsMenuClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    // Update labels with i18n information

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_menu_content_reset'},

      { id: 'headings-legend', label: 'options_heading_legend'},

      { id: 'headings-2-label', label: 'options_heading_h2'},
      { id: 'headings-3-label', label: 'options_heading_h3'},
      { id: 'headings-4-label', label: 'options_heading_h4'},
      { id: 'headings-5-label', label: 'options_heading_h5'},
      { id: 'headings-6-label', label: 'options_heading_h6'},

      { id: 'headings-main-only-label', label: 'options_heading_main_only'},

      { id: 'landmarks-legend',              label: 'options_landmark_legend'},
      { id: 'landmarks-banner-label',        label: 'options_landmark_banner'},
      { id: 'landmarks-complementary-label', label: 'options_landmark_complementary'},
      { id: 'landmarks-contentinfo-label',   label: 'options_landmark_contentinfo'},
      { id: 'landmarks-navigation-label',    label: 'options_landmark_navigation'},
      { id: 'landmarks-search-label',        label: 'options_landmark_search'}
    ];

    i18nLabels.forEach( item => {
      const node = getNode(item.id);
      const label = chrome.i18n.getMessage(item.label);
      if (node && label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        node && console.error(`node not found for ${item.id}`);
        label && console.error(`message not found for ${item.label}`);
      }
    });

    const form = {};

    form.landmarksNavigationInput    = getNode('landmarks-navigation');
    form.landmarksSearchInput        = getNode('landmarks-search');
    form.landmarksComplementaryInput = getNode('landmarks-complementary');
    form.landmarksContentinfoInput   = getNode('landmarks-contentinfo');
    form.landmarksBannerInput        = getNode('landmarks-banner');

    form.headings2Input = getNode('headings-2');
    form.headings3Input = getNode('headings-3');
    form.headings4Input = getNode('headings-4');
    form.headings5Input = getNode('headings-5');
    form.headings6Input = getNode('headings-6');

    form.headingsMainOnlyInput = getNode('headings-main-only');

    this.form = form;

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultMenuOptions().then(this.updateOptions.bind(this));
    });

    optionsMenu.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsMenu.onFocus);
      input.addEventListener('blur',   optionsMenu.onBlur);
      input.addEventListener('change', optionsMenu.onChange.bind(optionsMenu));
    });
  }

  updateOptions () {
    const form = this.form;

    getOptions().then( (options) => {
      form.landmarksNavigationInput.checked = options.landmarks.includes('nav');
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

  saveMenuContentOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.landmarks = 'main';

      if (form.landmarksNavigationInput.checked) {
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

      saveOptions(options).then(this.syncOptionsWithSkipToScript(options));
    });
  }

  // Event handlers

  onFocus (event) {
    const node = event.currentTarget.parentNode;
    const rect = node.querySelector('span').getBoundingClientRect();
    node.style.width = (rect.width + 40) + 'px';
    node.classList.add('focus');
  }

  onBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
  }

  onChange () {
    debug && console.log(`[saveOptions]`);
    this.saveMenuContentOptions();
  }

}

window.customElements.define("options-menu", OptionsMenu);
