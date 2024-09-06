/* optionsStyle.js */

const debug = false;

import {
  getOptions,
  saveOptions,
  optionsToParams,
  resetDefaultStyleOptions
} from './storage.js';

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    debug && console.log(chrome.runtime.lastError.message);
    return false;
  }
}

// Constants

const optionsStyleTemplate = document.createElement('template');
optionsStyleTemplate.innerHTML = `
  <form>

    <h2>Font Options</h2>

    <div class="font">
      <label for="select-font-family">Font Family</label>
      <select id="select-font-family">
        <option value="sans-serif">Sans-serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
    </div>

    <div class="font">
      <label for="select-font-size">Font Size</label>
      <select id="select-font-size">
        <option value="10pt">10pt</option>
        <option value="12pt">12pt</option>
        <option value="14pt">14pt</option>
        <option value="16pt">16pt</option>
      </select>
    </div>


    <h2>Color Options</h2>

    <div class="color">
      <input id="button-text-color"
        type="color"/>
      <label id="button-text-color-label"
             for="button-text-color">
      </label>
    </div>

    <div class="color">
      <input id="button-background-color"
        type="color"/>
      <label id="button-background-color-label"
             for="button-background-color">
      </label>
    </div>

    <div class="color">
      <input id="focus-border-color"
        type="color"/>
      <label id="focus-border-color-label"
             for="focus-border-color">
      </label>
    </div>

    <div class="color">
      <input id="menu-text-color"
        type="color"/>
      <label id="menu-text-color-label"
             for="menu-text-color">
      </label>
    </div>

    <div class="color">
      <input id="menu-background-color"
        type="color"/>
      <label id="menu-background-color-label"
             for="menu-background-color">
      </label>
    </div>

    <options-style-viewer></options-style-viewer>

    <button id="button-reset" type="reset">Reset Defaults</button>

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

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_style_reset'},

      { id: 'button-text-color-label',         label: 'options_button_text_color'},
      { id: 'button-background-color-label',   label: 'options_button_background_color'},
      { id: 'focus-border-color-label',        label: 'options_focus_border_color'},
      { id: 'menu-text-color-label',           label: 'options_menu_text_color'},
      { id: 'menu-background-color-label',     label: 'options_menu_background_color'},

    ];

    i18nLabels.forEach( item => {
      const node = getNode(item.id);
      const label = chrome.i18n.getMessage(item.label);
      if (node && label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        node && console.error(`node not found for ${item.id}`);
        label && console.error(`message not found for ${item.label}`);
      }
    });

    const form = {};

    form.selectFontFamily             = getNode('select-font-family');
    form.selectFontSize               = getNode('select-font-size');
    form.buttonTextColorInput         = getNode('button-text-color');
    form.buttonBackgroundColorInput   = getNode('button-background-color');
    form.focusBorderColorInput        = getNode('focus-border-color');
    form.menuTextColorInput           = getNode('menu-text-color');
    form.menuBackgroundColorInput     = getNode('menu-background-color');

    this.form = form;

    this.optionsStyleViewerNode = this.shadowRoot.querySelector('options-style-viewer');

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultStyleOptions().then(this.updateOptions.bind(this));
    });

    optionsStyle.shadowRoot.querySelectorAll('input[type=color]').forEach( input => {
      input.addEventListener('focus', this.onFocus);
      input.addEventListener('blur', this.onBlur);
      input.addEventListener('input', optionsStyle.onChange.bind(optionsStyle));
    });

    getNode('select-font-family').addEventListener('change', this.onChangeFontFamily.bind(this));

    getNode('select-font-size').addEventListener('change', this.onChangeFontSize.bind(this));

  }

  updateOptions () {
    const form = this.form;
    let optionNodes, optionNode;

    getOptions().then( (options) => {

      optionNodes = form.selectFontFamily.querySelectorAll('option');
      for (let i = 0; i < optionNodes.length; i += 1) {
        optionNode = optionNodes[i];
        if (optionNode.value === options.fontFamily) {
            optionNode.setAttribute('selected', '');
        }
      }

      optionNodes = form.selectFontSize.querySelectorAll('option');
      for (let i = 0; i < optionNodes.length; i += 1) {
        optionNode = optionNodes[i];
        if (optionNode.value === options.fontSize) {
          optionNode.setAttribute('selected', '');
        }
      }

      form.buttonTextColorInput.value         = options.buttonTextColor;
      form.buttonBackgroundColorInput.value   = options.buttonBackgroundColor;
      form.focusBorderColorInput.value        = options.focusBorderColor;
      form.menuTextColorInput.value           = options.menuTextColor;
      form.menuBackgroundColorInput.value     = options.menuBackgroundColor;

      this.syncOptionsWithSkipToScript (options);

      this.updateStyleViewer(options);
    });
  }

  syncOptionsWithSkipToScript (options) {
    async function sendOptionsToTabs (options) {
      debug && console.log(`[syncOptoinsWithSkipToScript]: ${options}`);
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, {skiptoParams: optionsToParams(options)})
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
      chrome.runtime.sendMessage({type: 'updateMyParams'});
  }

  saveStyleOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.fontFamily = form.selectFontFamily.value;
      options.fontSize   = form.selectFontSize.value;

      options.buttonTextColor         = form.buttonTextColorInput.value;
      options.buttonBackgroundColor   = form.buttonBackgroundColorInput.value;
      options.focusBorderColor        = form.focusBorderColorInput.value;
      options.menuTextColor           = form.menuTextColorInput.value;
      options.menuBackgroundColor     = form.menuBackgroundColorInput.value;
      options.menuitemFocusTextColor       = form.menuBackgroundColorInput.value;
      options.menuitemFocusBackgroundColor = form.menuTextColorInput.value;

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
