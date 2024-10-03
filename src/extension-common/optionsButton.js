/* optionsButton.js */

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
  resetDefaultButtonOptions
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

const optionsButtonTemplate = document.createElement('template');
optionsButtonTemplate.innerHTML = `
  <form>
    <div>

      <fieldset>
        <legend id="button-border-legend">
          Border Visibility
         </legend>

        <label class="inline" for="button-border">
          <input type="checkbox" id="button-border"/>
          <span id="button-border-label">Bottom border of button always visible</span>
        </label>

         <p id="button-border-desc">By making the bottom border always visible
           the pointer can be used to expose the button when is mostly hidden.</p>

      </fieldset>

      <fieldset>
        <legend id="button-focus-legend">
          Button Focus
         </legend>

        <label class="inline" for="button-focus-none">
          <input type="radio" name="focus" value="none" id="button-focus-none"/>
          <span id="button-focus-none-label">None</span>
        </label>

        <label class="inline" for="button-focus-button">
          <input type="radio" name="focus" value="button" id="button-focus-button"/>
          <span id="button-focus-button-label">Button</span>
        </label>

        <label class="inline" for="button-focus-menu">
          <input type="radio" name="focus" value="menu" id="button-focus-menu"/>
          <span id="button-focus-menu-label">Menu</span>
        </label>

         <p id="button-focus-desc">When a new page loads some users may not want the button visible since it obscures some content and others
         may want the menu to be open to more efficiently navigate to page content.</p>

      </fieldset>

    </div>

    <button id="button-reset" type="reset">Reset Button Defaults</button>

  </form>
`;


class OptionsButton extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsButton.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsButton = this;

    const optionsButtonClone = optionsButtonTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsButtonClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    // Update labels with i18n information

    const i18nLabels = [
      { id: 'button-reset', label: 'options_button_button_content_reset'},

      { id: 'button-border-legend', label: 'options_button_border_legend'},
      { id: 'button-border-label',  label: 'options_button_border_label'},
      { id: 'button-border-desc',   label: 'options_button_border_desc'},

      { id: 'button-focus-legend',       label: 'options_button_focus_legend'},
      { id: 'button-focus-none-label',   label: 'options_button_focus_none_label'},
      { id: 'button-focus-button-label', label: 'options_button_focus_button_label'},
      { id: 'button-focus-menu-label',   label: 'options_button_focus_menu_label'},
      { id: 'button-focus-desc',         label: 'options_button_focus_desc'}
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

    form.showBorder  = getNode('button-border');

    form.buttonFocusNoneInput    = getNode('button-focus-none');
    form.buttonFocusButtonInput  = getNode('button-focus-button');
    form.buttonFocusMenuInput    = getNode('button-focus-menu');

    this.form = form;

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultButtonOptions().then(this.updateOptions.bind(this));
    });

    optionsButton.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsButton.onFocus);
      input.addEventListener('blur',   optionsButton.onBlur);
      input.addEventListener('change', optionsButton.onChange.bind(optionsButton));
    });
  }

  updateOptions () {
    const form = this.form;

    getOptions().then( (options) => {

      form.showBorder.checked = options.displayOption === 'popup-border';

      form.buttonFocusNoneInput.checked    = options.focusOption === 'none';
      form.buttonFocusButtonInput.checked  = options.focusOption === 'button';
      form.buttonFocusMenuInput.checked    = options.focusOption === 'menu';

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

  saveButtonContentOptions () {

    const form = this.form;

    getOptions().then( (options) => {


      options.displayOption = form.showBorder.checked ? 'popup-border' : 'popup';

      options.focusOption = 'none';

      if (form.buttonFocusButtonInput.checked) {
        options.focusOption = 'button';
      }

      if (form.buttonFocusMenuInput.checked) {
        options.focusOption = 'menu';
      }

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
    this.saveButtonContentOptions();
  }

}

window.customElements.define("options-button", OptionsButton);
