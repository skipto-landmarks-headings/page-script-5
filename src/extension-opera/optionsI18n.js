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
      <legend data-i18n="options_legend_button_labels">
        X
      </legend>

      <div class="text">
        <label  data-i18n="options_button_label"
                for="input-button-label">
                X
        </label>
        <input id="input-button-label"
          data-option="buttonLabel"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label data-i18n="options_small_button_label"
               for="small-button-label">
                X
        </label>
        <input id="input-small-button-label"
          data-option="smallButtonLabel"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label data-i18n="options_alt_name_label"
               for="input-alt-name">
                X
        </label>
        <input id="input-alt-name"
          data-option="altLabel"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label data-i18n="options_option_name_label"
               for="input-option-name">
                X
        </label>
        <input id="input-option-name"
          data-option="optionLabel"
          type="text"
          size="15"/>
      </div>

      <div class="text">
        <label data-i18n="options_shortcut_name_label"
               for="input-shortcut-name">
                X
        </label>
        <input id="input-shortcut-name"
          data-option="shortcutLabel"
          type="text"
          size="15"/>
      </div>

    </fieldset>

    <fieldset>
      <legend data-i18n="options_legend_menu_labels">
        Menu Labels
      </legend>

      <div class="text">
        <label data-i18n="options_menu_label"
               for="input-menu">
                X
        </label>
        <input id="input-menu"
          data-option="menuLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_landmark_group_label"
               for="input-landmark-group">
                X
        </label>
        <input id="input-landmark-group"
          data-option="landmarkGroupLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_landmark_one_group_label"
               for="input-landmark-one-group">
                X
        </label>
        <input id="input-landmark-One-group"
          data-option="landmarkOneGroupLabel"
          type="text"
          size="25"/>
      </div>


      <div class="text">
        <label data-i18n="options_heading_group_label"
               for="input-heading-group">
               X
        </label>
        <input id="input-heading-group"
          data-option="headingGroupLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_heading_one_group_label"
               for="input-heading-one-group">
               X
        </label>
        <input id="input-heading-one-group"
          data-option="headingOneGroupLabel"
          type="text"
          size="25"/>
      </div>


      <div class="text">
        <label data-i18n="options_heading_main_group_label"
               for="input-heading-main-group">
                X
        </label>
        <input id="input-heading-main-group"
          data-option="headingMainGroupLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_heading_one_main_group_label"
               for="input-heading-one-main-group">
                X
        </label>
        <input id="input-heading-one-main-group"
          data-option="headingOneMainGroupLabel"
          type="text"
          size="25"/>
      </div>


      <div class="text">
        <label data-i18n="options_heading_level_label"
               for="input-heading-level">
                X
        </label>
        <input id="input-heading-level"
          data-option="headingLevelLabel"
          type="text"
          size="25"/>
      </div>

    </fieldset>


    <fieldset>
      <legend data-i18n="options_legend_landmark_labels">
        X
      </legend>

      <div class="text">
        <label data-i18n="options_main_region_name"
               for="input-main-region-name">
               X
        </label>
        <input id="input-main-region-name"
          data-option="mainLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_search_region_name"
               for="input-search-region-name">
                X
        </label>
        <input id="input-search-region-name"
          data-option="searchLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_navigation_region_name"
               for="input-navigation-region-name">
                X
        </label>
        <input id="input-navigation-region-name"
          data-option="navLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_complementary_region_name"
               for="input-complementary-region-name">
                X
        </label>
        <input id="input-complementary-region-name"
          data-option="asideLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_contentinfo_region_name"
               for="input-contentinfo-region-name">
                X
        </label>
        <input id="input-contentinfo-region-name"
          data-option="footerLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_banner_region_name"
               for="input-banner-region-name">
                X
        </label>
        <input id="input-banner-region-name"
          data-option="headerLabel"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_no_landmarks"
               for="input-msg-no-landmarks">
            X
        </label>
        <input id="input-msg-no-landmarks"
          data-option="msgNoLandmarksFound"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_no_headings"
               for="input-msg-no-headings">
             X
        </label>
        <input id="input-msg-no-headings"
          data-option="msgNoHeadingsFound"
          type="text"
          size="25"/>
      </div>

    </fieldset>

    <fieldset>
      <legend data-i18n="options_legend_shortcuts_menu_labels">
        Shortcut Menu Labels
      </legend>

      <div class="text">
        <label data-i18n="options_shortcuts_enabled_label"
               for="input-group-enabled">
            X
        </label>
        <input id="input-group-enabled"
          data-option="shortcutsGroupEnabledLabel"
          type="text"
          size="30"/>
      </div>

      <div class="text">
        <label data-i18n="options_shortcuts_disabled_label"
               for="input-group-disabled">
            X
        </label>
        <input id="input-group-disabled"
          data-option="shortcutsGroupDisabledLabel"
          type="text"
          size="30"/>
      </div>

      <div class="text">
        <label data-i18n="options_toggle_enabled_label"
               for="input-toggle-enabled">
            X
        </label>
        <input id="input-toggle-enabled"
          data-option="shortcutsToggleEnableLabel"
          type="text"
          size="30"/>
      </div>

      <div class="text">
        <label data-i18n="options_toggle_disabled_label"
               for="input-toggle-disabled">
            X
        </label>
        <input id="input-toggle-disabled"
          data-option="shortcutsToggleDisableLabel"
          type="text"
          size="30"/>
      </div>

      <div class="text">
        <label data-i18n="options_shortcut_info_label"
               for="input-shortcut-info">
            X
        </label>
        <input id="input-shortcut-info"
          data-option="shortcutsInfoLabel"
          type="text"
          size="30"/>
      </div>

    </fieldset>

    <fieldset>
      <legend data-i18n="options_legend_region_shortcut_messages">
        X
      </legend>

      <div class="text">
        <label data-i18n="options_next_region_label"
               for="input-next-region">
            X
        </label>
        <input id="input-next-region"
          data-option="msgNextRegion"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_previous_region_label"
               for="input-previous-region">
            X
        </label>
        <input id="input-previous-region"
          data-option="msgPreviousRegion"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_main_regions_label"
               for="input-main-regions">
            X
        </label>
        <input id="input-main-regions"
          data-option="msgMainRegions"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_navigation_regions_label"
               for="input-navigation-regions">
           X
        </label>
        <input id="input-navigation-regions"
          data-option="msgNavigationRegions"
          type="text"
          size="25"/>
      </div>

      <div class="text">
        <label data-i18n="options_complementary_regions_label"
               for="input-complementary-regions">
            X
        </label>
        <input id="input-complementary-regions"
          data-option="msgComplementaryRegions"
          type="text"
          size="25"/>
      </div>

    </fieldset>

    <fieldset>
      <legend data-i18n="options_legend_heading_shortcut_messages">
        X
      </legend>

      <div class="text">
        <label data-i18n="options_msg_heading_level_label"
               for="input-heading-msg-level">
            X
        </label>
        <input id="input-heading-level-msg"
          data-option="msgHeadingLevel"
          aria-describedby="input-heading-level-msg-desc"
          type="text"
          size="20"/>
        <div id="input-heading-level-msg-desc"
             class="desc"
             data-i18n="options_heading_level_desc">
          X
        </div>

      </div>

      <div class="text">
        <label data-i18n="options_next_heading_label"
               for="input-next-heading">
            X
        </label>
        <input id="input-next-heading"
          data-option="msgNextHeading"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_previous_heading_label"
               for="input-previous-heading">
            X
        </label>
        <input id="input-previous-heading"
          data-option="msgPreviousHeading"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_h1_headings_label"
               for="input-h1-headings">
            X
        </label>
        <input id="input-h1-headings"
          data-option="msgH1Headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_h2_headings_label"
               for="input-h2-headings">
            X
        </label>
        <input id="input-h2-headings"
          data-option="msgH2Headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_h3_headings_label"
               for="input-h3-headings">
            X
        </label>
        <input id="input-h3-headings"
          data-option="msgH3Headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_h4_headings_label"
               for="input-h4-headings">
            X
        </label>
        <input id="input-h4-headings"
          data-option="msgH4Headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_h5_headings_label"
               for="input-h5-headings">
            X
        </label>
        <input id="input-h5-headings"
          data-option="msgH5Headings"
          type="text"
          size="20"/>
      </div>

     <div class="text">
        <label data-i18n="options_h6_headings_label"
               for="input-h6-headings">
            X
        </label>
        <input id="input-h6-headings"
          data-option="msgH6Headings"
          type="text"
          size="20"/>
      </div>


    </fieldset>

    <fieldset>
      <legend data-i18n="options_shortcut_info_dialog_messages">
        X
      </legend>

      <div class="text">
        <label data-i18n="options_close_label"
               for="input-close-label">
            X
        </label>
        <input id="input-close-label"
          data-option="closeLabel"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label data-i18n="options_more_info_label"
               for="input-more-info-label">
            X
        </label>
        <input id="input-more-info-label"
          data-option="moreInfoLabel"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_key"
               for="input-msg-key">
            X
        </label>
        <input id="input-msg-key"
          data-option="msgKey"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_description"
               for="input-msg-desc">
            X
        </label>
        <input id="input-msg-desc"
          data-option="msgDescription"
          type="text"
          size="20"/>
      </div>

  </fieldset>

    <fieldset>
      <legend data-i18n="options_navigation_messages_legend">
        X
      </legend>

      <div class="text">
        <label data-i18n="options_msg_no_more_regions_label"
               for="input-no-more-regions">
            X
        </label>
        <input id="input-no-more-regions"
          data-option="msgNoMoreRegions"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_no_regions_found_label"
               for="input-no-regions">
            X
        </label>
        <input id="input-no-regions"
          data-option="msgNoRegionsFound"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_no_more_headings_label"
               for="input-no-more-headings">
            X
        </label>
        <input id="input-no-more-headings"
          data-option="msgNoMoreHeadings"
          type="text"
          size="20"/>
      </div>

      <div class="text">
        <label data-i18n="options_msg_no_headings_found_label"
               for="input-no-headings">
            X
        </label>
        <input id="input-no-headings"
          data-option="msgNoHeadingsLevelFound"
          type="text"
          size="20"/>
      </div>
    </fieldset>

    <button id="button-reset"
            type="reset"
            data-i18n="options_button_i18n_reset">
        X
    </button>

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

    const i18nLabels =  Array.from(this.shadowRoot.querySelectorAll('[data-i18n]'));

    i18nLabels.forEach( node => {
      const label = browserI18n.getMessage(node.getAttribute('data-i18n'));
      if (label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        console.error(`[node]: ${node.getAttribute('data-i18n')}`);
        console.error(`[label]: ${label}`);
      }
    });

    this.formControls =  Array.from(this.shadowRoot.querySelectorAll('[data-option]'));

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
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        input.value = options[input.getAttribute('data-option')];
      });

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

    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[save][${input.id}]: ${input.getAttribute('data-option')}`);
        options[input.getAttribute('data-option')] = input.value;
      });

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
