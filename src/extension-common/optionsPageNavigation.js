/* optionsPageNavigation.js */

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
  resetDefaultPageNavigationOptions
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

const optionsPageNavigationTemplate = document.createElement('template');
optionsPageNavigationTemplate.innerHTML = `
  <form>
    <div>

      <label class="inline" for="enable-page-nav">
        <input id="enable-page-nav"
           type="checkbox"/>
        <span id="enable-page-nav-label">Enable page navigation with shortcut keys</span>
      </label>

    </div>

    <button id="button-reset" type="reset">Reset Page Navigation Defaults</button>

  </form>
`;


class OptionsPageNavigation extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsPageNavigation.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsPageNavigation = this;

    const optionsPageNavigationClone = optionsPageNavigationTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsPageNavigationClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    // Update labels with i18n information

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_page_nav_reset'},

      { id: 'enable-page-nav-label',  label: 'options_enable_page_nav_label'}
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

    form.checkboxEnablePageNavInput    = getNode('enable-page-nav');

    this.form = form;

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultPageNavigationOptions().then(this.updateOptions.bind(this));
    });

    optionsPageNavigation.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsPageNavigation.onFocus);
      input.addEventListener('blur',   optionsPageNavigation.onBlur);
      input.addEventListener('change', optionsPageNavigation.onChange.bind(optionsPageNavigation));
    });
  }

  updateOptions () {
    const form = this.form;

    getOptions().then( (options) => {

      form.checkboxEnablePageNavInput.checked = options.pageNavigation === 'enabled';


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

  saveButtonContentOptions () {

    const form = this.form;

    getOptions().then( (options) => {


      options.pageNavigation = form.checkboxEnablePageNavInput.checked ? 'enabled' : 'disabled';

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
    this.saveButtonContentOptions();
  }

}

window.customElements.define("options-page-navigation", OptionsPageNavigation);
