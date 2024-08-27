/* optionsColor.js */

const debug = false;

import {
  getOptions,
  saveOptions,
  optionsToParams,
  resetDefaultColorOptions
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

const optionsColorTemplate = document.createElement('template');
optionsColorTemplate.innerHTML = `
  <form>

    <div class="text">
      <label id="button-text-color-label"
             for="button-text-color">
      </label>
      <input id="button-text-color"
        type="color"/>
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

    <div class="color">
      <input id="menuitem-focus-text-color"
        type="color"/>
      <label id="menuitem-focus-text-color-label"
             for="menuitem-focus-text-color">
      </label>
    </div>

    <div class="color">
      <input id="menuitem-focus-background-color"
        type="color"/>
      <label id="menuitem-focus-background-color-label"
             for="menuitem-focus-background-color">
      </label>
    </div>

    <button id="button-reset" type="reset">Reset Defaults</button>

  </form>
`;


class OptionsColor extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsColor.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function
    const optionsColor = this;

    const optionsColorClone = optionsColorTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsColorClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    // Update labels with i18n information

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_color_reset'},

      { id: 'button-text-color-label',         label: 'options_button_text_color'},
      { id: 'button-background-color-label',   label: 'options_button_background_color'},
      { id: 'focus-border-color-label',        label: 'options_focus_border_color'},
      { id: 'menu-text-color-label',           label: 'options_menu_text_color'},
      { id: 'menu-background-color-label',     label: 'options_menu_background_color'},
      { id: 'menuitem-focus-text-color-label', label: 'options_menuitem_focus_text_color'},
      { id: 'menuitem-focus-background-color-label', label: 'options_menuitem_focus_background_color'}

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

    form.buttonTextColorInput         = getNode('button-text-color');
    form.buttonBackgroundColorInput   = getNode('button-background-color');
    form.focusBorderColorInput        = getNode('focus-border-color');
    form.menuTextColorInput           = getNode('menu-text-color');
    form.menuBackgroundColorInput     = getNode('menu-background-color');
    form.menuitemFocusTextColorInput       = getNode('menuitem-focus-text-color');
    form.menuitemFocusBackgroundColorInput = getNode('menuitem-focus-background-color');

    this.form = form;

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultColorOptions().then(this.updateOptions.bind(this));
    });

    optionsColor.shadowRoot.querySelectorAll('input[type=color]').forEach( input => {
      input.addEventListener('focus', this.onFocus);
      input.addEventListener('blur', this.onBlur);
      input.addEventListener('change', optionsColor.onChange.bind(optionsColor));
    });
  }

  updateOptions () {
    const form = this.form;

    getOptions().then( (options) => {

      form.buttonTextColorInput.value         = options.buttonTextColor;
      form.buttonBackgroundColorInput.value   = options.buttonBackgroundColor;
      form.focusBorderColorInput.value        = options.focusBorderColor;
      form.menuTextColorInput.value           = options.menuTextColor;
      form.menuBackgroundColorInput.value     = options.menuBackgroundColor;
      form.menuitemFocusTextColorInput.value       = options.menuitemFocusTextColor;
      form.menuitemFocusBackgroundColorInput.value = options.menuitemFocusBackgroundColor;

      this.syncOptionsWithSkipToScript (options);
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
  }

  saveColorOptions () {

    const form = this.form;

    getOptions().then( (options) => {

      options.buttonTextColor         = form.buttonTextColorInput.value;
      options.buttonBackgroundColor   = form.buttonBackgroundColorInput.value;
      options.focusBorderColor        = form.focusBorderColorInput.value;
      options.menuTextColor           = form.menuTextColorInput.value;
      options.menuTextColor           = form.menuBackgroundColorInput.value;
      options.menuitemFocusTextColor       = form.menuitemFocusTextColorInput.value;
      options.menuitemFcousBackgroundColor = form.menuitemFocusBackgroundColorInput.value;

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

  onChange () {
    debug && console.log(`[saveOptions]`);
    this.saveColorOptions();
  }

}

window.customElements.define("options-color", OptionsColor);
