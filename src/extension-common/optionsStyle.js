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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {String}  value   The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {String}          The RGB representation
 */
  function hslToHex(value) {

    function getNumber(str) {
      let num = '';
      for(let i = 0; i < str.length; i += 1) {
        const c = str[i];
        if ('0123456789'.includes(c)) {
          num += c;
        }
      }
      return parseInt(num);
    }

    const parts = value.split(',');

    let h = getNumber(parts[0]); // hue
    let s = getNumber(parts[1]); // Saturation
    let l = getNumber(parts[2]); // lightness

    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    console.log(`[hslToHex]: ${value} => ${hex}`);
    return hex;
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
        let option = options[input.getAttribute('data-option')];

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
          option = option.includes('hsl') ? hslToHex(option) : option;
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
