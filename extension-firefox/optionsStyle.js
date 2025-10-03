/* optionsStyle.js */

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

const optionsStyleTemplate = document.createElement('template');
optionsStyleTemplate.innerHTML = `
  <form>
    <div>

      <fieldset>
        <legend data-i18n="options_font_options">
          X
        </legend>

        <div class="font">
          <label data-i18n="options_font_family"
                for="select-font-family">
             X
          </label>
          <select id="select-font-family"
                  data-option="fontFamily">
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        <div class="font">
          <label data-i18n="options_font_size"
              for="select-font-size">
            Font Size
          </label>
          <select id="select-font-size"
                  data-option="fontSize">
            <option value="9pt">9pt</option>
            <option value="10pt">10pt</option>
            <option value="11pt">11pt</option>
            <option value="12pt">12pt</option>
            <option value="14pt">14pt</option>
            <option value="16pt">16pt</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend data-i18n="options_color_options">
          Color Options
        </legend>

        <div class="color">
          <input id="button-text-color"
                 type="color"
                 data-option="buttonTextColor"/>
          <label data-i18n="options_button_text_color"
                 for="button-text-color">
          </label>
        </div>

        <div class="color">
          <input id="button-background-color"
                 type="color"
                 data-option="buttonBackgroundColor"/>
          <label data-i18n="options_button_background_color"
                 for="button-background-color">
          </label>
        </div>

        <div class="color">
          <input id="focus-border-color"
                 type="color"
                 data-option="focusBorderColor"/>
          <label data-i18n="options_focus_border_color"
                 for="focus-border-color">
          </label>
        </div>

        <div class="color">
          <input id="menu-text-color"
                 type="color"
                 data-option="menuTextColor"/>
          <label data-i18n="options_menu_text_color"
                 for="menu-text-color">
          </label>
        </div>

        <div class="color">
          <input id="menu-background-color"
                 type="color"
                 data-option="menuBackgroundColor"/>
          <label data-i18n="options_menu_background_color"
                 for="menu-background-color">
          </label>
        </div>
      </fieldset>

     <options-style-viewer></options-style-viewer>

     <button id="button-reset"
             type="reset"
             data-i18n="options_button_style_reset">
        X
      </button>

   </div>
</form>
`;


class OptionsStyle extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsStyle.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function
    const optionsStyle = this;

    const optionsStyleClone = optionsStyleTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsStyleClone);

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

    debug && console.log(`[formControls]: ${this.formControls.length}`);

    this.optionsStyleViewerNode = this.shadowRoot.querySelector('options-style-viewer');

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultStyleOptions().then(this.updateOptions.bind(this));
    });

    optionsStyle.shadowRoot.querySelectorAll('input[type=color], select').forEach( input => {
      input.addEventListener('focus', this.onFocus);
      input.addEventListener('blur', this.onBlur);
      input.addEventListener('input', optionsStyle.onChange.bind(optionsStyle));
    });

    getNode('select-font-family').addEventListener('change', this.onChangeFontFamily.bind(this));

    getNode('select-font-size').addEventListener('change', this.onChangeFontSize.bind(this));

  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = options[input.getAttribute('data-option')];

        if (input.tagName.toLowerCase() === 'select') {
          const optionNodes = input.querySelectorAll('option');
          for (let i = 0; i < optionNodes.length; i += 1) {
            const optionNode = optionNodes[i];
            if (optionNode.value === option) {
                optionNode.setAttribute('selected', '');
            }
          }
        }
        else {
          input.value = option;
        }
      });
      this.syncOptionsWithSkipToScript (options);
      this.updateStyleViewer(options);
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
        debug && console.log(`[save][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        options[input.getAttribute('data-option')] = input.value;
      });

      this.updateStyleViewer(options);

      saveOptions(options).then(this.syncOptionsWithSkipToScript(options));
    });
  }

  updateStyleViewer(options) {

    this.optionsStyleViewerNode.setAttribute('data-font-family', options.fontFamily);
    this.optionsStyleViewerNode.setAttribute('data-font-size', options.fontSize);

    this.optionsStyleViewerNode.setAttribute('data-button-text-color', options.buttonTextColor);
    this.optionsStyleViewerNode.setAttribute('data-button-background-color', options.buttonBackgroundColor);
    this.optionsStyleViewerNode.setAttribute('data-focus-border-color', options.focusBorderColor);
    this.optionsStyleViewerNode.setAttribute('data-menu-text-color', options.menuTextColor);
    this.optionsStyleViewerNode.setAttribute('data-menu-background-color', options.menuBackgroundColor);
    this.optionsStyleViewerNode.setAttribute('data-menuitem-focus-text-color', options.menuitemFocusTextColor);
    this.optionsStyleViewerNode.setAttribute('data-menuitem-focus-background-color', options.menuitemFocusBackgroundColor);
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

  onChangeFontFamily (event) {
    debug && console.log(`[onChangeFontFamily]: ${event.target.value}`);
    this.saveStyleOptions();
  }

  onChangeFontSize (event) {
    debug && console.log(`[onChangeFontSize]: ${event.target.value}`);
    this.saveStyleOptions();
  }


}

window.customElements.define("options-style", OptionsStyle);
