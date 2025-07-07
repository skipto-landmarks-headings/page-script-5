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
        <legend data-i18n="options_landmark_legend">
          Landmark Regions
         </legend>

        <label class="inline"
               for="landmarks-navigation">
          <input id="landmarks-navigation"
                 type="checkbox"
                 value="navigation"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_navigation">
            Navigation
          </span>
        </label>

        <label class="inline"
               for="landmarks-search">
          <input id="landmarks-search"
                 type="checkbox"
                 value="search"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_search">
            Search
          </span>
        </label>

        <label class="inline"
               for="landmarks-complementary">
          <input id="landmarks-complementary"
                 type="checkbox"
                 value="complementary"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_complementary">
            Complementary
          </span>
        </label>

        <label class="inline"
               for="landmarks-contentinfo">
          <input id="landmarks-contentinfo"
                 type="checkbox"
                 value="contentinfo"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_contentinfo">
            Contentinfo
          </span>
        </label>

        <label class="inline"
               for="landmarks-banner">
          <input id="landmarks-banner"
                 type="checkbox"
                 value="banner"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_banner">
            Banner
          </span>
        </label>

        <label class="inline"
               for="landmarks-region">
          <input id="landmarks-region"
                 type="checkbox"
                 value="region"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_region">
            XX
          </span>
        </label>

        <label class="inline"
               style="margin-top: 1em"
               for="landmarks-with-name">
          <input id="landmarks-with-name"
                 type="checkbox"
                 data-option="excludeLandmarksWithoutNames"/>
          <span data-i18n="options_landmarks_without_names">
            XX
          </span>
        </label>

        <label class="inline"
               style="margin-top: 1em"
               for="landmarks-doc-order">
          <input id="landmarks-doc-order"
                 type="checkbox"
                 value="doc-order"
                 data-option="landmarks"/>
          <span data-i18n="options_landmark_doc_order">
            XX
          </span>
        </label>


      </fieldset>

      <fieldset>
        <legend data-i18n="options_heading_legend">
          Headings
         </legend>

        <label class="inline"
               for="headings-1">
          <input id="headings-1"
                 type="radio"
                 name="headings"
                 value="h1"
                 data-option="headings"/>
          <span data-i18n="options_heading_h1">
            h1
          </span>
        </label>

        <label class="inline"
               for="headings-2">
          <input id="headings-2"
                 type="radio"
                 name="headings"
                 value="h1 h2"
                 data-option="headings"/>
          <span data-i18n="options_heading_h2">
            h2
          </span>
        </label>

        <label class="inline"
               for="headings-3">
          <input id="headings-3"
                 type="radio"
                 name="headings"
                 value="h1 h2 h3"
                 data-option="headings"/>
          <span data-i18n="options_heading_h3">
            h3
          </span>
        </label>

        <label class="inline"
               for="headings-4">
          <input id="headings-4"
                 type="radio"
                 name="headings"
                 value="h1 h2 h3 h4"
                 data-option="headings"/>
          <span data-i18n="options_heading_h4">
            h4
          </span>
        </label>

        <label class="inline"
               for="headings-5">
          <input id="headings-5"
                 type="radio"
                 name="headings"
                 value="h1 h2 h3 h4 h5"
                 data-option="headings"/>
          <span data-i18n="options_heading_h5">
            h5
          </span>
        </label>

        <label class="inline"
               for="headings-6">
          <input id="headings-6"
                 type="radio"
                 name="headings"
                 value="h1 h2 h3 h4 h5 h6"
                 data-option="headings"/>
          <span data-i18n="options_heading_h6">
            h6
          </span>
        </label>

        <label class="inline"
               style="margin-top: 1em"
               for="headings-main-only">
          <input id="headings-main-only"
                 type="checkbox"
                 value="main-only"
                 data-option="headings"/>
          <span data-i18n="options_heading_main_only">
            Only show headings in main landmark region
          </span>
        </label>

        <label class="inline"
               style="margin-top: 1em"
               for="headings-small">
          <input id="headings-small"
                 type="checkbox"
                 data-option="excludeSmallHeadings"/>
          <span data-i18n="options_heading_exclude_small">
            XX
          </span>
        </label>


      </fieldset>

    </div>

    <button id="button-reset"
            data-i18n="options_button_menu_content_reset"
            type="reset">
      Reset Menu Content Defaults
      </button>

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
      resetDefaultMenuOptions().then(this.updateOptions.bind(this));
    });

    optionsMenu.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsMenu.onFocus);
      input.addEventListener('blur',   optionsMenu.onBlur);
      input.addEventListener('change', optionsMenu.onChange.bind(optionsMenu));
    });
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          if (options[option].includes) {
            input.checked = options[option].includes(input.value);
          }
          else {
            input.checked = options[option];
          }
        }
        else {
          const value = option === 'headings' ?
                        options[option].replace('main-only', '').trim() :
                        options[option];

          if (input.type === 'radio') {
            if (input.value === 'main-only') {
              input.checked = options[option].includes('main-only');
            }
            else {
              input.checked = value === input.value;
            }
          }
          else {
            input.value = value;
          }
        }
      });

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

    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          if (input.checked) {
            if (options[option].includes) {
              if (!options[option].includes(input.value)) {
                options[option] += ' ' + input.value;
              }
            }
            else {
              options[option] = true;
            }
          }
          else {
            if (options[option].replace) {
              options[option] = options[option].replace(input.value, '').trim();
            }
            else {
              options[option] = false;
            }
          }
        }
        else {
          if (input.type === 'radio') {
            if (input.checked) {
              if (options[option].includes('main-only')) {
                options[option] = 'main-only ' + input.value;
              }
              else {
                options[option] = input.value;
              }
            }
          }
          else {
            options[option] = input.value;
          }
        }
      });

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
