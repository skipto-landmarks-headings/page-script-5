/* shortcutInfoDialog.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  DIALOG_ID,
  MORE_ABOUT_INFO_URL,
  MORE_SHORTCUT_INFO_URL,
  VERSION
} from './constants.js';

/* Constants */
const debug = new DebugLogging('[shortcutsInfoDialog]', false);
debug.flag = false;

const templateInfoDialog = document.createElement('template');
templateInfoDialog.innerHTML = `
  <dialog id="${DIALOG_ID}">
    <div class="header">
      <h2>Keyboard Shortcuts</h2>
      <button>✕</button>
    </div>

    <div class="content shortcuts">
       <table>
          <caption>Landmark Regions</caption>
          <thead>
             <tr>
                <th class="shortcut">Key</th>
                <th class="desc">Description</th>
             </tr>
          </thead>
          <tbody>
             <tr>
                <td class="shortcut">r</td>
                <td class="desc">Next region</td>
             </tr>
             <tr>
                <td class="shortcut">R</td>
                <td class="desc">Previous region</td>
             </tr>
             <tr>
                <td class="shortcut">m</td>
                <td class="desc">Main regions</td>
             </tr>
             <tr>
                <td class="shortcut">n</td>
                <td class="desc">Navigation regions</td>
             </tr>
             <tr>
                <td class="shortcut">c</td>
                <td class="desc">Complementary regions</td>
             </tr>
          </tbody>
       </table>
       <table>
          <caption>Headings</caption>
          <thead>
             <tr>
                <th class="shortcut">Key</th>
                <th class="desc">Description</th>
             </tr>
          </thead>
          <tbody>
             <tr>
                <td class="shortcut">h</td>
                <td class="desc">Next heading</td>
             </tr>
             <tr>
                <td class="shortcut">H</td>
                <td class="desc">Previous heading</td>
             </tr>
             <tr>
                <td class="shortcut">1</td>
                <td class="desc">Level 1 headings</td>
             </tr>
             <tr>
                <td class="shortcut">2</td>
                <td class="desc">Level 2 headings</td>
             </tr>
             <tr>
                <td class="shortcut">3</td>
                <td class="desc">Level 3 headings</td>
             </tr>
             <tr>
                <td class="shortcut">4</td>
                <td class="desc">Level 4 headings</td>
             </tr>
             <tr>
                <td class="shortcut">5</td>
                <td class="desc">Level 5 headings</td>
             </tr>
             <tr>
                <td class="shortcut">6</td>
                <td class="desc">Level 6 headings</td>
             </tr>
          </tbody>
       </table>
    </div>

    <div class="content about">
      <div class="desc">
        SkipTo.js is a free and open source utility to support the WCAG 2.4.1 Bypass Block requirement.
      </div>
      <div class="privacy-label">
        Privacy
      </div>
      <div class="privacy">
        SkipTo.js does not collect or store any information about users or work with any other parties to collect or share user browsing information.
      </div>
      <div class="happy">
        Happy Skipping!
      </div>
      <div class="version">
        Version ${VERSION}
      </div>
      <div class="copyright">
        BSD License, Copyright 2021-2025
      </div>
    </div>

    <div class="buttons">
      <button class="more">
        More Information
      </button>
      <button class="close">
        Close
      </button>
    </div>

  </dialog>
`;

/*
 *
 *
 */

export default class SkipToContentInfoDialog {
  constructor (attachElem) {

    // Get references

    attachElem.appendChild(templateInfoDialog.content.cloneNode(true));

    this.dialogElem = attachElem.querySelector('dialog');

    this.closeButtonElem1  = attachElem.querySelector('.header button');
    this.closeButtonElem1.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButtonElem1.addEventListener('keydown', this.onKeyDown.bind(this));

    this.shortcutContentElem = attachElem.querySelector('.content.shortcuts');
    this.aboutContentElem    = attachElem.querySelector('.content.about');

    const moreInfoButtonElem = attachElem.querySelector('.buttons button.more');
    moreInfoButtonElem.addEventListener('click', this.onMoreInfoClick.bind(this));

    this.closeButtonElem2  = attachElem.querySelector('.buttons button.close');
    this.closeButtonElem2.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButtonElem2.addEventListener('keydown', this.onKeyDown.bind(this));

    return this;
  }

  onCloseButtonClick () {
    this.dialogElem.close();
  }

  openDialog (content) {
    this.content = content;

    if (content === 'shortcuts') {
      this.aboutContentElem.style.display = 'none';
      this.shortcutContentElem.style.display = 'block';
    }
    else {
      this.shortcutContentElem.style.display = 'none';
      this.aboutContentElem.style.display = 'block';
    }
    this.dialogElem.showModal();
    this.closeButtonElem2.focus();
  }

  onMoreInfoClick () {
    const url = this.content === 'shortcut' ?
                                  MORE_SHORTCUT_INFO_URL :
                                  MORE_ABOUT_INFO_URL;
    if (url) {
      window.open(url, '_blank').focus();
    }
  }

  onKeyDown (event) {

    if ((event.key === "Tab") &&
        !event.altKey &&
        !event.ctlKey &&
        !event.metaKey) {

      if (event.shiftKey &&
          (event.currentTarget === this.closeButtonElem1)) {
        this.closeButtonElem2.focus();
        event.preventDefault();
        event.stopPropagation();
      }

      if (!event.shiftKey &&
          (event.currentTarget === this.closeButtonElem2)) {
        this.closeButtonElem1.focus();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}


