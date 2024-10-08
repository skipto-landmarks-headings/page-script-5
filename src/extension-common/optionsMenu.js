/* optionsMenu.js */

const debug = false;

// Define browser specific APIs for Opera, Firefox and Chrome

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const browserI18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;

const browserTabs = typeof browser === 'object' ?
            browser.tabs :
            chrome.tabs;


import {
  getOptions,
  saveOptions,
  optionsToParams,
  resetDefaultMenuOptions
} from './storage.js';

// Generic error handler
function notLastError () {
  if (!browserRuntime.lastError) { return true; }
  else {
    debug && console.log(browserRuntime.lastError.message);
    return false;
  }
}

// Constants

const optionsMenuTemplate = document.createElement('template');
optionsMenuTemplate.innerHTML = `
  <form>
    <div>

      <fieldset>
        <legend id="highlight-legend">
          Highlight Content when when navigating menu options
         </legend>

        <label class="inline" for="highlight-disabled">
          <input type="radio" name="highlight" value="disabled" id="highlight-disabled"/>
          <span id="highlight-disabled-label">None</span>
        </label>

        <label class="inline" for="highlight-instant">
          <input type="radio" name="highlight" value="instant" id="highlight-instant"/>
          <span id="highlight-instant-label">Scroll <em>immediately</em> to menu target</span>
        </label>

        <label class="inline" for="highlight-smooth">
          <input type="radio" name="highlight" value="smooth" id="highlight-smooth"/>
          <span id="highlight-smooth-label">Scroll <em>immediately</em> to menu target</span>
        </label>

      </fieldset>

      <fieldset>
        <legend id="landmarks-legend">
          Landmark Regions
         </legend>

        <label class="inline" for="landmarks-navigation">
          <input type="checkbox" value="navigation" id="landmarks-navigation"/>
          <span id="landmarks-navigation-label">Navigation</span>
        </label>

        <label class="inline" for="landmarks-search">
          <input type="checkbox" value="search" id="landmarks-search"/>
          <span id="landmarks-search-label">Search</span>
        </label>

        <label class="inline" for="landmarks-complementary">
          <input type="checkbox" value="complementary" id="landmarks-complementary"/>
          <span id="landmarks-complementary-label">Complementary</span>
        </label>

        <label class="inline" for="landmarks-contentinfo">
          <input type="checkbox" value="contentinfo" id="landmarks-contentinfo"/>
          <span id="landmarks-contentinfo-label">Contentinfo</span>
        </label>

        <label class="inline" for="landmarks-banner">
          <input type="checkbox" value="banner" id="landmarks-banner"/>
          <span id="landmarks-banner-label">Banner</span>
        </label>

        <label class="inline" for="landmarks-region">
          <input type="checkbox" value="region" id="landmarks-region"/>
          <span id="landmarks-region-label">Named region</span>
        </label>

        <label class="inline" style="margin-top: 2em"  for="landmarks-doc-order">
          <input type="checkbox" value="doc-order" id="landmarks-doc-order"/>
          <span id="landmarks-doc-order-label">Show landmarks in document order</span>
        </label>


      </fieldset>

      <fieldset>
        <legend id="headings-legend">
          Headings
         </legend>

        <label class="inline" for="headings-1">
          <input type="radio" name="headings" value="h1" id="headings-1"/>
          <span id="headings-1-label">h1</span>
        </label>

        <label class="inline" for="headings-2">
          <input type="radio" name="headings" value="h1 h2" id="headings-2"/>
          <span id="headings-2-label">h1, h2</span>
        </label>

        <label class="inline" for="headings-3">
          <input type="radio" name="headings" value="h1 h2 h3" id="headings-3"/>
          <span id="headings-3-label">h1, h2, h3</span>
        </label>

        <label class="inline" for="headings-4">
          <input type="radio" name="headings" value="h1 h2 h3 h4" id="headings-4"/>
          <span id="headings-4-label">h1, h2, h3, h4</span>
        </label>

        <label class="inline" for="headings-5">
          <input type="radio" name="headings" value="h1 h2 h3 h4 h5" id="headings-5"/>
          <span id="headings-5-label">h1, h2, h3, h4, h5</span>
        </label>

        <label class="inline" for="headings-6">
          <input type="radio" name="headings" value="h1 h2 h3 h4 h5 h6" id="headings-6"/>
          <span id="headings-6-label">h1, h2, h3, h4, h5, h6</span>
        </label>

        <label class="inline" style="margin-top: 2em"  for="headings-main-only">
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

      { id: 'highlight-legend',         label: 'options_highlight_legend'},
      { id: 'highlight-disabled-label', label: 'options_highlight_disabled_label'},
      { id: 'highlight-instant-label',  label: 'options_highlight_instant_label'},
      { id: 'highlight-smooth-label',   label: 'options_highlight_smooth_label'},

      { id: 'headings-legend', label: 'options_heading_legend'},

      { id: 'headings-1-label', label: 'options_heading_h1'},
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
      { id: 'landmarks-search-label',        label: 'options_landmark_search'},
      { id: 'landmarks-region-label',        label: 'options_landmark_region'},
      { id: 'landmarks-doc-order',           label: 'options_landmark_doc_order'}

    ];

    i18nLabels.forEach( item => {
      const node = getNode(item.id);
      const label = browserI18n.getMessage(item.label);
      if (node && label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        node && console.error(`node not found for ${item.id}`);
        label && console.error(`message not found for ${item.label}`);
      }
    });

    const form = {};

    form.highlightDisabled  = getNode('highlight-disabled');
    form.highlightInstant   = getNode('highlight-instant');
    form.highlightSmooth    = getNode('highlight-smooth');

    form.landmarksNavigationInput    = getNode('landmarks-navigation');
    form.landmarksSearchInput        = getNode('landmarks-search');
    form.landmarksComplementaryInput = getNode('landmarks-complementary');
    form.landmarksContentinfoInput   = getNode('landmarks-contentinfo');
    form.landmarksBannerInput        = getNode('landmarks-banner');
    form.landmarksRegionInput        = getNode('landmarks-region');

    form.landmarksDocOrderInput      = getNode('landmarks-doc-order');

    form.headings1Input = getNode('headings-1');
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

      form.highlightDisabled.checked = options.highlightTarget === 'disabled';
      form.highlightInstant.checked  = options.highlightTarget === 'instant';
      form.highlightSmooth.checked   = options.highlightTarget === 'smooth';

      form.landmarksNavigationInput.checked    = options.landmarks.includes('nav');
      form.landmarksSearchInput.checked        = options.landmarks.includes('search');
      form.landmarksComplementaryInput.checked = options.landmarks.includes('complementary');
      form.landmarksContentinfoInput.checked   = options.landmarks.includes('contentinfo');
      form.landmarksBannerInput.checked        = options.landmarks.includes('banner');
      form.landmarksRegionInput.checked        = options.landmarks.includes('region');

      form.landmarksDocOrderInput.checked      = options.landmarks.includes('doc-order');

      form.headings1Input.checked = options.headings.includes('h1');
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
      debug && console.log(`[syncOptoinsWithSkipToScript][params]: ${optionsToParams(options)}`);
      const tabs = await browserTabs.query({});
      for (const tab of tabs) {
          browserTabs.sendMessage(tab.id, {skiptoParams: optionsToParams(options)})
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
    this.syncMyParamsInBackground(options);
  }

  syncMyParamsInBackground (options) {
      debug && console.log(`[syncMyParamsInBackground][params]: ${optionsToParams(options)}`);
      browserRuntime.sendMessage({type: 'updateMyParams'});
  }

  saveMenuContentOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.highlightTarget = form.highlightSmooth.checked ?
                              'smooth' :
                              (form.highlightInstant.checked ?
                              'instant' :
                              'disabled'
                              );

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

      if (form.landmarksRegionInput.checked) {
        options.landmarks += ' region';
      }

      if (form.landmarksDocOrderInput.checked) {
        options.landmarks += ' doc-order';
      }

      options.headings = form.headingsMainOnlyInput.checked ? "main-only" : "";

     if (form.headings1Input.checked) {
        options.headings += " h1";
      }

      if (form.headings2Input.checked) {
        options.headings += " h1 h2";
      }

      if (form.headings3Input.checked) {
        options.headings += " h1 h2 h3";
      }

      if (form.headings4Input.checked) {
        options.headings += " h1 h2 h3 h4";
      }

      if (form.headings5Input.checked) {
        options.headings += "h1 h2 h3 h4 h5";
      }

      if (form.headings6Input.checked) {
        options.headings += "h1 h2 h3 h4 h5 h6";
      }

      saveOptions(options).then(
        this.syncOptionsWithSkipToScript(options));
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
