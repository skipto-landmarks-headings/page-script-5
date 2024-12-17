/* shortcutsMessage.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('[shortcutsMessage]', false);
debug.flag = false;

const defaultStyleOptions = {
  fontFamily: 'sans-serif',
  fontSize: '12pt',
  focusBorderColor: '#c5050c',
  menuTextColor: '#13294b',
  menuBackgroundColor: '#dddddd',
};

const styleTemplate = document.createElement('template');
styleTemplate.textContent = `
/* shortcutsMessage.css */

div#skip-to-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

  font-family: $fontFamily;
  font-size: $fontSize;
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: white;
  border: 2px solid $focusBorderColor;
  border-radius: 5px;
  color: black;
  z-index: 2000001;
  opacity: 1;
}

div#skip-to-message .header {
  margin: 0;
  padding: 4px;
  border-bottom: 1px solid $focusBorderColor;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: $menuBackgroundColor;
  color $menuTextColor:
  font-size: 100%;
}

div#skip-to-message .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
  margin-bottom: 2em;
  background-color: #fff;
  color: #000;
  font-size: 110%;
  text-algin: center;
}

div#skip-to-message.hidden {
  display: none;
}

div#skip-to-message.show {
  display: block;
}
`;

export default class ShortcutsMessage extends HTMLElement {
  constructor () {

    super();
    this.attachShadow({ mode: 'open' });

    // Get references

    this.messageDialog  = document.createElement('div');
    this.messageDialog.id = 'skip-to-message';
    this.messageDialog.classList.add('hidden');
    this.shadowRoot.appendChild(this.messageDialog);

    const headerElem  = document.createElement('div');
    headerElem.className = 'header';
    headerElem.textContent = 'SkipTo.js Message';
    this.messageDialog.appendChild(headerElem);

    this.contentElem  = document.createElement('div');
    this.contentElem.className = 'content';
    this.messageDialog.appendChild(this.contentElem);

    this.timeoutID = false;

  }

  configureStyle(config={}) {

    function updateOption(style, option, configOption, defaultOption) {
      if (configOption) {
        return style.replaceAll(option, configOption);
      }
      else {
        return style.replaceAll(option, defaultOption);
      }
    }

    // make a copy of the template
    let style = styleTemplate.textContent.slice(0);

    style = updateOption(style,
                         '$fontFamily',
                         config.fontFamily,
                         defaultStyleOptions.fontFamily);

    style = updateOption(style,
                         '$fontSize',
                         config.fontSize,
                         defaultStyleOptions.fontSize);

    style = updateOption(style,
                         '$focusBorderColor',
                         config.focusBorderColor,
                         defaultStyleOptions.focusBorderColor);

    style = updateOption(style,
                         '$menuTextColor',
                         config.menuTextColor,
                         defaultStyleOptions.menuTextColor);

    style = updateOption(style,
                         '$menuBackgroundColor',
                         config.menuBackgroundColor,
                         defaultStyleOptions.menuBackgroundColor);

    let styleNode = this.shadowRoot.querySelector('style');

    if (styleNode) {
      styleNode.remove();
    }

    styleNode = document.createElement('style');
    styleNode.textContent = style;
    this.shadowRoot.appendChild(styleNode);

  }

  close() {
    this.messageDialog.classList.remove('show');
    this.messageDialog.classList.add('hidden');
  }

  open(message) {
    clearInterval(this.timeoutID);
    this.messageDialog.classList.remove('hidden');
    this.messageDialog.classList.add('show');
    this.contentElem.textContent = message;

    const msg = this;

    this.timeoutID = setTimeout( () => {
      msg.close();
    }, 4000);

  }

}


