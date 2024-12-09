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
  resetDefaultShortcutOptions
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

      <label class="inline"
             for="enable-shortcuts">
        <input id="enable-shortcuts"
              type="checkbox"
              data-option="shortcuts"
              data-checked="enabled"
              data-unchecked="disabled"/>
        <span data-i18n="options_enable_shortcuts_label">
          X
        </span>
      </label>


      <fieldset>
        <legend data-i18n="options_heading_legend">
          X
         </legend>

        <div id="shortcut-key-desc-1" class="desc" data-i18n="options_shortcut_key_desc_headings"></div>

        <label class="inline text"
               for="heading-next">
          <input id="heading-next"
                 type="text"
                 size="1"
                 value="x"
                 aria-describedby="shortcut-key-desc-1"
                 data-option="shortcutHeadingNext"/>
          <span data-i18n="options_heading_next_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="heading-prev">
          <input id="heading-prev"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingPrevious"/>
          <span data-i18n="options_heading_previous_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="heading-h1">
          <input id="heading-h1"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingH1"/>
          <span data-i18n="options_h1_headings_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="heading-h2">
          <input id="heading-h2"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingH2"/>
          <span data-i18n="options_h2_headings_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="heading-h3">
          <input id="heading-h3"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingH3"/>
          <span data-i18n="options_h3_headings_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="heading-h4">
          <input id="heading-h4"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingH4"/>
          <span data-i18n="options_h4_headings_label">
            X
          </span>
        </label>


        <label class="inline text"
               for="heading-h5">
          <input id="heading-h5"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingH5"/>
          <span data-i18n="options_h5_headings_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="heading-h6">
          <input id="heading-h6"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutHeadingH6"/>
          <span data-i18n="options_h6_headings_label">
            X
          </span>
        </label>

      </fieldset>

      <fieldset>
        <legend data-i18n="options_landmark_legend">
          X
         </legend>

        <div id="shortcut-key-desc-2" class="desc" data-i18n="options_shortcut_key_desc_regions"></div>


        <label class="inline text"
               for="region-next">
          <input id="region-next"
                 type="text"
                 size="1"
                 value=""
                 aria-describedby="shortcut-key-desc-2"
                 data-option="shortcutRegionNext"/>
          <span data-i18n="options_next_region_label">Next region</span>
        </label>

        <label class="inline text"
               for="region-prev">
          <input id="region-prev"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutRegionPrevious"/>
          <span data-i18n="options_region_previous_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="region-main">
          <input id="region-main"
                 type="text"
                 size="1"
                 value="x"
                 data-option="shortcutRegionMain"/>
          <span data-i18n="options_region_main_label">
            X
          </span>
        </label>

        <label class="inline text"
               for="region-nav">
          <input id="region-nav"
                 type="text"
                size="1"
                value="x"
                data-option="shortcutRegionNavigation"/>
          <span data-i18n="options_region_nav_label">
            Next Navigation region
          </span>
        </label>

        <label class="inline text"
               for="region-complementary">
          <input id="region-complementary"
                 type="text"
                size="1"
                value="x"
                data-option="shortcutRegionComplementary"/>
          <span data-i18n="options_region_complementary_label">
            X
          </span>
        </label>


      </fieldset>


    </div>


    <button id="button-reset"
            data-i18n="options_button_shortcuts_reset"
            type="reset">
        Reset Page Navigation Defaults
    </button>

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
      resetDefaultShortcutOptions().then(this.updateOptions.bind(this));
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
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          input.checked =  options[option] === input.getAttribute('data-checked');
        }
        else {
          input.value = options[option];
        }
      });

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

    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          if (input.checked) {
            options[option] === input.getAttribute('data-checked');
          }
          else {
            options[option] === input.getAttribute('data-unchecked');
          }
        }
        else {
          options[option] = input.value;
        }
      });

      saveOptions(options).then(this.syncOptionsWithSkipToScript(options));
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

window.customElements.define("options-shortcuts", OptionsShortcuts);
