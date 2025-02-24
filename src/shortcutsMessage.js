/* shortcutsMessage.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  MESSAGE_ID
} from './constants.js';

import {colorThemes} from './colorThemes.js';

/* Constants */
const debug = new DebugLogging('[shortcutsMessage]', false);
debug.flag = false;

const defaultStyleOptions = colorThemes['default'];

const styleTemplate = document.createElement('template');
styleTemplate.textContent = `
/* shortcutsMessage.css */
:root {
  color-scheme: light dark;
}

#${MESSAGE_ID} {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

  font-family: $fontFamily;
  font-size: $fontSize;
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: light-dark($dialogBackgroundColor, $dialogBackgroundDarkColor);
  border: 2px solid light-dark($focusBorderColor, $focusBorderDarkColor);
  border-radius: 5px;
  color: light-dark($dialogTextColor, $dialogTextDarkColor);
  z-index: 2000001;
  opacity: 1;
}

#${MESSAGE_ID} .header {
  margin: 0;
  padding: 4px;
  border-bottom: 1px solid light-dark($focusBorderColor, $focusBorderDarkColor);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: light-dark($dialogBackgroundTitleColor, $dialogBackgroundTitleDarkColor);
  color light-dark($dialogTextColor, $dialogTextDarkColor);
  font-size: 100%;
}

#${MESSAGE_ID} .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
  margin-bottom: 2em;
  background-color: light-dark($dialogBackgroundColor, $dialogBackgroundDarkColor);
  color: light-dark($dialogTextColor, $dialogTextDarkColor);
  font-size: 110%;
  text-algin: center;
}

#${MESSAGE_ID}.hidden {
  display: none;
}

#${MESSAGE_ID}.show {
  display: block;
  opacity: 1;
}

#${MESSAGE_ID}.fade {
  opacity: 0;
  transition: visibility 0s 1s, opacity 1s linear;
}

@media (forced-colors: active) {

  #${MESSAGE_ID} {
    background-color: Canvas;
    color CanvasText;
    border-color: AccentColor;
  }

  #${MESSAGE_ID} .header {
    background-color: Canvas;
    color CanvasText;
  }

  #${MESSAGE_ID} .content {
    background-color: Canvas;
    color: CanvasText;
  }
}

`;

export default class ShortcutsMessage extends HTMLElement {
  constructor () {

    super();
    this.attachShadow({ mode: 'open' });

    // Get references

    this.messageDialog  = document.createElement('div');
    this.messageDialog.id = MESSAGE_ID;
    this.messageDialog.classList.add('hidden');
    this.shadowRoot.appendChild(this.messageDialog);

    const headerElem  = document.createElement('div');
    headerElem.className = 'header';
    headerElem.textContent = 'SkipTo.js Message';
    this.messageDialog.appendChild(headerElem);

    this.contentElem  = document.createElement('div');
    this.contentElem.className = 'content';
    this.messageDialog.appendChild(this.contentElem);

    this.timeoutShowID = false;
    this.timeoutFadeID = false;

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
                         '$focusBorderDarkColor',
                         config.focusBorderDarkColor,
                         defaultStyleOptions.focusBorderDarkColor);


    style = updateOption(style,
                         '$dialogTextColor',
                         config.dialogTextColor,
                         defaultStyleOptions.dialogTextColor);

    style = updateOption(style,
                         '$dialogTextDarkColor',
                         config.dialogTextDarkColor,
                         defaultStyleOptions.dialogTextDarkColor);

    style = updateOption(style,
                         '$dialogBackgroundColor',
                         config.dialogBackgroundColor,
                         defaultStyleOptions.dialogBackgroundColor);

    style = updateOption(style,
                         '$dialogBackgroundDarkColor',
                         config.dialogBackgroundDarkColor,
                         defaultStyleOptions.dialogBackgroundDarkColor);

    style = updateOption(style,
                         '$dialogBackgroundTitleColor',
                         config.dialogBackgroundTitleColor,
                         defaultStyleOptions.dialogBackgroundTitleColor);

    style = updateOption(style,
                         '$dialogBackgroundTitleDarkColor',
                         config.dialogBackgroundTitleDarkColor,
                         defaultStyleOptions.dialogBackgroundTitleDarkColor);

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
    this.messageDialog.classList.remove('fade');
    this.messageDialog.classList.add('hidden');
  }

  open(message) {
    clearInterval(this.timeoutFadeID);
    clearInterval(this.timeoutShowID);
    this.messageDialog.classList.remove('hidden');
    this.messageDialog.classList.remove('fade');
    this.messageDialog.classList.add('show');
    this.contentElem.textContent = message;

    const msg = this;

    this.timeoutFadeID = setTimeout( () => {
      msg.messageDialog.classList.add('fade');
      msg.messageDialog.classList.remove('show');
    }, 3000);

    this.timeoutShowID = setTimeout( () => {
      msg.close();
    }, 4000);

  }

}


