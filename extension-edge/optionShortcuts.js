/* optionsShortcuts.js */

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
  resetDefaultShortcutsOptions
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

const optionsShortcutsTemplate = document.createElement('template');
optionsShortcutsTemplate.innerHTML = `
  <form>
    <div>

      <label class="inline" for="enable-shortcuts">
        <input id="enable-shortcuts"
           type="checkbox"/>
        <span id="enable-shortcuts-label">Enable page navigation with shortcut keys</span>
      </label>

      <fieldset>
        <legend id="region-legend">
          Landmark Regions
         </legend>

        <label class="inline text" for="region-next">
          <input type="text" size="1" value="x" id="region-next"/>
          <span id="region-next-label">Next region</span>
        </label>

        <label class="inline text" for="region-prev">
          <input type="text" size="1" value="x" id="region-prev"/>
          <span id="region-prev-label">Previous region</span>
        </label>

        <label class="inline text" for="region-main">
          <input type="text" size="1" value="x" id="region-main"/>
          <span id="region-main-label">Next Main region</span>
        </label>

        <label class="inline text" for="region-nav">
          <input type="text" size="1" value="x" id="region-nav"/>
          <span id="region-nav-label">Next Navigation region</span>
        </label>

      </fieldset>

      <fieldset>
        <legend id="heading-legend">
          Headings
         </legend>

        <label class="inline text" for="heading-next">
          <input type="text" size="1" value="x" id="heading-next"/>
          <span id="heading-next-label">Next heading/span>
        </label>

        <label class="inline text" for="heading-prev">
          <input type="text" size="1" value="x" id="heading-prev"/>
          <span id="heading-prev-label">Next heading/span>
        </label>

        <label class="inline text" for="heading-h1">
          <input type="text" size="1" value="x" id="heading-h1"/>
          <span id="heading-h1-label">H1 headings</span>
        </label>

        <label class="inline text" for="heading-h2">
          <input type="text" size="1" value="x" id="heading-h2"/>
          <span id="heading-h2-label">H2 headings</span>
        </label>

        <label class="inline text" for="heading-h3">
          <input type="text" size="1" value="x" id="heading-h3"/>
          <span id="heading-h3-label">H3 headings</span>
        </label>

        <label class="inline text" for="heading-h4">
          <input type="text" size="1" value="x" id="heading-h4"/>
          <span id="heading-h4-label">H4 headings</span>
        </label>

        <label class="inline text" for="heading-h5">
          <input type="text" size="1" value="x" id="heading-h5"/>
          <span id="heading-h5-label">H5 headings</span>
        </label>

        <label class="inline text" for="heading-h6">
          <input type="text" size="1" value="x" id="heading-h6"/>
          <span id="heading-h6-label">H6 headings</span>
        </label>

      </fieldset>

    </div>

    <button id="button-reset" type="reset">Reset Page Navigation Defaults</button>

  </form>
`;


class OptionsShortcuts extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsShortcuts.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsShortcuts = this;

    const optionsShortcutsClone = optionsShortcutsTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsShortcutsClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    // Update labels with i18n information

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_shortcuts_reset'},

      { id: 'enable-shortcuts-label',  label: 'options_enable_shortcuts_label'},

      { id: 'region-legend',      label: 'region_legend'},
      { id: 'region-next-label',  label: 'region_next_label'},
      { id: 'region-prev-label',  label: 'region_prev_label'},
      { id: 'region-main-label',  label: 'region_main_label'},,
      { id: 'region-nav-label',   label: 'region_nav_label'},

      { id: 'heading-legend',      label: 'heading_legend'},
      { id: 'heading-next-label',  label: 'heading_next_label'},
      { id: 'heading-prev-label',  label: 'heading_prev_label'},
      { id: 'heading-h1-label',    label: 'heading_h1_label'},
      { id: 'heading-h2-label',    label: 'heading_h2_label'},
      { id: 'heading-h3-label',    label: 'heading_h3_label'},
      { id: 'heading-h4-label',    label: 'heading_h4_label'},
      { id: 'heading-h5-label',    label: 'heading_h5_label'},
      { id: 'heading-h6-label',    label: 'heading_h6_label'}

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

    form.checkboxEnableShortcutsInput    = getNode('enable-shortcuts');

    form.textRegionNextInput  = getNode('region-next');
    form.textRegionPrevInput  = getNode('region-prev');
    form.textRegionMainInput  = getNode('region-main');
    form.textRegionNavInput   = getNode('region-nav');

    form.textHeadingNextInput  = getNode('heading-next');
    form.textHeadingPrevInput  = getNode('heading-prev');
    form.textHeadingH1Input    = getNode('heading-h1');
    form.textHeadingH2Input    = getNode('heading-h2');
    form.textHeadingH3Input    = getNode('heading-h3');
    form.textHeadingH4Input    = getNode('heading-h4');
    form.textHeadingH5Input    = getNode('heading-h5');
    form.textHeadingH6Input    = getNode('heading-h6');

    this.form = form;

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultShortcutsOptions().then(this.updateOptions.bind(this));
    });

    optionsShortcuts.shadowRoot.querySelectorAll('input[type=checkbox], input[type=text]').forEach( input => {
      input.addEventListener('focus',  optionsShortcuts.onFocus);
      input.addEventListener('blur',   optionsShortcuts.onBlur);
      input.addEventListener('change', optionsShortcuts.onChange.bind(optionsShortcuts));
    });

    optionsShortcuts.shadowRoot.querySelectorAll('input[type=text]').forEach( input => {
      input.addEventListener('keydown', optionsShortcuts.onKeydown.bind(optionsShortcuts));
    });

  }

  updateOptions () {
    const form = this.form;

    getOptions().then( (options) => {

      form.checkboxEnableShortcutsInput.checked = options.shortcuts === 'enabled';

      form.textRegionNextInput.value = options.pageRegionNext;
      form.textRegionPrevInput.value = options.pageRegionPrevious;
      form.textRegionMainInput.value = options.pageRegionMain;
      form.textRegionNavInput.value  = options.pageRegionNavigation;

      form.textHeadingNextInput.value  = options.pageHeadingNext;
      form.textHeadingPrevInput.value  = options.pageHeadingPrevious;
      form.textHeadingH1Input.value    = options.pageHeadingH1;
      form.textHeadingH2Input.value    = options.pageHeadingH2;
      form.textHeadingH3Input.value    = options.pageHeadingH3;
      form.textHeadingH4Input.value    = options.pageHeadingH4;
      form.textHeadingH5Input.value    = options.pageHeadingH5;
      form.textHeadingH6Input.value    = options.pageHeadingH6;

      this.syncOptionsWithSkipToScript (options);
    });
  }

  syncOptionsWithSkipToScript (options) {
    async function sendOptionsToTabs (options) {
//      debug && console.log(`[syncOptoinsWithSkipToScript][params]: ${optionsToParams(options)}`);
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
//      debug && console.log(`[syncMyParamsInBackground][params]: ${optionsToParams(options)}`);
      browserRuntime.sendMessage({type: 'updateMyParams'});
  }

  saveButtonContentOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.shortcuts = form.checkboxEnableShortcutsInput.checked ? 'enabled' : 'disabled';

      options.pageRegionNext       = form.textRegionNextInput.value.trim().substring(0,1);
      options.pageRegionPrevious   = form.textRegionPrevInput.value.trim().substring(0,1);
      options.pageRegionMain       = form.textRegionMainInput.value.trim().substring(0,1);
      options.pageRegionNavigation = form.textRegionNavInput.value.trim().substring(0,1);

      options.pageHeadingNext     = form.textHeadingNextInput.value.trim().substring(0,1);
      options.pageHeadingPrevious = form.textHeadingPrevInput.value.trim().substring(0,1);
      options.pageHeadingH1       = form.textHeadingH1Input.value.trim().substring(0,1);
      options.pageHeadingH2       = form.textHeadingH2Input.value.trim().substring(0,1);
      options.pageHeadingH3       = form.textHeadingH3Input.value.trim().substring(0,1);
      options.pageHeadingH4       = form.textHeadingH4Input.value.trim().substring(0,1);
      options.pageHeadingH5       = form.textHeadingH5Input.value.trim().substring(0,1);
      options.pageHeadingH6       = form.textHeadingH6Input.value.trim().substring(0,1);

      saveOptions(options).then(
        this.syncOptionsWithSkipToScript(options));
    });
  }

  // Event handlers

  onFocus (event) {
    const node = event.currentTarget.parentNode;
    const rect = node.querySelector('span').getBoundingClientRect();
    node.style.width = (rect.width + 60) + 'px';
    node.classList.add('focus');
  }

  onBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
  }

  onChange () {
    this.saveButtonContentOptions();
  }

  onKeydown (event) {
    const tgt = event.currentTarget;
    if (event.key.length === 1) {
      if (this.unusedShortcutKey(tgt, event.key)) {
        tgt.value = event.key;
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }

  unusedShortcutKey(inputNode, key) {

    const unique = (this.form.textRegionNextInput.value  !== key) &&
      (this.form.textRegionPrevInput.value  !== key) &&
      (this.form.textRegionMainInput.value  !== key) &&
      (this.form.textRegionNavInput.value   !== key) &&
      (this.form.textHeadingNextInput.value !== key) &&
      (this.form.textHeadingPrevInput.value !== key) &&
      (this.form.textHeadingH1Input.value   !== key) &&
      (this.form.textHeadingH2Input.value   !== key) &&
      (this.form.textHeadingH3Input.value   !== key) &&
      (this.form.textHeadingH4Input.value   !== key) &&
      (this.form.textHeadingH5Input.value   !== key) &&
      (this.form.textHeadingH6Input.value   !== key);

    return unique;
  }

}

window.customElements.define("options-page-navigation", OptionsShortcuts);
