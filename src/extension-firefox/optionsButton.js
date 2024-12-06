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
        <legend data-i18n="options_button_border_legend">
          X
         </legend>

        <label class="inline"
              for="button-border">
          <input id="button-border"
             type="checkbox"
             aria-describedby="button-border-desc"
             data-option="displayOption"
             data-checked="popup-border"
             data-unchecked="popup"/>
          <span data-i18n="options_button_border_label">
            X
          </span>
        </label>

         <p id="button-border-desc" class="desc">By making the bottom border always visible
           the pointer can be used to expose the button when is mostly hidden.</p>

      </fieldset>

      <fieldset>
        <legend data-i18n="options_button_focus_legend">
          X
         </legend>

        <label class="inline"
               for="button-focus-none">
          <input id="button-focus-none"
            type="radio"
            name="focus"
            value="none"
            data-option="focusOption"/>
          <span data-i18n="options_button_focus_button_label">
            X
          </span>
        </label>

        <label class="inline"
               for="button-focus-button">
          <input id="button-focus-button"
             type="radio"
             name="focus"
             value="button"
             aria-describedby="button-focus-desc"
             data-option="focusOption"/>
          <span data-i18n="options_button_focus_button_label">
            X
          </span>
        </label>

        <label class="inline"
               for="button-focus-menu">
          <input id="button-focus-menu"
            type="radio"
            name="focus"
            value="menu"
            data-option="focusOption"/>
          <span data-i18n="options_button_focus_menu_label">
            X
          </span>
        </label>

         <div data-i18n="options_button_focus_desc"
            class="desc">When a new page loads some users may not want the button visible since it obscures some content and others
         may want the menu to be open to more efficiently navigate to page content.</div>

      </fieldset>

    </div>

    <button id="button-reset"
            type="reset"
            data-i18n="options_button_button_content_reset">
            X
    </button>

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
      resetDefaultButtonOptions().then(this.updateOptions.bind(this));
    });

    optionsButton.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsButton.onFocus);
      input.addEventListener('blur',   optionsButton.onBlur);
      input.addEventListener('change', optionsButton.onChange.bind(optionsButton));
    });
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);

        if (input.type === 'checkbox') {
          input.checked = options.displayOption === 'popup-border';
        }
        else {
          if (input.type === 'radio') {
            input.checked = input.value === options[input.getAttribute('data-option')];
          }
          else {
            input.value = options[input.getAttribute('data-option')];
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

  saveButtonContentOptions () {
   const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          options[option] = input.checked ?
                            input.getAttribute('data-checked') :
                            input.getAttribute('data-unchecked');
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
    this.saveButtonContentOptions();
  }

}

window.customElements.define("options-button", OptionsButton);
