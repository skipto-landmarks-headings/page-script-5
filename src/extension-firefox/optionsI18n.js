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
          size="15"/>
      </div>

      <div class="text">
        <label id="input-small-button-label-label"
               for="small-button-label">
                Button Small Label
        </label>
        <input id="input-small-button-label"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-alt-name-label"
               for="input-alt-name">
                ALT key name
        </label>
        <input id="input-alt-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-option-name-label"
               for="input-option-name">
                OPTION key name
        </label>
        <input id="input-option-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-shortcut-name-label"
               for="input-shortcut-name">
                Heading Group Label
        </label>
        <input id="input-shortcut-name"
          type="text"
          size="15"/>
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
          size="15"/>
      </div>

      <div class="text">
        <label id="input-landmark-group-label"
               for="input-landmark-group">
                Landmark Group Label
        </label>
        <input id="input-landmark-group"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-heading-group-label"
               for="input-heading-group">
                Heading Group Label
        </label>
        <input id="input-heading-group"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-heading-main-group-label"
               for="input-heading-main-group">
                Heading in Main Region Group Label
        </label>
        <input id="input-heading-main-group"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label id="input-heading-level-label"
               for="input-heading-level">
                Heading Group Label
        </label>
        <input id="input-heading-level"
          type="text"
          size="15"/>
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
          size="15"/>
      </div>

      <div class="text">
        <label id="input-search-region-name-label"
               for="input-search-region-name">
                Search region name
        </label>
        <input id="input-search-region-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-navigation-region-name-label"
               for="input-navigation-region-name">
                Navigation region name
        </label>
        <input id="input-navigation-region-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-complementary-region-name-label"
               for="input-complementary-region-name">
                Navigation region name
        </label>
        <input id="input-complementary-region-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-contentinfo-region-name-label"
               for="input-contentinfo-region-name">
                Content Information region name
        </label>
        <input id="input-contentinfo-region-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-banner-region-name-label"
               for="input-banner-region-name">
                Banner region name
        </label>
        <input id="input-banner-region-name"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label id="input-msg-no-landmarks-label"
               for="input-msg-no-landmarks">
            No landmarks found
        </label>
        <input id="input-msg-no-landmarks"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label id="input-msg-no-headings-label"
               for="input-msg-no-headings">
             No headings found
        </label>
        <input id="input-msg-no-headings"
          type="text"
          size="25"/>
      </div>

    </fieldset>

    <fieldset>
      <legend id="legend-shortcuts-menu-labels">Shortcut Menu Labels</legend>

      <div class="text">
        <label id="input-group-enabled-label"
               for="input-group-enabled">
            Enabled
        </label>
        <input id="input-group-enabled"
          type="text"
          size="30"/>
      </div>

      <div class="text">
        <label id="input-group-disabled-label"
               for="input-group-disabled">
            Disabled
        </label>
        <input id="input-group-disabled"
          type="text"
          size="30"/>
      </div>

      <div class="text">
        <label id="input-toggle-enabled-label"
               for="input-toggle-enabled">
            Toggled Enabled
        </label>
        <input id="input-toggle-enabled"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label id="input-toggle-disabled-label"
               for="input-toggle-disabled">
            Toggled Disabled
        </label>
        <input id="input-toggle-disabled"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label id="input-shortcut-info-label"
               for="input-shortcut-info">
            Information
        </label>
        <input id="input-shortcut-info"
          type="text"
          size="20"/>
      </div>

    </fieldset>

    <fieldset>
      <legend id="legend-region-shortcut-messages">Region Shortcut Messages</legend>

      <div class="text">
        <label id="input-next-region-label"
               for="input-next-region">
            Next Region
        </label>
        <input id="input-next-region"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label id="input-previous-region-label"
               for="input-previous-region">
            Previous Region
        </label>
        <input id="input-previous-region"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label id="input-main-regions-label"
               for="input-main-regions">
            Main Regions
        </label>
        <input id="input-main-regions"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label id="input-navigation-regions-label"
               for="input-navigation-regions">
            Navigation Regions
        </label>
        <input id="input-navigation-regions"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label id="input-complementary-regions-label"
               for="input-complementary-regions">
            Complementary Regions
        </label>
        <input id="input-complementary-regions"
          type="text"
          size="20"/>
      </div>

    </fieldset>

    <fieldset>
      <legend id="legend-heading-shortcut-messages">Heading Shortcut Messages</legend>

      <div class="text">
        <label id="input-heading-level-msg-label"
               for="input-heading-msg-level">
            Heading Level
        </label>
        <input id="input-heading-level-msg"
          aria-describedby="input-heading-level-msg-desc"
          type="text"
          size="20"/>
        <div class="desc" id="input-heading-level-msg-desc"></div>

      </div>

      <div class="text">
        <label id="input-next-heading-label"
               for="input-next-heading">
            Next Heading
        </label>
        <input id="input-next-heading"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-previous-heading-label"
               for="input-previous-heading">
            Previous Heading
        </label>
        <input id="input-previous-heading"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-h1-headings-label"
               for="input-h1-headings">
            Level 1 Headings
        </label>
        <input id="input-h1-headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-h2-headings-label"
               for="input-h2-headings">
            Level 2 Headings
        </label>
        <input id="input-h2-headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-h3-headings-label"
               for="input-h3-headings">
            Level 3 Headings
        </label>
        <input id="input-h3-headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-h4-headings-label"
               for="input-h4-headings">
            Level 4 Headings
        </label>
        <input id="input-h4-headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-h5-headings-label"
               for="input-h5-headings">
            Level 5 Headings
        </label>
        <input id="input-h5-headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label id="input-h6-headings-label"
               for="input-h6-headings">
            Level 6 Headings
        </label>
        <input id="input-h6-headings"
          type="text"
          size="20"/>
      </div>


    </fieldset>

    <button id="button-reset" type="reset">Reset to English Defaults</button>

  </form>
`;


class OptionsI18n extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      const node = optionsI18n.shadowRoot.querySelector(`#${id}`);
      debug && console.log(`[getNode][${id}]: ${node}`);
      return node;
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

      { id: 'legend-menu-labels',             label: 'options_legend_menu_labels'},
      { id: 'input-menu-label',               label: 'options_menu_label'},
      { id: 'input-landmark-group-label',     label: 'options_landmark_group_label'},
      { id: 'input-heading-group-label',      label: 'options_heading_group_label'},
      { id: 'input-heading-main-group-label', label: 'options_heading_main_group_label'},
      { id: 'input-heading-level-label',      label: 'options_heading_level_label'},

      { id: 'legend-landmark-names',               label: 'options_legend_landmark_labels'},
      { id: 'input-main-region-name-label',        label: 'options_main_region_name'},
      { id: 'input-search-region-name-label',      label: 'options_search_region_name'},
      { id: 'input-navigation-region-name-label',  label: 'options_navigation_region_name'},
      { id: 'input-contentinfo-region-name-label', label: 'options_contentinfo_region_name'},
      { id: 'input-banner-region-name-label',      label: 'options_banner_region_name'},
      { id: 'input-msg-no-landmarks-label',        label: 'options_msg_no_landmarks'},
      { id: 'input-msg-no-headings-label',         label: 'options_msg_no_headings'},

      { id: 'legend-shortcuts-menu-labels',   label: 'options_legend_shortcuts_menu_labels'},
      { id: 'input-group-enabled-label',      label: 'options_shortcuts_enabled_label'},
      { id: 'input-group-disabled-label',     label: 'options_shortcuts_disabled_label'},
      { id: 'input-toggle-enabled-label',     label: 'options_toggle_enabled_label'},
      { id: 'input-toggle-disabled-label',    label: 'options_toggle_disabled_label'},
      { id: 'input-shortcut-info-label',      label: 'options_shortcut_info_label'},

      { id: 'legend-region-shortcut-messages',   label: 'options_legend_region_shortcut_messages'},
      { id: 'input-next-region-label',           label: 'options_next_region_label'},
      { id: 'input-previous-region-label',       label: 'options_previous_region_label'},
      { id: 'input-main-regions-label',          label: 'options_main_regions_label'},
      { id: 'input-navigation-regions-label',    label: 'options_navigation_regions_label'},
      { id: 'input-complementary-regions-label', label: 'options_complementary_regions_label'},

      { id: 'legend-heading-shortcut-messages', label: 'options_legend_heading_shortcut_messages'},
      { id: 'input-next-heading-label',         label: 'options_next_heading_label'},
      { id: 'input-previous-heading-label',     label: 'options_previous_heading_label'},
      { id: 'input-heading-level-msg-label',    label: 'options_heading_level_label'},
      { id: 'input-heading-level-msg-desc',     label: 'options_heading_level_desc'},
      { id: 'input-h1-headings-label',          label: 'options_h1_headings_label'},
      { id: 'input-h2-headings-label',          label: 'options_h2_headings_label'},
      { id: 'input-h3-headings-label',          label: 'options_options_h3_headings_label'},
      { id: 'input-h4-headings-label',          label: 'options_h4_headings_label'},
      { id: 'input-h5-headings-label',          label: 'options_h5_headings_label'},
      { id: 'input-h6-headings-label',          label: 'options_h6_headings_label'},

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
    form.headingMainGroupInput       = getNode('input-heading-main-group');
    form.headingLevelInput           = getNode('input-heading-level');

    form.mainRegionNameInput           = getNode('input-main-region-name');
    form.searchRegionNameInput         = getNode('input-search-region-name');
    form.navigationRegionNameInput     = getNode('input-navigation-region-name');
    form.complementaryRegionNameInput  = getNode('input-complementary-region-name');
    form.contentinfoRegionNameInput    = getNode('input-contentinfo-region-name');
    form.bannerRegionNameInput         = getNode('input-banner-region-name');
    form.msgNoLandmarksInput           = getNode('input-msg-no-landmarks');
    form.msgNoHeadingsInput            = getNode('input-msg-no-headings');

    form.groupEnabledInput     = getNode('input-group-enabled');
    form.groupDisabledInput    = getNode('input-group-disabled');
    form.toggleEnabledInput    = getNode('input-toggle-enabled');
    form.toggleDisabledInput   = getNode('input-toggle-disabled');
    form.shortcutInfoInput     = getNode('input-shortcut-info',);

    form.nextRegionInput            = getNode('input-next-region');
    form.previousRegionInput        = getNode('input-previous-region');
    form.mainRegionsInput           = getNode('input-main-regions');
    form.navigationRegionsInput     = getNode('input-navigation-regions');
    form.complementaryRegionsInput  = getNode('input-complementary-regions');

    form.nextHeadingInput      = getNode('input-next-heading');
    form.previousHeadingInput  = getNode('input-previous-heading');
    form.headingLevelMsgInput  = getNode('input-heading-level-msg');
    form.h1HeadingsInput       = getNode('input-h1-headings');
    form.h2HeadingsInput       = getNode('input-h2-headings');
    form.h3HeadingsInput       = getNode('input-h3-headings');
    form.h4HeadingsInput       = getNode('input-h4-headings');
    form.h5HeadingsInput       = getNode('input-h5-headings');
    form.h6HeadingsInput       = getNode('input-h6-headings');

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

      form.menuLabelInput.value           = options.menuLabel;
      form.landmarkGroupInput.value       = options.landmarkGroupLabel;
      form.headingGroupInput.value        = options.headingGroupLabel;
      form.headingMainGroupInput.value    = options.headingMainGroupLabel;
      form.headingLevelInput.value        = options.headingLevelLabel;

      form.mainRegionNameInput.value          = options.mainLabel;
      form.searchRegionNameInput.value        = options.searchLabel;
      form.navigationRegionNameInput.value    = options.navLabel;
      form.complementaryRegionNameInput.value = options.asideLabel;
      form.contentinfoRegionNameInput.value   = options.footerLabel;
      form.bannerRegionNameInput.value        = options.headerLabel;
      form.msgNoLandmarksInput.value          = options.msgNoLandmarksFound;
      form.msgNoHeadingsInput.value           = options.msgNoHeadingsFound;

      form.groupEnabledInput.value    = options.shortcutsGroupEnabledLabel;
      form.groupDisabledInput.value   = options.shortcutsGroupDisabledLabel;
      form.toggleEnabledInput.value   = options.shortcutsToggleEnableLabel;
      form.toggleDisabledInput.value  = options.shortcutsToggleDisableLabel;
      form.shortcutInfoInput.value    = options.shortcutsInfoLabel;

      form.headingLevelMsgInput.value      = options.msgHeadingLevel;
      form.nextRegionInput.value           = options.msgNextRegion;
      form.previousRegionInput.value       = options.msgPreviousRegion;
      form.mainRegionsInput.value          = options.msgMainRegions;
      form.navigationRegionsInput.value    = options.msgNavigationRegions;
      form.complementaryRegionsInput.value = options.msgComplementaryRegions;

      form.nextHeadingInput.value      = options.msgNextHeading;
      form.previousHeadingInput.value  = options.msgPreviousHeading;
      form.h1HeadingsInput.value       = options.msgH1Headings;
      form.h2HeadingsInput.value       = options.msgH2Headings;
      form.h3HeadingsInput.value       = options.msgH3Headings;
      form.h4HeadingsInput.value       = options.msgH4Headings;
      form.h5HeadingsInput.value       = options.msgH5Headings;
      form.h6HeadingsInput.value       = options.msgH6Headings;

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
      options.headingMainGroupLabel   = form.headingMainGroupInput.value;
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

      options.shortcutsGroupEnabledLabel  = form.groupEnabledInput.value;
      options.shortcutsGroupDisabledLabel = form.groupDisabledInput.value;
      options.shortcutsToggleEnableLabel  = form.toggleEnabledInput.value;
      options.shortcutsToggleDisableLabel = form.toggleDisabledInput.value;
      options.shortcutsInfoLabel          = form.shortcutInfoInput.value;

      options.msgHeadingLevel         = form.headingLevelMsgInput.value;
      options.msgNextRegion           = form.nextRegionInput.value;
      options.msgPreviousRegion       = form.previousRegionInput.value;
      options.msgMainRegions          = form.mainRegionsInput.value;
      options.msgNavigationRegions    = form.navigationRegionsInput.value;
      options.msgComplementaryRegions = form.complementaryRegionsInput.value;

      options.msgNextHeading     = form.nextHeadingInput.value ;
      options.msgPreviousHeading = form.previousHeadingInput.value;
      options.msgH1Headings      = form.h1HeadingsInput.value;
      options.msgH2Headings      = form.h2HeadingsInput.value;
      options.msgH3Headings      = form.h3HeadingsInput.value;
      options.msgH4Headings      = form.h4HeadingsInput.value;
      options.msgH5Headings      = form.h5HeadingsInput.value;
      options.msgH6Headings      = form.h6HeadingsInput.value;

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
