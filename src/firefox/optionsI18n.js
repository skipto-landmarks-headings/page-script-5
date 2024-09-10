/* optionsI18n.js */

const debug = true;

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
  resetDefaultStyleOptions
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

const optionsI18nTemplate = document.createElement('template');
optionsI18nTemplate.innerHTML = `
  <form>

    <fieldset>
      <legend id="legend-button-labels">Button Labels</legend>

      <div class="text">
        <label id="input-button-label-label"
               for="button-label">
                Button Label
        </label>
        <input id="input-button-label"
          type="text"
          length="15"/>
      </div>

    </fieldset>


    <fieldset>
      <legend id="legend-menu-labels">Menu Labels</legend>

      <div class="text">
        <label id="input-menu-label-label"
               for="input-menu-label">
                Menu Label
        </label>
        <input id="input-menu-label"
          type="text"
          length="15"/>
      </div>

    </fieldset>

    <button id="button-reset" type="reset">Reset to English Defaults</button>

  </form>
`;


class OptionsI18n extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsI18n.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function
    const optionsI18n = this;

    const optionsI18nClone = optionsI18nTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsI18nClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    // Update labels with i18n information

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_i18n_reset'},

      { id: 'legend-button-labels',     label: 'options_legend_button_labels'},
      { id: 'input-button-label-label', label: 'options_button_label'},

      { id: 'legend-menu-labels',       label: 'options_legend_menu_labels'},
      { id: 'input-menu-label-label',   label: 'options_menu_label'}

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

    form.buttonLabelInput            = getNode('input-button-label');
    form.menuLabelInput              = getNode('input-menu-label');

    this.form = form;

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultStyleOptions().then(this.updateOptions.bind(this));
    });

    optionsI18n.shadowRoot.querySelectorAll('input[type=text]').forEach( input => {
      input.addEventListener('focus', this.onFocus);
      input.addEventListener('blur', this.onBlur);
      input.addEventListener('input', optionsI18n.onChange.bind(optionsI18n));
    });

  }

  updateOptions () {
    const form = this.form;
    let optionNodes, optionNode;

    getOptions().then( (options) => {

      form.buttonLabelInput.value           = options.buttonLabel;
      form.menuLabelInput.value             = options.menuLabel;

      this.syncOptionsWithSkipToScript (options);
    });
  }

  syncOptionsWithSkipToScript (options) {
    async function sendOptionsToTabs (options) {
      debug && console.log(`[syncOptoinsWithSkipToScript]: ${options}`);
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

  saveStyleOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.buttonLabel = form.buttonLabelInput.value;
      options.menuLabel   = form.menuLabelInput.value;

      this.updateStyleViewer(options);

      saveOptions(options).then(this.syncOptionsWithSkipToScript(options));
    });
  }

  // Event handlers

  onFocus (event) {
    const node = event.currentTarget.parentNode;
    const rect = node.getBoundingClientRect();
    node.style.width = (rect.width + 40) + 'px';
    node.classList.add('focus');
  }

  onBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
  }

  onChange (event) {
    debug && console.log(`[onChange]: ${event.target.value}`);
    this.saveStyleOptions();
  }

}

window.customElements.define("options-i18n", OptionsI18n);
