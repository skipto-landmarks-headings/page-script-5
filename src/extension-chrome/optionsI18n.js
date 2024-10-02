/* optionsI18n.js */

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

      <div class="text">
        <label id="input-small-button-label-label"
               for="small-button-label">
                Button Small Label
        </label>
        <input id="input-small-button-label"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-alt-name-label"
               for="input-alt-name">
                ALT key name
        </label>
        <input id="input-alt-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-option-name-label"
               for="input-option-name">
                OPTION key name
        </label>
        <input id="input-option-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-shortcut-name-label"
               for="input-shortcut-name">
                Heading Group Label
        </label>
        <input id="input-shortcut-name"
          type="text"
          length="15"/>
      </div>

    </fieldset>


    <fieldset>
      <legend id="legend-menu-labels">
        Menu Labels
      </legend>

      <div class="text">
        <label id="input-menu-label"
               for="input-menu">
                Menu Label
        </label>
        <input id="input-menu"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-landmark-group-label"
               for="input-landmark-group">
                Landmark Group Label
        </label>
        <input id="input-landmark-group"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-heading-group-label"
               for="input-heading-group">
                Heading Group Label
        </label>
        <input id="input-heading-group"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-heading-level-label"
               for="input-heading-level">
                Heading Group Label
        </label>
        <input id="input-heading-level"
          type="text"
          length="15"/>
      </div>

    </fieldset>


    <fieldset>
      <legend id="legend-landmark-names">Landmark Region Names</legend>

      <div class="text">
        <label id="input-main-region-name-label"
               for="input-main-region-name">
                Menu region name
        </label>
        <input id="input-main-region-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-search-region-name-label"
               for="input-search-region-name">
                Search region name
        </label>
        <input id="input-search-region-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-navigation-region-name-label"
               for="input-navigation-region-name">
                Navigation region name
        </label>
        <input id="input-navigation-region-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-complementary-region-name-label"
               for="input-complementary-region-name">
                Navigation region name
        </label>
        <input id="input-complementary-region-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-contentinfo-region-name-label"
               for="input-contentinfo-region-name">
                Content Information region name
        </label>
        <input id="input-contentinfo-region-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-banner-region-name-label"
               for="input-banner-region-name">
                Banner region name
        </label>
        <input id="input-banner-region-name"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-msg-no-landmarks-label"
               for="input-msg-no-landmarks">
                Banner region name
        </label>
        <input id="input-msg-no-landmarks"
          type="text"
          length="15"/>
      </div>

      <div class="text">
        <label id="input-msg-no-headings-label"
               for="input-msg-no-headings">
                Banner region name
        </label>
        <input id="input-msg-no-headings"
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

      { id: 'legend-button-labels',           label: 'options_legend_button_labels'},
      { id: 'input-button-label-label',       label: 'options_button_label'},
      { id: 'input-small-button-label-label', label: 'options_small_button_label'},
      { id: 'input-alt-name-label',           label: 'options_alt_name_label'},
      { id: 'input-option-name-label',        label: 'options_option_name_label'},
      { id: 'input-shortcut-name-label',      label: 'options_shortcut_name_label'},

      { id: 'legend-menu-labels',           label: 'options_legend_menu_labels'},
      { id: 'input-menu-label',             label: 'options_menu_label'},
      { id: 'input-landmark-group-label',   label: 'options_landmark_group_label'},
      { id: 'input-heading-group-label',    label: 'options_heading_group_label'},
      { id: 'input-heading-level-label',    label: 'options_heading_level_label'},

      { id: 'legend-landmark-names',              label: 'options_legend_landmark_labels'},
      { id: 'input-main-region-name-label',        label: 'options_main_region_name'},
      { id: 'input-search-region-name-label',      label: 'options_search_region_name'},
      { id: 'input-navigation-region-name-label',  label: 'options_navigation_region_name'},
      { id: 'input-contentinfo-region-name-label', label: 'options_contentinfo_region_name'},
      { id: 'input-banner-region-name-label',      label: 'options_banner_region_name'},
      { id: 'input-msg-no-landmarks-label',        label: 'options_msg_no_landmarks'},
      { id: 'input-msg-no-headings-label',         label: 'options_msg_no_headings'},

    ];

    i18nLabels.forEach( item => {
      const node = getNode(item.id);
      const label = browserI18n.getMessage(item.label);
      if (node && label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        console.error(`[node][${node}]: ${item.id}`);
        console.error(`[label][${label}]: ${item.label}`);
      }
    });

    const form = {};

    form.buttonLabelInput            = getNode('input-button-label');
    form.smallButtonLabelInput       = getNode('input-small-button-label');
    form.altNameInput                = getNode('input-alt-name');
    form.optionNameInput             = getNode('input-option-name');
    form.shortcutNameInput           = getNode('input-shortcut-name');

    form.menuLabelInput              = getNode('input-menu');
    form.landmarkGroupInput          = getNode('input-landmark-group');
    form.headingGroupInput           = getNode('input-heading-group');
    form.headingLevelInput           = getNode('input-heading-level');

    form.mainRegionNameInput           = getNode('input-main-region-name');
    form.searchRegionNameInput         = getNode('input-search-region-name');
    form.navigationRegionNameInput     = getNode('input-navigation-region-name');
    form.complementaryRegionNameInput  = getNode('input-complementary-region-name');
    form.contentinfoRegionNameInput    = getNode('input-contentinfo-region-name');
    form.bannerRegionNameInput         = getNode('input-banner-region-name');
    form.msgNoLandmarksInput           = getNode('input-msg-no-landmarks');
    form.msgNoHeadingsInput            = getNode('input-msg-no-headings');

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
      form.smallButtonLabelInput.value      = options.smallButtonLabel;
      form.altNameInput.value           = options.altLabel;
      form.optionNameInput.value        = options.optionLabel;
      form.shortcutNameInput.value      = options.shortcutLabel;

      form.menuLabelInput.value       = options.menuLabel;
      form.landmarkGroupInput.value   = options.landmarkGroupLabel;
      form.headingGroupInput.value    = options.headingGroupLabel;
      form.headingLevelInput.value    = options.headingLevelLabel;

      form.mainRegionNameInput.value          = options.mainLabel;
      form.searchRegionNameInput.value        = options.searchLabel;
      form.navigationRegionNameInput.value    = options.navLabel;
      form.complementaryRegionNameInput.value = options.asideLabel;
      form.contentinfoRegionNameInput.value   = options.footerLabel;
      form.bannerRegionNameInput.value        = options.headerLabel;
      form.msgNoLandmarksInput.value          = options.msgNoLandmarksFound;
      form.msgNoHeadingsInput.value           = options.msgNoHeadingsFound;

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

      options.buttonLabel      = form.buttonLabelInput.value;
      options.smallButtonLabel = form.smallButtonLabelInput.value;
      options.altLabel         = form.altNameInput.value;
      options.optionLabel      = form.optionNameInput.value;
      options.shortcutLabel    = form.shortcutNameInput.value;

      options.menuLabel           = form.menuLabelInput.value;
      options.landmarkGroupLabel  = form.landmarkGroupInput.value;
      options.headingGroupLabel   = form.headingGroupInput.value;
      options.headingLevelLabel   = form.headingLevelInput.value;

      options.mainLabel        = form.mainRegionNameInput.value;
      options.searchLabel      = form.searchRegionNameInput.value;

      options.searchLabel         = form.searchRegionNameInput.value ;
      options.navLabel            = form.navigationRegionNameInput.value;
      options.asideLabel          = form.complementaryRegionNameInput.value;
      options.footerLabel         = form.contentinfoRegionNameInput.value;
      options.headerLabel         = form.bannerRegionNameInput.value;
      options.msgNoLandmarksFound = form.msgNoLandmarksInput.value;
      options.msgNoHeadingsFound  = form.msgNoHeadingsInput.value;

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
