/* shortcutsMessage.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  MESSAGE_ID
} from './constants.js';

/* Constants */
const debug = new DebugLogging('[shortcutsMessage]', false);
debug.flag = false;

/*
  Code for message
  <div id="${MESSAGE_ID}" class="hidden">
    <div class="header">
      SkipTo.js Message
    </div>
    <div class="content">
    </div>
  </div>
*/

// Creates a elements for shortcuts message

function getMessageElements() {

  const divElem     = document.createElement('div');
  divElem.id        = MESSAGE_ID;
  divElem.className = 'hidden';
  divElem.textContent = `SkipTo.js Message`; // i18n issue

  const divHeaderElem     = document.createElement('div');
  divHeaderElem.className = 'header';
  divElem.appendChild(divHeaderElem);

  const divContentElem     = document.createElement('div');
  divContentElem.className = 'content';
  divElem.appendChild(divContentElem);

  return divElem;
}

export default class ShortcutsMessage {
  constructor (attachElem) {

    attachElem.appendChild(getMessageElements());

    // Get references

    this.messageElem  = attachElem.querySelector(`#${MESSAGE_ID}`);

    this.contentElem  = this.messageElem.querySelector(`.content`);

    this.timeoutShowID = false;
    this.timeoutFadeID = false;

    return this;
  }

  close() {
    this.messageElem.classList.remove('show');
    this.messageElem.classList.remove('fade');
    this.messageElem.classList.add('hidden');
  }

  open(message) {
    clearInterval(this.timeoutFadeID);
    clearInterval(this.timeoutShowID);
    this.messageElem.classList.remove('hidden');
    this.messageElem.classList.remove('fade');
    this.messageElem.classList.add('show');
    this.contentElem.textContent = message;

    const msg = this;

    this.timeoutFadeID = setTimeout( () => {
      msg.messageElem.classList.add('fade');
      msg.messageElem.classList.remove('show');
    }, 3000);

    this.timeoutShowID = setTimeout( () => {
      msg.close();
    }, 4000);

  }

}


