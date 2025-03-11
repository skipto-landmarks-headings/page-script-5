/* optionsHighlight.js */

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
  resetDefaultHighlightOptions
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

const optionsHighlightTemplate = document.createElement('template');
optionsHighlightTemplate.innerHTML = `
  <form>
    <div>

      <fieldset>
        <legend data-i18n="options_highlight_legend">
          X
         </legend>

        <label class="inline"
               for="highlight-disabled">
          <input id="highlight-disabled"
                 type="radio"
                 name="highlight"
                 value="disabled"
                 data-option="highlightTarget"/>
          <span data-i18n="options_highlight_disabled_label">
            X
          </span>
        </label>

        <label class="inline"
               for="highlight-instant">
          <input id="highlight-instant"
                 type="radio"
                 name="highlight"
                 value="instant"
                 data-option="highlightTarget"/>
          <span data-i18n="options_highlight_instant_label">
            X
          </span>
        </label>

        <label class="inline"
               for="highlight-smooth">
          <input id="highlight-smooth"
                 type="radio"
                 name="highlight"
                 value="smooth"
                 data-option="highlightTarget"/>
          <span data-i18n="options_highlight_smooth_label">
            X
          </span>
        </label>

      </fieldset>

    </div>

      <fieldset>
        <legend data-i18n="options_highlight_border_legend">
          X
         </legend>

        <label class="inline"
               for="highlight-border-small">
          <input id="highlight-border-small"
                 type="radio"
                 name="border"
                 value="small"
                 data-option="highlightBorderSize"/>
          <span data-i18n="options_highlight_border_small_label">
            X
          </span>
        </label>

        <label class="inline"
               for="highlight-border-medium">
          <input id="highlight-border-medium"
                 type="radio"
                 name="border"
                 value="medium"
                 data-option="highlightBorderSize"/>
          <span data-i18n="options_highlight_border_medium_label">
            X
          </span>
        </label>

        <label class="inline"
               for="highlight-border-large">
          <input id="highlight-border-large"
                 type="radio"
                 name="border"
                 value="large"
                 data-option="highlightBorderSize"/>
          <span data-i18n="options_highlight_border_large_label">
            X
          </span>
        </label>

        <label class="inline"
               for="highlight-border-x-large">
          <input id="highlight-border-x-large"
                 type="radio"
                 name="border"
                 value="x-large"
                 data-option="highlightBorderSize"/>
          <span data-i18n="options_highlight_border_x_large_label">
            X
          </span>
        </label>

      </fieldset>

    </div>

    <button id="button-reset"
            type="reset"
            data-i18n="options_highlight_button_content_reset">
            X
    </button>

  </form>
`;


class OptionsHighlight extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsHighlight.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsHighlight = this;

    const optionsHighlightClone = optionsHighlightTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsHighlightClone);

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
      resetDefaultHighlightOptions().then(this.updateOptions.bind(this));
    });

    optionsHighlight.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsHighlight.onFocus);
      input.addEventListener('blur',   optionsHighlight.onBlur);
      input.addEventListener('change', optionsHighlight.onChange.bind(optionsHighlight));
    });
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        const dataOption = input.getAttribute('data-option');
        debug && console.log(`[updateOptions][${input.id}]: ${dataOption} ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        if (input.type === 'radio') {
          input.checked = input.value === options[input.getAttribute('data-option')];
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

  saveHighlightContentOptions () {
   const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug && console.log(`[saveHighlightContentOptions][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'radio' && input.checked) {
          options[option] = input.value;
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
    this.saveHighlightContentOptions();
  }

}

window.customElements.define("options-highlight", OptionsHighlight);
